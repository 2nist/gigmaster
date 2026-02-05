# Getting Started with GigMaster Avatar Assets

**Welcome! This guide will get you creating avatar assets in under 30 minutes.**

## 🎯 Your Mission

Create custom avatar parts (body, eyes, hair, etc.) that Phaser.js will composite into unique characters for your GigMaster game.

## 📋 Before You Start

### What You Need:
- ✅ A design tool (GIMP is free and works great)
- ✅ 30-60 minutes of uninterrupted time
- ✅ These template files (you already have them!)
- ✅ Your GigMaster repository

### What You Don't Need:
- ❌ Professional art skills (simple shapes work!)
- ❌ Expensive software
- ❌ Game development experience
- ❌ Previous asset creation knowledge

## 🚦 Start Here (Step-by-Step)

### Step 1: Review the References (5 minutes)

Open these files to understand what you're creating:

1. **DIMENSIONS_GUIDE.png** - Visual reference showing exact positions
2. **COLOR_PALETTE.png** - Pre-selected colors that work well together
3. **example-assets/** folder - See working examples

**Don't skip this!** These 5 minutes save hours of confusion later.

### Step 2: Install GIMP (10 minutes)

If you don't have a design tool yet:

1. Go to https://www.gimp.org/downloads/
2. Download for your OS (Windows/Mac/Linux)
3. Install (it's free!)
4. Launch GIMP

**Already have Photoshop/Krita/etc?** Use that instead! Skip to Step 3.

### Step 3: Create Your First Asset (15 minutes)

**Let's make a body (skin tone):**

1. **In GIMP:**
   - File → New
   - Width: `512` Height: `512`
   - Advanced Options → Fill with: `Transparency`
   - Click OK

2. **Import the template:**
   - File → Open as Layers
   - Select: `templates/TEMPLATE_body.png`
   - This is your guide (you'll delete it before exporting)

3. **Create a new layer:**
   - Layer → New Layer
   - Name it "body-light"
   - Fill with: Transparency
   - Click OK

4. **Draw the body:**
   - Select the Ellipse tool (E key)
   - Draw a circle where the template shows the head
   - Fill it with `#FFDAB9` (light skin tone)
   - Use Rectangle/Polygon tools for neck and shoulders
   - Follow the template guides

5. **Hide the template:**
   - In Layers panel, click the eye icon next to TEMPLATE_body

6. **Export:**
   - File → Export As
   - Name: `body-light.png`
   - Save to: `/path/to/gigmaster/public/avatar/assets/body/`
   - File Type: PNG
   - Make sure "Save background color" is UNCHECKED

### Step 4: Test It (5 minutes)

```bash
# Navigate to your GigMaster repo
cd /path/to/gigmaster

# Rebuild the manifest
node tools/build-avatar-manifest.js

# Start dev server
npm run dev

# Open your avatar demo page
# You should see your new body asset!
```

### Step 5: Create More Assets (Ongoing)

**Now that you've made one, make more!**

**Recommended order:**

1. **More bodies** (30 min total)
   - `body-medium.png` using `#D2B48C`
   - `body-dark.png` using `#8B4513`

2. **Eyes** (45 min total)
   - Use `templates/TEMPLATE_eyes.png`
   - `eyes-normal-brown.png`
   - `eyes-normal-blue.png`
   - `eyes-normal-green.png`

3. **Mouth** (20 min total)
   - Use `templates/TEMPLATE_mouth.png`
   - `mouth-smile.png`
   - `mouth-neutral.png`

4. **Hair** (60 min total)
   - Use `templates/TEMPLATE_hair.png`
   - Remember: hair needs TWO files (front + back)
   - `hair-back-spiky-black.png`
   - `hair-front-spiky-black.png`

**After these, you'll have ~100 unique avatar combinations!**

## 🎨 Design Tips for Beginners

### Keep It Simple
- **Good**: Solid colors, clean shapes, high contrast
- **Bad**: Detailed textures, gradients, low contrast

### Use the Color Palette
- Don't guess colors - use the hex codes from `COLOR_PALETTE.png`
- These are tested to work well together
- Copy-paste into GIMP's color picker

### Follow the Templates
- The guides show you exactly where things go
- Don't improvise positions until you're comfortable
- Test early and often

### Start Geometric
Your first assets can be very simple:
- **Body**: Circle for head + rectangle for torso
- **Eyes**: Two small circles
- **Mouth**: A curved line
- **Hair**: Triangles for spiky, rectangles for straight

**You can always improve them later!**

## 🐛 Common First-Time Mistakes

### "I exported but there's a white background!"

**Fix:**
- In GIMP export dialog, UNCHECK "Save background color"
- Make sure your canvas has a transparent background (checkered pattern)
- Ensure you're exporting PNG, not JPG

### "The manifest isn't finding my files!"

**Fix:**
- Check the filename exactly matches the convention
- Make sure it's in the right folder: `public/avatar/assets/{category}/`
- Run `node tools/build-avatar-manifest.js` again
- Restart your dev server

### "My asset is in the wrong position!"

**Fix:**
- Double-check your canvas is 512×512px
- Use the template guides
- Check the DIMENSIONS_GUIDE.png for exact coordinates

### "My colors look washed out!"

**Fix:**
- Make sure you're using RGB mode (not CMYK)
- Use the exact hex codes from COLOR_PALETTE.png
- Check your layer opacity is 100%

## 📚 What to Read Next

After you've created your first few assets:

1. **QUICK_START.md** - Cheat sheet for fast reference
2. **ASSET_SPEC.md** - Full technical specifications
3. **LAYER_GUIDE.md** - Advanced workflows & batch export

## 🎓 Learning Resources

### Video Tutorials (Search YouTube)
- "GIMP basics for beginners"
- "How to create game sprites"
- "Pixel art for games" (similar concepts)

### Inspiration
- Look at your favorite games' character creators
- Search "avatar creator" for visual inspiration
- Check out music game characters (Guitar Hero, Rock Band)

## ✅ Success Checklist

After your first session, you should have:

- [ ] GIMP (or another tool) installed
- [ ] Created at least one asset (body, eyes, or hair)
- [ ] Successfully exported as PNG with transparency
- [ ] Rebuilt the manifest
- [ ] Seen your asset in the game

**If you've done all this - congratulations! You're now a game asset creator!** 🎉

## 🚀 Next Steps

### Week 1 Goal: Basic Set
- [ ] 3 body tones
- [ ] 3 eye colors
- [ ] 2 mouth expressions
- [ ] 2 hair styles (front + back)

This gives you 3 × 3 × 2 × 2 = **36 unique combinations** minimum!

### Week 2 Goal: Variety
- [ ] 3 more hair styles
- [ ] Recolor hair (5 colors × all styles)
- [ ] Add 3 accessories

Now you have **thousands of combinations!**

### Week 3 Goal: Polish
- [ ] Refine based on what looks best
- [ ] Add archetype-specific items
- [ ] Create themed sets (Rock, DJ, Jazz)

## 💪 You've Got This!

Remember:
- **Start simple** - geometric shapes are fine
- **Test often** - don't make 50 assets before testing
- **Iterate** - your 10th asset will be way better than your 1st
- **Have fun** - this is creative work!

**The best asset is the one that's done.** Don't aim for perfection on your first try!

---

## Need Help?

**Stuck?** Check:
1. QUICK_START.md troubleshooting section
2. Example assets to see how it's done
3. Your team chat

**Ready to dive deeper?** Read:
1. ASSET_SPEC.md for all technical details
2. LAYER_GUIDE.md for advanced workflows

**Let's create some awesome avatars!** 🎸🎮
