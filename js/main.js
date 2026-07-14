// ─── STATE ──────────────────────────────────────────────────────────────────
let currentMode = 0;
let originalParentText = ""; // stores pre-AI version

// ─── MODE SWITCHING ──────────────────────────────────────────────────────────
function setMode(m) {
  currentMode = m;
  document.getElementById("form1").classList.toggle("hidden", m !== 1);
  document.getElementById("form2").classList.toggle("hidden", m !== 2);
  document.getElementById("form3").classList.toggle("hidden", m !== 3);
  document.getElementById("mode4Container").classList.toggle("hidden", m !== 4);
  document.getElementById("studentInfoSection").classList.toggle("hidden", m === 4);
  document.getElementById("reportPreview").classList.add("hidden");
  document.getElementById("actionBar").classList.toggle("hidden", m === 3 || m === 4);
  document.getElementById("outputPanel").classList.add("hidden");
  document.getElementById("aiBanner").classList.add("hidden");

  // Vào Mode 4: nếu có phiên làm việc đã lưu mà chưa import gì → mời khôi phục
  if (m === 4 && typeof m4MaybeShowRestoreBanner === "function") m4MaybeShowRestoreBanner();

  const b1 = document.getElementById("btnMode1");
  const b2 = document.getElementById("btnMode2");
  const b3 = document.getElementById("btnMode3");
  const b4 = document.getElementById("btnMode4");
  [b1, b2, b3, b4].forEach((b) => b && b.classList.remove("active"));
  if (m === 1) b1.classList.add("active");
  else if (m === 2) b2.classList.add("active");
  else if (m === 3) b3.classList.add("active");
  else if (m === 4) b4 && b4.classList.add("active");
}

// ─── CLOSING LINE ────────────────────────────────────────────────────────────
function closingLine() {
  const ts = document.getElementById("timeSlot").value.trim() || "[KHUNG GIỜ]";
  const dt = document.getElementById("callDate").value.trim() || "[NGÀY]";
  return `Dạ vâng ạ. Nếu phụ huynh còn bất kỳ thắc mắc nào hoặc muốn trao đổi thêm về tình hình học tập của bé, phụ huynh vui lòng nhắn xác nhận giúp em. Em sẽ chủ động sắp xếp gọi lại trong khung giờ ${ts} ngày ${dt} để trao đổi cụ thể và đầy đủ hơn với mình ạ. Em cảm ơn phụ huynh rất nhiều.`;
}

// ─── GENERATE ENTRY ──────────────────────────────────────────────────────────
function generate() {
  if (!currentMode) {
    showToast("Vui lòng chọn loại báo cáo trước ạ.", "warn");
    return;
  }
  const result = currentMode === 1 ? generateExam() : generateMonthly();
  originalParentText = result.parent;
  document.getElementById("outputParent").textContent = result.parent;
  document.getElementById("outputLog").textContent = result.log;
  document.getElementById("outputPanel").classList.remove("hidden");
  document.getElementById("revertBtn").classList.add("hidden");
  document.getElementById("aiBanner").classList.add("hidden");
  switchTab("A");
  document.getElementById("outputPanel").scrollIntoView({ behavior: "smooth", block: "start" });

  const ts = document.getElementById("timeSlot").value.trim();
  const dt = document.getElementById("callDate").value.trim();
  if (ts) localStorage.setItem("ta_timeSlot", ts);
  if (dt) localStorage.setItem("ta_callDate", dt);
}

// ─── TABS ────────────────────────────────────────────────────────────────────
function switchTab(tab) {
  const isA = tab === "A";
  document.getElementById("panelA").classList.toggle("hidden", !isA);
  document.getElementById("panelB").classList.toggle("hidden", isA);
  document.getElementById("tabA").className = isA
    ? "flex-1 py-3 text-sm font-semibold text-indigo-600 border-b-2 border-indigo-500"
    : "flex-1 py-3 text-sm font-semibold text-slate-400 border-b-2 border-transparent";
  document.getElementById("tabB").className = !isA
    ? "flex-1 py-3 text-sm font-semibold text-indigo-600 border-b-2 border-indigo-500"
    : "flex-1 py-3 text-sm font-semibold text-slate-400 border-b-2 border-transparent";
}

