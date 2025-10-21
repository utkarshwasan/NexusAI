
# NexusAI 🤖

A modern, full-stack platform for intelligent AI-powered discussions and learning.  
Built with **Next.js** on the frontend and a **Convex** serverless backend, NexusAI provides real-time chat with AI assistants, automated summarization, and a persistent history for all your conversations. 🌟

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation and Setup](#installation-and-setup)
- [How to Use](#how-to-use)

---

## Features
- **💬 Real-time AI Discussions**: Engage in dynamic, real-time voice or text conversations with various AI personalities across different coaching modes (Lectures, Mock Interviews, Q&A, Language Learning, Meditation).
- **🧠 Automated Summarization & Feedback**: Automatically generate and review concise summaries and actionable feedback from your completed discussion sessions.
- **📜 Persistent Chat History & Feedback**: Keep track of all your past discussions and feedback in easily accessible dashboard panels.
- **🎙️ Voice Interaction**: Utilizes AssemblyAI for real-time transcription and AWS Polly for text-to-speech output, enabling natural voice conversations.
- **🔐 Secure Authentication**: Full-featured user authentication (sign-up, sign-in) and protected application routes handled seamlessly by **Stack**.
- **✨ Modern & Responsive UI**: A sleek, responsive landing page and application interface built with **Tailwind CSS** and **shadcn/ui** components, featuring light/dark modes.
- **🚀 Full-Stack Serverless**: Powered by a **Convex** backend for real-time database operations, user management, and discussion room persistence without managing server infrastructure.

---

## Tech Stack
| Category         | Technology                                      |
| :--------------- | :---------------------------------------------- |
| **Frontend**     | Next.js (React), JavaScript (JSX)               |
| **UI/UX**        | Tailwind CSS, shadcn/ui, Lucide React, Framer Motion |
| **Backend**      | Convex (Serverless Platform)                    |
| **Database**     | Convex (Real-time Database)                     |
| **Authentication**| Stack                                           |
| **AI & Services**| OpenAI (via OpenRouter), AssemblyAI, AWS Polly |
| **Languages**    | JavaScript, CSS                                 |
| **Tooling**      | npm, Convex CLI                                 |

---

## Project Structure
```bash
nexusai/
├── app/
│   ├── (main)/             # Main authenticated app routes
│   │   ├── dashboard/      # User dashboard (History, Feedback, Features)
│   │   ├── discussion-room/[roomid]/ # Core real-time chat interface
│   │   └── view-summary/[roomid]/    # Page to view past summaries
│   ├── api/                # Next.js API routes (e.g., getToken for AssemblyAI)
│   ├── handler/[...stack]/ # Stack authentication handler routes
│   ├── _context/           # React Context (e.g., UserContext)
│   ├── layout.js           # Root layout (fonts, providers)
│   └── page.js             # Landing page component
├── components/
│   ├── landing/            # Landing page sections (Hero, Features, etc.)
│   ├── magicui/            # Special UI effects (e.g., BlurFade)
│   └── ui/                 # shadcn/ui base components
├── convex/                 # Convex backend functions and schema
│   ├── _generated/         # Auto-generated Convex files
│   ├── DiscussionRoom.jsx  # Backend logic for discussions
│   ├── users.js            # User creation/management logic
│   └── schema.js           # Database schema definition
├── hooks/                  # Custom React hooks (e.g., use-mobile)
├── lib/                    # Utility functions (e.g., cn for class names)
├── public/                 # Static assets (images, icons, svgs)
├── services/               # Client-side API/service calls (AI models, TTS)
├── middleware.jsx          # Next.js middleware for route protection
├── package.json            # Project dependencies and scripts
├── tailwind.config.mjs     # Tailwind CSS configuration
└── stack.js                # Stack server app initialization
```

---

## Getting Started

### Prerequisites
- **Node.js** (v18 or later recommended)
- **npm** (v7 or later recommended)
- A **Convex** account ([https://convex.dev](https://convex.dev))
- A **Stack** account ([https://stackframe.co](https://stackframe.co))
- **API Keys** for:
  - OpenRouter (or OpenAI)
  - AssemblyAI
  - AWS Polly (Access Key ID & Secret Access Key)

### Installation and Setup
1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/nexusai.git
   cd nexusai
   ```

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

3. **Set up Convex Backend**:
   ```bash
   # Install Convex CLI globally if you haven't already
   npm install -g convex
   
   # Log in to your Convex account
   npx convex login
   
   # Link your project to Convex (this creates .env.local)
   # Follow the CLI prompts to select your Convex project
   npx convex dev
   ```
   Keep this terminal window open; `convex dev` runs your local backend proxy.

4. **Configure Environment Variables**:
   - Open the `.env.local` file created by Convex.
   - Add your API keys and Stack credentials:
     ```env
     # Convex variables (should be added automatically by `convex dev`)
     NEXT_PUBLIC_CONVEX_URL=...
     CONVEX_DEPLOYMENT=...
     
     # Stack Authentication
     NEXT_PUBLIC_STACK_PUBLIC_KEY=pk_...
     STACK_SECRET_KEY=sk_...
     
     # AI & Voice Services
     NEXT_PUBLIC_AI_OPENROUTER_API_KEY=...
     ASSEMBLYAI_API_KEY=...
     NEXT_PUBLIC_AWS_ACCESS_KEY_ID=...
     NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY=...
     ```

5. **Push Database Schema**:
   - Open a **new terminal** in the `nexusai` project root.
   - Run the push command:
     ```bash
     npx convex push
     ```

6. **Run the Frontend**:
   - In the second terminal (where you ran `convex push`), start the Next.js app:
     ```bash
     npm run dev
     ```
   Your `NexusAI` app should now be running at `http://localhost:3000`, connected to your Convex backend.

---

## How to Use
1. **Visit the App**: Open `http://localhost:3000`.
2. **Sign Up / Log In**: Use the buttons on the landing page to authenticate via Stack.
3. **Explore Dashboard**: After logging in, you'll land on your dashboard.
4. **Start a Session**:
   - Click on a feature assistant card (e.g., "Mock Interview", "Topic Base Lecture").
   - Enter a topic you want to discuss.
   - Select an AI expert personality.
   - Click "Next" to enter the discussion room.
5. **Connect & Chat**: Click the "Connect" button to enable your microphone and start the real-time voice session with the AI.
6. **Review History/Feedback**: Navigate back to the dashboard to see your previous sessions and any generated feedback or notes.
