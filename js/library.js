const PAGE = 48;
const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6", "#f43f5e", "#6366f1", "#84cc16"];
const CHIPS = [
  { id: "all", label: "All" },
  { id: "recent", label: "Continue" },
  { id: "favorites", label: "Favorites" },
  { id: "action", label: "Action" },
  { id: "racing", label: "Racing" },
  { id: "puzzle", label: "Puzzle" },
  { id: "horror", label: "Horror" },
  { id: "fnf", label: "FNF" },
  { id: "io", label: "IO" },
  { id: "sports", label: "Sports" },
  { id: "classic", label: "Classic" },
  { id: "minecraft", label: "Minecraft" }
];

const RULES = {
  fnf: /funkin|friday night|fnf|psych engine/i,
  minecraft: /minecraft/i,
  horror: /granny|horror|five nights|fnaf|freddy|baldi|scary/i,
  racing: /moto|race|drift|parking|bike|kart|offroad|drive/i,
  puzzle: /2048|wordle|chess|sort|puzzle|sudoku|mahjong|solitaire|match|word/i,
  io: /\.io\b| io\b/i,
  sports: /soccer|football|basket|golf|tennis|billiard|archery|dunk|sport/i,
  classic: /pac-man|flappy|tetris|snake|mario|sonic|pong|breakout|2048/i,
  action: /shoot|blast|war|fight|brawl|ninja|stickman|attack|battle/i
};

const els = {
  grid: document.getElementById("grid"),
  rail: document.getElementById("recent-rail"),
  recentWrap: document.getElementById("recent-wrap"),
  search: document.getElementById("search"),
  searchBox: document.getElementById("search-box"),
  clear: document.getElementById("search-clear"),
  chips: document.getElementById("chips"),
  sort: document.getElementById("sort"),
  total: document.getElementById("stat-total"),
  visible: document.getElementById("stat-visible"),
  favCount: document.getElementById("stat-favs"),
  more: document.getElementById("more"),
  player: document.getElementById("player"),
  frame: document.getElementById("player-frame"),
  playerTitle: document.getElementById("player-title"),
  intro: document.getElementById("intro")
};

let games = [];
let filtered = [];
let shown = 0;
let chip = "all";
let activeGame = null;