// ─── SETTINGS PANEL ──────────────────────────────────────────────────────────
function toggleSettings() {
  const panel = document.getElementById("settingsPanel");
  const isHidden = panel.classList.contains("hidden");
  panel.classList.toggle("hidden", !isHidden);
  if (isHidden) {
    const saved = localStorage.getItem("gemini_api_key") || "";
    document.getElementById("apiKeyInput").value = saved;
    const savedModel = localStorage.getItem("gemini_model") || "gemini-2.5-flash";
    document.getElementById("modelSelect").value = savedModel;
    updateKeyStatus();
  }
}

function saveApiKey() {
  const key = document.getElementById("apiKeyInput").value.trim();
  const model = document.getElementById("modelSelect").value;
  localStorage.setItem("gemini_model", model);
  if (key) {
    localStorage.setItem("gemini_api_key", key);
    showToast("Đã lưu cài đặt ạ.", "ok");
  } else {
    localStorage.removeItem("gemini_api_key");
    showToast("Đã xóa API key.", "info");
  }
  updateKeyStatus();
}

function updateKeyStatus() {
  const el = document.getElementById("keyStatus");
  if (localStorage.getItem("gemini_api_key")) {
    el.textContent = "✓ Đã kết nối";
    el.className = "text-xs text-center font-medium text-indigo-500";
  } else {
    el.textContent = "⚠ Chưa có key";
    el.className = "text-xs text-center font-medium text-amber-600";
  }
}

// close settings when clicking backdrop
document.getElementById("settingsPanel").addEventListener("click", function (e) {
  if (e.target === this) toggleSettings();
});

// ─── DISCLAIMER MODAL ────────────────────────────────────────────────────────
let _aiPendingCallback = null;

function showDisclaimer(onAccept) {
  _aiPendingCallback = onAccept;
  document.getElementById("disclaimerCheck").checked = false;
  document.getElementById("disclaimerModal").classList.remove("hidden");
}

function acceptDisclaimer() {
  if (!document.getElementById("disclaimerCheck").checked) {
    showToast("Vui lòng tích vào ô xác nhận trước ạ.", "warn");
    return;
  }
  localStorage.setItem("ai_disclaimer_accepted", "true");
  localStorage.setItem("ai_disclaimer_ts", Date.now().toString());
  document.getElementById("disclaimerModal").classList.add("hidden");
  if (_aiPendingCallback) {
    _aiPendingCallback();
    _aiPendingCallback = null;
  }
}

function closeDisclaimer() {
  document.getElementById("disclaimerModal").classList.add("hidden");
  _aiPendingCallback = null;
}

// ─── INIT ────────────────────────────────────────────────────────────────────
buildSkillRows();
buildCategoryGroups();
// Mode 3: start with 3 empty rows
addScoreRow();
addScoreRow();
addScoreRow();

const savedTs = localStorage.getItem("ta_timeSlot");
const savedDt = localStorage.getItem("ta_callDate");
if (savedTs) document.getElementById("timeSlot").value = savedTs;
if (savedDt) document.getElementById("callDate").value = savedDt;

// ─── WELCOME MODAL ───────────────────────────────────────────────────────────
function closeWelcomeModal() {
  const dontShow = document.getElementById("dontShowWelcome").checked;
  if (dontShow) {
    localStorage.setItem("welcome_dismissed", "1");
  }
  animCloseModal(document.getElementById("welcomeModal"));
}

// Show welcome modal the first time the user enters the app (not on the landing page)
function maybeShowWelcome() {
  if (!localStorage.getItem("welcome_dismissed")) {
    animOpenModal(document.getElementById("welcomeModal"));
  }
}

