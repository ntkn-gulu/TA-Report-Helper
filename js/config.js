// ─── SKILLS ─────────────────────────────────────────────────────────────────
const SKILLS = [
  { id: "vocab", label: "Từ vựng", vn: "từ vựng" },
  { id: "grammar", label: "Ngữ pháp", vn: "ngữ pháp" },
  { id: "listening", label: "Nghe", vn: "nghe" },
  { id: "reading", label: "Đọc", vn: "đọc hiểu" },
  { id: "writing", label: "Viết", vn: "viết" },
  { id: "speaking", label: "Nói", vn: "nói" },
];

// ─── SKILL TIER PHRASES ─────────────────────────────────────────────────────
const SKILL_TIER_PHRASES = {
  // Khi Vocab + Grammar cùng tier sẽ gộp thành 1 câu
  vocab_grammar: {
    EXCELLENT: `Con đạt kết quả xuất sắc về từ vựng và ngữ pháp ạ. Con nắm bài rất tốt, hiểu rõ nghĩa của từ vựng và nắm rõ cách dùng ngữ pháp trong bài ạ.`,
    GOOD: `Về phần từ vựng và ngữ pháp, con làm bài khá tốt, đa số con đã nắm được ạ. Tuy nhiên còn một số câu con vẫn nhầm lẫn, cần ôn lại để chắc kiến thức hơn ạ.`,
    AVERAGE: `Về phần từ vựng và ngữ pháp, con nắm được phần cơ bản nhưng còn mắc khá nhiều lỗi ạ. Con cần ôn lại lý thuyết và làm thêm bài tập để nắm chắc kiến thức hơn ạ.`,
    WEAK: `Phần từ vựng và ngữ pháp của con còn hạn chế ạ. Con chưa nhớ rõ từ vựng và còn lúng túng khi áp dụng ngữ pháp. Mình cần ôn lại từ đầu và học từ vựng đều đặn mỗi ngày để cải thiện ạ.`,
  },
  vocab: {
    EXCELLENT: `Về từ vựng, con đạt kết quả xuất sắc ạ. Con nhớ và hiểu rõ nghĩa của các từ trong khóa học ạ.`,
    GOOD: `Về phần từ vựng, con làm khá tốt, đa số từ vựng con đã nhớ ạ. Tuy nhiên còn một vài từ con chưa thật vững, cần ôn lại thêm ạ.`,
    AVERAGE: `Về từ vựng, con đã nhớ được phần cơ bản nhưng còn quên một số từ ạ. Con cần ôn từ vựng đều đặn mỗi ngày để nhớ lâu hơn ạ.`,
    WEAK: `Phần từ vựng của con còn hạn chế, con chưa nhớ được nhiều từ trong khóa học ạ. Con cần học từ vựng mỗi ngày và làm thêm bài tập để củng cố ạ.`,
  },
  grammar: {
    EXCELLENT: `Về ngữ pháp, con đạt kết quả xuất sắc, con nắm rõ và biết cách áp dụng vào bài thi ạ.`,
    GOOD: `Về ngữ pháp, con làm khá tốt, con hiểu cách dùng các cấu trúc trong khóa học ạ. Chỉ cần cẩn thận hơn ở một số chi tiết nhỏ là sẽ chính xác hơn ạ.`,
    AVERAGE: `Về ngữ pháp, con nắm được lý thuyết cơ bản nhưng còn lúng túng khi áp dụng vào bài tập ạ. Con cần làm thêm bài tập thực hành để vững hơn ạ.`,
    WEAK: `Phần ngữ pháp của con còn yếu, con còn nhầm lẫn nhiều cấu trúc ạ. Con cần ôn lại lý thuyết và làm bài tập theo từng chủ điểm để cải thiện ạ.`,
  },
  listening: {
    EXCELLENT: `Con làm bài nghe rất tốt ạ. Con nghe được nội dung chính cũng như nắm được các chi tiết quan trọng trong bài ạ.`,
    GOOD: `Về phần nghe, con làm khá tốt, con nắm được ý chính và đa số chi tiết của bài ạ. Chỉ cần luyện nghe thêm để bắt được những chi tiết nhỏ là sẽ tốt hơn ạ.`,
    AVERAGE: `Về phần nghe, con hiểu được phần lớn nội dung của bài ạ. Tuy nhiên con cần đầu tư thêm thời gian luyện tập kỹ năng này để kết quả tốt hơn ạ.`,
    WEAK: `Kỹ năng nghe của con còn hạn chế, con chưa bắt được rõ nội dung của bài nghe ạ. Con cần nghe thêm các bài tương tự hằng ngày để quen với tốc độ và phát âm ạ.`,
  },
  reading: {
    EXCELLENT: `Con đạt kết quả xuất sắc về đọc hiểu ạ. Con hiểu và nắm rõ nội dung của bài đọc ạ.`,
    GOOD: `Về phần đọc hiểu, con làm tốt, con hiểu được nội dung chính của bài ạ. Chỉ cần chú ý thêm một số chi tiết nhỏ là sẽ chính xác hơn ạ.`,
    AVERAGE: `Về phần đọc hiểu, con hiểu được phần lớn nội dung của bài ạ. Tuy nhiên con cần luyện đọc thêm để bắt được những chi tiết nhỏ và suy luận trong câu hỏi ạ.`,
    WEAK: `Kỹ năng đọc hiểu của con còn hạn chế, con chưa nắm được rõ nội dung của bài đọc ạ. Con cần chịu khó luyện đọc thêm các bài tương tự để cải thiện ạ.`,
  },
  writing: {
    EXCELLENT: `Bài thi viết của con rất tốt ạ. Con viết chính xác, đầy đủ ý và bố cục rõ ràng ạ.`,
    GOOD: `Về phần viết, con làm tốt ạ. Con hiểu bài và biết cách dùng, chỉ cần cẩn thận hơn ở một vài chi tiết nhỏ là sẽ hoàn thiện hơn nữa ạ.`,
    AVERAGE: `Về phần viết, con đã thể hiện được ý chính nhưng còn mắc lỗi ngữ pháp và chính tả ạ. Con cần luyện viết thêm và kiểm tra kỹ trước khi nộp bài ạ.`,
    WEAK: `Phần viết của con còn cần cải thiện, con chưa diễn đạt được ý đầy đủ và còn mắc nhiều lỗi ạ. Con cần luyện viết thường xuyên hơn và xem lại cấu trúc câu cơ bản ạ.`,
  },
  speaking: {
    EXCELLENT: `Ở phần thi nói, con nói rất tốt ạ. Con phát âm chính xác, trả lời đúng trọng tâm câu hỏi và có phản xạ nhanh ạ.`,
    GOOD: `Ở phần thi nói, con nói tốt, phát âm chính xác và trả lời đúng trọng tâm của câu hỏi ạ. Tuy nhiên con cần luyện tập nhiều hơn để có phản xạ nhanh hơn và hạn chế vấp khi nói ạ.`,
    AVERAGE: `Về phần nói, con đã giao tiếp được những câu cơ bản, tuy nhiên còn vấp và chưa thật sự tự tin ạ. Con cần luyện nói thường xuyên hơn để phát âm rõ và phản xạ tốt hơn ạ.`,
    WEAK: `Phần thi nói của con còn cần cải thiện, con còn rụt rè và phát âm chưa thật rõ ạ. Con nên luyện nói tiếng Anh nhiều hơn ở nhà, kể cả những câu đơn giản, để tự tin hơn ạ.`,
  },
};

