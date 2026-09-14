# Project Nuperous

A static, browser-based game portal. Browse hundreds of HTML games from one liquid-glass launcher, search, continue, favorite, and play in-page.

> **Beta** — Some games may not load or may break. Report issues to **Nuper**.

## Features

- **Game library** — 500+ titles listed in `games.json`, with 800+ HTML builds in `games/`
- **Search** — Filter by title or filename (`/` or `Ctrl/⌘K`)
- **Continue playing** — Last 12 opened games in a horizontal rail
- **Favorites** — Pin games with the heart control
- **Categories** — Action, racing, puzzle, horror, FNF, IO, sports, classic, Minecraft
- **In-launcher player** — Overlay with new-tab and fullscreen; optional new-tab mode
- **Thumbnails** — `thumbnails/*.jpg` with colored initials fallback
- **Liquid glass** — Apple-style refraction on chrome via [simple-liquid-glass](https://github.com/lucaperullo/simple-liquid-glass). Chromium gets live SVG refraction; Safari/Firefox get frosted glass. Toggle in Settings.
- **Themes** — Dark (default), light, and system, saved in `localStorage`
- **First-visit intro** — One-time welcome modal

## Project structure

```
projectnuperous/
├── index.html       # Library
├── settings.html    # Theme, play mode, local data
├── css/portal.css   # Design system
├── js/              # Theme, liquid glass prefs, elastic controls, library
├── vendor/          # Vendored GitHub UI (simple-liquid-glass)
├── games.json       # Catalog: { "File", "Title" } per game
├── games/           # Individual game HTML files
└── thumbnails/      # Optional: {game-filename}.jpg
```

## Getting started

This project uses `fetch()` to load `games.json`. Opening `index.html` directly from the file system (`file://`) will not work in most browsers. Serve the folder with a local HTTP server.

### Python

```bash
cd projectnuperous
python -m http.server 8080
```

Open [http://localhost:8080](http://localhost:8080).

### Node.js (npx)

```bash
npx serve .
```

### VS Code

Use the **Live Server** extension and open `index.html`.

## Adding a game

1. Place the game HTML in `games/` (e.g. `games/my-game.html`).
2. Add an entry to `games.json`:

```json
{
  "File": "my-game.html",
  "Title": "My Game"
}
```

3. *(Optional)* Add `thumbnails/my-game.jpg` (same base name as the HTML file, without `.html`).

Reload the launcher; the new game appears in the grid.

## Settings

Open **Settings** from the nav bar or go to `settings.html`.

| Key | Purpose |
|-----|---------|
| `theme` | `dark`, `light`, or `system` |
| `hasSeenIntro` | Intro modal dismissed |
| `recentlyPlayed` | JSON array of up to 12 game filenames |
| `favorites` | JSON array of pinned filenames |
| `playMode` | `overlay` or `tab` |
| `gridDensity` | `comfortable` or `compact` |
| `reduceMotion` | `1` to disable extra motion |
| `liquidGlass` | `on` (refraction), `blur` (frosted), or `off` |

## Tech stack

- Plain HTML, CSS, and JavaScript (no build step)
- [Lexend](https://fonts.google.com/specimen/Lexend) via Google Fonts
- [simple-liquid-glass](https://github.com/lucaperullo/simple-liquid-glass) web component (MIT, vendored at `vendor/simple-liquid-glass/`)
- No backend required

## License

Game content may be subject to third-party copyrights. Use and redistribution of individual games are your responsibility. The portal shell (`index.html`, `settings.html`, `games.json`) is provided as-is for personal or educational use unless otherwise specified by the maintainer.
