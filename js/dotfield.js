// ─── DOT FIELD ──────────────────────────────────────────────────────────────

function initDotField(container, opts) {
  if (!container) return;
  const o = Object.assign(
    {
      dotRadius: 2.2,
      dotSpacing: 14,
      cursorRadius: 500,
      bulgeStrength: 67,
      glowRadius: 170,
      sparkle: false,
      waveAmplitude: 0,
      gradientFrom: "rgba(0, 117, 222, 0.50)",
      gradientTo: "rgba(0, 117, 222, 0.24)",
      glowColor: "rgba(0, 117, 222, 0.22)",
    },
    opts || {}
  );

  const TWO_PI = Math.PI * 2;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  const canvas = document.createElement("canvas");
  canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;";
  const ctx = canvas.getContext("2d", { alpha: true });

  const glowId = "dot-field-glow-" + Math.random().toString(36).slice(2, 9);
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.style.cssText = "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;";
  const defs = document.createElementNS(svgNS, "defs");
  const grad = document.createElementNS(svgNS, "radialGradient");
  grad.setAttribute("id", glowId);
  const s0 = document.createElementNS(svgNS, "stop");
  s0.setAttribute("offset", "0%");
  s0.setAttribute("stop-color", o.glowColor);
  const s1 = document.createElementNS(svgNS, "stop");
  s1.setAttribute("offset", "100%");
  s1.setAttribute("stop-color", "transparent");
  grad.appendChild(s0);
  grad.appendChild(s1);
  defs.appendChild(grad);
  const glowEl = document.createElementNS(svgNS, "circle");
  glowEl.setAttribute("cx", "-9999");
  glowEl.setAttribute("cy", "-9999");
  glowEl.setAttribute("r", o.glowRadius);
  glowEl.setAttribute("fill", "url(#" + glowId + ")");
  glowEl.style.cssText = "opacity:0;will-change:opacity;";
  svg.appendChild(defs);
  svg.appendChild(glowEl);

  container.appendChild(canvas);
  container.appendChild(svg);

  let dots = [];
  const mouse = { x: -9999, y: -9999, prevX: -9999, prevY: -9999, speed: 0 };
  const size = { w: 0, h: 0 };
  let glowOpacity = 0;
  let engagement = 0;
  let raf = null;
  let frameCount = 0;
  let resizeTimer = null;

  function buildDots(w, h) {
    const step = o.dotRadius + o.dotSpacing;
    const cols = Math.floor(w / step);
    const rows = Math.floor(h / step);
    const padX = (w % step) / 2;
    const padY = (h % step) / 2;
    const arr = new Array(rows * cols);
    let idx = 0;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const ax = padX + col * step + step / 2;
        const ay = padY + row * step + step / 2;
        arr[idx++] = { ax, ay, sx: ax, sy: ay };
      }
    }
    dots = arr;
  }

  function doResize() {
    const rect = container.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    if (w === 0 || h === 0) return;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    size.w = w;
    size.h = h;
    buildDots(w, h);
  }

  function resize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(doResize, 100);
  }

  function onMouseMove(e) {
    const rect = container.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  }

  function updateMouseSpeed() {
    const dx = mouse.prevX - mouse.x;
    const dy = mouse.prevY - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    mouse.speed += (dist - mouse.speed) * 0.5;
    if (mouse.speed < 0.001) mouse.speed = 0;
    mouse.prevX = mouse.x;
    mouse.prevY = mouse.y;
  }
  const speedInterval = setInterval(updateMouseSpeed, 20);

  function tick() {
    raf = requestAnimationFrame(tick);
    // Tạm dừng vẽ khi hero bị ẩn (đang ở trong app) — giữ vòng lặp nhẹ.
    if (canvas.offsetParent === null || size.w === 0) return;

    frameCount++;
    const w = size.w;
    const h = size.h;
    const len = dots.length;
    const t = frameCount * 0.02;

    const targetEngagement = Math.min(mouse.speed / 5, 1);
    engagement += (targetEngagement - engagement) * 0.06;
    if (engagement < 0.001) engagement = 0;
    const eng = engagement;

    glowOpacity += (eng - glowOpacity) * 0.08;
    glowEl.setAttribute("cx", mouse.x);
    glowEl.setAttribute("cy", mouse.y);
    glowEl.style.opacity = glowOpacity;

    ctx.clearRect(0, 0, w, h);
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, o.gradientFrom);
    g.addColorStop(1, o.gradientTo);
    ctx.fillStyle = g;

    const cr = o.cursorRadius;
    const crSq = cr * cr;
    const rad = o.dotRadius / 2;

    ctx.beginPath();
    for (let i = 0; i < len; i++) {
      const d = dots[i];
      const dx = mouse.x - d.ax;
      const dy = mouse.y - d.ay;
      const distSq = dx * dx + dy * dy;

      if (distSq < crSq && eng > 0.01) {
        const dist = Math.sqrt(distSq);
        const tt = 1 - dist / cr;
        const push = tt * tt * o.bulgeStrength * eng;
        const angle = Math.atan2(dy, dx);
        d.sx += (d.ax - Math.cos(angle) * push - d.sx) * 0.15;
        d.sy += (d.ay - Math.sin(angle) * push - d.sy) * 0.15;
      } else {
        d.sx += (d.ax - d.sx) * 0.1;
        d.sy += (d.ay - d.sy) * 0.1;
      }

      let drawX = d.sx;
      let drawY = d.sy;
      if (o.waveAmplitude > 0) {
        drawY += Math.sin(d.ax * 0.03 + t) * o.waveAmplitude;
        drawX += Math.cos(d.ay * 0.03 + t * 0.7) * o.waveAmplitude * 0.5;
      }

      if (o.sparkle) {
        const hash = ((i * 2654435761) ^ (frameCount >> 3)) >>> 0;
        const r = hash % 100 < 3 ? rad * 1.8 : rad;
        ctx.moveTo(drawX + r, drawY);
        ctx.arc(drawX, drawY, r, 0, TWO_PI);
      } else {
        ctx.moveTo(drawX + rad, drawY);
        ctx.arc(drawX, drawY, rad, 0, TWO_PI);
      }
    }
    ctx.fill();
  }

  doResize();
  window.addEventListener("resize", resize);
  window.addEventListener("mousemove", onMouseMove, { passive: true });
  raf = requestAnimationFrame(tick);

  return {
    destroy() {
      cancelAnimationFrame(raf);
      clearInterval(speedInterval);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      canvas.remove();
      svg.remove();
    },
  };
}
