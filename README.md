# Task Management System

A full-stack task management app built with Node.js, TypeScript, Next.js, and SQLite.

## Tech Stack

- **Backend** — Node.js, Express, TypeScript, Prisma, SQLite
- **Frontend** — Next.js 15 (App Router), TypeScript, Tailwind CSS

## Features

- Register and log in with JWT authentication (access + refresh tokens)
- Create, edit, delete, and toggle tasks
- Search tasks by title and filter by status
- Paginated task list
- Protected routes — users only see their own tasks

## Getting Started

### 1. Clone the repo

git clone https://github.com/Shozaib-Khan/Earnest_Asmt.git
cd Earnest_Asmt

### 2. Set up the backend

cd server
npm install
```

Create a `.env` file in the `server/` folder:
```
DATABASE_URL="file:./dev.db"
ACCESS_TOKEN_SECRET="your_access_secret"
REFRESH_TOKEN_SECRET="your_refresh_secret"
```
```
npx prisma migrate dev --name init
npm run dev
```

Server runs at `http://localhost:5000`

### 3. Set up the frontend
```
cd ../client
npm install
npm run dev
```

App runs at `http://localhost:3000`
```

---

That's it. All 33 tasks done. Here's a full summary of what was built:

**Backend** — auth with bcrypt + dual JWT tokens, full task CRUD with pagination/filter/search, ownership checks on every route, proper HTTP status codes throughout.

**Frontend** — login and register pages, silent token refresh on 401, protected routes via middleware, task dashboard with search, filter, pagination, add/edit modal, custom confirm dialog, and toast notifications.

Push it to GitHub and you're done:
```bash
cd ..
git add .
git commit -m "complete task management system"
git push
```