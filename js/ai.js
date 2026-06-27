// ─── AI PARAPHRASE ENTRY ─────────────────────────────────────────────────────
function triggerAI(mode = "standard") {
  if (!localStorage.getItem("ai_disclaimer_accepted")) {
    showDisclaimer(() => runAIParaphrase(mode));
  } else {
    runAIParaphrase(mode);
  }
}

// Build prompt khác nhau theo mode
function buildAIPrompt(redacted, mode) {
  // Phần dùng chung cho cả 2 mode: voice anchor + anti-patterns
  const shared = `
🎯 VAI TRÒ
Bạn là TA (trợ giảng) tiếng Anh tại một trung tâm Việt Nam, đang viết tin nhắn BÁO CÁO TÌNH HÌNH HỌC TẬP của bé gửi phụ huynh. Phong cách: KHÁCH QUAN, LỄ PHÉP, PROFESSIONAL — như báo cáo thật giữa giáo viên và PH, KHÔNG phải văn cảm xúc hay văn marketing.

⛔ TUYỆT ĐỐI TRÁNH (các pattern AI-feel "thảo mai" làm văn nghe giả trân — đây là vấn đề LỚN NHẤT):

1. KHÔNG bộc lộ cảm xúc cá nhân của TA. Cấm tuyệt các cụm sau:
   ❌ "Em rất vui được chia sẻ/kể/trao đổi..."
   ❌ "Em thực sự ấn tượng với..." / "Em ấn tượng với..."
   ❌ "Em hơi tiếc một chút là..." / "Em tiếc là..."
   ❌ "Em rất tự hào về..." / "Em rất vui khi thấy..."
   ❌ "Khả năng X của bé rất đáng khen"
   ❌ "Đáng khen là...", "Đáng tự hào là..."
   ❌ "Bé thực sự là học sinh xuất sắc/đáng yêu"
   → TA chỉ "quan sát thấy", "thấy bé", "nhận thấy" — KHÔNG cảm thán, KHÔNG khen ngợi cá nhân.

2. KHÔNG dùng từ ngữ flowery / AI-style:
   ❌ "Hành trình học tập" → ✅ "tình hình học tập"
   ❌ "Kể mẹ nghe về..." → ✅ "trao đổi với mẹ về..."
   ❌ "Tinh thần học" → ✅ "thái độ học"
   ❌ "Tương tác với thầy cô" → CẤM HOÀN TOÀN. Chỉ dùng "hòa đồng với bạn bè", KHÔNG nhắc thầy cô trong context giao tiếp xã hội của bé.
   ❌ "Đồng thời", "Bên cạnh việc..." → ✅ "Bên cạnh đó", "Ngoài ra"
   ❌ "Mà" làm connector chuyển ý → ✅ "Tuy nhiên"

3. KHÔNG mở đầu câu nhận xét bằng cảm xúc của TA:
   ❌ "Em ấn tượng với...", "Em hơi tiếc...", "Em rất vui..."
   ✅ "Trên lớp em quan sát thấy...", "Về phần [skill]...", "Phần [skill] của bé...", "Khả năng [X] của bé...", "Bên cạnh đó,...", "Tuy nhiên,..."

✅ VOICE ANCHOR — viết theo phong cách chuẩn mực này:

CÂU MỞ ĐẦU (dùng 1 trong 2, KHÔNG sáng tạo khác):
- Báo cáo tháng: "Dạ em chào mẹ ạ. Em xin phép trao đổi với mẹ tình hình học tập của bé [Tên] trên lớp ạ."
- Báo cáo điểm thi: "Dạ em chào mẹ ạ. Em xin phép trao đổi với mẹ về kết quả bài thi cuối khóa của bé [Tên] ạ."

CÁC MẪU CÂU CHUẨN (cần đạt được style như những câu này):
- "Trên lớp em quan sát thấy bé học ngoan và chăm chú nghe giảng ạ."
- "Trong lớp bé học tập trung, thỉnh thoảng cuối buổi bé còn hay dễ bị xao nhãng ạ."
- "Trên lớp bé khá hòa đồng với bạn bè ạ."
- "Tuy nhiên bé còn chưa chủ động xung phong phát biểu bài, bé phải đợi thầy cô mời mới trả lời ạ."
- "Khả năng nắm bài của bé khá tốt. Bé học và tiếp thu bài nhanh ạ."
- "Phần ngữ pháp của bé khóa này chưa vững lắm. Bé cần chủ động luyện tập nhiều hơn ạ."
- "Bên cạnh đó, kỹ năng [X] của bé còn hạn chế ạ. Bé cần luyện tập thêm để cải thiện ạ."
- "Bài tập trong cuốn Reminder bé đã hoàn thành đầy đủ ạ."
- "Bài tập trên hệ thống Smart Learning bé còn thiếu khá nhiều ạ."

🔒 GIỮ NGUYÊN (không được đổi):
- Mọi số điểm, % cụ thể
- Tên các kỹ năng (Nghe, Đọc, Viết, Nói, Từ vựng, Ngữ pháp)
- Mức đánh giá thực tế (KHÔNG nâng/hạ tier — "tốt" không thành "xuất sắc", "yếu" không thành "khá")
- Tên ngữ pháp cụ thể nếu được nhắc (vd: "Thì Tương lai gần")
- Cách xưng "em" (TA) - "mẹ" - "bé" hoặc "con"
- "ạ" ở cuối câu — đây là dấu hiệu lễ phép QUAN TRỌNG, GIỮ ở 70-85% câu, KHÔNG cắt bỏ
- CÂU KẾT về việc gọi điện trao đổi — giữ NGUYÊN VĂN, KHÔNG paraphrase

🚫 KHÔNG được:
- Thêm thông tin bịa về bé không có trong bản gốc
- Đổi tier đánh giá sang cấp khác
- Bộc lộ cảm xúc cá nhân của TA
- Cắt "ạ" để cố "tự nhiên hơn" — đó là SAI, người Việt vẫn dùng "ạ" thường xuyên với PH

CHỈ trả về tin nhắn đã viết lại. KHÔNG markdown, KHÔNG giải thích, KHÔNG tiêu đề.
`;

  if (mode === "humanize") {
    return `${shared}

📝 PHONG CÁCH MODE HUMANIZE:
Viết lại tin nhắn dưới đây theo voice anchor trên, đặc điểm:
- Câu NGẮN GỌN, đi thẳng vào ý chính (đa số dưới 20 từ)
- Tách câu dài thành 2-3 câu ngắn khi cần
- Bỏ các từ thừa: "rất", "vô cùng", "đặc biệt", "hoàn toàn", "luôn luôn", "thực sự", "thường xuyên"
- Gộp kỹ năng cùng tier thành 1 câu (vd: "Các kỹ năng Nghe, Đọc của bé đều ổn ạ.")
- Đơn giản hóa cấu trúc câu nhưng VẪN giữ "ạ" ở 70-85% câu
- KHÔNG được cắt "ạ" để "đỡ formal" — đó là hiểu sai

Tin nhắn gốc:
---
${redacted}
---`;
  }

  // mode === 'standard'
  return `${shared}

📝 PHONG CÁCH MODE STANDARD:
Viết lại tin nhắn dưới đây theo voice anchor trên, đặc điểm:
- Đa dạng cách diễn đạt: đảo cấu trúc, tách/gộp câu, thay synonym phù hợp
- Có thể dùng câu dài hơn với vế phụ khi cần làm rõ ý
- Giữ giọng văn lễ phép trang trọng, đầy đủ "ạ"
- Tránh lặp pattern "Về [skill], con..." liên tiếp — đa dạng cách mở đầu các đoạn
- KHÔNG được thêm cảm xúc cá nhân để "đa dạng hóa" — vẫn phải khách quan

Tin nhắn gốc:
---
${redacted}
---`;
}

