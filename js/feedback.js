// ─── WIDGET GÓP Ý ────────────────────────────────────────────────────────────
// Port vanilla JS từ component feedback kiểu Vercel (bản gốc là React/shadcn,
// không chạy được trên app static thuần). Nút nổi "💬 Góp ý" ở góc phải dưới,
// mở popover: ô nhập + 4 emoji cảm xúc + nút gửi.
// Gửi về đâu (cấu hình trong js/config.js):
//   - FEEDBACK_ENDPOINT có URL → POST JSON tới Google Apps Script (vào Sheet).
//   - FEEDBACK_ENDPOINT rỗng   → mở Gmail soạn sẵn tới FEEDBACK_EMAIL.

const FB_MOODS = ["😍 Rất thích", "🙂 Ổn", "😕 Chưa ổn", "😠 Không thích"];
let fbMood = null;
let fbSending = false;

function fbTogglePanel(force) {
  const panel = document.getElementById("fbPanel");
  if (!panel) return;
  const shown = !panel.classList.contains("hidden");
  const show = force !== undefined ? force : !shown;
  if (show === shown) return;
  panel.classList.toggle("hidden", !show);
  if (show) {
    if (typeof ANIM_ENABLED !== "undefined" && ANIM_ENABLED) {
      anime.animate(panel, { opacity: [0, 1], y: [10, 0], duration: 220, ease: "out(2)" });
    }
    setTimeout(() => {
      const t = document.getElementById("fbText");
      if (t) t.focus();
    }, 50);
  }
}

function fbSelectMood(i) {
  fbMood = fbMood === i ? null : i;
  document.querySelectorAll("#fbPanel .fb-emoji").forEach((b, idx) => {
    b.classList.toggle("fb-emoji-on", idx === fbMood);
  });
}

function fbReset() {
  const t = document.getElementById("fbText");
  if (t) t.value = "";
  fbSelectMood(null);
}

function fbBuildBody(msg) {
  return [
    "Góp ý cho TA Report Helper",
    "──────────────────────────",
    "Cảm nhận: " + (fbMood === null ? "(không chọn)" : FB_MOODS[fbMood]),
    "Nội dung: " + (msg || "(trống)"),
    "",
    "Mode đang dùng: " + (typeof currentMode !== "undefined" && currentMode ? "Mode " + currentMode : "trang chủ"),
    "Thời gian: " + new Date().toLocaleString("vi-VN"),
    "Trình duyệt: " + navigator.userAgent,
  ].join("\n");
}

function fbSend() {
  if (fbSending) return;
  const msg = (document.getElementById("fbText").value || "").trim();
  if (!msg && fbMood === null) {
    showToast("Bạn chọn cảm xúc hoặc nhập góp ý trước ạ.", "warn");
    return;
  }
  if (typeof FEEDBACK_ENDPOINT === "string" && FEEDBACK_ENDPOINT) {
    fbSending = true;
    fetch(FEEDBACK_ENDPOINT, {
      method: "POST",
      mode: "no-cors", // Apps Script không trả CORS header — response opaque là đủ
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        mood: fbMood === null ? "" : FB_MOODS[fbMood],
        message: msg,
        mode: typeof currentMode !== "undefined" ? currentMode : "",
        ua: navigator.userAgent,
        time: new Date().toISOString(),
      }),
    })
      .then(() => {
        showToast("Cảm ơn góp ý của bạn!", "ok");
        fbReset();
        fbTogglePanel(false);
      })
      .catch(() => fbGmail(msg)) // endpoint lỗi → fallback Gmail, góp ý không bị mất
      .finally(() => (fbSending = false));
  } else {
    fbGmail(msg);
  }
}

function fbGmail(msg) {
  const su = encodeURIComponent("[TA Report Helper] Góp ý từ người dùng");
  const body = encodeURIComponent(fbBuildBody(msg));
  const url =
    "https://mail.google.com/mail/?view=cm&fs=1&to=" + encodeURIComponent(FEEDBACK_EMAIL) + "&su=" + su + "&body=" + body;
  const w = window.open(url, "_blank");
  if (w) {
    showToast("Đã mở Gmail — bạn bấm Gửi trong tab mới để hoàn tất ạ.", "ok");
    fbReset();
    fbTogglePanel(false);
  } else {
    // Popup bị chặn → dùng trình mail mặc định của máy
    window.location.href = "mailto:" + FEEDBACK_EMAIL + "?subject=" + su + "&body=" + body;
  }
}

// Đóng popover khi click ra ngoài hoặc nhấn Esc (giống useClickOutside bản gốc)
document.addEventListener("mousedown", (e) => {
  const w = document.getElementById("fbWidget");
  if (w && !w.contains(e.target)) fbTogglePanel(false);
});
document.addEventListener("touchstart", (e) => {
  const w = document.getElementById("fbWidget");
  if (w && !w.contains(e.target)) fbTogglePanel(false);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") fbTogglePanel(false);
});
