// ─── MODE 3: HELPERS ─────────────────────────────────────────────────────────

// Validates both inputs in a row and updates red borders + error message.
// Returns true if all non-empty values are valid.
function validateRowInputs(row) {
  const inputs = row.querySelectorAll("input");
  const errEl = row.querySelector(".error-msg");
  const dateVal = inputs[0].value.trim();
  const scoreVal = inputs[1].value.trim();

  // Reset state
  inputs[0].classList.remove("border-red-400");
  inputs[0].classList.add("border-slate-200");
  inputs[1].classList.remove("border-red-400");
  inputs[1].classList.add("border-slate-200");
  errEl.textContent = "";
  errEl.classList.add("hidden");

  let ok = true;

  if (scoreVal !== "") {
    const n = parseFloat(scoreVal);
    if (isNaN(n) || n < 0 || n > 10) {
      inputs[1].classList.add("border-red-400");
      inputs[1].classList.remove("border-slate-200");
      errEl.textContent = "Điểm phải từ 0 đến 10";
      errEl.classList.remove("hidden");
      ok = false;
    }
  }

  if (dateVal !== "") {
    if (!DATE_RE.test(dateVal)) {
      inputs[0].classList.add("border-red-400");
      inputs[0].classList.remove("border-slate-200");
      errEl.textContent = "Định dạng ngày sai (vd: 22/02)"; // date error takes priority in display
      errEl.classList.remove("hidden");
      ok = false;
    }
  }

  return ok;
}

function validateAllRows() {
  const rows = document.querySelectorAll("#scoreRows > div");
  let firstInvalidRow = null;
  let hasError = false;
  rows.forEach((row) => {
    if (!validateRowInputs(row)) {
      hasError = true;
      if (!firstInvalidRow) firstInvalidRow = row;
    }
  });
  if (firstInvalidRow) firstInvalidRow.scrollIntoView({ behavior: "smooth", block: "center" });
  return !hasError;
}

// ─── MODE 3: SCORE ROWS ──────────────────────────────────────────────────────
let scoreRowCount = 0;

function addScoreRow(dateVal, scoreVal) {
  const currentCount = document.querySelectorAll("#scoreRows > div").length;
  if (currentCount >= 20) {
    showToast("Tối đa 20 dòng điểm ạ. Xóa bớt dòng cũ trước khi thêm.", "warn");
    return;
  }
  const container = document.getElementById("scoreRows");
  const id = ++scoreRowCount;
  const row = document.createElement("div");
  row.id = `scoreRow_${id}`;
  row.className = "space-y-0.5";
  row.innerHTML = `
    <div class="flex items-center gap-2">
      <input type="text" placeholder="VD: 22/02" maxlength="12"
        class="w-24 border border-slate-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        value="${dateVal || ""}" />
      <input type="number" step="0.1" min="0" max="10" placeholder="Điểm"
        class="w-20 border border-slate-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        value="${scoreVal !== undefined && scoreVal !== null ? scoreVal : ""}" />
      <span class="text-slate-400 text-xs">/10</span>
      <button type="button" onclick="removeScoreRow(${id})"
        class="text-slate-300 hover:text-red-400 font-bold text-lg leading-none transition-colors" title="Xóa dòng"><svg class="ico"><use href="#i-x"/></svg></button>
    </div>
    <p class="error-msg hidden text-xs text-red-500 pl-1"></p>`;
  container.appendChild(row);

  // Attach real-time validation to both inputs
  const inputs = row.querySelectorAll("input");
  inputs[0].addEventListener("input", () => validateRowInputs(row));
  inputs[1].addEventListener("input", () => validateRowInputs(row));

  // Pre-validate if date was pre-filled (e.g. from calendar)
  if (dateVal) validateRowInputs(row);
}

function removeScoreRow(id) {
  const row = document.getElementById(`scoreRow_${id}`);
  if (row) row.remove();
}

