(function () {
  const key = "liquidGlass";

  function preferred() {
    if (localStorage.getItem("reduceMotion") === "1") return "off";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "blur";
    return localStorage.getItem(key) || "on";
  }

  function apply() {
    const mode = preferred();
    document.documentElement.dataset.liquid = mode;
    document.querySelectorAll("liquid-glass").forEach((el) => {
      const wave = el.getAttribute("data-liquid") || "";
      if (mode === "off") {
        el.setAttribute("effect-mode", "off");
        el.removeAttribute("liquid");
        return;
      }
      if (mode === "blur") {
        el.setAttribute("effect-mode", "blur");
        el.removeAttribute("liquid");
        return;
      }
      el.removeAttribute("effect-mode");
      if (wave) el.setAttribute("liquid", wave);
      else el.removeAttribute("liquid");
    });
  }

  window.NuperousGlass = {
    key,
    get: () => localStorage.getItem(key) || "on",
    set(value) {
      localStorage.setItem(key, value);
      apply();
    },
    apply
  };

  function boot() {
    if (window.customElements.get("liquid-glass")) apply();
    else window.customElements.whenDefined("liquid-glass").then(apply);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
