import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";

function findRembgCommand() {
  // Prefer direct 'rembg' if available, else try 'python -m rembg'
  try {
    const which = spawnSync(process.platform === "win32" ? "where" : "which", ["rembg"], { encoding: "utf8" });
    if (which.status === 0 && which.stdout.trim()) return "rembg";
  } catch (e) {}
  // fallback
  return "python -m rembg";
}

function usage() {
  console.log("Usage: node scripts/remove-bg.js --input <folder> [--pattern <glob>] (defaults to '*.png')");
}

const args = process.argv.slice(2);
const inputIndex = args.indexOf("--input");
if (inputIndex === -1 || !args[inputIndex + 1]) {
  usage();
  process.exit(1);
}
const inputFolder = args[inputIndex + 1];
const patternIndex = args.indexOf("--pattern");
const pattern = patternIndex !== -1 && args[patternIndex + 1] ? args[patternIndex + 1] : "*.png";

if (!fs.existsSync(inputFolder)) {
  console.error("Input folder does not exist:", inputFolder);
  process.exit(1);
}

const outAlphaFolder = path.join(inputFolder, "alpha");
fs.mkdirSync(outAlphaFolder, { recursive: true });

const rembgCmd = findRembgCommand();
console.log("Using rembg command:", rembgCmd);

// Simple glob: pattern like '*.png' or 'eyes_1000_*.png'
const files = fs.readdirSync(inputFolder).filter(f => {
  if (!f.toLowerCase().endsWith('.png')) return false;
  if (pattern === '*.png') return true;
  // very simple pattern support: replace * with regex
  const regex = new RegExp('^' + pattern.replace(/\./g, '\\.').replace(/\*/g, '.*') + '$');
  return regex.test(f);
});

if (files.length === 0) {
  console.log("No matching PNG files found in", inputFolder);
  process.exit(0);
}

files.forEach(file => {
  const inputPath = path.join(inputFolder, file);
  const outPath = path.join(outAlphaFolder, file);
  console.log(`Processing ${inputPath} -> ${outPath}`);

  // rembg CLI: rembg -o out.png in.png
  const cmdParts = rembgCmd.split(' ');
  const cmd = cmdParts[0];
  const cmdArgs = cmdParts.slice(1).concat(["-o", outPath, inputPath]);

  const res = spawnSync(cmd, cmdArgs, { stdio: "inherit" });
  if (res.status !== 0) {
    console.error(`rembg failed for ${file}`);
  }
});

console.log("Background removal complete. Alpha images in", outAlphaFolder);
