# Avatar Asset Examples

This directory contains example avatar assets created to demonstrate the expected style and quality level for the GigMaster avatar system.

## Overview

These examples show a **semi-realistic painterly style** with:
- Soft gradients and brush-like textures
- Subtle shadows and highlights
- Natural color palettes
- 1024×1024 resolution with transparency
- Proper face center alignment (512, 512)

## Example Assets

### Heads
- `head_example_warm_medium.png` - Warm medium skin tone head showing facial structure, shadows, and highlights

### Eyes
- `eye_example_neutral.png` - Neutral eye with iris gradient, pupil depth, catch light, and eyelid details

### Noses
- `nose_example_neutral.png` - Neutral nose with subtle nostril shadows and bridge definition

### Mouths
- `mouth_example_neutral.png` - Neutral mouth with lip gradients and subtle border definition

### Hair
- `hair_example_messy.png` - Messy hairstyle in neutral gray (supports tinting) with strand details and highlights

### Facial Hair
- `facialHair_example_beard.png` - Beard with hair strand details and gradient shadows

### Accessories
- `accessory_example_glasses.png` - Glasses with lens reflections and frame gradients

## Technical Details

- **Resolution**: 1024×1024 pixels
- **Format**: PNG with transparency
- **Center Point**: (512, 512) for face alignment
- **Style**: Painterly/semi-realistic
- **Color Space**: RGB with proper alpha channels

## Usage for Artists

1. **Reference Style**: Use these as visual references for the expected quality and aesthetic
2. **Technical Guide**: Study the gradients, shadows, and layer structure
3. **Starting Point**: Artists can trace or adapt these for their own variations
4. **Consistency**: Maintain similar brush techniques and color approaches

## Metadata

Each example includes a `.meta.json` file with:
- Resolution and technical specs
- Style and gender tags
- Tint support information
- Usage notes and author credits

## Next Steps

1. Study these examples in your preferred art software
2. Create variations using the same techniques
3. Follow the [Avatar Asset Creation Guide](../../docs/AVATAR_ASSET_CREATION_GUIDE.md) for full production workflow
4. Test assets in the avatar PoC at `?poc=avatar`

## File Structure

```
assets/
├── heads/
│   ├── head_example_warm_medium.png
│   └── head_example_warm_medium.meta.json
├── eyes/
│   ├── eye_example_neutral.png
│   └── eye_example_neutral.meta.json
├── noses/
│   ├── nose_example_neutral.png
│   └── nose_example_neutral.meta.json
├── mouths/
│   ├── mouth_example_neutral.png
│   └── mouth_example_neutral.meta.json
├── hair/
│   ├── hair_example_messy.png
│   └── hair_example_messy.meta.json
├── facialHair/
│   ├── facialHair_example_beard.png
│   └── facialHair_example_beard.meta.json
└── accessories/
    ├── accessory_example_glasses.png
    └── accessory_example_glasses.meta.json
```

---

*These examples were generated programmatically to demonstrate the target style. Professional artists should create original assets following these visual guidelines.*