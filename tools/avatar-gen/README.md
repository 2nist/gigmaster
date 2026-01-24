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
│  ├─ negative.txt
│  ├─ eyes.txt
│  ├─ noses.txt
│  └─ mouths.txt
├─ batches/
│  └─ eyes.json
├─ scripts/
│  ├─ generate.js
│  └─ remove-bg.js
├─ outputs/
│  └─ eyes/
└─ README.md
```

## Usage

- Generate images:

  node scripts/generate.js

- Generate and automatically remove background (creates alpha PNGs in `outputs/<category>/alpha`):

  node scripts/generate.js --alpha

- Run background removal on existing PNGs:

  node scripts/remove-bg.js --input outputs/eyes --pattern "eyes_1000_*.png"

## Notes

- `remove-bg` calls the `rembg` CLI. Install it with `pip install rembg`.
- This project intentionally keeps prompts in separate files to prevent accidental editing and to be Cursor-friendly.

Enjoy! 🎯
