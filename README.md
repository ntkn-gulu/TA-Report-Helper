# 📚 TA Report Helper

> A lightweight web tool that helps Teaching Assistants at Vietnamese English centers draft monthly progress reports, end-of-course exam feedback, homework summaries, and printable score cards for parents — fast, structured, and with a natural Vietnamese tone.

[![Made with HTML](https://img.shields.io/badge/Made%20with-HTML-orange)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)](https://tailwindcss.com/)
[![Gemini API](https://img.shields.io/badge/AI-Gemini%202.5-blue)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

🔗 **Live demo:** https://ntkn-gulu.github.io/TA-Report-Helper/

---

## 🎯 About

At Vietnamese English centers, Teaching Assistants (TAs) are required to send monthly progress reports to every parent, plus end-of-course exam feedback every few months. With 20–30 students per class, hand-writing personalized feedback for each child takes hours — and writing too briefly often leads to parent complaints.

**TA Report Helper** turns that into a few minutes of work. Pick a report type, fill in the scores or tick a few options, and get a polished, parent-ready message or a printable score card. Everything runs in the browser — no install, no backend, no build step.

- ✅ Four report modes covering every routine TA reporting task
- ✅ Dozens of hand-crafted Vietnamese phrasings, auto-selected by performance tier
- ✅ Printable/exportable score cards (PNG, PDF, and whole-class ZIP)
- ✅ Optional AI rewriting via Google Gemini for more variety and a natural tone
- ✅ Automatic privacy protection — real names are redacted before any AI call

The generated output is in Vietnamese (the language used between TAs and parents), and the interface is Vietnamese too.

---

## ✨ Features

The app is organized into **four modes**, selectable from the landing page or the sidebar.

### 1️⃣ End-of-course exam report (message)

Generate a polite parent message from exam scores.

- Enter scores for **6 skills** (Vocabulary, Grammar, Listening, Reading, Writing, Speaking) with a custom max per skill.
- Each skill is auto-classified into **4 performance tiers** (Excellent / Good / Average / Needs work), and a matching, hand-written Vietnamese sentence is selected.
- Vocabulary + Grammar are merged into a single sentence when they land in the same tier, for a more natural read.
- Optional free-text fields for specific grammar mistakes, weak vocabulary topics, and extra notes.
- Produces both the **parent message** and a short **internal TA Log** for back-office records.

### 2️⃣ Monthly progress report (message)

Generate a monthly classroom-behavior message with a few clicks.

- Tick **Good / Okay / Needs improvement** across categories: attitude, focus, class interaction, comprehension, pronunciation, grammar knowledge, the four skills, homework completion, and more.
- Each category × tier maps to a carefully worded Vietnamese phrasing.
- Dedicated field for the course's new grammar point + common errors, with a reminder to review the "Reminder" notebook.
- Also outputs the parent message + internal TA Log.

### 3️⃣ Homework score report (image)

Turn a list of homework scores into a clean, shareable report card.

- Add score rows manually (**Date + Score /10**, up to 20) or pick dates from a **multi-select calendar** that spans multiple months.
- **Real-time validation**: date format (DD/MM or DD/MM/YYYY) and score range (0–10) with inline error highlighting.
- "Not completed" handling — a date with no score is flagged distinctly.
- **Auto-generated remarks**: number completed, overall consistency, highest score, average, and gentle warnings for low/missing scores.
- Edit the remarks freely (supports `**bold**`), then **export the report card as a PNG**.
- Color-coded table: low scores highlighted, incomplete entries marked in red.

### 4️⃣ ILA end-of-course score card (image / PDF / ZIP)

Produce official-looking per-student score cards for a whole class at once.

- **Import scores from a CSV** by pasting text or dropping a file.
- For ILA TAs: an in-app **browser Console command** (with a one-click copy button + step-by-step guide) scrapes the grade table directly from the ILA system and exports the CSV — no manual typing.
- The same command also reads **class metadata** (class code, teacher, TA, start/end dates) and **auto-fills** the card.
- Each card shows the correct **ILA level logo** and an **award stamp** (Best / Passed / Failed), with a manual pass/fail override for borderline cases.
- Score breakdown: Project 1 & 2, VGRW (or split into Vocabulary / Grammar / Reading / Writing), Speaking, Listening, Homework, and Total — toggle which rows appear.
- **Auto-generated per-skill comments** based on each skill's tier, with each skill name **bolded** (e.g. `Kĩ năng Listening:`) so parents can scan the card quickly — merged into one paragraph, or one dash-bulleted line per skill when individual V/G/R/W scores are provided. A "regenerate from scores" button rebuilds the comment anytime. Names and comments are fully editable per student, and manually entered scores (including the split V/G/R/W ones) are stored **per student** — switching cards never loses them.
- **Session autosave** — students, scores, comments, and class info are continuously saved to the browser's `localStorage`. Close the app mid-work and a **"Khôi phục phiên làm việc"** banner offers to restore everything the next time you open Mode 4 (same browser + same app location).
- **Export options**: single **PNG**, single **PDF**, or a **ZIP of the entire class** (one PNG per student).

### 🤖 Optional AI rewriting (message modes)

For the two message modes, polish the rule-based draft with Google Gemini:

- **✨ Rewrite with AI** — diversifies phrasing while keeping a formal, polite register.
- **💬 Humanize** — trims redundancy into shorter, more conversational sentences, closer to how a real TA texts a parent.
- Uses Google Gemini 2.5 with a free API key, and **auto-falls back from Pro to Flash** when the Pro tier hits rate limits.
- **↩ Revert** returns to the original rule-based output anytime.

### 🔒 Privacy by design

- The student's real name is automatically replaced with a nickname **before any API call**.
- Phone numbers and Vietnamese ID-like patterns are stripped as defense-in-depth.
- The API key is stored only in the browser's `localStorage` and is sent only to the Gemini endpoint.
- A first-time disclaimer modal explains AI responsibility and sensitive-data handling.

### 🎨 Interface & quality-of-life

- Clean, Notion-inspired UI (warm paper canvas, single blue accent, Inter font) with an animated landing page.
- Collapsible sidebar to switch modes.
- One-click copy for messages and the TA Log.
- Persistent settings (callback time slot, AI model, dismissed welcome) saved in `localStorage`.
- **💬 Feedback widget** — a floating button where users can rate the app and send suggestions straight to the maintainer.

---

## 🚀 Getting Started

### Option 1: Use the live demo (simplest)

Just open 👉 **https://ntkn-gulu.github.io/TA-Report-Helper/**

### Option 2: Run it locally

Because the app is split into a few files (`index.html`, `css/`, `js/`, `assets/`), download or clone the whole repo, then either:

```bash
# open index.html directly in a browser, OR serve it locally:
python3 -m http.server 5500      # Python
npx serve .                      # Node.js
```

Then open `http://localhost:5500`. No installation and no build step — it's a pure static site.

---

## 🤖 AI Setup (Optional)

The app works perfectly without AI — the rule-based phrasings alone produce solid reports. Enable AI only if you want extra variety.

### Step 1: Get a free Gemini API key

1. Go to [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey).
2. Sign in with a Google account.
3. Click **"Create API key"**, pick (or create) a project, and copy the key.
4. **No credit card required.**

### Step 2: Enter the key

1. Open the app, click the **⚙️** icon in the top-right.
2. Paste your API key, select a model (Flash is recommended), and save.

### Step 3: Use the AI buttons

After generating a message report, click **✨ Rewrite with AI** or **💬 Humanize**. Use **↩ Revert** to undo.

### Model comparison

| Model | Free quota | Notes |
|---|---|---|
| ⚡ **Flash** (recommended) | ~250 req/day | Fast, stable, plenty for one class |
| 🚀 Flash Lite | ~1000 req/day | Fastest, slightly lower writing quality |
| 🎯 Pro | ~100 req/day | Highest quality, but often rate-limited on free tier (auto-falls back to Flash) |

---

## 🛠 Tech Stack

- **HTML5 + Vanilla JavaScript** — no framework, no build step
- **Tailwind CSS** via CDN
- **html2canvas** — render report cards to images
- **jsPDF** — single-card PDF export
- **JSZip** — whole-class ZIP export
- **Google Gemini API** — optional, client-side calls only
- **localStorage** — user preferences and API key

Structure: `index.html` + `css/report-card.css` + a small set of `js/` modules (one per mode, plus shared config/utilities) + `assets/`. Fully client-side — no backend.

---

## ⚠️ Important Notes

### This is an assistance tool, not a replacement

The app is designed to **save typing time**, not to replace the TA's judgment. Best practices:

- ✅ Always read the generated output before sending to parents
- ✅ Add personal observations specific to each child (favorite lessons, personality, in-class moments)
- ✅ Edit anything that doesn't match the actual situation
- ❌ Never paste the raw output verbatim without review
- ❌ Never enter phone numbers, addresses, or other sensitive PII into the notes fields

### Privacy considerations when using AI

When you click an AI button:
- The redacted message (with a nickname instead of the real name) is sent to Google's servers.
- On Gemini's free tier, Google **may use prompts for model training** per their Terms of Service.
- For complete privacy, use Gemini's paid tier — Google contractually does not train on paid-tier data.

The redaction is solid for free-tier use, but understand what you're sending if your center has strict data policies.

---

## 🤝 Contributing

This is a personal project, but contributions are welcome — especially from other TAs.

Particularly useful contributions:
- Phrasings tuned for other Vietnamese English centers (Yola, VUS, Apollo, ACET, etc.)
- AI prompt refinements for specific writing styles
- Bug fixes and UX improvements

Open an Issue or PR anytime.

---

## 📄 License

MIT License — free to use, modify, and share.

---

## 🙏 Credits

- Built to solve the daily reporting workload faced by TAs at English centers in Ho Chi Minh City
- Powered by [Google Gemini](https://ai.google.dev/) for the optional AI features
- A big shout-out to [Claude](https://claude.com) and [Claude Code](https://claude.com/code) for the development assistance 💙

---

<div align="center">

**If this app saves you time, a ⭐ on GitHub would mean a lot 💙**

Made with ❤️ for Vietnamese English Teaching Assistants

</div>
