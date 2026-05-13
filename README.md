# 📚 TA Report Helper

> A lightweight web tool that helps Teaching Assistants at Vietnamese English centers draft monthly progress reports and end-of-course exam feedback for parents — fast, structured, and with a natural Vietnamese tone.

[![Made with HTML](https://img.shields.io/badge/Made%20with-HTML-orange)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)](https://tailwindcss.com/)
[![Gemini API](https://img.shields.io/badge/AI-Gemini%202.5-blue)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## 🎯 About

At Vietnamese English centers, Teaching Assistants (TAs) are required to send monthly progress reports to every parent, plus end-of-course exam feedback every 3 months. With 20–30 students per class, hand-writing personalized feedback for each child takes hours — and writing too briefly often leads to parent complaints.

**TA Report Helper** is a single-page web app that solves this by:

- ✅ Pre-built phrasings for the most common student situations (39+ templates)
- ✅ Two structured report modes: monthly progress and end-of-course exam
- ✅ Optional AI rewriting via Google Gemini for more variety and natural tone
- ✅ Automatic privacy protection — real names are redacted before any AI call
- ✅ Auto-generated internal TA Log summary for back-office reporting

Output is in Vietnamese (the language used between TAs and parents in Vietnam). The interface itself is also Vietnamese.

---

## ✨ Features

### 📊 Two report modes

- **End-of-course exam report**: Input scores for 6 skills (Vocab, Grammar, Listening, Reading, Writing, Speaking). The app auto-classifies each skill into 4 performance tiers and generates skill-specific feedback.
- **Monthly progress report**: Select options across 13 categories (attitude, focus, communication, comprehension, homework completion, etc.). Each category × tier combination maps to a hand-crafted Vietnamese phrasing.

### 🤖 Optional AI integration

- **✨ Rewrite with AI**: Diversifies phrasing while keeping a formal, polite register.
- **💬 Humanize**: Trims redundancy and produces shorter, more conversational sentences — closer to how a real TA texts a parent.
- Both modes use Google Gemini 2.5 with a free API key (250 requests/day on Flash).
- Auto-fallback from Pro to Flash when the Pro tier returns rate-limit errors (which happens often on free tier).

### 🔒 Privacy by design

- Student's real name is automatically replaced with a nickname before any API call.
- Phone numbers and Vietnamese ID patterns are stripped as defense-in-depth.
- API key is stored only in the browser's `localStorage` — never transmitted to anything other than the Gemini endpoint.
- First-time disclaimer modal explicitly warns users about AI responsibility and sensitive data.

### 📝 Workflow extras

- Auto-generated short TA Log for internal back-office reporting.
- One-click copy for both the parent message and the TA Log.
- Persistent settings (nickname, callback time slot, AI model preference) saved in `localStorage`.

---

## 🚀 Getting Started

### Option 1: Open the file directly (simplest)

1. Download `index.html`.
2. Double-click to open it in any modern browser.
3. That's it — no installation, no build step.

### Option 2: Local server

```bash
# Python
python3 -m http.server 5500

# Or Node.js
npx serve .
```

Then open `http://localhost:5500`.

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
2. Paste your API key.
3. Select a model (Flash is recommended).
4. Save.

### Step 3: Use the AI buttons

After generating a report, click **✨ Rewrite with AI** or **💬 Humanize**. Use **↩ Revert** to go back to the original rule-based output anytime.

### Model comparison

| Model | Free quota | Notes |
|---|---|---|
| ⚡ **Flash** (recommended) | 250 req/day | Fast, stable, plenty for one class |
| 🚀 Flash Lite | 1000 req/day | Fastest, slightly lower writing quality |
| 🎯 Pro | 100 req/day | Highest quality, but often returns 429 because Google deprioritizes free-tier Pro |

---

## 🛠 Tech Stack

- **HTML5 + Vanilla JavaScript** — no framework, no build step
- **Tailwind CSS** via CDN
- **Google Gemini API** — optional, client-side calls only
- **localStorage** — for user preferences and API key

Everything is contained in a single `index.html` file. No dependencies to install, no backend, fully client-side.

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
- The redacted message (with nickname instead of real name) is sent to Google's servers.
- On Gemini's free tier, Google **may use prompts for model training** per their Terms of Service.
- For complete privacy, upgrade to Gemini's paid tier (~$0.01/month for typical usage) — Google contractually does not train on paid-tier data.

The redaction is solid for free-tier use, but understand what you're sending if your center has strict data policies.

---

## 🤝 Contributing

This is a personal project, but contributions are welcome — especially from other TAs.

Particularly useful contributions:
- Phrasings tuned for other Vietnamese English centers (Yola, ILA, VUS, Apollo, ACET, etc.)
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
- Developed with assistance from [Claude](https://claude.com) and [Claude Code](https://claude.com/code)

---

<div align="center">

**If this app saves you time, a ⭐ on GitHub would mean a lot 💙**

Made with ❤️ for Vietnamese English Teaching Assistants

</div>
