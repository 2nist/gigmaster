# Avatar Asset Creation Guide

Guide for creating high-quality avatar assets to replace placeholder art in your game.

## Current Status

**What you have:**
- 37 hair variants, 20 eye styles, 5 head shapes
- Basic 512×512 PNG placeholders with transparency
- Complete manifest system with metadata support
- Realism-ready rendering pipeline (lighting presets, tint system, normal maps)

**What you need:**
- Higher resolution assets (1024×1024 target, 2048×2048 working canvas)
- Painterly/semi-realistic style vs. current sketches
- Metadata files for each feature (tone, gender tags, style tags)
- Optional: normal maps, roughness maps for depth/lighting

---

## Recommended Approach

### Phase 1: Foundation (Skin Tones & Heads)
**Priority:** Establish your five skin tone families first, as all facial features build on these.

**Skin Tone Palette:**
```
warm_light   → peachy highlights, golden midtones
warm_medium  → tan with amber undertones
warm_deep    → rich brown with red-orange undertones
cool_light   → porcelain with pink/blue undertones
cool_medium  → olive with neutral gray-green
cool_deep    → deep brown with blue undertones
neutral_light → beige, balanced warmth
neutral_medium → medium beige, no strong undertone
neutral_deep  → dark brown, neutral
```

**Tools:**
- **Procreate (iPad):** Best for painterly digital art with natural brush feel
- **Clip Studio Paint:** Excellent for anime/semi-realistic styles, strong brush engine
- **Photoshop:** Industry standard, powerful but expensive
- **Krita:** Free alternative to Photoshop with good brush customization
- **Aseprite:** If you prefer pixel art style (different aesthetic)

**Head Creation Process:**
1. Create 2048×2048 canvas with guidelines marking center (1024, 1024)
2. Block in basic head shape on separate layer using neutral mid-tone
3. Add core shadows (temple, jaw, neck) on multiply layer
4. Add highlight pass (forehead, cheekbone, nose bridge) on screen/add layer
5. Refine edges with soft round brush, avoid hard outlines
6. Export flattened PNG at 1024×1024 with transparency
7. Create `.meta.json` file:
```json
{
  "resolution": 1024,
  "tone": "warm_medium",
  "genderTags": ["neutral"],
  "styleTags": ["realistic"],
  "supportsTint": true,
  "author": "Your Name",
  "notes": "Base head shape for warm skin tones"
}
```

### Phase 2: Facial Features (Eyes, Nose, Mouth)
**Focus:** Variety trumps perfection. Start with 3-5 variations per feature.

**Eyes:**
- Paint iris with gradient (darker outer ring, lighter center with pupil)
- Add white catchlight for life (top-left quadrant)
- Include subtle eyelid shadow and lower lash line
- Consider emotion variants: neutral, tired, intense, friendly
- Metadata: `genderTags`, `styleTags` like `["intense"]`, `["droopy"]`

**Noses:**
- Anchor with subtle nostril shadow
- Keep edges soft, avoid hard lines
- Vary bridge width, tip roundness, nostril shape
- Most detail comes from shadow/highlight, not outlines

**Mouths:**
- Neutral lips are safest base; avoid strong expressions initially
- Add subtle lip border (darker than skin, lighter than full outline)
- Top lip slightly darker than bottom
- Consider variants: smile, frown, neutral, smirk

### Phase 3: Hair & Facial Hair
**Challenge:** Hair needs to support dynamic tinting while reading as natural.

**Process:**
1. Paint hair in **neutral gray** (RGB 180, 180, 180)
2. Use darker gray (RGB 100) for root shadows, creases
3. Use lighter gray (RGB 220) for highlight strands
4. Keep alpha channel clean - transparency = scalp showing
5. Set `"supportsTint": true` in metadata so runtime can apply color

**Hair Styles to Prioritize:**
- Short clean cut (professional musician)
- Long/wavy (rock/indie aesthetic)
- Mohawk/spiky (punk)
- Bald/buzzed (no-nonsense)
- Ponytail/bun (practical)

**Metadata Example:**
```json
{
  "resolution": 1024,
  "genderTags": ["neutral"],
  "styleTags": ["rock", "long"],
  "supportsTint": true,
  "hueVariants": ["black", "brown", "blonde", "red", "unnatural"],
  "normalMap": null
}
```

### Phase 4: Accessories & Effects
**Lower priority** but adds personality.

**Accessories:**
- Eyewear: round, rectangular, aviator frames
- Headwear: beanie, cap, headband
- Piercings: nose ring, eyebrow, lip
- Paint in neutral silver/gray for easy tinting

**Shading Overlays:**
- `shadingBase.png`: Ambient occlusion (eye sockets, under nose/chin) - multiply blend
- `shadingHighlights.png`: Rim light from stage (cheekbone, hair edge) - screen/add blend

---

## Asset Creation Workflows

