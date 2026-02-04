# avatar-gen

Production-style, deterministic batch avatar generator using Automatic1111 WebUI and a Node pipeline.

## Prerequisites

1. Start Stable Diffusion WebUI with API enabled (from your SD WebUI folder):

   webui-user.bat --api

   Verify: http://127.0.0.1:7860/docs

2. Node.js (recommended v16+). In project root run:

   npm init -y
   npm install

3. Python + rembg (for local alpha/background removal)

   pip install rembg

   If you want GPU acceleration, follow rembg docs (install U^2-Net GPU variant).

## Project layout

```
avatar-gen/
├─ prompts/
│  ├─ base.txt
│  ├─ base-avatar.txt    ← SD Avatar master prompt (style lock)
│  ├─ negative.txt
│  ├─ negative-avatar.txt
│  ├─ eyes.txt
│  ├─ noses.txt
│  └─ mouths.txt
├─ batches/
│  ├─ eyes.json
│  └─ avatars.json      ← identities + lockedSeed
├─ scripts/
│  ├─ generate.js
│  └─ remove-bg.js
├─ outputs/
│  ├─ eyes/
│  └─ avatar/           ← 512×512 + optional icons/
└─ README.md
```

## Usage

- Generate images (legacy batch):

  node scripts/generate.js

- **Avatar portraits (SD 1.5 · A1111)** — consistent, game-icon–ready head-only avatars:

  npm run avatar

  Uses `batches/avatars.json`: locked seed, one identity descriptor per image. Style from `base-avatar` + `negative-avatar` only; **identity is the only variation**.

- Avatar run **plus** 128×128 icons (Lanczos downscale):

  npm run avatar:icons

- Custom batch:

  node scripts/generate.js --batch batches/avatars.json

  Optional: `--downscale 128` or `150`, `--steps 24`, `--cfg 6.5`, `--api-base <url>`.

- Generate and automatically remove background (creates alpha PNGs in `outputs/<category>/alpha`):

  node scripts/generate.js --alpha

- Run background removal on existing PNGs:

  node scripts/remove-bg.js --input outputs/eyes --pattern "eyes_1000_*.png"

## Avatar workflow (fixed settings)

- **Model:** single SD 1.5 checkpoint (e.g. DreamShaper / Juggernaut).
- **Resolution:** 512×512 (downscale to 125–150px for icons).
- **Sampler:** DPM++ 2M Karras · **Steps:** 24 · **CFG:** 6.5.
- **Seed:** locked for all avatars (in `avatars.json`).
- **Rule:** change only identity descriptors in `identities`; never alter style, settings, or seed.

## Configuration

- **API base URL** — Default `http://127.0.0.1:7860`. Override via env `SD_API_BASE` or CLI `--api-base`:
  - `SD_API_BASE=http://192.168.1.10:7860 npm run avatar`
  - `node scripts/generate.js --batch batches/avatars.json --api-base http://localhost:7860`
- Other env vars: `SD_MODEL`, `SD_STEPS`, `SD_CFG`, `SD_SAMPLER`, `AVATAR_DOWNSCALE`.

## Notes

- `remove-bg` calls the `rembg` CLI. Install it with `pip install rembg`.
- This project intentionally keeps prompts in separate files to prevent accidental editing and to be Cursor-friendly.

Enjoy! 🎯
