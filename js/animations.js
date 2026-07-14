// ─── ANIMATIONS (anime.js v4) ───────────────────────────────────────────────
// Hiệu ứng chuyển động mềm cho landing page + modal.
// An toàn: nếu CDN anime.js không tải được, hoặc người dùng bật
// prefers-reduced-motion, mọi hàm ở đây tự chuyển về hành vi tĩnh
// (nội dung hiện đủ, modal bật/tắt tức thì). Không đụng vùng export Mode 4.

const ANIM_ENABLED = (function () {
  if (typeof anime === "undefined") return false;
  try {
    return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (e) {
    return true;
  }
})();

// Spring dịu: damping cao so với stiffness → lún nhẹ đúng 1 nhịp (~630ms), không nảy lố.
const MODAL_SPRING = ANIM_ENABLED
  ? anime.spring({ mass: 1, stiffness: 110, damping: 16, velocity: 0 })
  : null;

// ─── MODAL: SPRING POP-IN / FADE-OUT ─────────────────────────────────────────
function animOpenModal(modal) {
  if (!modal) return;
  if (modal._closeAnim) {
    modal._closeAnim.cancel();
    modal._closeAnim = null;
    delete modal.dataset.closing;
  }
  modal.classList.remove("hidden");
  if (!ANIM_ENABLED) return;
  const card = modal.firstElementChild;
  anime.animate(modal, { opacity: [0, 1], duration: 240, ease: "out(2)" });
  if (card) anime.animate(card, { scale: [0.94, 1], y: [14, 0], ease: MODAL_SPRING });
}

function animCloseModal(modal) {
  if (!modal || modal.classList.contains("hidden")) return;
  if (!ANIM_ENABLED) {
    modal.classList.add("hidden");
    return;
  }
  if (modal.dataset.closing) return;
  modal.dataset.closing = "1";
  const card = modal.firstElementChild;
  if (card) anime.animate(card, { scale: 0.96, y: 6, duration: 180, ease: "out(2)" });
  modal._closeAnim = anime.animate(modal, {
    opacity: 0,
    duration: 190,
    ease: "out(2)",
    onComplete: function () {
      modal.classList.add("hidden");
      delete modal.dataset.closing;
      modal._closeAnim = null;
      // Trả trạng thái sạch cho lần mở sau.
      anime.utils.set(modal, { opacity: 1 });
      if (card) anime.utils.set(card, { scale: 1, y: 0 });
    },
  });
}

// ─── LANDING: STAGGER ENTRANCE + SVG DRAW-IN ─────────────────────────────────
function playModesEntrance(heads, cards, shapes) {
  const tl = anime.createTimeline({
    defaults: { ease: "out(3)" },
    onComplete: function () {
      // Xóa inline style để trả quyền cho stylesheet
      // (giữ hiệu ứng :hover translateY của .lp-mode-card).
      heads.forEach(function (el) {
        el.style.removeProperty("opacity");
        el.style.removeProperty("transform");
      });
      cards.forEach(function (el) {
        el.style.removeProperty("opacity");
        el.style.removeProperty("transform");
      });
    },
  });
  tl.add(heads, { opacity: [0, 1], y: [16, 0], duration: 700, delay: anime.stagger(130) });
  tl.add(cards, { opacity: [0, 1], y: [26, 0], duration: 900, delay: anime.stagger(160) }, "-=450");
  if (shapes.length) {
    tl.add(
      shapes,
      { draw: ["0 0", "0 1"], duration: 1100, delay: anime.stagger(80), ease: "inOut(2)" },
      "-=1000"
    );
  }
}

function initLandingEntrance() {
  if (!ANIM_ENABLED || typeof IntersectionObserver === "undefined") return;
  const picker = document.getElementById("modePicker");
  if (!picker) return;
  const heads = picker.querySelectorAll(".lp-modes-title, .lp-modes-sub");
  const cards = picker.querySelectorAll(".lp-mode-card");
  if (!cards.length) return;

  let shapes = [];
  try {
    shapes = anime.svg.createDrawable(
      "#modePicker .lp-mode-ico svg line, #modePicker .lp-mode-ico svg path, " +
        "#modePicker .lp-mode-ico svg polyline, #modePicker .lp-mode-ico svg rect, " +
        "#modePicker .lp-mode-ico svg circle"
    );
  } catch (e) {
    shapes = []; // draw-in chỉ là tô điểm — thiếu cũng không sao
  }

  // Chỉ ẩn bằng JS (không ẩn trong CSS) — lỡ script lỗi thì trang vẫn hiện đủ.
  anime.utils.set(heads, { opacity: 0 });
  anime.utils.set(cards, { opacity: 0 });
  if (shapes.length) anime.utils.set(shapes, { draw: "0 0" });

  const io = new IntersectionObserver(
    function (entries) {
      if (!entries.some(function (en) { return en.isIntersecting; })) return;
      io.disconnect(); // chạy đúng 1 lần
      playModesEntrance(heads, cards, shapes);
    },
    { threshold: 0.2 }
  );
  io.observe(picker);
}

initLandingEntrance();
