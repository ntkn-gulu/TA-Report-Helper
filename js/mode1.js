// ─── BUILD SKILL ROWS ────────────────────────────────────────────────────────
function buildSkillRows() {
  const container = document.getElementById("skillRows");
  container.innerHTML = "";
  SKILLS.forEach((sk) => {
    const row = document.createElement("div");
    row.className = "flex items-center gap-2";
    row.innerHTML = `
      <span class="text-sm text-slate-600 w-20 shrink-0">${sk.label}</span>
      <input id="score_${sk.id}" type="number" min="0" placeholder="Điểm"
        class="w-20 border border-slate-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        oninput="updateBadge('${sk.id}')" />
      <span class="text-slate-400 text-sm">/</span>
      <input id="max_${sk.id}" type="number" min="0" placeholder="Tối đa"
        class="w-20 border border-slate-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        oninput="updateBadge('${sk.id}')" />
      <span id="badge_${sk.id}" class="tier-badge hidden"></span>`;
    container.appendChild(row);
  });
}

function updateBadge(id) {
  const score = parseFloat(document.getElementById("score_" + id).value);
  const max = parseFloat(document.getElementById("max_" + id).value);
  const badge = document.getElementById("badge_" + id);
  if (!max || isNaN(score) || isNaN(max)) {
    badge.classList.add("hidden");
    return;
  }
  const tier = getTier((score / max) * 100);
  badge.textContent = tier.label;
  badge.className = "tier-badge " + tier.color;
  badge.classList.remove("hidden");
}

// ─── GENERATE MODE 1 ─────────────────────────────────────────────────────────
function generateExam() {
  const full = document.getElementById("fullName").value.trim();
  const nick = document.getElementById("nickName").value.trim();
  const beRef = nick ? `bé ${nick}` : full ? `bé ${full.split(" ").pop()}` : "bé";

  const gramMistakes = document.getElementById("grammarMistakes").value.trim();
  const vocabGaps = document.getElementById("vocabGaps").value.trim();
  const extraNotes = document.getElementById("extraNotes1").value.trim();

  const results = [];
  let totalPct = 0,
    count = 0;
  SKILLS.forEach((sk) => {
    const score = parseFloat(document.getElementById("score_" + sk.id).value);
    const max = parseFloat(document.getElementById("max_" + sk.id).value);
    if (!max || isNaN(max) || max <= 0) return;
    const pct = isNaN(score) ? 0 : (score / max) * 100;
    totalPct += pct;
    count++;
    results.push({ sk, score: isNaN(score) ? 0 : score, max, pct, tier: getTier(pct) });
  });

  const avgPct = count > 0 ? totalPct / count : 0;
  const avgTier = getTier(avgPct);
  const paragraphs = [];

  paragraphs.push(
    `Dạ em chào mẹ ạ. Em xin phép trao đổi với mẹ về kết quả bài thi cuối khóa của bé ${full || "bé"} ạ.`,
  );

  const overallMap = {
    EXCELLENT: `Nhìn chung kết quả thi của ${beRef} rất xuất sắc ạ. Kết quả cho thấy bé đã nắm vững kiến thức, vận dụng tốt các kỹ năng và có sự chuẩn bị kỹ lưỡng cho kỳ thi ạ.`,
    GOOD: `Nhìn chung kết quả thi của ${beRef} khá tốt ạ. Bé đã nắm được phần lớn kiến thức và hoàn thành bài thi tương đối tốt. Bé cần chú ý rèn luyện thêm và ôn tập đều đặn ở một số kỹ năng là sẽ tiến bộ hơn nữa ạ.`,
    AVERAGE: `Nhìn chung kết quả thi của ${beRef} ở mức khá ạ. Bé đã hoàn thành bài thi và nắm được phần cơ bản ạ. Tuy nhiên vẫn còn một số kỹ năng cần đầu tư thêm thời gian luyện tập ạ.`,
    WEAK: `Nhìn chung kết quả thi của ${beRef} còn cần cố gắng hơn ạ. Em thấy bé vẫn còn gặp khó khăn ở một số kỹ năng, cần chịu khó ôn tập thêm trong thời gian tới ạ.`,
  };
  paragraphs.push(overallMap[avgTier.key]);

  // Logic gộp Vocab + Grammar khi cùng tier, các skill khác giữ riêng
  const byId = Object.fromEntries(results.map((r) => [r.sk.id, r]));
  const v = byId.vocab,
    g = byId.grammar;

  if (v && g && v.tier.key === g.tier.key) {
    // Gộp Vocab + Grammar
    paragraphs.push(skillPhrase("vocab_grammar", v.tier.key));
  } else {
    if (v) paragraphs.push(skillPhrase("vocab", v.tier.key));
    if (g) paragraphs.push(skillPhrase("grammar", g.tier.key));
  }

  // Các skill còn lại theo thứ tự: Nghe → Đọc → Viết → Nói
  ["listening", "reading", "writing", "speaking"].forEach((id) => {
    const r = byId[id];
    if (r) paragraphs.push(skillPhrase(id, r.tier.key));
  });

  if (gramMistakes)
    paragraphs.push(
      `Dạ về phần ngữ pháp, em có ghi nhận ${beRef} còn một số lỗi sai như: ${gramMistakes} ạ. Đây là điểm mà mình cần chú ý ôn lại và luyện tập thêm ạ. Tuy nhiên đây là điều bình thường và bé hoàn toàn có thể cải thiện được nếu chịu khó ôn tập ạ.`,
    );
  if (vocabGaps)
    paragraphs.push(
      `Về từ vựng, em thấy ${beRef} chưa nắm thật vững các chủ đề: ${vocabGaps} ạ. Em có ghi bổ sung phần từ vựng này trong cuốn Reminder để bé tiện ôn lại ạ. Nhờ mẹ nhắc bé xem lại cuốn Reminder để củng cố từ vựng thêm nhé ạ.`,
    );
  if (extraNotes)
    paragraphs.push(
      `Dạ thêm một điều em muốn chia sẻ với mẹ về quá trình học của ${beRef} ạ: ${extraNotes} ạ. Em hy vọng ${beRef} sẽ tiếp tục phát huy và tiến bộ hơn nữa trong khóa học tới ạ.`,
    );

  paragraphs.push(closingLine());

  let logParts = ["Báo điểm thi cuối khóa."];
  if (count > 0) {
    const avgLabel = { EXCELLENT: "xuất sắc", GOOD: "tốt", AVERAGE: "khá", WEAK: "cần cố gắng" }[avgTier.key];
    logParts.push(`Kết quả tổng thể ở mức ${avgLabel} (trung bình ${avgPct.toFixed(1)}%).`);
    const strong = results.filter((r) => r.tier.key === "EXCELLENT" || r.tier.key === "GOOD").map((r) => r.sk.label);
    const weak = results.filter((r) => r.tier.key === "WEAK").map((r) => r.sk.label);
    if (strong.length) logParts.push(`Điểm mạnh: ${strong.join(", ")}.`);
    if (weak.length) logParts.push(`Cần cải thiện: ${weak.join(", ")}.`);
  }
  if (gramMistakes) logParts.push(`Lỗi ngữ pháp: ${gramMistakes}.`);
  if (extraNotes) logParts.push(extraNotes);

  return { parent: paragraphs.join("\n\n"), log: logParts.join(" ") };
}
