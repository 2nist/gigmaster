# GigMaster Avatar Asset Templates

**Professional-quality templates and guides for creating Phaser.js game avatars**

This package contains everything you need to start designing custom avatar assets for your GigMaster game, even if you've never created game art before.

## 📦 What's Included

```
gigmaster-avatar-templates/
├── README.md                    ← You are here
├── ASSET_SPEC.md               ← Technical specifications (dimensions, formats)
├── LAYER_GUIDE.md              ← GIMP/Photoshop workflow & export scripts
├── QUICK_START.md              ← Cheat sheet for fast reference
├── COLOR_PALETTE.png           ← Visual color reference
│
├── templates/                   ← PNG templates with guide overlays
│   ├── TEMPLATE_body.png
│   ├── TEMPLATE_eyes.png
│   ├── TEMPLATE_mouth.png
│   ├── TEMPLATE_hair.png
│   └── TEMPLATE_accessory.png
│
└── example-assets/             ← Working examples to learn from
    ├── body/
    │   ├── body-light.png
    │   └── body-medium.png
    ├── eyes/
    │   ├── eyes-normal-brown.png
    │   └── eyes-normal-blue.png
    ├── hair/
    │   ├── hair-back-spiky-black.png
    │   └── hair-front-spiky-black.png
    ├── mouth/
    │   └── mouth-smile.png
    └── accessories/
        └── acc-headphones-dj.png
```

## 🚀 Quick Start (5 Minutes)

### 1. Install a Design Tool
- **GIMP** (Free): https://www.gimp.org/downloads/
- **Photopea** (Free, Browser): https://www.photopea.com/
- **Photoshop** (Paid): If you have it

### 2. Open a Template
- Launch your design tool
- Open `templates/TEMPLATE_body.png`
- This shows you exactly where to draw

### 3. Create Your First Asset
- Create a new layer above the template
- Draw a simple body shape
- Use the color palette: `#FFDAB9` (light skin)
- Export as PNG-24 with transparency

### 4. Test It
```bash
# Copy your PNG to your game repo
cp my-body.png /path/to/gigmaster/public/avatar/assets/body/body-custom.png

# Rebuild the manifest
cd /path/to/gigmaster
node tools/build-avatar-manifest.js

# Start your dev server and view!
npm run dev
```

## 📖 Documentation Guide

**New to game art?** Start here:
1. Read `QUICK_START.md` (10 min read)
2. Open `COLOR_PALETTE.png` for reference
3. Follow the Week 1 asset list
4. Refer back to `ASSET_SPEC.md` when needed

**Experienced artist?** Skip to:
1. `ASSET_SPEC.md` - Get exact dimensions
2. `templates/` - Use as guide layers
3. `LAYER_GUIDE.md` - Set up batch exports
4. Start creating!

## 🎨 Asset Creation Workflow

### Recommended Order

**Week 1: Basics** (14 assets)
- 3 body tones
- 3 eye colors  
- 2 mouth expressions
- 2 hair styles (front + back layers)

This gives you ~100 unique combinations!

**Week 2: Variety** (30+ assets)
- 3 more hair styles × 3 colors
- 3 accessories (headphones, glasses, hat)
- More eye/mouth variations

This unlocks thousands of combinations!

### Daily Routine
1. **Pick one category** (body, eyes, hair, etc.)
2. **Open template** for that category
3. **Create 2-3 variants** (15-30 min each)
4. **Export & test** immediately
5. **Iterate** based on what you see

## 🎯 Technical Requirements

| Property | Value |
|----------|-------|
| Canvas Size | 512×512 pixels |
| Format | PNG-24 with alpha transparency |
| Color Mode | RGB |
| File Size Target | <100KB per asset |
| Safe Zone | 32px margin on all sides |
| Naming | `{category}-{variant}.png` |

**Examples:**
- `body-light.png`
- `eyes-normal-blue.png`
- `hair-front-spiky-red.png`
- `acc-headphones-dj.png`

## 🎨 Color Palette

Open `COLOR_PALETTE.png` for a visual reference, or use these hex codes:

### Skin Tones
```
Light:    #FFDAB9
Medium:   #D2B48C
Dark:     #8B4513
Alien:    #7CFC00
```

### Hair Colors (Natural)
```
Black:    #2C1810
Brown:    #8B4513
Blonde:   #FFD700
Red:      #DC143C
Auburn:   #A52A2A
```

### Hair Colors (Fantasy)
```
Hot Pink: #FF1493
Cyan:     #00CED1
Purple:   #9370DB
Lime:     #32CD32
White:    #F0F8FF
```

### Eye Colors
```
Brown:  #8B4513
Blue:   #4169E1
Green:  #228B22
Hazel:  #8B7355
Grey:   #708090
```

## 📐 Key Dimensions

Essential positions to remember:

| Element | Position (x, y) | Size |
|---------|----------------|------|
| Canvas | - | 512×512px |
| Head Circle | (256, 180) | 120px diameter |
| Left Eye | (226, 160) | 30×20px |
| Right Eye | (286, 160) | 30×20px |
| Mouth | (256, 200) | 50×20px |
| Anchor Point | (256, 480) | Center-bottom |

## 🛠️ Tools & Resources

### Free Design Tools
- **GIMP** - Powerful, full-featured
- **Krita** - Great for digital painting
- **Photopea** - Photoshop clone in browser
- **Aseprite** - Pixel art (if going retro)

