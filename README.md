# Prajna - AI-Powered Coding & DSA Platform

Prajna (Sanskrit: प्रज्ञा) means **"supreme intelligence, wisdom, or understanding"**. It is a modern, beautiful, responsive, and production-ready coding and DSA platform inspired by LeetCode, Codeforces, and HackerRank. It features real-time local code execution, an interactive AI Coding Coach, weekly virtual contests, company-specific preparation guides, technical mock interviews, and automated resume analysis.

Designed to be lightweight and run seamlessly on low-resource hardware (like a 2GB RAM laptop), Prajna avoids heavy node compilation/build setups by using browser-based standalone compilation, keeping the entire project under **50MB**!

---

## 🚀 Key Features

1. **Dashboard & Gamification**:
   - Track accepted solves, daily activity streaks, coins, and XP.
   - Unlocked milestone badges (e.g. *Algorithm Master*, *Contest Winner*).
   - Dynamic GitHub-style **365-Day Activity Heatmap Grid**.
   - **Weekly Coding Analytics** line graph (auto-locked with an overlay instruction until the user attempts their first question).

2. **Split-Pane Coding Playground**:
   - Loaded with the professional **Monaco Editor** (VS Code engine) fetching from CDN, custom font configurations (JetBrains Mono).
   - **Local Code Sandbox**: Instantly executes Python code locally, capturing stdout/stderr and handling infinite loops with a strict `2.5s` CPU timeout (TLE).
   - Fallback simulated compiler for other languages (C++, JS, Java) to keep the layouts fully active.

3. **Interactive AI Coding Coach Chatbot**:
   - Converted playground sidebar into an **AI Chat Coach**. Users can ask follow-up questions about their code or the problem.
   - In-browser markdown renderer parses bullet points, headers, inline highlights, and multi-line code blocks into styled HTML elements.
   - Preset quick actions: **Get Hint** (progressive hints, never gives away the solution), **Explain Code**, and **Optimize Code**.

4. **Virtual timed Contests**:
   - Timer-based contests with automated point calculations (Easy: 100, Medium: 200, Hard: 300).
   - Real-time global contest leaderboards sorting by score and finished duration.

5. **Company Preparation Sheets**:
   - Curated DSA sheets for **Google, Meta, Amazon, Microsoft, Netflix, and Goldman Sachs**.
   - In-depth FAANG interview tips, key DSA topics focus, and platform mock preparation FAQs.

6. **AI Mock Technical Interview**:
   - Simulates professional technical interviews. Select role (e.g. AI Engineer, Backend Architect) and topic (e.g. System Design, Graphs).
   - Chat-based interviewer asks sequential questions, evaluates replies, and generates a **Performance Report** with a mock score out of 10.

7. **AI Resume Feedback**:
   - Paste resume text against target job descriptions. The AI returns missing keywords, formatting suggestions, and quantifies bullet points.

8. **Canvas Certificate Downloader**:
   - Compiles user name, coding level, solves count, and verification signatures directly on an HTML5 canvas, outputting a high-res PNG certificate image client-side.

---

## 🛠️ Technology Stack

- **Frontend**:
  - **React + TailwindCSS + Monaco Editor** UMD libraries loaded via CDN.
  - **Babel Standalone**: Compiles JSX on-the-fly in the browser (eliminates heavy `node_modules` folders and local bundling wait times).
  - **Chart.js**: Render line graphs for weekly coding activity.
- **Backend**:
  - **FastAPI (Python)**: High-speed, modern ASGI framework.
  - **SQLAlchemy (SQLite)**: Database models with automated seeder populators (14+ standard DSA challenges).
- **AI Core**:
  - **Groq API**: Primary LLM engine using the state-of-the-art `llama-3.3-70b-versatile` model (average response: **0.5 seconds**).
  - **Gemini 1.5 Flash API**: Dual fallback support in case Groq keys are unset.

---

## 📁 Project Directory Structure

```text
ai-coding-dsa-platform/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── endpoints/
│   │   │   │   ├── admin.py         # Admin controls, database statistics
│   │   │   │   ├── ai.py            # AI endpoints (explain, roadmap, chatbot)
│   │   │   │   ├── auth.py          # JWT authentication, registration
│   │   │   │   ├── contests.py      # Contest management, registration
│   │   │   │   ├── problems.py      # DSA challenges fetch
│   │   │   │   ├── profile.py       # User profiles, solved status metrics
│   │   │   │   └── submissions.py   # Subprocess code run and test evaluation
│   │   │   └── router.py            # Main API router registry
│   │   ├── core/
│   │   │   ├── config.py            # Settings loader (JWT secret, API keys)
│   │   │   ├── database.py          # SQLite engine & database sessions
│   │   │   ├── security.py          # Password hashing, JWT validators
│   │   │   └── seeder.py            # Database seeder (seeds 14+ DSA problems)
│   │   ├── models/
│   │   │   └── user.py              # User, Problems, Submissions database tables
│   │   ├── services/
│   │   │   ├── execution.py         # Subprocess runner (synchronous thread-pools)
│   │   │   └── gemini.py            # AI API Client wrapper (Groq + Gemini UMD)
│   │   ├── static/                  # Static frontend files
│   │   │   ├── app.js               # Consolidated React pages & chatbot logic
│   │   │   ├── index.html           # Main HTML, CSS custom rules, CDN assets
│   │   │   ├── manifest.json        # PWA mobile wrapper
│   │   │   └── sw.js                # Service worker declaration
│   │   └── main.py                  # Lifespan startup seeder, middleware, static mount
│   ├── database.db                  # Auto-generated SQLite database file
│   ├── verify_api.py                # End-to-end integration tester
│   └── requirements.txt             # Lightweight Python package lists
```

---

## 🚀 How to Run the Project Locally

### 1. Setup Virtual Environment (Windows)
Open PowerShell inside the `backend` directory:
```powershell
# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure API Keys & Start Server
Set your API keys and launch uvicorn:
```powershell
# Set API Keys
$env:GROQ_API_KEY="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"
$env:GEMINI_API_KEY="AQ.Ab8RN6JgRB9adVhdYy0fjJ8HJuYikmM896rFC3NpjP_rvYmsGw"

# Run FastAPI server in hot-reload mode
python -m uvicorn app.main:app --port 8000 --reload
```

### 3. Open Browser
Open your browser and navigate to:
👉 **[http://127.0.0.1:8000/](http://127.0.0.1:8000/)**

---

## 🧪 How to Test and Validate

1. **Verify Backend Services**:
   Run the test script to verify user registration, login, profile retrieval, problem fetching, and local Python code execution sandbox:
   ```powershell
   python verify_api.py
   ```
2. **Verify AI Chat Services**:
   Run the script to test the `/playground/chat` multi-turn chatbot endpoint:
   ```powershell
   python scratch/test_ai_groq.py
   ```
