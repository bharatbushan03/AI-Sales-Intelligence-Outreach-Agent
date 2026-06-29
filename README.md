<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/bot.svg" width="120" height="120" alt="Agent Icon" />
  <h1>Autonomous B2B Sales Intelligence Agent</h1>
  <p><em>Powered by Google Gemini & Firebase</em></p>
  
  [![Vercel Deployment](https://img.shields.io/badge/Deployed_on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
  [![Google Gemini](https://img.shields.io/badge/Powered_by-Gemini_Pro-4285F4?style=for-the-badge&logo=google)](https://cloud.google.com/gemini)
  [![Firebase](https://img.shields.io/badge/Database-Firestore-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com)
</div>

---

## 🚀 Overview

The Autonomous B2B Sales Intelligence Agent is a multi-agent system designed to completely automate the outbound sales pipeline. It replaces manual research, data entry, and generic cold emails with a highly coordinated team of AI sub-agents orchestrated by an Executive Manager Agent.

By leveraging **Google Gemini Pro 1.5** for reasoning and **Firebase** for real-time memory and state, this platform acts as an autonomous Sales Development Representative (SDR) capable of booking meetings while you sleep.

## ✨ Key Features

- **Multi-Agent Orchestration:** Specialized agents (Research, Opportunity, Outreach, CRM, Proposal) work in tandem.
- **Judge Mode / Live Demo:** Instantly seed realistic test data and trigger an interactive product walkthrough.
- **Deep Intent Scoring:** Analyzes SEC filings, news articles, and historical CRM data to score leads automatically.
- **Hyper-Personalized Outreach:** Generates non-generic, highly contextual email sequences based on exact pain points.
- **Executive Boardroom UI:** A beautiful, responsive interface featuring 3D knowledge graphs and real-time collaboration.

## 🏗 System Architecture

The system follows a hierarchical agent design:
1. **Manager Agent**: Routes tasks and maintains the overarching goal state.
2. **Specialist Agents**: Execute narrow tasks (e.g., the Research Agent scraping domains, the Proposal Agent generating PDFs).
3. **Shared Memory**: Vector embeddings stored in Firestore allow agents to share context without hallucinating.

*(See our interactive `/architecture` route for a visual breakdown!)*

## 🛠 Tech Stack

- **AI Engine:** Google Gemini Pro 1.5 (via Vertex AI / AI Studio)
- **Database & Auth:** Firebase Auth, Cloud Firestore
- **Frontend Framework:** Next.js 15 (App Router), React 19
- **Styling:** Tailwind CSS, Framer Motion
- **Deployment:** Vercel Edge Network

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/bharatbushan03/AI-Sales-Intelligence-Outreach-Agent.git
   cd AI-Sales-Intelligence-Outreach-Agent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file with your Google and Firebase credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_CLIENT_EMAIL=your_client_email
   FIREBASE_PRIVATE_KEY=your_private_key
   GEMINI_API_KEY=your_gemini_key
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```

## 🎯 Hackathon Judging (Judge Mode)

To evaluate this project quickly without needing to connect your own external CRM APIs, simply navigate to the application and click **"Judge Mode -> Start Demo"** in the top navigation bar. This will:
- Instantly populate Firestore with realistic mock data (Stripe, Shopify, HubSpot).
- Launch an interactive guided tour explaining the technical and business value of every dashboard screen.

## 📄 License
This project is licensed under the MIT License.
