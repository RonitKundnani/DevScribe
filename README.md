# 🚀 DevScribe – Full-Stack Developer Platform

A modern, full-stack technical blogging and snippet-sharing web platform built for college Web Technology semester evaluation.

---

## 🌟 Tech Stack

- **Frontend:**
  - **Framework:** React 19 (Vite)
  - **Styling:** Tailwind CSS v4
  - **Icons:** Lucide React
  - **Routing:** React Router v7
  - **Markdown & Syntax Highlighting:** `react-markdown`, `remark-gfm`, `rehype-highlight`, `highlight.js`
  - **HTTP Client:** Axios (with bearer token interceptors)

- **Backend:**
  - **Server:** Node.js + Express (ES Modules)
  - **Database & ORM:** SQLite + Prisma ORM (zero-config, portable)
  - **Authentication:** JWT (JSON Web Tokens) + `bcryptjs` password hashing
  - **Cross-Origin:** CORS enabled for Vite dev server

---

## 🚀 Key Features

1. **Authentication & Authorization:**
   - Registration and Login with JWT tokens.
   - Protected routes for article creation, snippet creation, likes, bookmarks, and comments.
   - One-click demo account switcher for easy viva evaluation.

2. **Article Publishing & Markdown Engine:**
   - Live split-view/tabs: Write in Markdown, see immediate formatted output.
   - Auto-syntax highlighting for code blocks in JavaScript, Python, CSS, HTML, SQL, etc.
   - Dynamic reading-time estimation based on word count.
   - Multi-tag classification (e.g. `#react`, `#nodejs`, `#webdev`).

3. **Code Snippets Vault:**
   - Filter snippets by programming language (JavaScript, Python, Rust, Go, SQL, etc.).
   - Instant search across snippets.
   - One-click copy snippet to clipboard.

4. **Community & Interactivity:**
   - Likes & upvotes counter.
   - Bookmarks / Personal Reading List.
   - Threaded comments with timestamps and author deletion permissions.

5. **Author Profile & Portfolio:**
   - Displays user bio, joined date, articles published, and snippets shared.
   - Edit profile modal to update display name, bio, and avatar.

---

## 🛠️ Quick Start Guide

### 1. Start the Backend Server

```bash
cd server
npm install
npx prisma migrate dev --name init
node src/seed.js        # Seeds demo users, articles, and code snippets
npm run dev             # Runs backend on http://localhost:5000
```

### 2. Start the Frontend (Vite)

In another terminal window:

```bash
cd client
npm install
npm run dev             # Runs client on http://localhost:5173
```
