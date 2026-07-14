// ================================================
// MODE 4 - ILA SCORE REPORT
// ================================================

let m4IsSplitVGRW = false;
const m4Checked = new Set(["project1", "project2", "vgrw", "speaking", "listening", "homework", "total"]);
let m4Students = [];
let m4SelIdx = -1;
const m4Edits = {};

// ─── TỰ ĐỘNG LƯU PHIÊN LÀM VIỆC (localStorage) ───────────────────────────────
// Mọi thay đổi ở Mode 4 đều đi qua m4RenderCard → m4ScheduleSave (debounce)
// ghi toàn bộ trạng thái vào localStorage của trình duyệt. Đóng app / tắt máy
// mở lại vẫn còn; banner "Khôi phục" hiện khi vào Mode 4 mà có bản lưu.
const M4_SESSION_KEY = "ta_m4_session_v1";
let m4SaveTimer = null;
let m4Restoring = false;

function m4ScheduleSave() {
  if (m4Restoring) return;
  clearTimeout(m4SaveTimer);
  m4SaveTimer = setTimeout(m4SaveSession, 600);
}

function m4SaveSession() {
  if (!m4Students.length) return;
  try {
    const denoms = {};
    Object.keys(M4_FIELDS).forEach((k) => (denoms[k] = M4_FIELDS[k].denom));
    const gv = (id) => {
      const el = document.getElementById(id);
      return el ? el.value : "";
    };
    localStorage.setItem(
      M4_SESSION_KEY,
      JSON.stringify({
        v: 1,
        savedAt: Date.now(),
        students: m4Students,
        edits: m4Edits,
        selIdx: m4SelIdx,
        split: m4IsSplitVGRW,
        checked: Array.from(m4Checked),
        denoms,
        info: {
          cls: gv("m4Class"),
          start: gv("m4StartDate"),
          end: gv("m4EndDate"),
          teacher: gv("m4Teacher"),
          ta: gv("m4TA"),
          code: gv("m4ClassCode"),
        },
      })
    );
  } catch (e) {
    // localStorage bị chặn hoặc đầy — không chặn thao tác của người dùng
  }
}

function m4ReadSession() {
  try {
    const raw = localStorage.getItem(M4_SESSION_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw);
    if (!d || !Array.isArray(d.students) || !d.students.length) return null;
    return d;
  } catch (e) {
    return null;
  }
}

// Gọi khi vào Mode 4: có bản lưu + chưa import gì → hiện banner khôi phục.
function m4MaybeShowRestoreBanner() {
  const banner = document.getElementById("m4RestoreBanner");
  if (!banner) return;
  const d = m4ReadSession();
  const show = !!d && !m4Students.length;
  banner.classList.toggle("hidden", !show);
  if (show) {
    const when = new Date(d.savedAt).toLocaleString("vi-VN");
    const cls = d.info && d.info.cls ? " · lớp " + d.info.cls : "";
    document.getElementById("m4RestoreInfo").textContent =
      d.students.length + " học sinh" + cls + " · lưu lúc " + when;
  }
}

function m4DiscardSession() {
  try {
    localStorage.removeItem(M4_SESSION_KEY);
  } catch (e) {}
  const banner = document.getElementById("m4RestoreBanner");
  if (banner) banner.classList.add("hidden");
  showToast("Đã xóa bản lưu phiên làm việc.", "info");
}

function m4RestoreSession() {
  const d = m4ReadSession();
  if (!d) {
    m4MaybeShowRestoreBanner();
    return;
  }
  m4Restoring = true;
  try {
    m4Students = d.students;
    Object.keys(m4Edits).forEach((k) => delete m4Edits[k]);
    Object.keys(d.edits || {}).forEach((k) => (m4Edits[k] = d.edits[k]));
    m4IsSplitVGRW = !!d.split;
    const cb = document.getElementById("m4SplitVGRW");
    if (cb) cb.checked = m4IsSplitVGRW;
    m4Checked.clear();
    (d.checked || []).forEach((k) => m4Checked.add(k));
    Object.keys(d.denoms || {}).forEach((k) => {
      if (M4_FIELDS[k]) M4_FIELDS[k].denom = d.denoms[k];
    });
    const sv = (id, v) => {
      const el = document.getElementById(id);
      if (el && v != null) el.value = v;
    };
    if (d.info) {
      sv("m4Class", d.info.cls);
      sv("m4StartDate", d.info.start);
      sv("m4EndDate", d.info.end);
      sv("m4Teacher", d.info.teacher);
      sv("m4TA", d.info.ta);
      sv("m4ClassCode", d.info.code);
    }
    document.getElementById("m4StudentsSection").classList.remove("hidden");
    document.getElementById("m4WorkArea").classList.remove("hidden");
    m4RenderStudentCards();
    m4SelectStudent(Math.min(Math.max(d.selIdx || 0, 0), m4Students.length - 1));
    const banner = document.getElementById("m4RestoreBanner");
    if (banner) banner.classList.add("hidden");
    showToast("Đã khôi phục phiên làm việc (" + m4Students.length + " học sinh) ạ.", "ok");
  } finally {
    m4Restoring = false;
  }
}

