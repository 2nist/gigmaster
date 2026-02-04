import fs from "fs";
import fetch from "node-fetch";
import path from "path";
import { spawnSync } from "child_process";
import sharp from "sharp";

const apiBaseArgIdx = process.argv.indexOf("--api-base");
const apiBaseFromArg = apiBaseArgIdx !== -1 && process.argv[apiBaseArgIdx + 1]
  ? process.argv[apiBaseArgIdx + 1]
  : null;
const SD_API_BASE = (process.env.SD_API_BASE || apiBaseFromArg || "http://127.0.0.1:7860").replace(/\/$/, "");
const SD_URL = `${SD_API_BASE}/sdapi/v1/txt2img`;
const MODELS_URL = `${SD_API_BASE}/sdapi/v1/sd-models`;

const batchArgIdx = process.argv.indexOf("--batch");
const batchPath = batchArgIdx !== -1 && process.argv[batchArgIdx + 1]
  ? process.argv[batchArgIdx + 1]
  : "./batches/eyes.json";
const batch = JSON.parse(fs.readFileSync(batchPath, "utf8"));

const isAvatarMode = Array.isArray(batch.identities) && batch.lockedSeed != null;
const basePath = isAvatarMode ? "./prompts/base-avatar.txt" : "./prompts/base.txt";
const negativePath = isAvatarMode ? "./prompts/negative-avatar.txt" : "./prompts/negative.txt";
const basePrompt = fs.readFileSync(basePath, "utf8").trim();
const negativePrompt = fs.readFileSync(negativePath, "utf8").trim();
const featurePrompt = !isAvatarMode
  ? fs.readFileSync(`./prompts/${batch.category}.txt`, "utf8").trim()
  : "";

const outDir = `./outputs/${batch.category}`;
fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(path.join(outDir, "alpha"), { recursive: true });

async function getModels() {
  const ac = new AbortController();
  const timeout = setTimeout(() => ac.abort(), 15000);
  let res;
  try {
    res = await fetch(MODELS_URL, { signal: ac.signal });
  } catch (e) {
    clearTimeout(timeout);
    const msg = e.cause?.code === "ECONNREFUSED" || e.code === "ECONNREFUSED"
      ? "Connection refused."
      : e.name === "AbortError"
        ? "Request timed out (15s)."
        : (e?.message || String(e));
    throw new Error(
      `Cannot reach A1111 at ${SD_API_BASE}.\n${msg}\n\n` +
      `• Is Automatic1111 running? Start it with --api (e.g. webui-user.bat).\n` +
      `• Using a different host/port? Set SD_API_BASE or --api-base.\n` +
      `• Verify: ${SD_API_BASE}/docs`
    );
  }
  clearTimeout(timeout);
  if (!res.ok) {
    const text = (await res.text()).slice(0, 200);
    throw new Error(
      `A1111 returned HTTP ${res.status} from ${MODELS_URL}.\n` +
      `Ensure the API is enabled (--api in COMMANDLINE_ARGS).\n` +
      (text ? `Response: ${text}` : "")
    );
  }
  const data = await res.json();
  const list = Array.isArray(data) ? data : (Array.isArray(data?.value) ? data.value : []);
  return list;
}