// ─── MODE 2 CATEGORY GROUPS ─────────────────────────────────────────────────
const CAT_GROUPS = [
  {
    title: "Thái độ & Tập trung",
    cats: [
      {
        id: "attitude",
        label: "Thái độ học tập trong lớp",
        opts: {
          TOT: "Bé có thái độ học tập rất tốt ạ. Em quan sát thấy bé ngoan, chăm chú lắng nghe và tích cực tham gia các hoạt động trong lớp ạ.",
          ON: "Thái độ học tập của bé nhìn chung ổn ạ. Bé nghe bài tuy nhiên đôi khi còn mất tập trung hoặc làm việc riêng một chút ạ.",
          CAN: "Thái độ học tập của bé cần cải thiện ạ. Em thấy bé hay nói chuyện riêng, chưa thật sự tập trung vào bài học trên lớp ạ.",
        },
      },
      {
        id: "focus",
        label: "Khả năng tập trung",
        opts: {
          TOT: "Bé tập trung rất tốt trong suốt buổi học ạ. Bé ít bị phân tâm và luôn chú ý theo dõi bài giảng ạ.",
          ON: "Bé tập trung được ở mức ổn ạ. Tuy nhiên đôi khi bé còn dễ bị phân tâm, nhất là vào cuối buổi học ạ.",
          CAN: "Khả năng tập trung của bé còn cần cải thiện ạ. Bé thường xuyên mất tập trung, ảnh hưởng đến việc tiếp thu bài ạ.",
        },
      },
      {
        id: "interact",
        label: "Tương tác với bạn và thầy cô",
        opts: {
          TOT: "Trên lớp bé khá hòa đồng với bạn bè ạ. Bé chủ động phát biểu, hỏi bài và hỗ trợ các bạn trong nhóm ạ.",
          ON: "Trên lớp bé hòa đồng với bạn bè ạ. Bé trả lời khi được hỏi nhưng chưa chủ động xung phong phát biểu nhiều ạ.",
          CAN: "Bé còn hơi rụt rè với bạn bè trên lớp ạ. Bé ít phát biểu và chưa chủ động tham gia các hoạt động trên lớp ạ.",
        },
      },
    ],
  },
  {
    title: "Hiểu bài & Kiến thức",
    cats: [
      {
        id: "comprehension",
        label: "Khả năng nắm bài học",
        opts: {
          TOT: "Bé nắm bài rất tốt ạ. Em thấy bé hiểu bài nhanh, làm bài tập đúng và biết áp dụng kiến thức vào các tình huống khác nhau ạ.",
          ON: "Bé nắm bài ở mức ổn ạ. Bé hiểu được nội dung chính nhưng đôi khi cần thầy cô giải thích thêm ở một số phần ạ.",
          CAN: "Khả năng nắm bài của bé cần cải thiện ạ. Bé còn tiếp thu chậm, hay cần được nhắc lại và hướng dẫn thêm mới hiểu bài ạ.",
        },
      },
      {
        id: "pronunciation",
        label: "Phát âm từ vựng mới",
        opts: {
          TOT: "Bé phát âm từ vựng mới rất tốt ạ. Mỗi khi gặp từ mới, em thấy bé chịu khó đọc và phát âm chính xác, chuẩn ạ.",
          ON: "Bé phát âm từ vựng ở mức ổn ạ. Bé đọc được hầu hết từ mới tuy nhiên một số từ khó bé vẫn còn phát âm chưa thật chính xác ạ.",
          CAN: "Phát âm từ vựng của bé cần được cải thiện ạ. Bé còn hay phát âm sai nhiều từ mới, cần luyện tập thêm ở nhà ạ.",
        },
      },
      {
        id: "grammarKnow",
        label: "Nắm ngữ pháp khóa hiện tại",
        opts: {
          TOT: "Bé nắm ngữ pháp khóa này rất tốt ạ. Bé áp dụng đúng cấu trúc, ít mắc lỗi và làm bài tập ngữ pháp chính xác ạ.",
          ON: "Bé nắm ngữ pháp ở mức ổn ạ. Bé hiểu cấu trúc cơ bản nhưng đôi khi còn nhầm lẫn hoặc quên một vài chi tiết nhỏ ạ.",
          CAN: "Bé chưa nắm vững ngữ pháp khóa này ạ. Bé còn hay mắc lỗi khi dùng cấu trúc, cần ôn lại kỹ hơn ạ.",
        },
      },
    ],
  },
  {
    title: "Kỹ năng tiếng Anh",
    cats: [
      {
        id: "speaking2",
        label: "Giao tiếp tiếng Anh / Nói",
        opts: {
          TOT: "Bé giao tiếp tốt, nói tiếng Anh rõ ràng và phát âm khá chuẩn ạ. Bé chủ động tham gia phát biểu trong lớp ạ.",
          ON: "Bé giao tiếp được những câu đơn giản, trả lời được câu hoàn chỉnh có chủ ngữ vị ngữ ạ. Tuy nhiên bé còn nói nhỏ và khá rụt rè ạ.",
          CAN: "Bé giao tiếp còn khá yếu ạ. Bé hiểu câu hỏi nhưng còn ngại trả lời và ít chủ động dùng tiếng Anh trong lớp ạ.",
        },
      },
      {
        id: "confidence",
        label: "Mức độ tự tin khi phát biểu",
        opts: {
          TOT: "Bé rất tự tin khi phát biểu ạ. Bé mạnh dạn giơ tay, nói to rõ ràng và không ngại mắc lỗi ạ.",
          ON: "Bé tự tin ở mức ổn ạ. Bé trả lời được khi được gọi tuy nhiên chưa chủ động xung phong và đôi khi còn ngập ngừng ạ.",
          CAN: "Bé còn thiếu tự tin khi phát biểu ạ. Bé hay nói nhỏ, rụt rè và thường chờ thầy cô mời mới chịu trả lời ạ.",
        },
      },
      {
        id: "listening2",
        label: "Kỹ năng Nghe",
        opts: {
          TOT: "Kỹ năng nghe của bé rất tốt ạ. Bé nghe hiểu nội dung bài, nắm bắt thông tin chính xác và làm bài nghe tốt ạ.",
          ON: "Kỹ năng nghe của bé ổn ạ. Bé hiểu được nội dung cơ bản nhưng đôi khi còn bỏ sót một số chi tiết nhỏ ạ.",
          CAN: "Kỹ năng nghe của bé cần cải thiện ạ. Bé còn khó bắt kịp tốc độ bài nghe và hay bỏ sót thông tin quan trọng ạ.",
        },
      },
      {
        id: "reading2",
        label: "Kỹ năng Đọc hiểu",
        opts: {
          TOT: "Kỹ năng đọc hiểu của bé rất tốt ạ. Bé đọc bài nhanh, hiểu nội dung và trả lời chính xác các câu hỏi đọc hiểu ạ.",
          ON: "Kỹ năng đọc hiểu của bé ổn ạ. Bé hiểu được ý chính nhưng đôi khi cần thêm thời gian để xử lý thông tin chi tiết ạ.",
          CAN: "Kỹ năng đọc hiểu của bé cần cải thiện ạ. Bé còn gặp khó khăn khi đọc đoạn văn dài và hay hiểu sai ý câu hỏi ạ.",
        },
      },
      {
        id: "writing2",
        label: "Kỹ năng Viết",
        opts: {
          TOT: "Kỹ năng viết của bé rất tốt ạ. Bé viết câu đúng ngữ pháp, dùng từ đa dạng và trình bày ý rõ ràng ạ.",
          ON: "Kỹ năng viết của bé ổn ạ. Bé viết được câu hoàn chỉnh tuy nhiên đôi khi còn sai ngữ pháp nhỏ hoặc dùng từ chưa chính xác ạ.",
          CAN: "Kỹ năng viết của bé cần cải thiện ạ. Bé còn hay viết sai ngữ pháp, câu chưa hoàn chỉnh và vốn từ dùng trong bài còn hạn chế ạ.",
        },
      },
    ],
  },
  {
    title: "Bài tập về nhà",
    cats: [
      {
        id: "hwReminder",
        label: "Bài tập trong cuốn Reminder",
        opts: {
          TOT: "Bài tập trong cuốn Reminder bé hoàn thành đầy đủ và cẩn thận ạ. Em thấy bé làm bài sạch sẽ, đúng hạn ạ.",
          ON: "Bài tập trong cuốn Reminder bé hoàn thành tương đối ạ. Tuy nhiên đôi khi còn thiếu một vài bài nhỏ ạ.",
          CAN: "Bé còn thiếu khá nhiều bài tập trong cuốn Reminder ạ. Nhờ mẹ nhắc bé hoàn thành đầy đủ để củng cố kiến thức ạ.",
        },
      },
      {
        id: "hwSmart",
        label: "Bài tập trên hệ thống Smart Learning",
        opts: {
          TOT: "Bài tập trên hệ thống Smart Learning bé hoàn thành đầy đủ ạ. Bé làm bài đúng hạn và kết quả tốt ạ.",
          ON: "Bài tập trên Smart Learning bé hoàn thành phần lớn ạ. Tuy nhiên vẫn còn một vài bài chưa nộp ạ.",
          CAN: "Bài tập trên hệ thống Smart Learning của bé còn thiếu khá nhiều bài ạ. Nhờ mẹ nhắc bé vào hệ thống làm bài đầy đủ hơn ạ.",
        },
      },
    ],
  },
];

