# ⏱️ TimeWeave — Remote Team Meeting Planner

**TimeWeave** is a zero-dependency, client-side SaaS tool that helps remote teams find the best meeting times across any timezone — visually, instantly, without signing up.

## ✨ Features

- 🌍 **50+ IANA timezones** — covers every major city globally
- 🗓️ **Visual 24-hour grid** — see each team member's working hours overlaid side by side
- ✅ **Automatic overlap detection** — highlights windows where everyone's free
- ⭐ **Best window finder** — cycles through the top slots for your chosen meeting duration
- 💾 **Persistent** — team saved in `localStorage`, survives page refresh
- 📋 **One-click export** — pretty-prints the schedule to copy into Slack / Notion / email
- ⚡ **Zero API keys** — uses the browser's built-in `Intl` API for all timezone math

## 🚀 Deploy to Vercel

```bash
# 1. Push this directory to a GitHub repo
# 2. Import on vercel.com → Framework: Other → Root: ./
# 3. Deploy — done!
```

Or use the CLI:
```bash
npx vercel --prod
```

## 🛠️ Local Development

Just open `index.html` in a browser — no build step needed.

Or use any static file server:
```bash
npx serve .
# → http://localhost:3000
```

## 📁 Project Structure

```
├── index.html     # App shell & markup
├── style.css      # Design system & component styles
├── app.js         # All logic — state, grid, export, localStorage
├── vercel.json    # Vercel static deploy config
└── README.md
```

## 🗺️ Tech Stack

| Layer      | Technology                         |
|------------|------------------------------------|
| Structure  | Semantic HTML5                     |
| Styling    | Vanilla CSS (dark mode, glassmorphism, micro-animations) |
| Logic      | Vanilla ES6+ JavaScript            |
| Fonts      | Inter (Google Fonts)               |
| TZ Math    | `Intl.DateTimeFormat` (browser-native) |
| Persistence| `localStorage`                     |
| Deploy     | Vercel (static)                    |

---
Made with ❤️ — no API keys, no accounts, no nonsense.