function m4GetLogo() {
  const c = document.getElementById("m4ClassCode").value;
  return c === "S" ? LOGO_S : c === "I" ? LOGO_I : LOGO_J;
}

function m4SwitchTab(tab) {
  document.getElementById("m4PaneP").classList.toggle("hidden", tab !== "paste");
  document.getElementById("m4PaneF").classList.toggle("hidden", tab !== "file");
  const on = "px-4 py-2 text-sm font-semibold text-indigo-600 border-b-2 border-indigo-500";
  const off = "px-4 py-2 text-sm font-semibold text-slate-400 border-b-2 border-transparent";
  document.getElementById("m4TabPaste").className = tab === "paste" ? on : off;
  document.getElementById("m4TabFile").className = tab === "file" ? on : off;
}
function m4UpdateCharCount() {
  const n = document.getElementById("m4PasteArea").value.length;
  document.getElementById("m4CharCount").textContent = n.toLocaleString("vi") + " ký tự";
}
function m4ClearPaste() {
  document.getElementById("m4PasteArea").value = "";
  m4UpdateCharCount();
  m4HideError();
}
function m4HandleDrop(e) {
  e.preventDefault();
  document.getElementById("m4DropZone").classList.remove("border-indigo-500");
  m4ReadFile(e.dataTransfer.files[0]);
}
function m4HandleFileInput(e) {
  m4ReadFile(e.target.files[0]);
}
function m4ReadFile(f) {
  if (!f) return;
  const r = new FileReader();
  r.onload = (ev) => m4LoadData(ev.target.result);
  r.readAsText(f, "utf-8");
}
function m4ParsePaste() {
  m4LoadData(document.getElementById("m4PasteArea").value);
}
function m4ShowError(msg) {
  const el = document.getElementById("m4ImpError");
  el.textContent = msg;
  el.classList.remove("hidden");
}
function m4HideError() {
  document.getElementById("m4ImpError").classList.add("hidden");
}

// Đọc CSV xuất từ script lấy điểm:
//   <Tên>[,<Biệt danh>], Project01, Project02, VGRW, Speaking, Listening, Homework, Total
// 7 cột điểm cuối luôn cố định; số cột tên = tổng số cột - 7.
function m4CSVRows(text) {
  text = text.replace(/^\uFEFF/, ""); // bỏ BOM nếu có
  const rows = [];
  let row = [],
    field = "",
    inQ = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQ) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else inQ = false;
      } else field += ch;
    } else {
      if (ch === '"') inQ = true;
      else if (ch === ",") {
        row.push(field);
        field = "";
      } else if (ch === "\n") {
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      } else if (ch === "\r") {
        /* bỏ qua */
      } else field += ch;
    }
  }
  if (field !== "" || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function m4ParseStudents(text) {
  const rows = m4CSVRows(text).filter((r) => r.some((c) => c.trim() !== ""));
  if (!rows.length) return [];

  // Bỏ dòng tiêu đề nếu nhận diện được.
  let start = 0;
  const head = rows[0].join(" ").toLowerCase();
  if (/student name|nickname|biệt danh|project|course total|homework/.test(head)) start = 1;

  const num = (v) => {
    const n = parseFloat(String(v).replace(",", "."));
    return isNaN(n) ? 0 : n;
  };
  const out = [];
  for (let i = start; i < rows.length; i++) {
    const r = rows[i].map((c) => c.trim());
    if (r.length < 8) continue; // cần tối thiểu 1 cột tên + 7 cột điểm
    const nameCols = r.length - 7;
    const fullName = r[0] || "";
    const engName = nameCols >= 2 ? r[1] || "" : "";
    const [p1, p2, vgrw, speaking, listening, homework, total] = r.slice(nameCols).map(num);
    out.push({
      fullName,
      engName,
      p1,
      p2,
      vgrw,
      speaking,
      listening,
      homework,
      total,
      // Điểm tách V/G/R/W nhập tay — null = chưa nhập (ô hiện placeholder)
      vocab: null,
      grammar: null,
      reading: null,
      writing: null,
      passFailOverride: null,
    });
  }
  return out;
}

// Đọc các dòng "#META,key,value" (do lệnh console nối vào cuối CSV).
function m4ParseMeta(text) {
  const meta = {};
  m4CSVRows(text).forEach((r) => {
    if (r.length >= 3 && (r[0] || "").trim() === "#META") meta[(r[1] || "").trim()] = (r[2] || "").trim();
  });
  return meta;
}

// Đổi ngày M/D/Y -> D/M/Y. If không khớp -> giữ nguyên.
function m4USDateToVN(s) {
  s = (s || "").trim();
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (!m) return s;
  const pad = (x) => (x.length < 2 ? "0" + x : x);
  return pad(m[2]) + "/" + pad(m[1]) + "/" + m[3];
}

// Tự điền thông tin lớp vào các ô Mode 4 (chỉ điền khi có giá trị, không xoá ô đang có).
function m4ApplyMeta(meta) {
  if (!meta) return;
  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el && val) el.value = val;
  };
  set("m4Class", meta.classCode);
  set("m4Teacher", meta.teacher);
  set("m4TA", meta.ta);
  set("m4StartDate", m4USDateToVN(meta.startDate));
  set("m4EndDate", m4USDateToVN(meta.endDate));
}