// ─── DATE REGEX ─────────────────────────────────────────────────────────────
const DATE_RE = /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[0-2])(\/\d{2,4})?$/;

// ─── CALENDAR LABELS ────────────────────────────────────────────────────────
const VN_WEEKDAYS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const VN_MONTHS = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

// ─── MODE 4: SCORE FIELDS ───────────────────────────────────────────────────
const M4_FIELDS = {
  project1: { label: "Project 01", vi: "Dự án 1", score: 0, denom: 100 },
  project2: { label: "Project 02", vi: "Dự án 2", score: 0, denom: 100 },
  vgrw: { label: "Vocabulary / Grammar / Reading / Writing", vi: "Ngữ pháp và Từ vựng", score: 0, denom: 30 },
  vocab: { label: "Vocabulary", vi: "Từ vựng", score: 0, denom: 10 },
  grammar: { label: "Grammar", vi: "Ngữ pháp", score: 0, denom: 10 },
  reading: { label: "Reading", vi: "Đọc hiểu", score: 0, denom: 5 },
  writing: { label: "Writing", vi: "Viết", score: 0, denom: 5 },
  speaking: { label: "Speaking", vi: "Kĩ năng Nói", score: 0, denom: 60 },
  listening: { label: "Listening", vi: "Kĩ năng Nghe", score: 0, denom: 10 },
  homework: { label: "Homework", vi: "Bài tập về nhà", score: 0, denom: 10 },
  total: { label: "Course Total", vi: "Tổng điểm", score: 0, denom: 100 },
};

