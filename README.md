# HanExpress 🇰🇷

**Express Yourself Naturally in Korean**

A web application that generates contextual Korean expressions across different formality levels with grammar explanations and cultural insights.

🔗 **[Live Demo](https://hanexpress.vercel.app)**

---

## 🎯 What It Does

Most translation tools give you one Korean translation without context. But Korean has complex formality levels that change based on your relationship with the listener, age differences, and social setting.

**HanExpress generates 4 Korean expressions for any intent:**
- 🎩 **Formal** - Business and unfamiliar people
- 👋 **Informal** - Close friends and peers
- 😊 **Polite-Casual** - Respectful but friendly
- 🔥 **Slang** - Trendy and casual

Each expression includes romanization, grammar explanations, and cultural context so you know *when* and *why* to use it.

---

## ✨ Features

- 🤖 AI-powered Korean expression generation (Groq)
- 📊 Multiple formality levels with context
- 📚 Grammar points and cultural notes
- 🔐 Google sign-in to save expressions
- 💾 History page to review saved expressions
- 🔊 Audio pronunciation (browser TTS)**
- 📱 Responsive design

---

## 🛠️ Tech Stack

**Frontend:** Next.js 15, React 18, Tailwind CSS  
**Backend:** Groq API (LLM inference), Firebase (Auth & Firestore)  
**Deployment:** Vercel

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Groq API key ([console.groq.com](https://console.groq.com))
- Firebase project ([console.firebase.google.com](https://console.firebase.google.com))

### Installation
```bash
# Clone repository
git clone https://github.com/yourusername/hanexpress.git
cd hanexpress

# Install dependencies
npm install

# Create .env.local with your API keys
GROQ_API_KEY=gsk_your_key_here
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure
```
src/
├── app/
│   ├── api/generate-expressions/route.js  # API endpoint
│   ├── history/page.jsx                   # Saved expressions
│   ├── layout.jsx                         # Root layout
│   └── page.jsx                           # Homepage
├── components/
│   ├── Header.jsx                         # Navigation
│   ├── ExpressionInput.jsx                # Input form
│   └── ExpressionCard.jsx                 # Expression display
├── context/
│   └── AuthContext.jsx                    # Firebase auth
└── lib/
    ├── firebase.js                        # Firebase config
    └── groq.js                            # Groq API integration
```

---

## 🔌 API Integration

### Groq API
- **Models:** `llama-3.1-70b-versatile`, 
- **Purpose:** Generate Korean expressions with cultural context
- **Response Time:** 1-3 seconds
- **Free Tier:** Generous limits for learning apps

### Firebase
- **Authentication:** Google OAuth
- **Firestore:** Store saved expressions
- **Security:** User-scoped read/write rules

---

## 🔮 Roadmap

**Coming Soon:**
- 📖 NAVER Dictionary integration (vocabulary definitions)
- 🎙️ NAVER Clova TTS (high-quality audio)
- 🌙 Dark mode

**Future Ideas:**
- Korean input support
- Browser extension
- Mobile app
- Export to Anki/PDF
- Quiz mode
- Spaced repetition system

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

Report bugs or suggest features via [Issues](https://github.com/yourusername/hanexpress/issues).

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- **Groq** - Lightning-fast LLM inference
- **Firebase** - Authentication and database
- **Vercel** - Hosting platform

---

**Made with ❤️ for Korean learners**

*Learning Korean, one expression at a time.* 🇰🇷
