function bindElastic(btn) {
  if (!btn || btn.dataset.elastic === "1") return;
  btn.dataset.elastic = "1";
  const glare = btn.querySelector(".glare") || Object.assign(document.createElement("div"), { className: "glare" });
  if (!glare.parentNode) btn.prepend(glare);

  let hovering = false;
  let mouseX = 0;
  let mouseY = 0;
  const reduce = () => document.body.classList.contains("reduce-motion") || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  btn.addEventListener("pointerenter", () => {
    hovering = true;
    glare.style.opacity = "0.7";
  });
  btn.addEventListener("pointerleave", () => {
    hovering = false;
    btn.style.transform = "scale(1)";
    glare.style.opacity = "0";
  });
  btn.addEventListener("pointermove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    const rect = btn.getBoundingClientRect();
    glare.style.left = `${e.clientX - rect.left}px`;
    glare.style.top = `${e.clientY - rect.top}px`;
  });

  function tick() {
    if (hovering && !reduce()) {
      const rect = btn.getBoundingClientRect();
      const dx = mouseX - (rect.left + rect.width / 2);
      const dy = mouseY - (rect.top + rect.height / 2);
      const distance = Math.hypot(dx, dy) || 1;
      const intensity = Math.min(distance / 300, 1) * 0.22;
      btn.style.transform = `translate(${dx * 0.08}px, ${dy * 0.08}px) scaleX(${1 + Math.abs(dx / distance) * intensity}) scaleY(${1 + Math.abs(dy / distance) * intensity})`;
    }
    requestAnimationFrame(tick);
  }
  tick();
}

window.bindElastic = bindElastic;
document.querySelectorAll(".btn").forEach(bindElastic);