// ─── MODE 4: CÂU NHẬN XÉT TỰ ĐỘNG THEO KỸ NĂNG ──────────────────────────────
// Bộ câu RIÊNG của Mode 4 (không dùng chung SKILL_TIER_PHRASES của Mode 1).
// Mức: EXCELLENT ≥85 · GOOD ≥70 · AVERAGE ≥50 · WEAK <50 (xem m4SkillTier).
const M4_SKILL_PHRASES = {
  listening: {
    EXCELLENT: `Bài thi nghe của con rất tốt. Con nghe được nội dung chính cũng như nắm được các chi tiết quan trọng trong bài.`,
    GOOD: `Về phần nghe, con làm khá tốt, con nắm được phần lớn ý chính và chi tiết của bài. Con cần luyện tập thêm để nghe được các chi tiết nhỏ trong bài nha.`,
    AVERAGE: `Về phần nghe, con hiểu được phần lớn nội dung của bài. Tuy nhiên con cần đầu tư thêm thời gian luyện tập để đạt kết quả tốt hơn.`,
    WEAK: `Kỹ năng nghe của con còn hạn chế, con chưa nắm rõ được nội dung và các chi tiết trong bài nghe. Con cần luyện nghe thêm để quen dần với tốc độ và phát âm.`,
  },
  speaking: {
    EXCELLENT: `Kỹ năng nói của con rất tốt. Con giao tiếp to rõ, phát âm chính xác, trả lời đúng trọng tâm câu hỏi và có phản xạ nhanh.`,
    GOOD: `Ở bài thi nói, con nói tốt, phát âm chính xác và trả lời đúng trọng tâm của câu hỏi. Tuy nhiên con cần luyện tập nhiều hơn để có phản xạ nhanh hơn và hạn chế vấp khi nói.`,
    AVERAGE: `Ở bài thi nói, con đã giao tiếp được những câu cơ bản, tuy nhiên con còn vấp và chưa thật sự tự tin. Con cần luyện nói thường xuyên hơn để cải thiện phát âm và phản xạ tốt hơn.`,
    WEAK: `Phần thi nói của con còn cần cải thiện, con còn rụt rè và phát âm chưa thật rõ. Con nên luyện nói tiếng Anh nhiều hơn ở nhà, bắt đầu từ những câu đơn giản để tự tin hơn. Con cũng cần chịu khó đọc từ vựng mới nhiều hơn để cải thiện phát âm nhé.`,
  },
  vocab: {
    EXCELLENT: `Ở phần từ vựng, con nắm vững phần từ vựng của khóa này. Con nhớ và hiểu rõ nghĩa của các từ cũng như biết cách sử dụng từ cho đúng ngữ cảnh.`,
    GOOD: `Về phần từ vựng, con làm khá tốt, con nhớ đa số từ vựng của khóa. Tuy nhiên còn một vài từ con chưa nắm rõ nghĩa hoặc chưa biết cách sử dụng cho đúng ngữ cảnh.`,
    AVERAGE: `Về từ vựng, con đã nhớ được và nắm rõ đa số các từ cơ bản của khóa. Tuy nhiên con còn quên một số từ và chưa vận dụng tốt vào bài. Con cần ôn từ vựng đều đặn mỗi ngày để nhớ lâu hơn.`,
    WEAK: `Phần từ vựng của con còn hạn chế, con chưa nhớ được nhiều từ trong khóa học cũng như chưa nắm rõ nghĩa và cách dùng từ cho đúng ngữ cảnh. Con cần học từ vựng mỗi ngày và làm thêm bài tập để củng cố vốn từ vựng.`,
  },
  grammar: {
    EXCELLENT: `Về phần ngữ pháp, con đạt kết quả xuất sắc, con nắm rõ và biết cách áp dụng các cấu trúc ngữ pháp đã học vào bài thi một cách chính xác và linh hoạt.`,
    GOOD: `Ở bài thi ngữ pháp, con làm khá tốt, con hiểu cách dùng các cấu trúc ngữ pháp và vận dụng khá tốt vào bài. Tuy nhiên con cần cẩn thận hơn khi làm bài để tránh sai những lỗi không đáng có.`,
    AVERAGE: `Về ngữ pháp, con nắm được lý thuyết cơ bản nhưng chưa thật sự linh hoạt khi áp dụng vào bài tập. Con cần chịu khó làm thêm bài tập để nắm chắc kiến thức hơn và biết cách vận dụng vào bài.`,
    WEAK: `Phần ngữ pháp của con còn khá yếu, con chưa nắm rõ các cấu trúc ngữ pháp và còn nhầm lẫn khi áp dụng vào bài. Con cần ôn lại lý thuyết từng cấu trúc và luyện tập thường xuyên để ghi nhớ cách dùng chính xác hơn.`,
  },
  reading: {
    EXCELLENT: `Con đạt kết quả xuất sắc ở bài thi đọc hiểu. Con hiểu và nắm rõ nội dung của bài đọc.`,
    GOOD: `Về phần đọc hiểu, con làm tốt, con hiểu được nội dung chính của bài. Con cần chú ý thêm một số chi tiết nhỏ trong bài để đạt kết quả tốt hơn.`,
    AVERAGE: `Về phần đọc hiểu, con hiểu được phần lớn nội dung của bài. Tuy nhiên con cần luyện đọc thêm để hiểu được những chi tiết nhỏ trong bài và tư duy suy luận từng câu hỏi.`,
    WEAK: `Kỹ năng đọc hiểu của con còn hạn chế, con chưa nắm được rõ nội dung của bài đọc. Con cần luyện đọc các bài đọc ngắn mỗi ngày và học thêm từ vựng theo chủ đề để cải thiện kỹ năng Reading hơn.`,
  },
  writing: {
    EXCELLENT: `Bài thi viết của con rất tốt. Bài viết của con đầy đủ ý, bố cục rõ ràng và không mắc lỗi chính tả hay ngữ pháp.`,
    GOOD: `Ở bài thi viết, con làm khá tốt. Bài viết của con đủ ý, trả lời đúng yêu cầu đề, tuy nhiên con cần chú ý lỗi chính tả và ngữ pháp hơn.`,
    AVERAGE: `Ở bài thi viết, con có ý tưởng, diễn đạt được ý nhưng còn mắc lỗi ngữ pháp và chính tả. Con cần luyện viết thêm và kiểm tra kỹ trước khi nộp bài.`,
    WEAK: `Phần viết của con còn cần cải thiện, con chưa diễn đạt được ý đầy đủ và còn mắc nhiều lỗi. Con cần luyện viết thường xuyên hơn và xem lại cấu trúc câu cơ bản.`,
  },
};
