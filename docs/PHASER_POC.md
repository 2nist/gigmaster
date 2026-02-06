# Phaser Avatar PoC — Quick Run Guide

Steps to run the PoC locally:

1. Install Phaser (local project dependency):

   npm install phaser --save

2. Ensure you have the new files added to the repo (components and scene):
   - `src/components/PhaserAvatar.jsx`
   - `src/avatar/phaser/AvatarScene.js`
   - `src/pages/AvatarPoC.jsx`
   - `tools/build-avatar-manifest.js` and `src/avatar/manifest.json` (manifest generated)

3. (Optional) Regenerate the manifest if you add or change assets:

   node tools/build-avatar-manifest.js

4. Start the dev server (your normal start command), then navigate to a route that renders `AvatarPoC` (or import it into a page) to view the PoC.

Notes:
- The PoC uses the assets in `public/avatar/assets` directly. For a production-ready setup, consider using atlases and the manifest to load assets more efficiently.
- If `onGenerated` returns an empty string, check browser console for renderer snapshots or CORS issues on assets served from `public`.
- Review `docs/ASSET_GUIDE.md` for the high-fidelity asset specification, required metadata, and validation checklist before importing new art.
