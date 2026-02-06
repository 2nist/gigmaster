# Avatar Asset Guide

This document defines the realism-focused spec for Phaser avatars. Every submission must include source art plus metadata so tooling can produce an accurate manifest.

## Canvas And Output
- Working canvas: **2048 x 2048** layered PSD (or equivalent) to capture fine detail.
- Delivery resolution: export flattened PNG layers at **1024 x 1024** (1x) with transparency; provide optional **2048 x 2048** 2x variants that share filenames suffixed with `@2x`.
- Color space: **sRGB**. Keep contrast gentle; lighting passes will fine-tune highlights and shadows.
- Bit depth: 8-bit RGBA. Avoid premultiplied alpha.

## File Naming
- Use lower-case snake segments: `layer_variant_###.png`.
- Keep groups consistent: `head_warm_medium_01.png`, `hair_curly_dark_02.png`.
- Optional accessories that require color swaps should include a neutral base: `glasses_rect_clear_base.png`.
- Normal/specular maps append `_n` and `_s`: `head_warm_medium_01_n.png`.

## Folder Structure
- Place art under `public/avatar/assets/<layer>/`.
- For each feature, include an adjacent metadata file when needed:
	- `head/head_warm_medium_01.meta.json`
	- Fields: `resolution`, `tone`, `genderTags`, `hueVariants`, `normalMap`, `roughnessMap`, `zIndex`, `author`, `notes`.
- Shared palettes live in `public/avatar/assets/palettes/*.json`.

## Layers And Rendering Order
1. `paper` (background gradients, posters).
2. `skin` (head + neck) with optional normal/roughness maps.
3. `undertone` (subsurface color wash) merged during preprocessing.
4. `shadingBase` (AO) and `shadingHighlights` (light wraps).
5. Facial features: `brows`, `eyes`, `nose`, `mouth`.
6. `facialHair`.
7. `hairBase`, `hairHighlights`.
8. `accessories` (eyewear, piercings, headgear).
9. `fx` (stage light glows, rim lights).

All layers should align to the canvas center (512, 512). Use transparent padding to avoid clipping.

## Art Direction
- Aim for semi-realistic painterly style: confident brushwork, limited line art.
- Lighting: key light from top-left 35°, colored rim option from stage lighting.
- Provide **five** skin tone groupings with matching shading/undertone passes.
- Hair should include root shadow and highlight passes for tinting.
- Accessories should be neutral gray to enable tint overlays.

## Animations
- Blink cycles: deliver 3-frame sequences (`eyes_blink_01.png`, `eyes_blink_02.png`, `eyes_blink_03.png`).
- Mouth phonemes: optional viseme set (`mouth_viseme_A.png`, etc.).
- Store animation frames in subfolders (`eyes/blink/eyes_blink_01.png`). Manifest will aggregate sequences by prefix.

## Metadata Requirements
- Every feature entry must document:
	- `weight`: base spawn probability.
	- `tone`: matches palette groups (e.g., `warm_light`).
	- `genderTags`: array for filtering (`masc`, `fem`, `neutral`).
	- `styleTags`: descriptors (`punk`, `classic`, `glam`).
	- `ageRange`: `teen`, `adult`, `veteran`.
	- `variants`: named overrides referencing tint palettes.
- Shading entries must include intensity scalar (`0.0 - 1.0`).
- Hair and facial hair specify `supportsTint` boolean.

## Tooling Expectations
- Run `node tools/build-avatar-manifest.js --validate` before committing new art.
- The script verifies filenames, metadata keys, resolution, and required maps.
- Validation errors cite file path and rule; fix them before running the app.

## Submission Checklist
- [ ] PNG layers at 1024 square (plus 2x optional).
- [ ] Metadata file with complete fields.
- [ ] Normal/specular maps for skin, hair, metallic accessories.
- [ ] Example palette entry updated.
- [ ] Art preview exported to `/docs/artifacts/avatars/` for review.

Refer to `docs/PHASER_POC.md` for live preview instructions and runtime toggles.