function m4LoadData(text) {
  m4HideError();
  const students = m4ParseStudents(text);
  if (!students.length) {
    m4ShowError("Không tìm thấy dữ liệu học sinh. Kiểm tra định dạng file.");
    return;
  }
  m4Students = students;
  const cmax = Math.max(...students.map((s) => s.total));
  students.forEach((s) => (s.classMax = cmax));
  students.forEach((s, i) => {
    m4Edits[i] = {
      fullName: s.fullName,
      altName: s.engName,
      comment: m4SkillComment({
        listening: s.listening,
        speaking: s.speaking,
        vgrw: s.vgrw,
        total: s.total,
        split: false,
      }),
    };
  });
  const meta = m4ParseMeta(text);
  m4ApplyMeta(meta);
  m4RenderStudentCards();
  const banner = document.getElementById("m4RestoreBanner");
  if (banner) banner.classList.add("hidden");
  document.getElementById("m4StudentsSection").classList.remove("hidden");
  document.getElementById("m4WorkArea").classList.remove("hidden");
  m4SelectStudent(0);
  showToast("Đã import " + students.length + " học sinh" + (meta.classCode ? " · lớp " + meta.classCode : "") + " ạ.", "ok");
}

function m4DefaultComment(t) {
  if (t >= 80)
    return "**Quá trình học:** Con học tốt và nắm vững kiến thức của khóa học. Con tích cực tham gia phát biểu xây dựng bài và hoàn thành đầy đủ bài tập về nhà.\n**Nhận xét về bài kiểm tra cuối khoá:** Con thể hiện tốt ở các kỹ năng, kết quả bài kiểm tra phản ánh sự cố gắng của con trong suốt khóa học ạ.";
  if (t >= 65)
    return "**Quá trình học:** Con nắm được phần lớn kiến thức của khóa học và có tham gia xây dựng bài. Con cần duy trì việc làm bài tập về nhà đều đặn hơn.\n**Nhận xét về bài kiểm tra cuối khoá:** Con làm bài ở mức khá, một số kỹ năng con cần luyện tập thêm để cải thiện trong khóa tiếp theo ạ.";
  return "**Quá trình học:** Con cần tập trung hơn trong giờ học và chủ động hoàn thành bài tập về nhà đầy đủ hơn.\n**Nhận xét về bài kiểm tra cuối khoá:** Kết quả bài kiểm tra cho thấy con cần ôn tập lại kiến thức nền và luyện tập thêm các kỹ năng, phụ huynh hỗ trợ nhắc nhở con học đều hơn ạ.";
}

// Xếp mức 1 kỹ năng theo % điểm (riêng cho Mode 4): ≥85 XS · ≥70 Tốt · ≥50 TB · <50 CCT.
function m4SkillTier(pct) {
  if (pct >= 85) return "EXCELLENT";
  if (pct >= 70) return "GOOD";
  if (pct >= 50) return "AVERAGE";
  return "WEAK";
}

