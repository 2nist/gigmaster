# Avatar Asset Technical Specifications

This document outlines the required format, sizing, positioning, and directory structure for avatar assets in the GigMaster game.

## Overview

The avatar system uses a layered PNG approach with 9 distinct layers that are composited together to create procedural avatars. All assets must be PNG format with transparency.

## Canvas Size & Resolution

- **Working Canvas:** 2048×2048 pixels (recommended for creation)
- **Final Export:** 1024×1024 pixels (required)
- **Minimum:** 512×512 pixels (acceptable for placeholders)
- **Aspect Ratio:** Square (1:1) required

## Positioning & Alignment

### Center Point
- **Coordinates:** (1024, 1024) on 2048×2048 canvas / (512, 512) on 1024×1024 canvas
- **Purpose:** All facial features must align to this center point
- **Alignment:** Face center should be positioned at the canvas center

### Layer Stacking Order (Z-Index)
Layers are rendered in this order (back to front):
1. `paper` (background/base layer)
2. `head` (base head shape)
3. `eyes`
4. `nose`
5. `mouth`
6. `facialHair`
7. `hair`
8. `accessories`
9. `shading` (lighting/shadow overlays)

## Directory Structure

```
public/avatar/
├── assets/                    # Main asset directory
│   ├── paper/                # Background/base layers
│   │   ├── paper_1.png
│   │   └── paper_1.meta.json
│   ├── heads/                # Head shapes
│   │   ├── head_1.png
│   │   ├── head_2.png
│   │   └── ...
│   ├── eyes/                 # Eye variations
│   ├── noses/                # Nose variations
│   ├── mouths/               # Mouth variations
│   ├── facialHair/          # Beards, mustaches, etc.
│   ├── hair/                 # Hair styles
│   ├── accessories/          # Glasses, piercings, etc.
│   └── shading/              # Lighting overlays
└── templates/                # Template guides
    ├── paper_template.png
    ├── heads_template.png
    ├── eyes_template.png
    ├── noses_template.png
    ├── mouths_template.png
    ├── facialHair_template.png
    ├── hair_template.png
    ├── accessories_template.png
    ├── shading_template.png
    ├── DIMENSIONS_GUIDE.png
    └── COLOR_PALETTE.png
```

## File Naming Convention

### Asset Files
```
[layer]_[descriptor]_[number].png
```

**Examples:**
- `head_1.png` - First head shape
- `eyes_tired_01.png` - First tired eye variation
- `hair_messy_03.png` - Third messy hair style
- `accessory_headphones_02.png` - Second headphone accessory
- `shading_1.png` - First shading overlay

### Metadata Files
Each PNG asset should have a corresponding `.meta.json` file:
```
[asset_filename].meta.json
```

**Example:** `head_1.png` → `head_1.meta.json`

## Metadata Format

Each asset requires a metadata JSON file with the following structure:

```json
{
  "resolution": 1024,
  "tone": "warm_medium",
  "genderTags": ["neutral"],
  "styleTags": ["realistic"],
  "ageRange": [18, 65],
  "variants": [],
  "hueVariants": [],
  "supportsTint": true,
  "normalMap": null,
  "roughnessMap": null,
  "atlas": null,
  "frame": null,
  "zIndex": 0,
  "intensity": null,
  "metadataAuthor": "Artist Name",
  "metadataNotes": "Optional notes about the asset"
}
```

### Required Fields
- `resolution`: Pixel dimensions (width/height, since square)
- `genderTags`: Array of gender categories (`["unisex"]`, `["neutral"]`, etc.)
- `styleTags`: Array of style descriptors (`["realistic"]`, `["cartoon"]`, etc.)
- `supportsTint`: Boolean - whether the asset can be color-tinted

### Optional Fields
- `tone`: Skin tone category for heads (`"warm_light"`, `"cool_medium"`, etc.)
- `ageRange`: Array `[minAge, maxAge]` for age-appropriate filtering
- `hueVariants`: Array of available color variations for tintable assets
- `normalMap`: Path to normal map file for 3D lighting effects
- `roughnessMap`: Path to roughness map for material properties
- `zIndex`: Override default layer ordering
- `intensity`: Opacity multiplier (0.0-1.0)
- `metadataAuthor`: Artist credit
- `metadataNotes`: Additional context

## Layer Specifications

### 1. Paper Layer (`paper/`)
- **Purpose:** Background/base texture
- **Required:** Yes
- **Examples:** `paper_1.png`
- **Notes:** Usually a single neutral background

### 2. Heads Layer (`heads/`)
- **Purpose:** Base head shapes and skin tones
- **Required:** Yes
- **Examples:** `head_1.png`, `head_2.png`, `head_3.png`, `head_4.png`, `head_5.png`
- **Notes:** Should include skin tone variations in metadata

### 3. Eyes Layer (`eyes/`)
- **Purpose:** Eye shapes and expressions
- **Required:** Yes
- **Examples:** `eyes_neutral_01.png`, `eyes_tired_02.png`, `eyes_intense_01.png`
- **Notes:** Include both eye shape and eyelid variations

