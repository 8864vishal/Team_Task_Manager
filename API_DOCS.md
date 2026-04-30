# Team Task Manager API Documentation

Base URL: `/api`

Auth: pass JWT in header:

`Authorization: Bearer <token>`

## Authentication

- `POST /auth/signup`
  - Body: `{ "name": "A", "email": "a@b.com", "password": "secret123", "role": "admin|member" }`
- `POST /auth/login`
  - Body: `{ "email": "a@b.com", "password": "secret123" }`

## Users (Admin only)

- `GET /users`
  - Returns all users (without password).

## Projects

- `GET /projects`
  - Admin: all projects
  - Member: only assigned projects
- `POST /projects` (Admin)
  - Body: `{ "name": "Project A", "description": "..." }`
- `PATCH /projects/:id` (Admin)
- `DELETE /projects/:id` (Admin)
- `POST /projects/:id/members` (Admin)
  - Body: `{ "userId": "<user-id>" }`
- `DELETE /projects/:id/members/:userId` (Admin)

## Tasks

- `GET /tasks?status=&projectId=`
  - Admin: all tasks
  - Member: own assigned tasks
- `POST /tasks` (Admin)
  - Body:
    - `title` string
    - `description` string
    - `assignedTo` user id
    - `projectId` project id
    - `deadline` ISO string/date string
    - `status` optional (`pending|in_progress|completed`)
- `PATCH /tasks/:id`
  - Admin can edit full task.
  - Member can update `status` only for own tasks.
- `DELETE /tasks/:id` (Admin)

## Dashboard

- `GET /dashboard/me`
  - Returns task list + summary:
    - `pending`
    - `completed`
    - `overdue`
    - `total`
