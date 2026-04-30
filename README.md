# 🚀 Team Task Manager

A **production-ready full-stack task management application** built with modern technologies like **Next.js (App Router)**, **MongoDB**, and **JWT Authentication**.

Designed to manage projects, assign tasks, and track progress with **role-based access control (Admin / Member)**.

---

## 🌐 Live Demo

👉 http://teamtaskmanager-production-e09f.up.railway.app

---

## 🛠️ Tech Stack

**Frontend**

* Next.js (App Router)
* Tailwind CSS

**Backend**

* Next.js API Routes
* Node.js

**Database**

* MongoDB (Atlas)

**Authentication**

* JWT + bcrypt

---

## 📁 Project Structure

```
src/
  app/
    (auth)/
      login/page.tsx
      signup/page.tsx
    dashboard/page.tsx
    api/
      auth/login/route.ts
      auth/signup/route.ts
      users/route.ts
      projects/route.ts
      projects/[id]/route.ts
      projects/[id]/members/route.ts
      projects/[id]/members/[userId]/route.ts
      tasks/route.ts
      tasks/[id]/route.ts
      dashboard/me/route.ts
  components/
    auth-form.tsx
    dashboard-client.tsx
  lib/
    api.ts
    auth.ts
    client-api.ts
    db.ts
    validation.ts
  models/
    User.ts
    Project.ts
    Task.ts
```

---

## ⚙️ Setup Instructions

### 1️⃣ Install Dependencies

```
npm install
```

### 2️⃣ Setup Environment Variables

Create `.env.local`:

```
MONGODB_URI=your_mongodb_uri
MONGODB_DB_NAME=your_db_name
JWT_SECRET=your_secret_key
```

---

### 3️⃣ Run Locally

```
npm run dev
```

👉 App runs on: http://localhost:3000

---

## ✨ Features

✅ Secure Authentication (JWT + bcrypt)
✅ Role-Based Access Control (Admin / Member)
✅ Project & Team Management
✅ Task Assignment & Status Tracking
✅ Dashboard with Filters (status/project)
✅ Overdue Task Detection 🔴
✅ Input Validation using Zod
✅ RESTful APIs with proper status codes

---

## 👥 User Roles

### 🔹 Admin

* Manage users
* Create & manage projects
* Assign tasks
* Full control over system

### 🔹 Member

* View assigned tasks
* Update task status

---

## 🔌 API Overview

All APIs follow REST standards.

📄 Full documentation available in:

```
API_DOCS.md
```

---

## 🚀 Deployment (Railway)

1. Push code to GitHub
2. Create project on Railway
3. Connect GitHub repo
4. Add environment variables
5. Deploy

---

## 🔐 Production Highlights

* Environment-based configuration
* Secure authentication handling
* Scalable database design
* Clean modular architecture
* Ready for real-world usage

---

## 🎯 Future Improvements

* Notifications system 🔔
* Pagination & search optimization
* Activity logs
* UI/UX enhancements

---

## 👨‍💻 Author

**Vishal Singhal**

---

## ⭐ If you like this project

Give it a ⭐ on GitHub and share feedback!
