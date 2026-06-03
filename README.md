# Personal Task Manager

## Project Title & Brief Description

I chose the **Personal Task Manager** exercise — a full-stack to-do application where a single user can create, view, update, and delete tasks without authentication. The app supports optional descriptions and due dates, completion toggling, status filters, search, overdue highlighting, and persistent storage via MongoDB so data survives server restarts.

---

## Live Demo Links

| Environment | URL |
|-------------|-----|
| **Frontend** | _Add after deployment — e.g. `https://your-app.vercel.app`_ |
| **API** | _Add after deployment — e.g. `https://your-api.onrender.com`_ |

> **Reviewer note:** If links are not yet live, follow [How to Run Locally](#how-to-run-locally) below. Deployment steps are in [Deployment](#deployment-optional).

---

## Tech Stack

| Layer | Technology | Why |
|-------|------------|-----|
| **Frontend** | React 19 + Vite | Fast dev experience, component model, widely understood by reviewers |
| **HTTP client** | Axios | Simple interceptors and error handling for REST calls |
| **Backend** | Node.js + Express 5 | Lightweight REST API with familiar middleware patterns |
| **Database** | MongoDB + Mongoose | Document model fits task shape; persistence across restarts (bonus requirement) |
| **Config** | dotenv | Keeps secrets out of source control |

---

## How to Run Locally

**Prerequisites:** [Node.js](https://nodejs.org/) 18+ only. You also need a MongoDB instance (local install or free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster).

### 1. Clone and configure the API

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/task-manager
PORT=3001
```

For Atlas, replace `MONGO_URI` with your connection string.

```bash
npm install
npm run dev
```

You should see: `MongoDB connected` and `Server running on http://localhost:3001`.

### 2. Start the frontend (new terminal)

```bash
cd client
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

### 3. Quick health check

```bash
curl http://localhost:3001/
curl http://localhost:3001/tasks
```

---

## API Documentation

Base URL (local): `http://localhost:3001`

All request/response bodies are `application/json`. Errors return `{ "message": "..." }`.

### Task object (response shape)

```json
{
  "_id": "665f1a2b3c4d5e6f7a8b9c0d",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "dueDate": "2026-06-10T00:00:00.000Z",
  "completed": false,
  "createdAt": "2026-06-03T10:00:00.000Z",
  "updatedAt": "2026-06-03T10:00:00.000Z"
}
```

`dueDate` is `null` when not set. `description` defaults to `""`.

---

### `GET /`

Health check.

**Response `200`:**

```json
{ "message": "Task Manager API", "version": "1.0.0" }
```

---

### `GET /tasks`

List tasks, newest first.

**Query parameters (optional):**

| Param | Values | Description |
|-------|--------|-------------|
| `status` | `active` \| `completed` | Filter by completion |
| `search` | string | Case-insensitive title search |

**Response `200`:** Array of task objects.

**Example:**

```bash
curl "http://localhost:3001/tasks?status=active&search=grocery"
```

---

### `POST /tasks`

Create a task.

**Request body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Non-empty after trim |
| `description` | string | No | Optional notes |
| `dueDate` | string (ISO date) | No | e.g. `"2026-06-15"` |

**Response `201`:** Created task object.

**Response `400`:** `{ "message": "Title is required" }`

**Example:**

```bash
curl -X POST http://localhost:3001/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Write README","description":"For submission","dueDate":"2026-06-05"}'
```

---

### `PATCH /tasks/:id`

Update one or more fields.

**Request body (all optional):**

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Must be non-empty if sent |
| `description` | string | |
| `dueDate` | string \| `null` | Set `null` to clear |
| `completed` | boolean | Set completion directly |

**Response `200`:** Updated task object.

**Response `400`:** Invalid ID or empty title.

**Response `404`:** `{ "message": "Task not found" }`

**Example:**

```bash
curl -X PATCH http://localhost:3001/tasks/TASK_ID \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated title","dueDate":null}'
```

---

### `PUT /tasks/:id/toggle`

Toggle `completed` between `true` and `false`.

**Request body:** None.

**Response `200`:** Updated task object.

**Response `404`:** Task not found.

**Example:**

```bash
curl -X PUT http://localhost:3001/tasks/TASK_ID/toggle
```

---

### `DELETE /tasks/:id`

Delete a task.

**Response `200`:** `{ "message": "Task deleted successfully" }`

**Response `404`:** Task not found.

**Example:**

```bash
curl -X DELETE http://localhost:3001/tasks/TASK_ID
```

---

## Project Structure

```
task-manager/
├── client/                    # React frontend (Vite)
│   ├── src/
│   │   ├── components/        # TaskForm, TaskItem — presentational UI
│   │   ├── hooks/             # useTasks — data fetching & mutations
│   │   ├── services/          # api.js — Axios client & endpoint helpers
│   │   ├── utils/             # taskHelpers, apiErrors
│   │   ├── App.jsx            # Page layout & user flows
│   │   ├── App.css            # Component styles
│   │   └── index.css          # Design tokens & global styles
│   ├── .env.example           # VITE_API_URL for production API
│   └── package.json
├── server/                    # Express REST API
│   ├── models/
│   │   └── Task.js            # Mongoose schema
│   ├── routes/
│   │   └── tasks.js           # CRUD route handlers
│   ├── middleware/
│   │   └── errorHandler.js    # Centralised error responses
│   ├── app.js                 # App entry, MongoDB connection
│   ├── .env.example           # MONGO_URI, PORT
│   └── package.json
├── .gitignore
└── README.md
```

---

## Features Implemented

### Must have
- [x] Add task (title required, optional description & due date)
- [x] View all tasks, sorted by creation date (newest first)
- [x] Toggle complete / incomplete
- [x] Edit title, description, due date
- [x] Delete with confirmation prompt
- [x] Filter: All, Active, Completed

### Should have
- [x] Active vs completed counts
- [x] Overdue tasks visually distinguished
- [x] Empty state UI

### Bonus
- [x] Search by title
- [x] MongoDB persistence
- [ ] Drag-and-drop reorder (not implemented)

---

## Next Steps

**Chose not to implement (scope / time):**
- User authentication and multi-user accounts
- Drag-and-drop task reordering
- Automated test suite
- Offline support / PWA

**Would build next:**
1. **Deployment** — host API on Render/Railway and frontend on Vercel; wire `VITE_API_URL` to production API.
2. **Tests** — API integration tests (Supertest) and component tests (Vitest + React Testing Library).
3. **Accessibility audit** — keyboard shortcuts, focus trap in edit mode, `aria-live` for mutation feedback.
4. **Due-date reminders** — email or browser notifications for upcoming/overdue tasks.

---