function getScoreRows() {
  const rows = document.querySelectorAll("#scoreRows > div");
  const result = [];
  rows.forEach((row) => {
    const inputs = row.querySelectorAll("input");
    const date = inputs[0].value.trim();
    const score = parseFloat(inputs[1].value);
    if (date || !isNaN(score)) {
      result.push({ date, score: isNaN(score) ? null : score });
    }
  });
  return result;
}

// ─── MODE 3: GENERATE NHẬN XÉT ───────────────────────────────────────────────
function generateNhanXet(scores, completedRows, totalCount, allValidRows, customNote) {
  const count = scores.length;
  const avg = scores.reduce((a, b) => a + b, 0) / count;
  const max = Math.max(...scores);
  const maxCount = scores.filter((s) => s === max).length;

  let phongDo;
  if (avg >= 9.0 && Math.min(...scores) >= 8.5) {
    phongDo = "Rất tốt và ổn định, hầu hết các đầu điểm đều trên 9.0.";
  } else if (avg >= 8.5) {
    phongDo = "Khá ổn định, đa số các đầu điểm đều ở mức tốt.";
  } else if (avg >= 7.5) {
    phongDo = "Tương đối ổn, một số bài có thể cải thiện thêm.";
  } else if (avg >= 6.5) {
    phongDo = "Cần đầu tư thêm thời gian cho các bài tập về nhà.";
  } else {
    phongDo = "Cần chú ý nhiều hơn, kết quả bài tập về nhà chưa đạt yêu cầu.";
  }

  const completionLine =
    totalCount > count
      ? `• **Số lượng bài tập hoàn thành:** ${count} bài/${totalCount} bài.`
      : `• **Số lượng bài tập hoàn thành:** ${count} bài.`;

  const bullets = [
    completionLine,
    `• **Mức độ hoàn thành:** ${phongDo}`,
    `• **Điểm cao nhất:** ${max} (đạt ${maxCount} lần).`,
    `• **Điểm trung bình:** ${avg.toFixed(2)}`,
  ];

  // Lưu ý: composite of incomplete + low scores
  const incompleteRows = allValidRows
    .filter((r) => r.score === null)
    .sort((a, b) => parseDateForSort(a.date) - parseDateForSort(b.date));

  const lowScores = completedRows
    .filter((r) => r.score < 8)
    .sort((a, b) => parseDateForSort(a.date) - parseDateForSort(b.date));

  const luuYParts = [];

  if (incompleteRows.length > 0) {
    const dateWord = incompleteRows.length === 1 ? "Ngày" : "Các ngày";
    const dates = incompleteRows.map((r) => `**${r.date}**`).join(", ");
    luuYParts.push(`${dateWord} ${dates} con **chưa hoàn thành bài tập về nhà**.`);
  }

  if (lowScores.length === 1) {
    const r = lowScores[0];
    luuYParts.push(
      `Ngày **${r.date}** có điểm thấp nhất trong kỳ là **${r.score}**, phụ huynh có thể nhắc nhở con xem và làm lại kiến thức phần này để cải thiện điểm trung bình ạ.`,
    );
  } else if (lowScores.length > 1) {
    const dates = lowScores.map((r) => `**${r.date}**`).join(", ");
    luuYParts.push(
      `Các ngày ${dates} có điểm bài tập còn thấp, nhờ phụ huynh nhắc nhở con xem và làm lại để cải thiện điểm số cũng như nắm chắc kiến thức bài học hơn ạ.`,
    );
  }

  if (luuYParts.length > 0) {
    bullets.push(`• **Lưu ý:** ${luuYParts.join(" ")}`);
  }

  if (customNote && customNote.trim()) {
    bullets.push(`• **Ghi chú thêm:** ${customNote.trim()}`);
  }

  return bullets.join("\n");
}