### 4. Noses Layer (`noses/`)
- **Purpose:** Nose shapes and sizes
- **Required:** Yes
- **Examples:** `nose_button_01.png`, `nose_crooked_left_02.png`, `nose_straight_01.png`
- **Notes:** Focus on bridge, tip, and nostril variations

### 5. Mouths Layer (`mouths/`)
- **Purpose:** Mouth shapes and expressions
- **Required:** Yes
- **Examples:** `mouth_smile_01.png`, `mouth_neutral_02.png`, `mouth_frown_01.png`
- **Notes:** Include lip thickness and expression variations

### 6. Facial Hair Layer (`facialHair/`)
- **Purpose:** Beards, mustaches, stubble
- **Required:** No (can be omitted)
- **Examples:** `facialHair_beard_01.png`, `facialHair_stubble_02.png`
- **Notes:** Should support tinting for different hair colors

### 7. Hair Layer (`hair/`)
- **Purpose:** Hair styles and colors
- **Required:** Yes
- **Examples:** `hair_messy_01.png`, `hair_long_02.png`, `hair_mohawk_01.png`
- **Notes:** Must support tinting (`"supportsTint": true`)

### 8. Accessories Layer (`accessories/`)
- **Purpose:** Glasses, piercings, headwear
- **Required:** No (can be omitted)
- **Examples:** `accessory_glasses_01.png`, `accessory_headphones_02.png`
- **Notes:** Can include tintable items (silver/gold jewelry)

### 9. Shading Layer (`shading/`)
- **Purpose:** Lighting and shadow overlays
- **Required:** No (can be omitted)
- **Examples:** `shading_1.png`, `shading_2.png`
- **Notes:** Use multiply/screen blend modes in engine

## Technical Requirements

### Image Format
- **Format:** PNG with transparency
- **Color Mode:** RGBA (32-bit)
- **Compression:** Lossless
- **Alpha Channel:** Required for proper compositing

### Color Guidelines
- **Heads:** Use skin tone colors (avoid pure white/gray placeholders)
- **Hair:** Use neutral gray (RGB 180, 180, 180) for tintable hair
- **Accessories:** Use neutral colors that work with tinting
- **Shading:** Use grayscale for lighting overlays

### Transparency
- **Clean Edges:** No halos or jagged edges
- **Anti-aliasing:** Smooth edges with 1-2 pixel feather
- **Alpha Channel:** Pure transparency (not premultiplied)

## Build Process

After adding assets, rebuild the manifest:

```bash
# Rebuild manifest with validation
node tools/build-avatar-manifest.js --validate

# Or use npm script
npm run avatar:manifest
```

## Testing

Test assets in the Avatar PoC:
1. Start dev server: `npm run dev`
2. Navigate to: `http://localhost:5175/gigmaster/?poc=avatar`
3. Generate avatars with different seeds
4. Check alignment, transparency, and tinting

## Template Files

Use the provided template PNGs in `public/avatar/templates/` as guides:
- Each template shows the center alignment point
- Templates include dimension guides
- Use as reference for positioning and sizing

## Quality Checklist

- [ ] PNG format with transparency
- [ ] 1024×1024 pixels (or 512×512 minimum)
- [ ] Face centered at canvas center
- [ ] Clean alpha channel edges
- [ ] Corresponding `.meta.json` file
- [ ] Proper naming convention
- [ ] Correct directory placement
- [ ] Manifest rebuilt after changes
- [ ] Tested in Avatar PoC

## Current Asset Counts

Based on the manifest system:
- **Total Assets:** 171 features across 9 layers
- **Paper:** 1 variant
- **Heads:** 5 shapes
- **Eyes:** 13 variations
- **Noses:** 10 variations
- **Mouths:** 12 variations
- **Facial Hair:** 7 styles
- **Hair:** 15 styles
- **Accessories:** 10 items
- **Shading:** 2 overlays

## File Size Guidelines

- **Individual PNG:** < 500KB (aim for < 200KB)
- **Total Bundle:** < 50MB for all assets
- **Optimization:** Use PNG-8 for simple graphics, PNG-32 for complex transparency

## Version Control

- Commit asset PNGs and metadata JSONs together
- Use descriptive commit messages: `feat: add tired eye variations`
- Keep assets in version control (not gitignored)

## Troubleshooting

### Assets not loading
- Verify file paths match manifest exactly (case-sensitive)
- Ensure files are in `public/avatar/assets/` directory
- Rebuild manifest after adding files

### Misaligned features
- Check center point alignment (512, 512 on 1024×1024 canvas)
- Verify all assets use same canvas size
- Use template guides for reference

### Tinting not working
- Set `"supportsTint": true` in metadata
- Paint hair/accessories in neutral gray
- Rebuild manifest and refresh browser

### Blend mode issues
- Shading layers use multiply/screen modes
- Ensure proper alpha channel usage
- Test with different lighting presets</content>
<parameter name="filePath">c:\Dev\gigmaster\AVATAR_ASSET_SPECIFICATIONS.md