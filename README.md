# CareerLens AI — AI Opportunity Intelligence Platform

> **“Don’t just find opportunities. Discover the opportunities you can become ready for.”**

[![Next.js 16](https://img.shields.io/badge/Next.js-16.3.8-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](#)

---

## 1. Product Vision & Problem Statement

**Problem Statement:** *“AI Opportunity Matcher: Matches students with relevant opportunities.”*

Traditional job boards and college placement portals are passive listings. They present raw internships without explaining:
- Why an opportunity fits you
- What skills you are missing
- How your qualification landscape expands if you learn a specific skill
- Whether an opportunity is verified, active, or fraudulent

**CareerLens AI** is an **AI Opportunity Intelligence Platform** that acts as:
1. **AI Career Navigator:** Ingests projects, code commits, and coursework into an evidence-backed Career DNA.
2. **Opportunity Discovery Engine:** Catalogs 8 distinct categories (Internships, Full-time, Research Fellowships, Hackathons, Fellowships, Scholarships, Competitions, and Apprenticeships).
3. **Explainable 5-Layer Matching Engine:** Breaks down every score into Skills, Projects, Education, Experience, Career Interest, and Eligibility.
4. **"Why not 100%?" Analyzer:** Pinpoints the highest-impact skill gaps preventing a perfect fit.
5. **What-If Opportunity Simulator (Signature WOW Feature):** Simulates how learning AWS, Docker, or AI elevates match percentages and unlocks additional opportunities (e.g. **+17 opportunities unlocked**).
6. **14-Day Action Roadmap:** Daily milestones, practical tasks, effort estimates, and tangible deliverables.
7. **Opportunity Trust & Safety Shield:** Verifies ATS sources, detects suspicious fees (flagging scam Telegram recruiters), and protects student safety.
8. **Opportunity Copilot:** Contextual, grounded AI assistant answering questions about matches and application readiness.

---

## 2. Core Architectural Pipeline

CareerLens AI utilizes a transparent 5-layer pipeline:

```
STUDENT PROFILE
      ↓
[Layer 1: Structured Eligibility Filter] (Graduation year, branch, education, location)
      ↓
[Layer 2: Semantic Matching] (Skills, projects, career goals)
      ↓
[Layer 3: Weighted Ranking Engine] (Skills 40%, Projects 20%, Interest 15%, Education 15%, Exp 10%)
      ↓
[Layer 4: Explainable AI & Why Not 100%] (Grounded explanations & fastest improvements)
      ↓
[Layer 5: Potential Match & What-If Simulator] (Calculates unlocked opportunity horizon)
```

---

## 3. Key Features

- **Interactive Landing Page:** Live 5-step Opportunity Intelligence Pipeline visual, Opportunity Universe tabs, and differentiators.
- **6-Step Student Onboarding:** Basic profile, career interests, skills with confidence ratings, evidence verification, resume upload parser simulation, and career goals.
- **AI Career DNA:** Visual breakdown of Technical Depth, Project Relevance, Problem Solving, Career Alignment, and Learning Velocity.
- **Opportunity Radar:** Filter by "Apply Now", "Strong Match", "Near-Fit", "Future", work mode, and natural language intent.
- **Explainable Matching Modal:** Transparent radar factor breakdown, strong matches, partial matches, and missing skills.
- **What-If Simulator:** Real-time recalculation of unlocked opportunities (+17 unlocked badge, improved roles, score comparisons).
- **Interactive Career Graph:** SVG node graph linking Student → Current Skills → Career Roles → Bridge Skills → Organizations.
- **Personalized 14-Day Roadmap:** Actionable day-by-day plan with STAR resume guidelines.
- **Trust & Verification Shield:** Audit factor scoring (94/100 verified direct ATS vs 18/100 high risk alerts).
- **Opportunity Copilot:** Grounded assistant with prompt chips.
- **Application Pipeline Tracker:** Kanban tracking from Drafting to Offer.
- **Admin Console:** Manage, verify, or flag opportunities.

---

## 4. Getting Started Locally

### Prerequisites
- Node.js 18+ (tested on v24.19.0)
- npm 9+

### Installation & Execution
```bash
# Clone or navigate to the project directory
cd "oct 6"

# Install dependencies (already completed)
npm install

# Start the development server
npm run dev
```

Visit **`http://localhost:3000`** in your browser.

---

## 5. 3-Minute Hackathon Demo Script

1. **Landing Page:** Show headline and click through the 5-step interactive pipeline visual in the hero.
2. **Opportunity Radar:** Click *"Explore Opportunities"*. Note the greeting for *Arjun Sharma*, Career Readiness (84%), and Career DNA.
3. **Explainable Match:** Click *"Why This Match?"* on the 94% match at *ABC Technologies*. Show the 6-factor score breakdown and natural language AI assessment.
4. **"Why not 100%?":** Switch to the *"Why am I not 100%?"* tab. Show how Docker and AWS deployment are identified as the exact gap drivers with fastest improvement tips.
5. **What-If Simulator:** Click *"What-If?"* in the navbar. Click `+ AWS Cloud Architecture`. Watch the counter jump from 32 to 49 (**+17 Opportunities Potentially Unlocked!**).
6. **Career Graph & Roadmap:** Open *"Career Graph"* to see interactive nodes, then open *"Roadmap"* to see the 14-day execution plan.
7. **Trust & Safety Shield:** Filter by *"High Risk"* in the Radar to showcase the Safety Shield warning on fraudulent postings.
8. **Opportunity Copilot:** Click *"Copilot"* on the top right, click *"Why am I matched with ABC Tech?"*, and watch the grounded response.