// ─── MODE 3: RENDER REPORT CARD ──────────────────────────────────────────────
function renderReportCard(validRows, nhanXetText) {
  const fullName = document.getElementById("fullName").value.trim();
  const nickName = document.getElementById("nickName").value.trim();

  let studentLabel;
  if (fullName && nickName) studentLabel = `${fullName} (${nickName})`;
  else if (fullName) studentLabel = fullName;
  else studentLabel = "___________";
  document.getElementById("rcStudentName").innerHTML = `Học sinh: <strong>${studentLabel}</strong>`;

  const tbody = document.getElementById("rcTableBody");
  tbody.innerHTML = "";
  validRows.forEach((r) => {
    const tr = document.createElement("tr");
    let scoreCell;
    if (r.score === null) {
      scoreCell = `<td style="border:1px solid #000; padding:6px 12px; color:#dc2626; font-weight:600;">Chưa hoàn thành</td>`;
    } else if (r.score < 8) {
      scoreCell = `<td style="border:1px solid #000; padding:6px 12px; background-color:#fef08a; font-weight:600;">${r.score}</td>`;
    } else {
      scoreCell = `<td style="border:1px solid #000; padding:6px 12px;">${r.score}</td>`;
    }
    tr.innerHTML = `<td style="border:1px solid #000; padding:6px 12px;">${r.date || "—"}</td>${scoreCell}`;
    tbody.appendChild(tr);
  });

  document.getElementById("reportNhanXet").innerHTML = renderBold(nhanXetText);
}

// ─── MODE 3: UPDATE REPORT CARD (from textarea) ──────────────────────────────
function updateReportCard() {
  document.getElementById("reportNhanXet").innerHTML = renderBold(document.getElementById("nhanXetEditor").value);
  showToast("Đã cập nhật bảng ạ.", "ok");
}

// ─── MODE 3: GENERATE ENTRY ──────────────────────────────────────────────────
function generate3() {
  if (!validateAllRows()) {
    showToast("Vui lòng kiểm tra các ô báo lỗi đỏ trước ạ.", "warn");
    return;
  }

  const allRows = getScoreRows();
  const validRows = allRows.filter((r) => r.date && r.date.trim());
  const completedRows = validRows.filter((r) => r.score !== null);

  if (validRows.length === 0) {
    showToast("Cần nhập ít nhất 1 dòng có ngày ạ.", "warn");
    return;
  }
  if (completedRows.length === 0) {
    showToast("Cần có ít nhất 1 bài có điểm để tạo nhận xét ạ.", "warn");
    return;
  }

  const scores = completedRows.map((r) => r.score);
  const customNote = document.getElementById("customNote3").value;
  const nhanXetText = generateNhanXet(scores, completedRows, validRows.length, validRows, customNote);

  document.getElementById("nhanXetEditor").value = nhanXetText;
  renderReportCard(validRows, nhanXetText);
  document.getElementById("reportPreview").classList.remove("hidden");
  document.getElementById("reportPreview").scrollIntoView({ behavior: "smooth", block: "start" });
}

