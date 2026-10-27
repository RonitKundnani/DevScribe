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

---

## 🔑 Demo Accounts for Viva / Testing

You can use these pre-seeded accounts or click the **Demo Login** buttons on the login page:

| Role / Name | Email | Password |
| :--- | :--- | :--- |
| **Alex Rivera** | `alex@example.com` | `password123` |
| **Sarah Chen** | `sarah@example.com` | `password123` |

---

## 📡 API Endpoints

### Auth
- `POST /api/auth/register` – Register new user
- `POST /api/auth/login` – Login & retrieve JWT
- `GET /api/auth/me` – Retrieve authenticated user profile (protected)
- `PUT /api/auth/profile` – Update name, bio, avatar (protected)
- `GET /api/users/:username` – Public author profile

### Articles
- `GET /api/articles` – Query articles (supports `search`, `tag`, `page`, `limit`)
- `GET /api/articles/:slug` – Single article with author and comments
- `POST /api/articles` – Create new article (protected)
- `PUT /api/articles/:id` – Edit article (author only)
- `DELETE /api/articles/:id` – Delete article (author only)
- `POST /api/articles/:id/like` – Toggle like
- `POST /api/articles/:id/bookmark` – Toggle bookmark
- `GET /api/articles/bookmarks/my` – User reading list (protected)
- `POST /api/articles/:id/comments` – Add comment (protected)
- `DELETE /api/articles/comments/:commentId` – Delete comment (comment author only)

### Snippets
- `GET /api/snippets` – Query code snippets (supports `language`, `search`)
- `POST /api/snippets` – Save new snippet (protected)
- `DELETE /api/snippets/:id` – Delete snippet (snippet author only)