### Paid Design Tools
- **Photoshop** - Industry standard
- **Affinity Photo** - One-time purchase
- **Procreate** - iPad illustration

### AI-Assisted Workflows
1. Generate base with Midjourney/DALL-E
2. Export PNG
3. Clean up in GIMP/Photoshop
4. Ensure transparency & dimensions
5. Export final PNG-24

## 🐛 Troubleshooting

### "My asset doesn't show in the game!"
- ✅ Did you run `node tools/build-avatar-manifest.js`?
- ✅ Is it saved as PNG-24 with transparency?
- ✅ Is it in the right folder?
- ✅ Is the filename correct?

### "The layers don't align!"
- ✅ Canvas exactly 512×512px?
- ✅ Using the template guides?
- ✅ Centering at (256, y)?

### "Colors look washed out!"
- ✅ Using RGB mode (not CMYK)?
- ✅ Using vibrant hex codes from palette?
- ✅ Saved at 100% opacity?

### "File size is huge!"
- ✅ Did you flatten guide layers into it?
- ✅ Saved as PNG-24 (not PNG-48)?
- Target: <100KB per file

## 💡 Pro Tips

1. **Start simple** - Geometric shapes work great
2. **Batch create** - Make all skin tones at once
3. **Test early** - Don't make 50 assets before testing
4. **Reuse & recolor** - Copy base shapes, change colors
5. **Version control** - Save as v1, v2, v3
6. **Get feedback** - Show others every few days

## 📊 Success Metrics

**After 1 week:**
- [ ] 10+ working assets
- [ ] 3+ complete avatar combinations look good
- [ ] Avatars generate in <1 second

**After 2 weeks:**
- [ ] 50+ assets
- [ ] Random generations all look acceptable
- [ ] Happy with overall quality

**After 1 month:**
- [ ] 100+ assets
- [ ] Archetype-specific collections (Rock, DJ, Jazz)
- [ ] Ready to show players!

## 🎓 Learning Path

### Beginner Path
1. Read `QUICK_START.md`
2. Open example assets in your design tool
3. Modify colors/simple shapes
4. Export & test
5. Create your first original asset

### Intermediate Path
1. Read `ASSET_SPEC.md`
2. Set up layer structure from `LAYER_GUIDE.md`
3. Create a complete set (body + eyes + hair)
4. Test combinations
5. Expand to accessories

### Advanced Path
1. Review all docs
2. Set up batch export scripts
3. Create archetype-specific themes
4. Add animation frames (blink, etc.)
5. Optimize with sprite atlases

## 🔗 Integration with Your Codebase

Your GigMaster repo should have this structure:

```
gigmaster/
├── public/
│   └── avatar/
│       └── assets/
│           ├── body/
│           │   ├── body-light.png
│           │   └── body-medium.png
│           ├── eyes/
│           ├── hair/
│           ├── mouth/
│           └── accessories/
│
├── src/
│   ├── avatar/
│   │   ├── manifest.json          ← Auto-generated
│   │   └── phaser/
│   │       └── AvatarScene.js     ← Uses your assets
│   └── components/
│       └── PhaserAvatar.jsx        ← React wrapper
│
└── tools/
    └── build-avatar-manifest.js    ← Run after adding assets
```

After creating assets:
```bash
# Copy to your repo
cp example-assets/body/*.png /path/to/gigmaster/public/avatar/assets/body/

# Rebuild manifest
cd /path/to/gigmaster
node tools/build-avatar-manifest.js

# Test
npm run dev
```

## 📝 File Naming Conventions

**Format:** `{category}-{style}-{variant}.png`

**Body:**
- `body-light.png`
- `body-medium.png`
- `body-dark.png`

**Eyes:**
- `eyes-normal-brown.png`
- `eyes-wide-blue.png`
- `eyes-closed-blink.png`

**Hair (requires front + back):**
- `hair-front-spiky-red.png`
- `hair-back-spiky-red.png`
- `hair-front-long-blonde.png`
- `hair-back-long-blonde.png`

**Accessories:**
- `acc-headphones-dj.png`
- `acc-sunglasses-rock.png`
- `acc-hat-beanie.png`

## 🎮 Archetype Themes

Create themed sets for different musician types:

**Rock Star**
- Colors: Black, red, silver
- Hair: Spiky, mohawk
- Accessories: Sunglasses, leather jacket
- Vibe: Edgy, rebellious

**DJ/Electronic**
- Colors: Cyan, purple, neon
- Hair: Modern cuts, bright colors
- Accessories: Headphones (essential!)
- Vibe: Futuristic, tech

**Jazz/Classical**
- Colors: Earth tones, gold
- Hair: Classic, refined
- Accessories: Bow tie, fedora
- Vibe: Sophisticated, timeless

**Hip-Hop**
- Colors: Bold, urban
- Hair: Dreads, fades, caps
- Accessories: Chains, snapbacks
- Vibe: Street, confident

## 🤝 Contributing

Found a better workflow? Created amazing assets? Share them!

This template pack is meant to evolve. Improvements welcome.

## 📄 License

These templates are provided for use in the GigMaster project.
Feel free to modify, extend, and improve them!

---

## ❓ Need Help?

**Stuck on something?**
1. Check `QUICK_START.md` troubleshooting section
2. Review `ASSET_SPEC.md` for technical details
3. Look at `example-assets/` for working examples
4. Ask in your team chat

**Remember:** Perfect is the enemy of done. Ship it fast, iterate based on feedback! 🚀

---

Created with ❤️ for the GigMaster project