// ─── MODE 3: PNG DOWNLOAD ────────────────────────────────────────────────────
async function downloadReportPNG() {
  const card = document.getElementById("reportCard");
  try {
    const canvas = await html2canvas(card, { scale: 2, backgroundColor: "#ffffff", useCORS: true });
    const link = document.createElement("a");
    const safeName = (document.getElementById("fullName").value.trim() || "BaoCao").replace(/\s+/g, "_");
    link.download = `BaoCaoBTVN_${safeName}_${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    showToast("Đang tải ảnh xuống...", "ok");
  } catch (err) {
    showToast("Không thể xuất ảnh. Thử lại ạ.", "error");
    console.error("html2canvas error:", err);
  }
}

// ─── MODE 3: CALENDAR PICKER ─────────────────────────────────────────────────
let calSelectedDates = new Set(); // 'YYYY-MM-DD' strings
let calYear = new Date().getFullYear();
let calMonth = new Date().getMonth(); // 0-indexed

function openCalendarPicker() {
  calYear = new Date().getFullYear();
  calMonth = new Date().getMonth();
  calSelectedDates.clear();
  renderCalendar();
  document.getElementById("calendarModal").classList.remove("hidden");
}

function closeCalendarPicker() {
  document.getElementById("calendarModal").classList.add("hidden");
}

function calNavMonth(delta) {
  calMonth += delta;
  if (calMonth > 11) {
    calMonth = 0;
    calYear++;
  }
  if (calMonth < 0) {
    calMonth = 11;
    calYear--;
  }
  renderCalendar();
}

function renderCalendar() {
  document.getElementById("calMonthLabel").textContent = `${VN_MONTHS[calMonth]} / ${calYear}`;

  const grid = document.getElementById("calGrid");
  grid.innerHTML = "";

  // Week-day header row
  VN_WEEKDAYS.forEach((d) => {
    const cell = document.createElement("div");
    cell.className = "text-xs font-semibold text-slate-500 py-1 text-center";
    cell.textContent = d;
    grid.appendChild(cell);
  });

  const firstDay = new Date(calYear, calMonth, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const today = new Date();

  // Empty leading cells
  for (let i = 0; i < firstDay; i++) grid.appendChild(document.createElement("div"));

  for (let d = 1; d <= daysInMonth; d++) {
    const mm = String(calMonth + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    const key = `${calYear}-${mm}-${dd}`;

    const isSelected = calSelectedDates.has(key);
    const isToday = today.getFullYear() === calYear && today.getMonth() === calMonth && today.getDate() === d;
    const isMaxed = calSelectedDates.size >= 20 && !isSelected;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = d;
    btn.dataset.key = key;

    if (isSelected) {
      btn.className =
        "w-8 h-8 mx-auto flex items-center justify-center rounded-full text-sm bg-indigo-600 text-white font-semibold";
    } else if (isMaxed) {
      btn.className =
        "w-8 h-8 mx-auto flex items-center justify-center rounded-full text-sm text-slate-300 cursor-not-allowed";
    } else if (isToday) {
      btn.className =
        "w-8 h-8 mx-auto flex items-center justify-center rounded-full text-sm ring-2 ring-indigo-400 text-slate-700 hover:bg-indigo-50 transition-colors";
    } else {
      btn.className =
        "w-8 h-8 mx-auto flex items-center justify-center rounded-full text-sm text-slate-700 hover:bg-slate-100 transition-colors";
    }

    btn.addEventListener("click", () => {
      if (isMaxed) {
        showToast("Đã đạt giới hạn 20 ngày ạ.", "warn");
        return;
      }
      toggleCalDate(key);
    });
    grid.appendChild(btn);
  }

  updateCalUI();
}

function toggleCalDate(key) {
  if (calSelectedDates.has(key)) calSelectedDates.delete(key);
  else {
    if (calSelectedDates.size >= 20) {
      showToast("Đã đạt giới hạn 20 ngày ạ.", "warn");
      return;
    }
    calSelectedDates.add(key);
  }
  renderCalendar();
}

function updateCalUI() {
  const count = calSelectedDates.size;
  document.getElementById("calCounter").textContent = `Đã chọn: ${count}/20 ngày`;
  const applyBtn = document.getElementById("calApplyBtn");
  applyBtn.textContent = `Áp dụng ${count} ngày`;
  applyBtn.disabled = count === 0;
  applyBtn.className =
    count === 0
      ? "flex-1 bg-indigo-300 text-white font-semibold py-2 rounded-lg text-sm cursor-not-allowed"
      : "flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg text-sm transition-colors";
}

function applyCalendarDates() {
  const count = calSelectedDates.size;
  if (count === 0) return;

  const currentRows = document.querySelectorAll("#scoreRows > div");
  const currentCount = currentRows.length;
  const hasData = Array.from(document.querySelectorAll("#scoreRows input")).some((i) => i.value.trim());

  const doApply = () => {
    document.getElementById("scoreRows").innerHTML = "";
    scoreRowCount = 0;
    // Sort ASC by date
    Array.from(calSelectedDates)
      .sort()
      .forEach((key) => {
        const [, mm, dd] = key.split("-");
        addScoreRow(`${dd}/${mm}`);
      });
    closeCalendarPicker();
    showToast(`Đã thêm ${count} ngày. Giờ điền điểm cho từng bài ạ.`, "ok");
  };

  if (hasData && currentCount > 0) {
    if (confirm(`Sẽ thay thế ${currentCount} dòng hiện tại bằng ${count} ngày đã chọn. Tiếp tục?`)) doApply();
  } else {
    doApply();
  }
}
