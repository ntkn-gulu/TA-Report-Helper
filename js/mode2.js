// ─── BUILD MODE 2 FORM ───────────────────────────────────────────────────────
function buildCategoryGroups() {
  const container = document.getElementById("categoryGroups");
  container.innerHTML = "";
  CAT_GROUPS.forEach((group) => {
    const groupEl = document.createElement("div");
    groupEl.className = "space-y-3";
    const title = document.createElement("h3");
    title.className = "text-xs font-semibold uppercase text-slate-500 tracking-wide";
    title.textContent = group.title;
    groupEl.appendChild(title);
    group.cats.forEach((cat) => {
      const catEl = document.createElement("div");
      catEl.className = "space-y-1";
      catEl.innerHTML = `<div class="text-sm text-slate-600">${cat.label}</div>
        <div class="flex gap-2 flex-wrap">
          <button type="button" onclick="selectOpt('${cat.id}','TOT',this)"
            class="opt-btn flex-1 min-w-[80px] border border-slate-200 rounded-lg py-1.5 text-xs font-medium text-slate-600 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700"
            data-cat="${cat.id}" data-val="TOT">TỐT</button>
          <button type="button" onclick="selectOpt('${cat.id}','ON',this)"
            class="opt-btn flex-1 min-w-[80px] border border-slate-200 rounded-lg py-1.5 text-xs font-medium text-slate-600 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"
            data-cat="${cat.id}" data-val="ON">ỔN</button>
          <button type="button" onclick="selectOpt('${cat.id}','CAN',this)"
            class="opt-btn flex-1 min-w-[80px] border border-slate-200 rounded-lg py-1.5 text-xs font-medium text-slate-600 hover:border-amber-400 hover:bg-amber-50 hover:text-amber-700"
            data-cat="${cat.id}" data-val="CAN">CẦN CẢI THIỆN</button>
        </div>`;
      groupEl.appendChild(catEl);
    });
    container.appendChild(groupEl);
  });
}

const mode2Selections = {};

function selectOpt(catId, val, btn) {
  mode2Selections[catId] = val;
  document.querySelectorAll(`[data-cat="${catId}"]`).forEach((b) => {
    b.classList.remove(
      "bg-emerald-100",
      "text-emerald-700",
      "border-emerald-400",
      "bg-blue-100",
      "text-blue-700",
      "border-blue-400",
      "bg-amber-100",
      "text-amber-700",
      "border-amber-400",
      "font-bold",
    );
    b.classList.add("border-slate-200", "text-slate-600");
  });
  if (val === "TOT") btn.classList.add("bg-emerald-100", "text-emerald-700", "border-emerald-400", "font-bold");
  else if (val === "ON") btn.classList.add("bg-blue-100", "text-blue-700", "border-blue-400", "font-bold");
  else btn.classList.add("bg-amber-100", "text-amber-700", "border-amber-400", "font-bold");
  btn.classList.remove("border-slate-200", "text-slate-600");
}

// ─── GENERATE MODE 2 ─────────────────────────────────────────────────────────
function generateMonthly() {
  const full = document.getElementById("fullName").value.trim();
  const nick = document.getElementById("nickName").value.trim();
  const beRef = nick ? `bé ${nick}` : full ? `bé ${full.split(" ").pop()}` : "bé";

  const grammarPoint = document.getElementById("grammarPoint").value.trim();
  const grammarErrors = document.getElementById("grammarErrors2").value.trim();
  const extraNotes = document.getElementById("extraNotes2").value.trim();

  function ph(catId) {
    const val = mode2Selections[catId];
    if (!val) return null;
    for (const g of CAT_GROUPS) for (const c of g.cats) if (c.id === catId) return c.opts[val] || null;
    return null;
  }

  const paragraphs = [];
  paragraphs.push(`Dạ em chào mẹ ạ. Em xin phép trao đổi với mẹ tình hình học trên lớp của bé ${full || "bé"} ạ.`);

  const groupA = [ph("attitude"), ph("focus"), ph("interact")].filter(Boolean);
  if (groupA.length) paragraphs.push(groupA.join(" "));

  const groupB = [ph("comprehension"), ph("pronunciation"), ph("grammarKnow")].filter(Boolean);
  let groupBText = groupB.join(" ");
  if (grammarPoint) {
    const errPart = grammarErrors ? ` Em có ghi nhận ${beRef} hay ${grammarErrors} ạ.` : "";
    groupBText += ` Dạ khóa này có ngữ pháp mới là ${grammarPoint}.${errPart} Trên lớp em có hỗ trợ thêm cho bé phần này và đã ghi bổ sung lý thuyết trong cuốn Reminder ạ. Nhờ mẹ nhắc ${beRef} xem lại cuốn Reminder khi làm bài ở nhà nha ạ.`;
  }
  if (groupBText.trim()) paragraphs.push(groupBText.trim());

  const groupC = [ph("speaking2"), ph("confidence"), ph("listening2"), ph("reading2"), ph("writing2")].filter(Boolean);
  if (groupC.length) paragraphs.push(groupC.join(" "));

  const groupD = [ph("hwReminder"), ph("hwSmart")].filter(Boolean);
  if (groupD.length) paragraphs.push(groupD.join(" "));

  if (extraNotes) paragraphs.push(`Dạ ngoài ra em cũng muốn chia sẻ thêm với mẹ: ${extraNotes} ạ.`);
  paragraphs.push(closingLine());

  const allCatIds = CAT_GROUPS.flatMap((g) => g.cats.map((c) => c.id));
  const catLabel = (id) => {
    for (const g of CAT_GROUPS) for (const c of g.cats) if (c.id === id) return c.label;
    return id;
  };
  const goodCats = allCatIds.filter((id) => mode2Selections[id] === "TOT");
  const weakCats = allCatIds.filter((id) => mode2Selections[id] === "CAN");

  let logParts = ["Báo tình hình học tập."];
  if (goodCats.length) logParts.push(`Điểm tốt: ${goodCats.map(catLabel).join(", ")}.`);
  if (weakCats.length) logParts.push(`Cần cải thiện: ${weakCats.map(catLabel).join(", ")}.`);
  if (grammarPoint)
    logParts.push(`Ngữ pháp mới: ${grammarPoint}${grammarErrors ? " — lỗi phổ biến: " + grammarErrors : ""}.`);
  if (extraNotes) logParts.push(extraNotes);

  return { parent: paragraphs.join("\n\n"), log: logParts.join(" ") };
}
