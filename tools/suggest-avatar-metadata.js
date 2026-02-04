import fs from 'fs';
import path from 'path';

const manifestPath = path.join(process.cwd(), 'src', 'avatar', 'manifest.json');
const outPath = path.join(process.cwd(), 'tools', 'suggested-avatar-meta.json');

if (!fs.existsSync(manifestPath)) {
  console.error('Manifest not found. Run tools/build-avatar-manifest.js first.');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const suggestions = {};

manifest.layers.forEach(layer => {
  layer.features.forEach(feature => {
    const missing = [];
    const suggestion = {};
    if (!feature.resolution) { missing.push('resolution'); suggestion.resolution = 512; }
    if (!feature.tone) { missing.push('tone'); }
    if (!feature.genderTags || feature.genderTags.length === 0) { missing.push('genderTags'); suggestion.genderTags = ['unisex']; }
    if (!feature.styleTags || feature.styleTags.length === 0) { missing.push('styleTags'); suggestion.styleTags = ['default']; }
    if (typeof feature.supportsTint === 'undefined') { missing.push('supportsTint'); suggestion.supportsTint = false; }

    if (missing.length > 0) {
      suggestions[`${layer.name}/${feature.filename}`] = {
        id: feature.id,
        path: feature.path,
        suggested: suggestion,
        missing
      };
    }
  });
});

fs.writeFileSync(outPath, JSON.stringify(suggestions, null, 2), 'utf8');
console.log(`Wrote suggested metadata to ${outPath} (${Object.keys(suggestions).length} entries)`);