### Option A: Traditional Digital Art
**Best for:** Custom, unique look; full artistic control

1. **Setup Photoshop/Procreate template:**
   - 2048×2048 canvas, center guides
   - Layer groups: Sketch → Flats → Shadows → Highlights → Cleanup
   
2. **Sketch rough shapes** with low-opacity brush
3. **Block colors** on separate layer, stay inside transparency
4. **Add shadows** on multiply layer (30-50% opacity)
5. **Add highlights** on screen/add layer (20-40% opacity)
6. **Merge and export** as PNG, downscale to 1024 in batch

**Time estimate:** 2-4 hours per feature once you have workflow down

### Option B: AI-Assisted Generation + Cleanup
**Best for:** Speed; generating variations quickly

**Tools:**
- **Stable Diffusion (local):** Full control, free, requires GPU
- **Midjourney:** High quality, requires subscription
- **DALL-E 3:** Good for specific requests via ChatGPT

**Process:**
1. Generate base image with prompt:
   ```
   "neutral front-facing portrait, [feature], 2D game asset, transparent background, 
   soft lighting, painterly style, no shadows, centered, high detail"
   ```
2. Use Photoshop's "Remove Background" or rembg.com
3. Clean up edges, adjust levels/curves
4. Ensure proper centering and transparency
5. Manually paint touch-ups as needed

**Caution:** 
- Check licensing for commercial use
- AI often struggles with consistent positioning across assets
- May need manual alignment/cropping

### Option C: Commission an Artist
**Best for:** Consistent style across large asset set; long-term quality

**Where to find:**
- **ArtStation:** Portfolio browsing, direct contact
- **Fiverr:** Quick turnarounds, variable quality
- **DeviantArt:** Niche styles, commission listings
- **r/HungryArtists:** Reddit community for freelance artists

**Budget estimates:**
- Simple sketches: $10-30 per asset
- Painted/rendered: $50-150 per asset
- Full avatar set (50+ assets): $500-2000 depending on artist

**Art direction brief:**
- Share your ASSET_GUIDE.md specifications
- Provide reference images (art style, not specific characters)
- Request PSD/layered files for future edits
- Establish clear revisions policy upfront

### Option D: Purchase Asset Packs
**Best for:** Getting started quickly; placeholder improvement

**Marketplaces:**
- **itch.io** - Indie asset bundles, often cheap or PWYW
- **Kenney.nl** - Many free CC0 game assets
- **OpenGameArt.org** - Community-uploaded free assets
- **Unity Asset Store** - 2D character packs (check export rights)

**Search terms:** "2D character creator", "avatar assets", "portrait sprites", "layered character"

**Compatibility checklist:**
- ✓ Transparent PNGs
- ✓ Similar style across all features
- ✓ Consistent resolution (512+ pixels)
- ✓ Face center alignment
- ✓ License allows commercial use

---

## Technical Implementation

### Adding New Assets

1. **Place PNG in correct folder:**
   ```
   public/avatar/assets/hair/hair_afro_01.png
   ```

2. **Create metadata file:**
   ```
   public/avatar/assets/hair/hair_afro_01.meta.json
   ```
   ```json
   {
     "resolution": 1024,
     "tone": null,
     "genderTags": ["neutral"],
     "styleTags": ["retro", "voluminous"],
     "supportsTint": true,
     "hueVariants": ["black", "brown"],
     "zIndex": 0,
     "author": "YourName"
   }
   ```

3. **Rebuild manifest:**
   ```bash
   node tools/build-avatar-manifest.js --validate
   ```

4. **Test in PoC:**
   - Navigate to `http://localhost:5173/gigmaster/?poc=avatar`
   - Generate avatars with different seeds
   - Toggle lighting presets to verify appearance

### Advanced: Normal Maps for Depth

If you want realistic lighting (stage lights, rim lighting), create normal maps:

