# Team Task Manager

Production-ready full-stack task management app built with Next.js App Router, Tailwind CSS, MongoDB, and JWT authentication.

## 1) Folder Structure

```text
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

## 2) Setup

1. Install dependencies:

```bash
npm install
```

2. Create env file:

```bash
cp .env.example .env.local
```

3. Fill required envs in `.env.local`:
- `MONGODB_URI`
- `MONGODB_DB_NAME`
- `JWT_SECRET`

4. Start app:

```bash
npm run dev
```

App runs at [http://localhost:3000](http://localhost:3000)

## 3) Features Implemented

- JWT auth with secure bcrypt password hashing
- Role-based access control (`admin`, `member`)
- Project management (create/update/delete)
- Team member project assignment APIs
- Task management with status and deadlines
- Overdue detection in dashboard summary + UI badge
- Dashboard filters by status/project
- Input validation using Zod
- RESTful API design with proper status codes

## 4) Roles

- **Admin**
  - Manage users
  - Create/manage projects
  - Create/assign/edit/delete tasks
- **Member**
  - View assigned tasks
  - Update task status for own tasks

## 5) API Documentation

See `API_DOCS.md` for full endpoint list and payload examples.

## 6) Deployment (Railway)

1. Push repo to GitHub.
2. Create a new Railway project and connect the repo.
3. Add environment variables from `.env.example` in Railway Variables.
4. Set build/start commands:
   - Build: `npm run build`
   - Start: `npm run start`
5. Deploy.

## 7) Production Notes

- Uses env variables for all secrets.
- Works with `npm run build` and `npm run start`.
- APIs enforce auth + role checks.
- DB models include required relationships (`User`, `Project`, `Task`).