// Sinh nhận xét tự động theo điểm từng kỹ năng.
// o = { listening, speaking, vgrw, vocab, grammar, reading, writing, total, split }
// - split=false (mặc định khi import): GỘP — câu các kỹ năng nối liền 1 đoạn, V/G/R/W lấy theo % VGRW.
// - split=true + đã nhập đủ điểm riêng V/G/R/W: TÁCH — mỗi kỹ năng 1 dòng, lấy theo điểm riêng.
// - split=true nhưng CHƯA nhập đủ điểm riêng: vẫn GỘP theo % VGRW.
function m4SkillComment(o) {
  const F = M4_FIELDS;
  const tierOf = (score, denom) => m4SkillTier(denom > 0 ? (score / denom) * 100 : 0);
  const P = M4_SKILL_PHRASES;

  // Phần "Quá trình học" — theo TỔNG điểm (85 / 70).
  let process;
  if (o.total >= 85)
    process =
      "Con học tốt và nắm vững kiến thức của khóa học. Trong quá trình học, con luôn tích cực tham gia phát biểu xây dựng bài và hoàn thành tốt bài tập về nhà.";
  else if (o.total >= 70)
    process =
      "Con nắm được phần lớn kiến thức của khóa học và có tham gia xây dựng bài. Con cần duy trì việc làm bài tập về nhà đều đặn hơn.";
  else process = "Con cần tập trung hơn trong giờ học và chủ động hoàn thành bài tập về nhà đầy đủ hơn.";

  // Tên kỹ năng in đậm ở đầu mỗi câu để PH dễ nhận diện.
  const L = (en, txt) => "**Kĩ năng " + en + ":** " + txt;

  // Nghe / Nói luôn theo điểm riêng.
  const lis = L("Listening", P.listening[tierOf(o.listening, F.listening.denom)]);
  const spk = L("Speaking", P.speaking[tierOf(o.speaking, F.speaking.denom)]);

  // V/G/R/W: chỉ tách khi đã nhập đủ 4 điểm riêng; ngược lại lấy chung theo % VGRW.
  const hasIndiv = o.split && [o.vocab, o.grammar, o.reading, o.writing].every((v) => Number(v) > 0);
  let voc, gra, rea, wri;
  if (hasIndiv) {
    voc = L("Vocabulary", P.vocab[tierOf(o.vocab, F.vocab.denom)]);
    gra = L("Grammar", P.grammar[tierOf(o.grammar, F.grammar.denom)]);
    rea = L("Reading", P.reading[tierOf(o.reading, F.reading.denom)]);
    wri = L("Writing", P.writing[tierOf(o.writing, F.writing.denom)]);
  } else {
    const vt = tierOf(o.vgrw, F.vgrw.denom);
    voc = L("Vocabulary", P.vocab[vt]);
    gra = L("Grammar", P.grammar[vt]);
    rea = L("Reading", P.reading[vt]);
    wri = L("Writing", P.writing[vt]);
  }

  // TÁCH: mỗi kỹ năng 1 dòng có gạch đầu dòng. GỘP: nối liền thành 1 đoạn.
  const parts = [lis, spk, voc, gra, rea, wri];
  const skills = hasIndiv ? parts.map((t) => "- " + t).join("\n") : parts.join(" ");
  const sep = hasIndiv ? "\n" : " ";

  return "**Quá trình học:** " + process + "\n**Nhận xét về bài kiểm tra cuối khoá:**" + sep + skills;
}

// Tạo lại nhận xét của học sinh đang chọn theo điểm hiện tại (nút bấm thủ công).
function m4RegenComment() {
  if (m4SelIdx < 0) return;
  const F = M4_FIELDS;
  const comment = m4SkillComment({
    listening: F.listening.score,
    speaking: F.speaking.score,
    vgrw: F.vgrw.score,
    vocab: F.vocab.score,
    grammar: F.grammar.score,
    reading: F.reading.score,
    writing: F.writing.score,
    total: F.total.score,
    split: m4IsSplitVGRW,
  });
  m4Edits[m4SelIdx].comment = comment;
  document.getElementById("m4EditComment").value = comment;
  m4RenderCard();
  showToast("Đã tạo lại nhận xét theo điểm ạ.", "ok");
}

function m4GetStamp(s) {
  if (s.total === s.classMax) return STAMP_BEST;
  if (s.total >= 65) return STAMP_PASSED;
  if (s.total >= 60) return s.passFailOverride === "failed" ? STAMP_FAILED : STAMP_PASSED;
  return STAMP_FAILED;
}
function m4SetStampOverride(val) {
  if (m4SelIdx < 0) return;
  m4Students[m4SelIdx].passFailOverride = val;
  m4RenderCard();
}

function m4RenderStudentCards() {
  document.getElementById("m4StudentsGrid").innerHTML = m4Students
    .map((s, i) => {
      const t = s.total,
        e = m4Edits[i] || {};
      const col = t >= 80 ? "#16a34a" : t >= 65 ? "#f59e0b" : "#ef4444";
      return (
        '<div class="m4-s-card bg-white border-2 border-slate-200 rounded-xl p-3 text-center' +
        (i === m4SelIdx ? " selected" : "") +
        '" onclick="m4SelectStudent(' +
        i +
        ')">' +
        '<div class="font-semibold text-xs text-slate-700 truncate">' +
        (e.fullName || s.fullName) +
        "</div>" +
        '<div class="text-xs text-slate-400 truncate">' +
        (e.altName || s.engName) +
        "</div>" +
        '<div class="mt-1 font-bold text-base" style="color:' +
        col +
        '">' +
        t.toFixed(2) +
        "</div></div>"
      );
    })
    .join("");
}

