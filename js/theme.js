(function () {
  const root = document.documentElement;
  const key = "theme";

  function systemLight() {
    return window.matchMedia("(prefers-color-scheme: light)").matches;
  }

  function apply(theme) {
    const light = theme === "light" || (theme === "system" && systemLight());
    root.dataset.theme = light ? "light" : "dark";
    const color = light ? "#dbe4f4" : "#07070f";
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", color);
  }

  function applyBodyPrefs() {
    if (!document.body) return;
    document.body.classList.toggle("reduce-motion", localStorage.getItem("reduceMotion") === "1");
    document.body.dataset.density = localStorage.getItem("gridDensity") || "comfortable";
  }

  apply(localStorage.getItem(key) || "dark");
  applyBodyPrefs();
  document.addEventListener("DOMContentLoaded", applyBodyPrefs);

  window.NuperousTheme = {
    get: () => localStorage.getItem(key) || "dark",
    set(theme) {
      localStorage.setItem(key, theme);
      apply(theme);
    },
    applyBodyPrefs
  };

  window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", () => {
    if ((localStorage.getItem(key) || "dark") === "system") apply("system");
  });
})();
