# Project Nuperous

A static, browser-based game portal. Browse hundreds of HTML games from one launcher, search by title, and open any game in a new tab.

> **Beta** — Some games may not load or may break. Report issues to **Nuper**.

## Features

- **Game library** — 500+ titles listed in `games.json`, with 800+ HTML builds in `games/`
- **Search** — Filter by game title or filename (multi-word queries supported)
- **Thumbnails** — Optional `thumbnails/*.jpg` images; colored initials used as fallback
- **Themes** — Dark (default) and light mode, saved in `localStorage`
- **Recently played** — Last 10 opened games tracked in the browser
- **First-visit intro** — One-time welcome modal (dismiss stored in `localStorage`)

## Project structure

```
projectnuperous/
├── index.html       # Main launcher (grid, search, intro modal)
├── settings.html    # Theme and preferences
├── games.json       # Catalog: { "File", "Title" } per game
├── games/           # Individual game HTML files
└── thumbnails/      # Optional: {game-filename}.jpg (without .html)
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

### VS Code / Cursor

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

Open **Settings** from the nav bar or go to `settings.html`. Theme choice is stored under the `theme` key in `localStorage` (`dark` or `light`).

## Browser storage keys

| Key | Purpose |
|-----|---------|
| `theme` | `dark` or `light` |
| `hasSeenIntro` | Intro modal dismissed |
| `recentlyPlayed` | JSON array of up to 10 game filenames |

## Tech stack

- Plain HTML, CSS, and JavaScript (no build step)
- [Lexend](https://fonts.google.com/specimen/Lexend) via Google Fonts
- No backend required

## License

Game content may be subject to third-party copyrights. Use and redistribution of individual games are your responsibility. The portal shell (`index.html`, `settings.html`, `games.json`) is provided as-is for personal or educational use unless otherwise specified by the maintainer.