// ─── LANDING ↔ APP NAVIGATION ────────────────────────────────────────────────
function scrollToModes() {
  const el = document.getElementById("modePicker");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function openApp(mode) {
  document.getElementById("landingView").style.display = "none";
  document.getElementById("appShell").style.display = "flex";
  setMode(mode);
  const ma = document.getElementById("mainArea");
  if (ma) ma.scrollTop = 0;
  maybeShowWelcome();
}

function goHome() {
  document.getElementById("appShell").style.display = "none";
  const lv = document.getElementById("landingView");
  lv.style.display = "block";
  lv.scrollTop = 0;
}

// ─── SPARKLES (vanilla port of MagicUI SparklesText) ─────────────────────────
function initSparkles(wrap, count, colors) {
  const STAR =
    "M9.82531 0.843845C10.0553 0.215178 10.9446 0.215178 11.1746 0.843845L11.8618 2.72026C12.4006 4.19229 12.3916 6.39157 13.5 7.5C14.6084 8.60843 16.8077 8.59935 18.2797 9.13822L20.1561 9.82534C20.7858 10.0553 20.7858 10.9447 20.1561 11.1747L18.2797 11.8618C16.8077 12.4007 14.6084 12.3916 13.5 13.5C12.3916 14.6084 12.4006 16.8077 11.8618 18.2798L11.1746 20.1562C10.9446 20.7858 10.0553 20.7858 9.82531 20.1562L9.13819 18.2798C8.59932 16.8077 8.60843 14.6084 7.5 13.5C6.39157 12.3916 4.19225 12.4007 2.72023 11.8618L0.843814 11.1747C0.215148 10.9447 0.215148 10.0553 0.843814 9.82534L2.72023 9.13822C4.19225 8.59935 6.39157 8.60843 7.5 7.5C8.60843 6.39157 8.59932 4.19229 9.13819 2.72026L9.82531 0.843845Z";
  const NS = "http://www.w3.org/2000/svg";
  function spec() {
    return {
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 2,
      scale: Math.random() * 0.9 + 0.35,
      life: Math.random() * 10 + 5,
    };
  }
  function paint(el, s) {
    el.style.left = s.x + "%";
    el.style.top = s.y + "%";
    el.style.setProperty("--s", s.scale);
    el.style.animationDelay = s.delay + "s";
    el.firstChild.setAttribute("fill", s.color);
  }
  const stars = [];
  for (let i = 0; i < count; i++) {
    const s = spec();
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("class", "sparkle");
    svg.setAttribute("width", "18");
    svg.setAttribute("height", "18");
    svg.setAttribute("viewBox", "0 0 21 21");
    const p = document.createElementNS(NS, "path");
    p.setAttribute("d", STAR);
    svg.appendChild(p);
    paint(svg, s);
    wrap.appendChild(svg);
    s.el = svg;
    stars.push(s);
  }
  setInterval(() => {
    stars.forEach((s) => {
      s.life -= 0.1;
      if (s.life <= 0) {
        Object.assign(s, spec(), { el: s.el });
        paint(s.el, s);
      }
    });
  }, 100);
}

// ─── AI GUIDE TOGGLE ─────────────────────────────────────────────────────────
function toggleAiGuide() {
  const content = document.getElementById("aiGuideContent");
  const chevron = document.getElementById("aiGuideChevron");
  const isHidden = content.classList.contains("hidden");
  content.classList.toggle("hidden", !isHidden);
  chevron.style.transform = isHidden ? "rotate(180deg)" : "rotate(0deg)";
}

// ─── SIDEBAR COLLAPSE ────────────────────────────────────────────────────────
document.getElementById("collapseBtn").addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle("collapsed");
});

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("m4AddModal").addEventListener("click", function (e) {
    if (e.target === this) m4CloseAddModal();
  });
  const spark = document.getElementById("sparkTitle");
  if (spark) initSparkles(spark, 15, ["#0075de", "#62aef0", "#f5b301", "#ffce3a"]);
  const heroDots = document.getElementById("heroDots");
  if (heroDots && typeof initDotField === "function") initDotField(heroDots);
  if (typeof m4FillScoreScript === "function") m4FillScoreScript();
});