async function run(removeAlpha = false) {
  const modelArgIndex = process.argv.indexOf("--model");
  const modelFromArgs = modelArgIndex !== -1 ? process.argv[modelArgIndex + 1] : null;
  const modelName = process.env.SD_MODEL || modelFromArgs || null;
  const stepsArgIndex = process.argv.indexOf("--steps");
  const cfgArgIndex = process.argv.indexOf("--cfg");
  const samplerArgIndex = process.argv.indexOf("--sampler");
  const widthArgIndex = process.argv.indexOf("--width");
  const heightArgIndex = process.argv.indexOf("--height");
  const downscaleArgIndex = process.argv.indexOf("--downscale");
  const stepsValue = stepsArgIndex !== -1 ? Number(process.argv[stepsArgIndex + 1]) : Number(process.env.SD_STEPS);
  const cfgValue = cfgArgIndex !== -1 ? Number(process.argv[cfgArgIndex + 1]) : Number(process.env.SD_CFG);
  const widthValue = widthArgIndex !== -1 ? Number(process.argv[widthArgIndex + 1]) : Number(process.env.SD_WIDTH);
  const heightValue = heightArgIndex !== -1 ? Number(process.argv[heightArgIndex + 1]) : Number(process.env.SD_HEIGHT);
  const downscaleValue = downscaleArgIndex !== -1 ? Number(process.argv[downscaleArgIndex + 1]) : Number(process.env.AVATAR_DOWNSCALE);

  const defaultSteps = isAvatarMode ? 24 : 30;
  const defaultCfg = 6.5;
  const defaultSampler = "DPM++ 2M Karras";
  const steps = Number.isFinite(stepsValue) && stepsValue > 0 ? stepsValue : defaultSteps;
  const cfgScale = Number.isFinite(cfgValue) && cfgValue > 0 ? cfgValue : defaultCfg;
  const width = Number.isFinite(widthValue) && widthValue > 0 ? widthValue : 512;
  const height = Number.isFinite(heightValue) && heightValue > 0 ? heightValue : 512;
  const sampler = samplerArgIndex !== -1 ? process.argv[samplerArgIndex + 1] : (process.env.SD_SAMPLER || defaultSampler);
  const downscaleSize = Number.isFinite(downscaleValue) && downscaleValue >= 64 && downscaleValue <= 512 ? downscaleValue : null;

  const runs = isAvatarMode ? batch.identities.length : Math.ceil(batch.count / batch.batchSize);
  const batchSize = isAvatarMode ? 1 : batch.batchSize;
  const cropEnabled = !isAvatarMode && (process.argv.includes("--crop") || process.env.CROP_EYES === "1");
  const cropLeft = Number(process.env.CROP_LEFT);
  const cropTop = Number(process.env.CROP_TOP);
  const cropWidth = Number(process.env.CROP_WIDTH);
  const cropHeight = Number(process.env.CROP_HEIGHT);
  const models = await getModels();

  if (!modelName && models.length === 0) {
    throw new Error(
      `A1111 at ${SD_API_BASE} has no checkpoints.\n\n` +
      `• Add an SD 1.5 model (.safetensors / .ckpt) to:\n` +
      `  stable-diffusion-webui/models/Stable-diffusion/\n` +
      `• Or set SD_MODEL to a specific checkpoint name, or use --model <name>.`
    );
  }

  const selectedModel = modelName || (models[0]?.title || models[0]?.model_name);

  if (downscaleSize) {
    fs.mkdirSync(path.join(outDir, "icons"), { recursive: true });
  }

  for (let i = 0; i < runs; i++) {
    const seed = isAvatarMode ? batch.lockedSeed : batch.seedStart + i;
    const prompt = isAvatarMode
      ? `${basePrompt}, ${batch.identities[i]}`
      : `${basePrompt}, ${featurePrompt}`;

    const payload = {
      prompt,
      negative_prompt: negativePrompt,
      seed,
      steps,
      cfg_scale: cfgScale,
      width,
      height,
      sampler_name: sampler,
      batch_size: batchSize,
      override_settings: selectedModel ? { sd_model_checkpoint: selectedModel } : undefined,
      override_settings_restore_afterwards: true
    };

    const res = await fetch(SD_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`SD API error ${res.status}: ${errorText}`);
    }

    const data = await res.json();
    if (!data?.images || !Array.isArray(data.images)) {
      throw new Error(`SD API response missing images: ${JSON.stringify(data)}`);
    }

    for (let idx = 0; idx < data.images.length; idx += 1) {
      const img = data.images[idx];
      const buffer = Buffer.from(img, "base64");
      const fileIdx = isAvatarMode ? i : idx;
      const filename = `${outDir}/${batch.category}_${seed}_${fileIdx}.png`;
      fs.writeFileSync(filename, buffer);

      if (downscaleSize) {
        const iconsDir = path.join(outDir, "icons");
        const iconPath = path.join(iconsDir, `${batch.category}_${seed}_${fileIdx}.png`);
        await sharp(buffer)
          .resize(downscaleSize, downscaleSize)
          .toFile(iconPath);
      }

      if (cropEnabled && batch.category === "eyes") {
        const cropDir = path.join(outDir, "crop");
        fs.mkdirSync(cropDir, { recursive: true });
        const meta = await sharp(buffer).metadata();
        const metaWidth = meta.width || width;
        const metaHeight = meta.height || height;
        const defaultCrop = {
          left: Math.round(metaWidth * 0.18),
          top: Math.round(metaHeight * 0.25),
          width: Math.round(metaWidth * 0.64),
          height: Math.round(metaHeight * 0.28)
        };
        const crop = {
          left: Number.isFinite(cropLeft) ? cropLeft : defaultCrop.left,
          top: Number.isFinite(cropTop) ? cropTop : defaultCrop.top,
          width: Number.isFinite(cropWidth) ? cropWidth : defaultCrop.width,
          height: Number.isFinite(cropHeight) ? cropHeight : defaultCrop.height
        };
        const cropPath = path.join(cropDir, `${batch.category}_${seed}_${fileIdx}.png`);
        await sharp(buffer)
          .extract(crop)
          .toFile(cropPath);
      }
    }

    console.log(isAvatarMode ? `Generated avatar ${i + 1}/${runs} (seed ${seed})` : `Generated batch seed ${seed}`);

    if (removeAlpha) {
      // Call remove-bg script for the newly created files
      const args = ["scripts/remove-bg.js", "--input", outDir, "--pattern", `${batch.category}_${seed}_*.png`];
      const nodeRes = spawnSync(process.execPath, args, { stdio: "inherit" });
      if (nodeRes.status !== 0) {
        console.error("remove-bg failed for seed", seed);
      }
    }
  }
}

// Allow flag --alpha to run background removal automatically
const removeAlpha = process.argv.includes("--alpha");
run(removeAlpha).catch(err => { console.error(err); process.exit(1); });