function m4SelectStudent(idx) {
  m4SelIdx = idx;
  document.querySelectorAll(".m4-s-card").forEach((c, i) => c.classList.toggle("selected", i === idx));
  const s = m4Students[idx],
    e = m4Edits[idx];
  document.getElementById("m4EditName").value = e.fullName;
  document.getElementById("m4EditAltName").value = e.altName;
  document.getElementById("m4EditComment").value = e.comment;
  const inBand = s.total >= 60 && s.total < 65 && s.total !== s.classMax;
  document.getElementById("m4StampToggle").classList.toggle("hidden", !inBand);
  if (inBand) {
    const ov = s.passFailOverride || "passed";
    document.querySelectorAll('input[name="m4StampChoice"]').forEach((r) => {
      r.checked = r.value === ov;
    });
  }
  M4_FIELDS.project1.score = s.p1 ?? 0;
  M4_FIELDS.project2.score = s.p2 ?? 0;
  M4_FIELDS.vgrw.score = s.vgrw;
  M4_FIELDS.speaking.score = s.speaking;
  M4_FIELDS.listening.score = s.listening;
  M4_FIELDS.homework.score = s.homework;
  M4_FIELDS.total.score = s.total;
  M4_FIELDS.vocab.score = s.vocab ?? 0;
  M4_FIELDS.grammar.score = s.grammar ?? 0;
  M4_FIELDS.reading.score = s.reading ?? 0;
  M4_FIELDS.writing.score = s.writing ?? 0;
  if (s.p1 !== null) m4Checked.add("project1");
  else m4Checked.delete("project1");
  if (s.p2 !== null) m4Checked.add("project2");
  else m4Checked.delete("project2");
  m4RenderPanel();
  m4RenderCard();
}

function m4RenderPanel() {
  if (m4SelIdx < 0) return;
  const s = m4Students[m4SelIdx];
  const keys = m4IsSplitVGRW
    ? ["project1", "project2", "vocab", "grammar", "reading", "writing", "speaking", "listening", "homework", "total"]
    : ["project1", "project2", "vgrw", "speaking", "listening", "homework", "total"];
  const vis = keys.filter((k) => !(k === "project1" && s.p1 === null) && !(k === "project2" && s.p2 === null));
  const isSK = (k) => m4IsSplitVGRW && ["vocab", "grammar", "reading", "writing"].includes(k);
  document.getElementById("m4Panel").innerHTML = vis
    .map((k) => {
      const f = M4_FIELDS[k],
        ch = m4Checked.has(k),
        val = isSK(k) ? (s[k] == null ? "" : String(s[k])) : f.score.toFixed(2),
        ph = isSK(k) ? "Enter..." : "";
      return (
        '<div class="flex items-center gap-2 py-2 border-b border-slate-100 last:border-0">' +
        '<input type="checkbox"' +
        (ch ? " checked" : "") +
        " onchange=\"m4ToggleField('" +
        k +
        '\',this.checked)" class="accent-indigo-600 flex-shrink-0" />' +
        '<span class="flex-1 text-sm text-slate-700">' +
        f.label +
        (f.vi ? ' <span class="text-slate-400 text-xs">(' + f.vi + ")</span>" : "") +
        "</span>" +
        '<input type="text" value="' +
        val +
        '" placeholder="' +
        ph +
        '" oninput="m4UpdScore(\'' +
        k +
        '\',this.value)" class="w-20 border border-slate-200 rounded px-2 py-1 text-sm text-center" />' +
        '<span class="text-slate-400 text-xs">/</span>' +
        '<input type="text" value="' +
        f.denom +
        '" oninput="m4UpdDenom(\'' +
        k +
        '\',this.value)" class="w-14 border border-slate-200 rounded px-2 py-1 text-sm text-center" /></div>'
      );
    })
    .join("");
}

function m4ToggleSplitVGRW() {
  m4IsSplitVGRW = document.getElementById("m4SplitVGRW").checked;
  if (m4IsSplitVGRW) {
    m4Checked.delete("vgrw");
    ["vocab", "grammar", "reading", "writing"].forEach((k) => m4Checked.add(k));
  } else {
    m4Checked.add("vgrw");
    ["vocab", "grammar", "reading", "writing"].forEach((k) => m4Checked.delete(k));
  }
  m4RenderPanel();
  m4RenderCard();
}
function m4ToggleField(k, on) {
  on ? m4Checked.add(k) : m4Checked.delete(k);
  m4RenderPanel();
  m4RenderCard();
}
// Điểm nhập tay được ghi ngược vào học sinh đang chọn — nếu chỉ ghi vào
// M4_FIELDS (dùng chung) thì chuyển thẻ học sinh khác là mất (bug cũ).
function m4UpdScore(k, v) {
  const n = parseFloat(String(v).replace(",", "."));
  M4_FIELDS[k].score = isNaN(n) ? 0 : n;
  if (m4SelIdx >= 0) {
    const s = m4Students[m4SelIdx];
    if (["vocab", "grammar", "reading", "writing"].includes(k)) {
      s[k] = isNaN(n) ? null : n; // null = chưa nhập
    } else if (k === "project1") {
      s.p1 = isNaN(n) ? 0 : n;
    } else if (k === "project2") {
      s.p2 = isNaN(n) ? 0 : n;
    } else {
      s[k] = isNaN(n) ? 0 : n;
      if (k === "total") {
        // Điểm tổng đổi → tính lại điểm cao nhất lớp (quyết định mộc BEST)
        const cmax = Math.max(...m4Students.map((x) => x.total));
        m4Students.forEach((x) => (x.classMax = cmax));
        m4RenderStudentCards();
      }
    }
  }
  m4RenderCard();
}
function m4UpdDenom(k, v) {
  const n = parseFloat(String(v).replace(",", "."));
  M4_FIELDS[k].denom = isNaN(n) ? 100 : n;
  m4RenderCard();
}