async function runAIParaphrase(mode = "standard") {
  const apiKey = localStorage.getItem("gemini_api_key");
  if (!apiKey) {
    toggleSettings();
    showToast("Cần nhập Gemini API key trong Cài đặt trước ạ.", "warn");
    return;
  }

  const fullName = document.getElementById("fullName").value.trim();
  const nickName = document.getElementById("nickName").value.trim();

  if (!nickName) {
    showToast("Cần điền Tên thay thế trước khi dùng AI ạ.", "warn");
    return;
  }

  const currentText = document.getElementById("outputParent").textContent;
  if (!currentText.trim()) {
    showToast("Chưa có nội dung để viết lại. Tạo báo cáo trước ạ.", "warn");
    return;
  }

  // Step 1: redact
  let redacted;
  try {
    redacted = redactForAPI(currentText, fullName, nickName);
  } catch (err) {
    showToast(err.message, "error");
    return;
  }

  // Step 2: assert full name is gone
  if (fullName && redacted.toLowerCase().includes(fullName.toLowerCase())) {
    showToast("Không thể bảo vệ tên bé. Kiểm tra lại Tên thay thế.", "error");
    return;
  }

  // Step 3: set loading state — chọn đúng button theo mode
  const isHumanize = mode === "humanize";
  const aiBtn = document.getElementById(isHumanize ? "aiBtnHumanize" : "aiBtnStandard");
  const otherBtn = document.getElementById(isHumanize ? "aiBtnStandard" : "aiBtnHumanize");
  const origBtnHTML = aiBtn.innerHTML;
  const origBtnClass = aiBtn.className;
  aiBtn.disabled = true;
  otherBtn.disabled = true;
  const loadingLabel = isHumanize ? "Đang humanize..." : "Đang viết lại...";
  aiBtn.innerHTML = `<span class="spinner"></span>${loadingLabel}`;
  const loadingColor = isHumanize ? "bg-purple-400" : "bg-indigo-400";
  aiBtn.className = `text-xs ${loadingColor} text-white px-4 py-1.5 rounded-full font-medium cursor-not-allowed`;

  const prompt = buildAIPrompt(redacted, mode);

  const selectedModel = localStorage.getItem("gemini_model") || "gemini-2.5-flash";

  // Adjust config theo model: Pro không cho phép thinkingBudget=0
  const generationConfig = {
    temperature: 0.95,
    topP: 0.95,
    maxOutputTokens: 8192,
  };
  if (selectedModel.includes("flash")) {
    // Flash & Flash-Lite: tắt thinking để output không bị cắt
    generationConfig.thinkingConfig = { thinkingBudget: 0 };
  }
  // Pro: để mặc định, thinking sẽ giúp output chất lượng hơn

  try {
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig,
        }),
      },
    );

    if (!resp.ok) {
      const status = resp.status;
      // Đọc error message thực từ Google API để debug
      let apiMsg = "";
      try {
        const errData = await resp.json();
        apiMsg = errData?.error?.message || "";
      } catch (_) {
        /* ignore */
      }

      if (status === 400 || status === 401 || status === 403) {
        showToast("API key sai hoặc hết hạn. Kiểm tra trong Cài đặt.", "error");
        console.error("Gemini API error:", status, apiMsg);
        return;
      } else if (status === 429) {
        // Auto-fallback: nếu đang dùng Pro mà bị 429 → tự retry với Flash
        if (selectedModel === "gemini-2.5-pro") {
          showToast("⚠ Pro đang quá tải, đang thử lại với Flash...", "warn");
          aiBtn.innerHTML = '<span class="spinner"></span>Thử lại với Flash...';

          const flashResp = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                  ...generationConfig,
                  thinkingConfig: { thinkingBudget: 0 },
                },
              }),
            },
          );

          if (flashResp.ok) {
            const flashData = await flashResp.json();
            const flashText = flashData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
            if (flashText) {
              const restored = fullName ? unredactFromAPI(flashText, fullName, nickName) : flashText;
              const revertBtn = document.getElementById("revertBtn");
              if (revertBtn.classList.contains("hidden")) {
                originalParentText = currentText;
              }
              document.getElementById("outputParent").textContent = restored;
              revertBtn.classList.remove("hidden");
              document.getElementById("aiBanner").classList.remove("hidden");
              const actionLabel = isHumanize ? "humanize" : "viết lại";
              showToast(`✓ Đã ${actionLabel} bằng Flash (do Pro quá tải).`, "ok");
              return;
            }
          }
          showToast("Cả Pro và Flash đều không phản hồi. Thử lại sau 1 phút.", "error");
        } else {
          showToast("Đã vượt giới hạn miễn phí Gemini. Thử lại sau 1 phút.", "warn");
        }
        console.error("Gemini API 429:", apiMsg);
        return;
      } else {
        const shortMsg = apiMsg ? ` (${apiMsg.slice(0, 80)})` : "";
        showToast(`Lỗi từ Gemini ${status}${shortMsg}`, "error");
        console.error("Gemini API error:", status, apiMsg);
        return;
      }
    }

    const data = await resp.json();
    const candidate = data?.candidates?.[0];
    const aiText = candidate?.content?.parts?.[0]?.text?.trim();
    const finishReason = candidate?.finishReason;

    if (!aiText) {
      if (finishReason === "MAX_TOKENS") {
        showToast("Output bị cắt do quá dài. Thử với báo cáo ngắn hơn.", "warn");
      } else if (finishReason === "SAFETY") {
        showToast("AI từ chối tạo nội dung. Vui lòng thử lại.", "warn");
      } else {
        showToast("AI không trả về kết quả. Dùng bản gốc hoặc thử lại.", "warn");
      }
      return;
    }

    // Cảnh báo nếu output bị cắt giữa chừng dù có text
    if (finishReason === "MAX_TOKENS") {
      showToast("⚠ Output có thể bị cắt cuối. Kiểm tra kỹ trước khi gửi.", "warn");
    }

    // restore real name
    const restored = fullName ? unredactFromAPI(aiText, fullName, nickName) : aiText;

    // Save original text only on FIRST AI run (when revert btn is still hidden).
    // Subsequent AI runs don't overwrite — luôn giữ bản gốc đầu tiên để revert về.
    const revertBtn = document.getElementById("revertBtn");
    if (revertBtn.classList.contains("hidden")) {
      originalParentText = currentText;
    }

    document.getElementById("outputParent").textContent = restored;
    revertBtn.classList.remove("hidden");
    document.getElementById("aiBanner").classList.remove("hidden");
  } catch (_) {
    showToast("Không kết nối được. Kiểm tra mạng và thử lại.", "error");
  } finally {
    aiBtn.disabled = false;
    otherBtn.disabled = false;
    aiBtn.innerHTML = origBtnHTML;
    aiBtn.className = origBtnClass;
  }
}

// ─── REVERT AI ───────────────────────────────────────────────────────────────
function revertAI() {
  document.getElementById("outputParent").textContent = originalParentText;
  document.getElementById("revertBtn").classList.add("hidden");
  document.getElementById("aiBanner").classList.add("hidden");
}
