// ─── TIER ───────────────────────────────────────────────────────────────────
function getTier(pct) {
  if (pct >= 90) return { label: "Xuất sắc", color: "bg-emerald-100 text-emerald-700", key: "EXCELLENT" };
  if (pct >= 80) return { label: "Tốt", color: "bg-blue-100 text-blue-700", key: "GOOD" };
  if (pct >= 65) return { label: "Khá", color: "bg-yellow-100 text-yellow-700", key: "AVERAGE" };
  return { label: "Cần cố gắng", color: "bg-red-100 text-red-700", key: "WEAK" };
}

function skillPhrase(skillId, tierKey) {
  return SKILL_TIER_PHRASES[skillId]?.[tierKey] || "";
}

// ─── COPY ───────────────────────────────────────────────────────────────────
function copyText(preId, btnId) {
  const text = document.getElementById(preId).textContent;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById(btnId);
    const orig = btn.textContent;
    btn.textContent = "Đã sao chép ✓";
    setTimeout(() => {
      btn.textContent = orig;
    }, 2000);
  });
}

// ─── TOAST ──────────────────────────────────────────────────────────────────
function showToast(msg, type) {
  const colors = { error: "bg-red-600", warn: "bg-amber-500", ok: "bg-emerald-600", info: "bg-slate-700" };
  const el = document.createElement("div");
  el.className = `toast text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-lg max-w-sm text-center ${colors[type] || colors.info}`;
  el.textContent = msg;
  document.getElementById("toastContainer").appendChild(el);
  setTimeout(() => el.remove(), 4000);
}

// ─── REDACTION ──────────────────────────────────────────────────────────────
function redactForAPI(text, studentFullName, studentNickname) {
  if (!studentNickname || studentNickname.trim() === "") {
    throw new Error("Cần có Tên thay thế khác biệt với tên thật trước khi dùng AI");
  }
  const lowerFull = studentFullName.toLowerCase();
  const lowerNick = studentNickname.toLowerCase();
  const lastName = lowerFull.split(" ").pop();
  if (lowerFull.includes(lowerNick) || lowerNick.includes(lastName)) {
    throw new Error("Tên thay thế quá giống tên thật. Hãy chọn nickname khác (vd: Kelvin, Apple, Tom).");
  }

  let redacted = text;
  const escapedName = studentFullName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  redacted = redacted.replace(new RegExp(escapedName, "gi"), studentNickname);
  redacted = redacted.replace(/(0|\+84)[1-9]\d{8,9}/g, "[đã ẩn]");
  redacted = redacted.replace(/\b\d{9}(\d{3})?\b/g, "[đã ẩn]");
  return redacted;
}

function unredactFromAPI(text, studentFullName, studentNickname) {
  const escapedNick = studentNickname.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.replace(new RegExp(escapedNick, "g"), studentFullName);
}

function parseDateForSort(dateStr) {
  if (!dateStr) return 0;
  const parts = dateStr.split("/");
  const day = parseInt(parts[0], 10) || 0;
  const month = parseInt(parts[1], 10) || 0;
  const year = parts[2] ? parseInt(parts[2], 10) : new Date().getFullYear();
  return new Date(year, month - 1, day).getTime();
}

// ─── BOLD RENDERER ──────────────────────────────────────────────────────────
function renderBold(text) {
  const escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}