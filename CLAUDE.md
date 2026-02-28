# TFM One Link — Landing Page (Linktree-Style)

## Project Overview
A branded landing page for **The Fragrant Memories (TFM)** that functions like Linktree:
- A **muted autoplay background/hero video** plays when the page opens
- Clickable **social media icons** navigate to TFM's social profiles
- **Mall location buttons** open Google Maps to each store
- **Footer link** takes users to the main TFM website

**Tech Stack:** Plain HTML + CSS + JavaScript (no framework)
**Hosting:** GitHub Pages (static deployment)
**Brand:** The Fragrant Memories

---

## File Structure

```
One Link/
├── index.html          ← Main landing page
├── style.css           ← All styles (layout, animations, responsive)
├── script.js           ← JS (video fallback, ripple, stagger animations)
├── assets/
│   ├── video/
│   │   └── hero.mp4    ← Background video (muted, autoplay, loop) ← ADD THIS
│   └── img/
│       └── logo.png    ← TFM cursive logo (white/transparent PNG) ← ADD THIS
└── CLAUDE.md           ← This file (project roadmap)
```

---

## Page Sections (Top to Bottom)

### 1. Hero Video
- Full-screen video plays automatically (`autoplay muted loop playsinline`)
- Dark overlay on top for text readability
- Fallback: dark gradient background if video fails to load

### 2. Logo + Brand Name
- `logo.png` centered (CSS filter makes it white automatically)
- Tagline: **THE FRAGRANT MEMORIES** in spaced uppercase

### 3. Social Icons (5 icons in a row)

| Icon | Platform | Link |
|------|----------|------|
| Instagram | Instagram | https://www.instagram.com/tfm |
| Snapchat  | Snapchat  | https://snapchat.com/t/4XMo7gU5 |
| TikTok    | TikTok    | https://www.tiktok.com/@tfmperfumes |
| WhatsApp  | WhatsApp  | https://wa.me/96560670703 |
| Globe     | Website   | https://www.tfmperfumes.com |

### 4. Mall Location Buttons (6 buttons)

| Mall | Google Maps Link |
|------|-----------------|
| MARINA MALL | https://maps.app.goo.gl/UUaZDk197eSmwA8B6 |
| THE AVENUES | https://maps.app.goo.gl/nxB3QUCJfLoXcrjy5 |
| 360 MALL | https://maps.google.com/?q=29.267828,47.993446 |
| WARE HOUSE MALL | https://maps.google.com/?q=29.084110,48.104721 |
| SULAIL AL JAHRA MALL | https://maps.app.goo.gl/Xg8U2mbpBmVBwENm6 |
| AL KHIRAN MALL | https://maps.app.goo.gl/exR8rrchAtAG2KVu6 |

### 5. Footer
- `WWW.TFMPERFUMES.COM` → links to https://www.tfmperfumes.com

---

## Design Spec

| Property | Value |
|----------|-------|
| Background | `hero.mp4` (muted video), fallback: dark gradient |
| Overlay | `rgba(0,0,0,0.22)` — light dark tint |
| Font | Poppins (Google Fonts) — weights 300 / 400 / 500 |
| Button style | Pill-shaped, semi-transparent dark, `backdrop-filter: blur` |
| Icon style | Circle bordered, semi-transparent |
| Text color | White |
| Max width | 480px (centered on desktop) |

---

## To-Do Before Launch

| Item | Status |
|------|--------|
| Add `hero.mp4` → `assets/video/hero.mp4` | ⏳ Pending |
| Add `logo.png` → `assets/img/logo.png` | ⏳ Pending |
| Test on iOS Safari (video autoplay) | ⏳ Pending |
| Deploy to GitHub Pages | ⏳ Pending |

---

## Deployment (GitHub Pages)

```bash
# 1. Initialize git repo in this folder
git init
git add .
git commit -m "Initial TFM One Link page"

# 2. Create GitHub repo named: tfm-one-link
# 3. Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/tfm-one-link.git
git push -u origin main

# 4. In GitHub repo settings → Pages → Source: main branch / root
# 5. Live URL: https://YOUR_USERNAME.github.io/tfm-one-link/
```

---

## Notes
- Video must be **under ~20MB** — compress with HandBrake or ffmpeg if needed
- Logo PNG should have transparent background; CSS auto-makes it white
- All links open in **new tab** (`target="_blank" rel="noopener"`)
- `playsinline` attribute ensures video autoplays on iOS Safari
- Page works with or without the video/logo files (graceful fallbacks built in)
