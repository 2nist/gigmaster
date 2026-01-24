import fs from "fs";
import fetch from "node-fetch";
import path from "path";
import { spawnSync } from "child_process";

const SD_URL = "http://127.0.0.1:7860/sdapi/v1/txt2img";
const MODELS_URL = "http://127.0.0.1:7860/sdapi/v1/sd-models";

const batch = JSON.parse(fs.readFileSync("./batches/eyes.json", "utf8"));

const basePrompt = fs.readFileSync("./prompts/base.txt", "utf8");
const featurePrompt = fs.readFileSync(`./prompts/${batch.category}.txt`, "utf8");
const negativePrompt = fs.readFileSync("./prompts/negative.txt", "utf8");

const outDir = `./outputs/${batch.category}`;
fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(path.join(outDir, "alpha"), { recursive: true });

async function getModels() {
  try {
    const res = await fetch(MODELS_URL);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function run(removeAlpha = false) {
  const runs = Math.ceil(batch.count / batch.batchSize);
  const modelArgIndex = process.argv.indexOf("--model");
  const modelFromArgs = modelArgIndex !== -1 ? process.argv[modelArgIndex + 1] : null;
  const modelName = process.env.SD_MODEL || modelFromArgs || null;
  const models = await getModels();

  if (!modelName && models.length === 0) {
    throw new Error("No SD models found. Add a checkpoint to stable-diffusion-webui/models/Stable-diffusion and try again.");
  }

  const selectedModel = modelName || (models[0]?.title || models[0]?.model_name);

  for (let i = 0; i < runs; i++) {
    const seed = batch.seedStart + i;

    const payload = {
      prompt: `${basePrompt}, ${featurePrompt}`,
      negative_prompt: negativePrompt,
      seed,
      steps: 30,
      cfg_scale: 6.5,
      width: 512,
      height: 512,
      sampler_name: "DPM++ 2M Karras",
      batch_size: batch.batchSize,
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

    data.images.forEach((img, idx) => {
      const buffer = Buffer.from(img, "base64");
      const filename = `${outDir}/${batch.category}_${seed}_${idx}.png`;
      fs.writeFileSync(filename, buffer);
    });

    console.log(`Generated batch seed ${seed}`);

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
