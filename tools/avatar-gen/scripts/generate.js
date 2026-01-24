import fs from "fs";
import fetch from "node-fetch";
import path from "path";
import { spawnSync } from "child_process";

const SD_URL = "http://127.0.0.1:7860/sdapi/v1/txt2img";

const batch = JSON.parse(fs.readFileSync("./batches/eyes.json", "utf8"));

const basePrompt = fs.readFileSync("./prompts/base.txt", "utf8");
const featurePrompt = fs.readFileSync(`./prompts/${batch.category}.txt`, "utf8");
const negativePrompt = fs.readFileSync("./prompts/negative.txt", "utf8");

const outDir = `./outputs/${batch.category}`;
fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(path.join(outDir, "alpha"), { recursive: true });

async function run(removeAlpha = false) {
  const runs = Math.ceil(batch.count / batch.batchSize);

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
      batch_size: batch.batchSize
    };

    const res = await fetch(SD_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

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
