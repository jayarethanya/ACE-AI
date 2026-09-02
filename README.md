# ACE AI - AI-Powered Event Intelligence Platform
> *"AI-Powered Event Intelligence for a Brighter Future"*  
> **HackGURU AI Solution Area 2.1: Personalized Event Recommendation**

---

## 🌟 Executive Overview
**ACE AI** is a fully functional, production-ready AI-powered platform designed to connect university students with hackathons, workshops, conferences, and competitions that match their exact skills, interests, department, career aspirations, and physical location.

Instead of generic or static listings, ACE AI implements a **real mathematical recommendation engine** combining **TF-IDF Vectorization, Cosine Similarity, Jaccard Skill Overlap, Career Semantic Alignment, and Active Behavioral Signals (Active View Duration, Saves, Registrations, and Category Affinity)**.

---

## 🔬 Mathematical Recommendation Formulation

All recommendation percentages are computed dynamically using the weighted formula:

$$\text{Final Score} = 0.27 \times S_{\text{skill}} + 0.18 \times S_{\text{interest}} + 0.18 \times S_{\text{career}} + 0.09 \times S_{\text{location}} + 0.18 \times S_{\text{tfidf}} + 0.10 \times S_{\text{behavior}}$$

### Component Breakdown:
1. **Skill Match ($S_{\text{skill}}$, 27%)**: Jaccard similarity and coverage of required event skills against student profile skills:
   $$S_{\text{skill}} = \frac{|\text{Student Skills} \cap \text{Event Skills}|}{|\text{Event Skills}|} \times 100$$
2. **Interest Match ($S_{\text{interest}}$, 18%)**: Keyword and conceptual density matching across category, title, tags, and description.
3. **Career Goal Match ($S_{\text{career}}$, 18%)**: Fuzzy alignment between student career target (e.g. *Machine Learning Engineer*) and event career relevance tracks.
4. **Location Match ($S_{\text{location}}$, 9%)**: 100% for exact city match or flexible online events; 75% for hybrid; 40% for distant in-person events.
5. **Content Similarity ($S_{\text{tfidf}}$, 18%)**: Sublinear TF-IDF vectors generated from tokenized profile text and event text, measured via Cosine Similarity:
   $$\text{Cosine}(\vec{u}, \vec{v}) = \frac{\sum u_i v_i}{\sqrt{\sum u_i^2} \sqrt{\sum v_i^2}} \times 100$$
6. **Behavioral Interest ($S_{\text{behavior}}$, 10%)**: Active duration tracking ($0-10\text{s} \to 5\%$, $10-30\text{s} \to 15\%$, $30-60\text{s} \to 30\%$, $60-120\text{s} \to 50\%$, $120+\text{s} \to 70\%$), bookmarks ($+15\%$), registrations ($+25\%$), and search query affinity.

---

## 🎯 Switchable Demo Personas

ACE AI provides an instant top demo bar allowing judges and reviewers to switch personas and witness **real-time dynamic recommendation re-ranking**:

| Persona | Domain | Skills | Career Goal | Top Ranked Event | Match % |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **Jaya Sundaram** | AI & Data Science | Python, Machine Learning, Pandas | ML Engineer | *AI Healthcare Hackathon 2026* | **~94%** |
| **Alex Chen** | Computer Science | HTML, CSS, JavaScript, React | Frontend Developer | *Modern Web Dev & React Challenge* | **~93%** |
| **Samira Patel** | Cyber Security | Python, Networking, Linux | Cyber Security Analyst | *CyberDefend National Hackathon* | **~95%** |
| **Dr. K. Raman** | Organizer Suite | Event Lead & Dean of Innovation | - | *Organizer Hub with AI Analysis* | - |

---

## ⚡ Key Features

1. **Explainable AI Scorecard ("Why Recommended?")**: Transparent breakdown showing exact scores across all 6 factors, matching factors checklist, and honest natural-language AI explanations.
2. **Skill Gap Diagnostics**: Analyzes readiness for competitions and highlights missing skills with links to curated bridging workshops.
3. **Privacy-Preserving Active Time Tracking**: Tracks active engagement only within ACE AI; automatically pauses when the browser tab is hidden or minimized.
4. **Organizer AI Event Analyzer**: Organizers can input raw title and description to auto-generate Smart Category, Skill Tags, Difficulty level, Target Audience, and Career relevance.
5. **Multi-Filter & Search Tracking**: Filter by Category, Location, Mode, Difficulty, and Skills while logging search signals.
6. **Delegate Pass & Bookmarking**: One-click registration with confirmation IDs and personal bookmark management.

---

## 🚀 How to Run

### Option 1: One-Click Launcher (Windows)
Double-click `start.bat` in this folder. It starts the local PowerShell HTTP server on port 8000 and opens your default browser.

### Option 2: PowerShell Direct Command
```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File server.ps1
```
Navigate to: `http://localhost:8000`

### Option 3: Direct File Opening
Open `index.html` directly in any modern web browser (Chrome, Edge, Firefox, Brave).