function m4OnEditName() {
  if (m4SelIdx < 0) return;
  m4Edits[m4SelIdx].fullName = document.getElementById("m4EditName").value;
  m4RenderStudentCards();
  m4RenderCard();
}
function m4OnEditAltName() {
  if (m4SelIdx < 0) return;
  m4Edits[m4SelIdx].altName = document.getElementById("m4EditAltName").value;
  m4RenderStudentCards();
  m4RenderCard();
}
function m4OnEditComment() {
  if (m4SelIdx < 0) return;
  m4Edits[m4SelIdx].comment = document.getElementById("m4EditComment").value;
  m4RenderCard();
}

function m4RenderCard() {
  m4ScheduleSave();
  if (m4SelIdx < 0) return;
  const s = m4Students[m4SelIdx],
    e = m4Edits[m4SelIdx];
  const logo = m4GetLogo(),
    stamp = m4GetStamp(s);
  const cls = document.getElementById("m4Class").value || "";
  const st = document.getElementById("m4StartDate").value || "";
  const en = document.getElementById("m4EndDate").value || "";
  const tc = document.getElementById("m4Teacher").value || "";
  const ta = document.getElementById("m4TA").value || "";
  const name = e.fullName || s.fullName,
    alt = e.altName || s.engName,
    cmt = e.comment || "";

  // Score Report: Homework + Projects (NOT in EOC)
  let srItems = "";
  if (m4Checked.has("homework")) {
    const f = M4_FIELDS.homework;
    srItems +=
      '<div class="sr-box"><div class="lbl">Homework<br><span class="vi">(Bài tập về nhà)</span></div><div class="sr-val-row"><div class="sr-val">' +
      f.score.toFixed(2) +
      '</div><div class="sr-denom">/' +
      f.denom +
      "</div></div></div>";
  }
  if (s.p1 !== null && m4Checked.has("project1")) {
    const f = M4_FIELDS.project1;
    srItems +=
      '<div class="sr-box"><div class="lbl">Project 1<br><span class="vi">(Dự án 1)</span></div><div class="sr-val-row"><div class="sr-val">' +
      f.score.toFixed(2) +
      '</div><div class="sr-denom">/' +
      f.denom +
      "</div></div></div>";
  }
  if (s.p2 !== null && m4Checked.has("project2")) {
    const f = M4_FIELDS.project2;
    srItems +=
      '<div class="sr-box"><div class="lbl">Project 2<br><span class="vi">(Dự án 2)</span></div><div class="sr-val-row"><div class="sr-val">' +
      f.score.toFixed(2) +
      '</div><div class="sr-denom">/' +
      f.denom +
      "</div></div></div>";
  }
  const srH = srItems
    ? '<hr class="divider"><div class="sec-title">Score Report <span class="vi">(Bảng điểm)</span></div><div class="sr-grid">' +
    srItems +
    "</div>"
    : "";

  // EOC: skills only (Homework moved to Score Report above)
  const eocBaseKeys = m4IsSplitVGRW
    ? ["vocab", "grammar", "reading", "writing", "speaking", "listening"]
    : ["vgrw", "speaking", "listening"];
  const eocAct = eocBaseKeys.filter((k) => m4Checked.has(k));
  let eocH = "";
  if (eocAct.length || m4Checked.has("total")) {
    const skillsH = eocAct
      .map((k) => {
        const f = M4_FIELDS[k],
          sc = typeof f.score === "number" ? f.score.toFixed(2) : f.score;
        const lblH =
          k === "vgrw"
            ? '<span class="en">Vocabulary / Grammar<br>Reading / Writing</span><br><span class="vi">(Ngữ pháp và Từ vựng,<br>Đọc và Viết)</span>'
            : '<span class="en">' + f.label + '</span><br><span class="vi">(' + f.vi + ")</span>";
        const lblCls = k === "vgrw" ? "eoc-lbl eoc-lbl-quad" : "eoc-lbl";
        return (
          '<div class="eoc-skill"><div class="' + lblCls + '">' +
          lblH +
          '</div><div class="eoc-val">' +
          sc +
          '</div><div class="eoc-denom">/' +
          f.denom +
          "</div></div>"
        );
      })
      .join("");
    const totalH = m4Checked.has("total")
      ? '<div class="total-box"><div class="lbl">Total Score<br><span class="vi">(Điểm tổng)</span></div><div class="val-line"><span class="val">' +
      M4_FIELDS.total.score.toFixed(2) +
      '</span><span class="denom">/' +
      M4_FIELDS.total.denom +
      "</span></div></div>"
      : "";
    eocH =
      '<hr class="divider"><div class="sec-title">End-Of-Course Test <span class="vi">(Bài kiểm tra cuối khoá)</span></div><div class="eoc-wrap"><div class="eoc-skills">' +
      skillsH +
      "</div>" +
      totalH +
      "</div>";
  }

  const cmtH = renderBold(cmt);
  document.getElementById("m4ReportCard").innerHTML =
    '<div class="hdr">' +
    '<div class="hdr-left"><img src="' +
    logo +
    '" alt="Logo"><div class="form-title">Student Score<br>Report Form</div></div>' +
    '<div class="hdr-right">' +
    '<div class="info-row"><div class="info-label">Class</div><div class="info-box">' +
    cls +
    "</div></div>" +
    '<div class="info-row"><div class="info-label">Start date</div><div class="info-box sm">' +
    st +
    '</div><div class="info-gap"></div><div class="info-label" style="flex:0 0 64px;">End date</div><div class="info-box sm">' +
    en +
    "</div></div>" +
    '<div class="info-row"><div class="info-label">Teacher</div><div class="info-box">' +
    tc +
    "</div></div>" +
    '<div class="info-row"><div class="info-label">T.A</div><div class="info-box">' +
    ta +
    "</div></div>" +
    "</div>" +
    "</div>" +
    '<hr class="divider">' +
    '<div class="sec-title">Student Details <span class="vi">(Thông tin học viên)</span></div>' +
    '<div class="sd-row"><div class="sd-label"><span class="en">Full name</span><br><span class="vi">(Họ và Tên)</span></div><div class="sd-value">' +
    name +
    "</div></div>" +
    '<div class="sd-row"><div class="sd-label"><span class="en">Alternative name</span><br><span class="vi">(Tên thay thế)</span></div><div class="sd-value">' +
    alt +
    "</div></div>" +
    srH +
    eocH +
    '<hr class="divider">' +
    '<div class="cmt-wrap">' +
    '<div><div class="sec-title">Comments <span class="vi">(Nhận xét)</span></div><div class="cmt-box">' +
    cmtH +
    "</div></div>" +
    '<div class="award"><div class="a-title">Award stamp<br><span class="vi">(Mộc chứng nhận)</span></div><img src="' +
    stamp +
    '" alt="stamp"><div class="sig">Signature<br><span class="vi">(Chữ kí của PH)</span></div></div>' +
    "</div>" +
    '<div class="ftr">ILA Viet Nam - Score Report</div>';
}