function readList(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function writeList(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function recents() {
  return readList("recentlyPlayed");
}

function favs() {
  return readList("favorites");
}

function playMode() {
  return localStorage.getItem("playMode") || "overlay";
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
}

function colorFor(title) {
  let hash = 0;
  for (let i = 0; i < title.length; i += 1) hash = title.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

function initials(title) {
  const clean = title.replace(/^(The|A|An)\s+/i, "").trim() || "?";
  const words = clean.split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return clean.slice(0, 2).toUpperCase();
}

function tagsFor(title) {
  return Object.keys(RULES).filter((key) => RULES[key].test(title));
}

function uniqueGames(list) {
  const seen = new Set();
  return list.filter((game) => {
    if (!game.File || seen.has(game.File)) return false;
    seen.add(game.File);
    return true;
  });
}

function displayTitle(game) {
  return (game.Title || "").trim() || game.File.replace(/\.html$/i, "");
}

function isFav(file) {
  return favs().includes(file);
}

function toggleFav(file) {
  let list = favs().filter((item) => item !== file);
  if (list.length === favs().length) list.unshift(file);
  writeList("favorites", list.slice(0, 200));
  updateStats();
}

function trackRecent(file) {
  const list = recents().filter((item) => item !== file);
  list.unshift(file);
  writeList("recentlyPlayed", list.slice(0, 12));
}

function byFile(file) {
  return games.find((game) => game.File === file);
}

function card(game, opts = {}) {
  const title = displayTitle(game);
  const file = game.File;
  const image = `thumbnails/${file.replace(/\.html$/i, ".jpg")}`;
  const node = document.createElement("div");
  node.className = "game-card";
  node.style.setProperty("--mx", "50%");
  node.style.setProperty("--my", "50%");
  node.innerHTML = `
    <button class="fav-btn" type="button" aria-label="Favorite ${escapeHtml(title)}" aria-pressed="${isFav(file)}">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="${isFav(file) ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
    </button>
    <a class="thumb-link" href="games/${encodeURIComponent(file)}">
      <div class="thumb" style="background:${colorFor(title)}">
        <span>${escapeHtml(initials(title))}</span>
        <img src="${image}" alt="" loading="lazy">
      </div>
      <div class="meta">
        <div class="title" title="${escapeHtml(title)}">${escapeHtml(title)}</div>
        <span class="play-label">Play</span>
      </div>
    </a>
  `;
  const img = node.querySelector("img");
  img.addEventListener("load", () => img.classList.add("is-on"));
  img.addEventListener("error", () => img.remove());
  node.querySelector(".fav-btn").addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleFav(file);
    const pressed = isFav(file);
    event.currentTarget.setAttribute("aria-pressed", String(pressed));
    event.currentTarget.querySelector("path").setAttribute("fill", pressed ? "currentColor" : "none");
    if (chip === "favorites") applyFilter();
  });
  node.querySelector(".thumb-link").addEventListener("click", (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (playMode() === "tab") {
      trackRecent(file);
      refreshRecent();
      return;
    }
    event.preventDefault();
    openPlayer(game);
  });
  return node;
}

function applyFilter() {
  const terms = els.search.value.toLowerCase().split(/\s+/).filter(Boolean);
  const recent = recents();
  const liked = favs();
  filtered = games.filter((game) => {
    const title = displayTitle(game);
    const file = game.File;
    const blob = `${title} ${file}`.toLowerCase();
    const matches = !terms.length || terms.every((term) => blob.includes(term));
    if (!matches) return false;
    if (chip === "all") return true;
    if (chip === "recent") return recent.includes(file);
    if (chip === "favorites") return liked.includes(file);
    return tagsFor(title).includes(chip);
  });

  const sort = els.sort.value;
  if (sort === "az") filtered.sort((a, b) => displayTitle(a).localeCompare(displayTitle(b)));
  if (sort === "za") filtered.sort((a, b) => displayTitle(b).localeCompare(displayTitle(a)));
  if (sort === "recent") {
    const order = new Map(recent.map((file, index) => [file, index]));
    filtered.sort((a, b) => (order.has(a.File) ? order.get(a.File) : 9999) - (order.has(b.File) ? order.get(b.File) : 9999) || displayTitle(a).localeCompare(displayTitle(b)));
  }
  shown = 0;
  els.grid.innerHTML = "";
  if (!filtered.length) {
    els.grid.innerHTML = `<div class="empty glass">${chip === "favorites" ? "No favorites yet. Tap the heart on a game." : chip === "recent" ? "Play a game and it will land here." : `No games match “${escapeHtml(els.search.value)}”.`}</div>`;
    els.more.hidden = true;
  } else {
    paintMore();
  }
  updateStats();
  els.searchBox.classList.toggle("has-value", Boolean(els.search.value));
}

function paintMore() {
  const slice = filtered.slice(shown, shown + PAGE);
  const frag = document.createDocumentFragment();
  slice.forEach((game) => frag.appendChild(card(game)));
  els.grid.appendChild(frag);
  shown += slice.length;
  els.more.hidden = shown >= filtered.length;
}

function updateStats() {
  els.total.textContent = String(games.length);
  els.visible.textContent = String(filtered.length);
  els.favCount.textContent = String(favs().length);
}

function refreshRecent() {
  const list = recents().map(byFile).filter(Boolean);
  els.recentWrap.hidden = !list.length || Boolean(els.search.value);
  els.rail.innerHTML = "";
  list.slice(0, 10).forEach((game) => els.rail.appendChild(card(game, { rail: true })));
}

function openPlayer(game) {
  activeGame = game;
  trackRecent(game.File);
  refreshRecent();
  els.playerTitle.textContent = displayTitle(game);
  els.frame.src = `games/${game.File}`;
  els.player.classList.add("open");
  document.body.classList.add("lock");
  document.getElementById("player-fav").setAttribute("aria-pressed", String(isFav(game.File)));
  document.getElementById("close-player").focus();
}

function closePlayer() {
  els.player.classList.remove("open");
  document.body.classList.remove("lock");
  els.frame.src = "about:blank";
  activeGame = null;
}

function skeletons() {
  els.grid.innerHTML = "";
  for (let i = 0; i < 12; i += 1) {
    const node = document.createElement("div");
    node.className = "game-card skel";
    node.innerHTML = `<div class="thumb"></div><div class="meta"><div class="title">Loading</div></div>`;
    els.grid.appendChild(node);
  }
}

function bindGridShine(root) {
  root.addEventListener("pointermove", (event) => {
    const cardNode = event.target.closest(".game-card");
    if (!cardNode) return;
    const rect = cardNode.getBoundingClientRect();
    cardNode.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    cardNode.style.setProperty("--my", `${event.clientY - rect.top}px`);
  });
}

CHIPS.forEach((item) => {
  const btn = document.createElement("button");
  btn.className = `chip${item.id === "all" ? " active" : ""}`;
  btn.type = "button";
  btn.dataset.chip = item.id;
  btn.textContent = item.label;
  btn.addEventListener("click", () => {
    chip = item.id;
    [...els.chips.children].forEach((node) => node.classList.toggle("active", node === btn));
    applyFilter();
  });
  els.chips.appendChild(btn);
});

els.search.addEventListener("input", () => {
  refreshRecent();
  applyFilter();
});
els.clear.addEventListener("click", () => {
  els.search.value = "";
  els.search.focus();
  refreshRecent();
  applyFilter();
});
els.sort.addEventListener("change", applyFilter);
els.more.addEventListener("click", paintMore);
document.getElementById("density").addEventListener("click", () => {
  const next = (document.body.dataset.density || "comfortable") === "compact" ? "comfortable" : "compact";
  document.body.dataset.density = next;
  localStorage.setItem("gridDensity", next);
  document.getElementById("density").classList.toggle("active", next === "compact");
});
document.getElementById("density").classList.toggle("active", (localStorage.getItem("gridDensity") || "comfortable") === "compact");

document.getElementById("close-player").addEventListener("click", closePlayer);
document.getElementById("player-newtab").addEventListener("click", () => {
  if (!activeGame) return;
  window.open(`games/${activeGame.File}`, "_blank", "noopener");
});
document.getElementById("player-full").addEventListener("click", () => {
  const node = els.player;
  if (!document.fullscreenElement) node.requestFullscreen?.();
  else document.exitFullscreen?.();
});
document.getElementById("player-fav").addEventListener("click", (event) => {
  if (!activeGame) return;
  toggleFav(activeGame.File);
  event.currentTarget.setAttribute("aria-pressed", String(isFav(activeGame.File)));
  applyFilter();
  refreshRecent();
});

document.addEventListener("keydown", (event) => {
  const typing = ["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName);
  if (event.key === "Escape") {
    if (els.player.classList.contains("open")) closePlayer();
    else if (els.search.value) {
      els.search.value = "";
      applyFilter();
      refreshRecent();
    }
  }
  if ((event.key === "/" || (event.key === "k" && (event.metaKey || event.ctrlKey))) && !typing) {
    event.preventDefault();
    els.search.focus();
    els.search.select();
  }
});

bindGridShine(els.grid);
bindGridShine(els.rail);

if (!localStorage.getItem("hasSeenIntro")) {
  els.intro.classList.add("open");
  document.body.classList.add("lock");
  document.getElementById("close-intro").addEventListener("click", () => {
    els.intro.classList.remove("open");
    document.body.classList.remove("lock");
    localStorage.setItem("hasSeenIntro", "true");
  });
}

skeletons();

fetch("games.json")
  .then((res) => res.text())
  .then((text) => JSON.parse(text.replace(/^\uFEFF/, "")))
  .then((data) => {
    games = uniqueGames(Array.isArray(data) ? data : []).map((game) => ({
      File: game.File,
      Title: game.Title,
      tags: tagsFor(game.Title || "")
    }));
    refreshRecent();
    applyFilter();
  })
  .catch(() => {
    els.grid.innerHTML = `<div class="empty glass">Could not load the library. Serve this folder over HTTP instead of opening the file directly.</div>`;
  });