**Tools:**
- **NormalMap-Online** (free web tool): Upload PNG, generates normal map
- **Photoshop plugin:** NVIDIA Normal Map Filter
- **Substance Designer:** Professional tool (overkill unless you're doing many)

**Process:**
1. Save your final PNG as `head_warm_medium_01.png`
2. Generate normal map (use "height to normal" converter)
3. Adjust strength (1.0-3.0 range works for faces)
4. Save as `head_warm_medium_01_n.png`
5. Update metadata: `"normalMap": "/avatar/assets/heads/head_warm_medium_01_n.png"`

---

## Style Guide Recommendations

### Aesthetic Options

**1. Semi-Realistic Painterly** (Recommended for your guide)
- Soft brush strokes, visible paint texture
- Gentle outlines or none at all
- Realistic proportions, stylized details
- Example refs: Disco Elysium portraits, Kentucky Route Zero

**2. Clean Vector/Flat**
- Solid colors, clean edges
- Minimal shading (2-3 tones max per feature)
- Modern, scalable, easy to produce
- Example refs: Monument Valley, Alto's Adventure

**3. Pixel Art**
- 128×128 or 256×256 native resolution
- Retro aesthetic, tile-friendly
- Easier for non-artists to produce
- Example refs: Stardew Valley, Eastward

**4. Anime/Manga**
- Large expressive eyes, simplified nose
- Strong outlines (2-3px black stroke)
- Cel-shaded flat colors
- Example refs: Persona series, Fire Emblem

**Choose based on:**
- Your art skills/budget
- Game's overall visual style
- Time available for asset creation

---

## Phased Rollout Plan

### Week 1: Core Foundations
- [ ] 5 head shapes (one per skin tone family) at 1024×1024
- [ ] 3 neutral eye variations
- [ ] 2 neutral mouth variations
- [ ] Test integration with PoC

### Week 2: Variety & Expression
- [ ] 8 additional hairstyles with tint support
- [ ] 5 expressive eye variants (tired, intense, etc.)
- [ ] 3 nose shapes
- [ ] 4 mouth expressions

### Week 3: Personality & Accessories
- [ ] 5 facial hair options
- [ ] 5 accessories (glasses, piercings)
- [ ] Shading overlays (AO, highlights)

### Week 4: Polish & Metadata
- [ ] Create all `.meta.json` files
- [ ] Generate normal maps for heads/hair
- [ ] Test gender/style tag filtering
- [ ] Validate lighting presets (stage, studio, noir)

---

## Testing Your Assets

1. **Visual spot-check:**
   ```bash
   npm run dev
   ```
   Navigate to `?poc=avatar`, generate 20-30 avatars, look for:
   - Misaligned features (eyes not on head)
   - Clipping issues (hair cutting through head)
   - Tint inconsistencies (hair not responding to color)

2. **Metadata validation:**
   ```bash
   node tools/build-avatar-manifest.js --validate
   ```
   Fix any warnings about missing fields or incorrect paths

3. **Lighting preview:**
   - Toggle between stage/studio/noir presets
   - Verify normal maps catch light correctly
   - Check skin tone tints look natural under colored lights

4. **Performance check:**
   - Monitor console for "Failed to load" errors
   - Ensure generation time < 500ms
   - Check memory usage if using 2048×2048 assets

---

## Quick Start: Your First Hour

**Goal:** Replace 5 head placeholders with better art

1. **Download Krita** (free): https://krita.org
2. **Create template:**
   - 2048×2048 canvas, add center guidelines
   - Save as `avatar_head_template.kra`
3. **Paint one head:**
   - Block in oval head shape (neutral tan color)
   - Add shadow layer (under cheekbones, jaw)
   - Add highlight layer (forehead, nose bridge)
   - Merge, export `head_warm_medium_01.png` at 1024×1024
4. **Duplicate & vary:**
   - Adjust head width, jaw shape, neck thickness
   - Export as `head_warm_medium_02.png`, etc.
5. **Test:**
   ```bash
   node tools/build-avatar-manifest.js
   npm run dev
   ```
   Visit `?poc=avatar` and verify avatars use new heads

---

## Resources

**Learning:**
- **CTRL+Paint**: Free digital painting tutorials (ctrlpaint.com)
- **Proko**: Figure drawing fundamentals (proko.com)
- **Marc Brunet**: Character design courses (youtube.com/@bluefley)

**Free Asset Bundles:**
- Kenney's 1-Bit Pack: kenney.nl/assets/1-bit-pack
- OpenGameArt Portrait Collection: opengameart.org

**Workflow Tools:**
- **rembg**: Remove backgrounds via CLI (github.com/danielgatis/rembg)
- **ImageMagick**: Batch resize/convert images
- **TexturePacker**: If you want to use sprite atlases later

**Color Palette Generators:**
- Coolors.co - Generate harmonious color schemes
- Adobe Color - Extract palettes from reference images

---

## Need Help?

**Common issues:**

1. **"Assets won't load in browser"**
   - Check file paths match manifest (case-sensitive)
   - Verify files are in `public/avatar/assets/`
   - Run manifest rebuild: `node tools/build-avatar-manifest.js`

2. **"Features don't align properly"**
   - Ensure all PNGs are same size (1024×1024)
   - Center point should be consistent (512, 512)
   - Use guides/rulers in your art program

3. **"Tinting doesn't work on hair"**
   - Hair must be painted in neutral gray
   - Set `"supportsTint": true` in metadata
   - Rebuild manifest and refresh browser

4. **"Lighting looks flat"**
   - Add normal maps for depth
   - Use shading overlays (multiply/screen blends)
   - Test with different lighting presets in PoC

---

**Next Steps:**
1. Choose your aesthetic (semi-realistic, flat, pixel, anime)
2. Pick your creation method (DIY, AI-assisted, commission, purchase)
3. Start with Phase 1 (heads & skin tones)
4. Test early, test often (?poc=avatar)
5. Expand systematically through phases

Good luck! 🎸🎨