function m4SafeName(n) {
  return (n || "Student").replace(/[\/\\:*?"<>|]/g, "").trim() || "Student";
}

// Chụp phiếu điểm bằng html2canvas.
// html2canvas 1.4.1 dùng line-height tính toán của <body> làm mốc đặt baseline
// cho chữ. Với line-height mặc định của app (1.5 từ Tailwind), mọi dòng chữ
// trong phiếu bị đẩy ~8px xuống đáy ô khi tải ảnh (preview vẫn đúng vì xem trực
// tiếp). Tạm đặt body line-height = 0.5 sẽ triệt tiêu độ lệch này; #appShell
// được ghim ở 1.5 nên giao diện đang hiển thị KHÔNG bị co (đã kiểm chứng:
// 0 pixel thay đổi). Bản thân #m4ReportCard giữ line-height 1.35 riêng nên
// không bị ảnh hưởng.
async function m4Capture(card) {
  const body = document.body;
  const shell = document.getElementById("appShell");
  const prevBody = body.style.lineHeight;
  const prevShell = shell ? shell.style.lineHeight : "";
  body.style.lineHeight = "0.5";
  if (shell) shell.style.lineHeight = "1.5";
  try {
    return await html2canvas(card, { scale: 2, backgroundColor: "#ffffff", useCORS: true });
  } finally {
    body.style.lineHeight = prevBody;
    if (shell) shell.style.lineHeight = prevShell;
  }
}

async function m4DownloadPNG() {
  if (m4SelIdx < 0) {
    showToast("Chọn học sinh trước ạ.", "warn");
    return;
  }
  const card = document.getElementById("m4ReportCard");
  try {
    const cv = await m4Capture(card);
    const a = document.createElement("a");
    a.download = m4SafeName(m4Edits[m4SelIdx].fullName) + ".png";
    a.href = cv.toDataURL("image/png");
    a.click();
    showToast("Đang tải ảnh...", "ok");
  } catch (err) {
    showToast("Lỗi xuất ảnh.", "error");
    console.error(err);
  }
}

async function m4DownloadPDF() {
  if (m4SelIdx < 0) {
    showToast("Chọn học sinh trước ạ.", "warn");
    return;
  }
  const card = document.getElementById("m4ReportCard");
  try {
    const cv = await m4Capture(card);
    const img = cv.toDataURL("image/png");
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pw = pdf.internal.pageSize.getWidth(),
      ph = pdf.internal.pageSize.getHeight();
    const iw = pw,
      ih = (iw * cv.height) / cv.width,
      y = ih < ph ? (ph - ih) / 2 : 0;
    pdf.addImage(img, "PNG", 0, y, iw, Math.min(ih, ph));
    pdf.save(m4SafeName(m4Edits[m4SelIdx].fullName) + ".pdf");
    showToast("Đang tải PDF...", "ok");
  } catch (err) {
    showToast("Lỗi xuất PDF.", "error");
    console.error(err);
  }
}

async function m4DownloadZIP() {
  if (!m4Students.length) {
    showToast("Import dữ liệu trước.", "warn");
    return;
  }
  const zip = new JSZip(),
    prog = document.getElementById("m4ZipProgress");
  prog.classList.remove("hidden");
  const orig = m4SelIdx,
    card = document.getElementById("m4ReportCard");
  for (let i = 0; i < m4Students.length; i++) {
    prog.textContent = "Đang xử lý " + (i + 1) + "/" + m4Students.length + "...";
    m4SelectStudent(i);
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    try {
      const cv = await m4Capture(card);
      zip.file(m4SafeName(m4Edits[i].fullName) + ".png", cv.toDataURL("image/png").split(",")[1], { base64: true });
    } catch (e) {
      console.error("Render err", i, e);
    }
  }
  if (orig >= 0) m4SelectStudent(orig);
  const code = document.getElementById("m4ClassCode").value;
  const blob = await zip.generateAsync({ type: "blob" });
  const a = document.createElement("a");
  a.download = code + "_Test Score.zip";
  a.href = URL.createObjectURL(blob);
  a.click();
  prog.textContent = "Hoàn thành! Đã đóng gói " + m4Students.length + " phiếu điểm.";
  setTimeout(() => prog.classList.add("hidden"), 4000);
  showToast("Đã tải ZIP " + m4Students.length + " phiếu điểm.", "ok");
}
function m4AddStudentManual() {
  document.getElementById("m4AddName").value = "";
  document.getElementById("m4AddEngName").value = "";
  animOpenModal(document.getElementById("m4AddModal"));
  setTimeout(() => document.getElementById("m4AddName").focus(), 50);
}

function m4CloseAddModal() {
  animCloseModal(document.getElementById("m4AddModal"));
}

function m4ConfirmAddStudent() {
  const name = document.getElementById("m4AddName").value.trim();
  if (!name) {
    showToast("Vui lòng nhập tên học sinh.", "warn");
    return;
  }
  const engName = document.getElementById("m4AddEngName").value.trim();
  const newStudent = {
    fullName: name,
    engName: engName,
    p1: null,
    p2: null,
    vgrw: 0,
    speaking: 0,
    listening: 0,
    homework: 0,
    total: 0,
    vocab: null,
    grammar: null,
    reading: null,
    writing: null,
    passFailOverride: null,
  };
  const newIdx = m4Students.length;
  m4Students.push(newStudent);
  m4Edits[newIdx] = { fullName: name, altName: engName, comment: m4DefaultComment(0) };
  document.getElementById("m4StudentsSection").classList.remove("hidden");
  document.getElementById("m4WorkArea").classList.remove("hidden");
  m4RenderStudentCards();
  m4SelectStudent(m4Students.length - 1);
  m4CloseAddModal();
  showToast('Import thành công "' + name + '" học sinh.', "ok");
}

// ── Hướng dẫn lấy điểm bằng Console ──────────────────────────────────────────
// Đổ nội dung lệnh (từ <script type="text/plain" id="m4ScoreScriptSrc">) vào ô
// xem trước. Dùng textContent nên các ký tự < > & được hiển thị an toàn.
function m4FillScoreScript() {
  const src = document.getElementById("m4ScoreScriptSrc");
  const view = document.getElementById("m4ScoreScriptView");
  if (src && view) view.textContent = src.textContent.trim();
}

function m4CopyScoreScript() {
  const src = document.getElementById("m4ScoreScriptSrc");
  const text = src ? src.textContent.trim() : "";
  if (!text) return;
  const done = () => {
    const btn = document.getElementById("m4CopyBtn");
    if (btn) {
      const old = btn.innerHTML;
      btn.innerHTML = "✓ Đã sao chép";
      setTimeout(() => (btn.innerHTML = old), 1800);
    }
    showToast("Đã sao chép lệnh vào clipboard ạ.", "ok");
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(() => m4CopyFallback(text, done));
  } else {
    m4CopyFallback(text, done);
  }
}

function m4CopyFallback(text, done) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.left = "-9999px";
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand("copy");
    done();
  } catch (e) {
    showToast("Không sao chép được, bạn copy thủ công trong ô bên dưới nhé ạ.", "error");
  }
  document.body.removeChild(ta);
}

// END MODE 4