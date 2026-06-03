# Personal Task Manager

## Project Title & Brief Description

This project implements the **Personal Task Manager** exercise: a full-stack to-do app for a single user (no authentication). Users can add tasks with a required title plus optional description and due date, view tasks sorted newest first, toggle completion, edit details, delete with confirmation, and filter by All / Active / Completed. The UI also shows active vs completed counts, highlights overdue tasks, supports search by title, and persists data in MongoDB across server restarts.

---

## Live Demo Links

| | URL |
|---|-----|
| **Application** | [https://task-manager1212.netlify.app](https://task-manager1212.netlify.app) |
| **API** | `https://task-manager-production-87bd.up.railway.app` |

The frontend is hosted on Netlify; the REST API runs on Railway with MongoDB Atlas.

---

## Tech Stack

| Layer | Tools | Why |
|-------|-------|-----|
| Frontend | React 19, Vite | Component-based UI with fast local development and production builds |
| HTTP | Axios | Straightforward REST calls and error handling from the client |
| Backend | Node.js, Express 5 | Simple REST API with middleware for CORS, JSON, and errors |
| Database | MongoDB, Mongoose | Document model matches task fields; data persists after restarts |
| Config | dotenv | Environment variables for database URL and port (not committed) |

---

## How to Run Locally

**Prerequisite:** [Node.js](https://nodejs.org/) 18+ and a MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)).

**Terminal 1 — API**

```bash
cd server
cp .env.example .env
```

Edit `server/.env` and set `MONGO_URI` (local: `mongodb://127.0.0.1:27017/task-manager`, or your Atlas connection string).

```bash
npm install
npm run dev
```

Wait for `MongoDB connected` and `Server running on http://localhost:3001`.

**Terminal 2 — Frontend**

```bash
cd client
npm install
npm run dev
```

Open **http://localhost:5173**. The client uses `http://localhost:3001` for the API by default.

**Verify the API**

```bash
curl http://localhost:3001/
curl http://localhost:3001/tasks
```

---

## API Documentation

**Base URL (local):** `http://localhost:3001`  
**Base URL (production):** `https://task-manager-production-87bd.up.railway.app`

All bodies are JSON. Errors: `{ "message": "string" }`.

### Task object

```json
{
  "_id": "665f1a2b3c4d5e6f7a8b9c0d",
  "title": "Buy groceries",
  "description": "Milk and eggs",
  "dueDate": "2026-06-10T00:00:00.000Z",
  "completed": false,
  "createdAt": "2026-06-03T10:00:00.000Z",
  "updatedAt": "2026-06-03T10:00:00.000Z"
}
```

`dueDate` may be `null`. `description` defaults to `""`.

---

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Health check |
| GET | `/tasks` | List tasks (newest first) |
| POST | `/tasks` | Create task |
| PATCH | `/tasks/:id` | Update task |
| PUT | `/tasks/:id/toggle` | Toggle completed |
| DELETE | `/tasks/:id` | Delete task |

### `GET /`

**Response `200`**

```json
{ "message": "Task Manager API", "version": "1.0.0" }
```

### `GET /tasks`

**Query (optional)**

| Param | Values | Description |
|-------|--------|-------------|
| `status` | `active`, `completed` | Filter by completion |
| `search` | string | Case-insensitive title search |

**Response `200`:** `Task[]`

### `POST /tasks`

**Request body**

| Field | Type | Required |
|-------|------|----------|
| `title` | string | Yes |
| `description` | string | No |
| `dueDate` | string (ISO date) | No |

**Response `201`:** Task  
**Response `400`:** `{ "message": "Title is required" }`

### `PATCH /tasks/:id`

**Request body (all optional)**

| Field | Type |
|-------|------|
| `title` | string |
| `description` | string |
| `dueDate` | string or `null` |
| `completed` | boolean |

**Response `200`:** Task  
**Response `404`:** `{ "message": "Task not found" }`

### `PUT /tasks/:id/toggle`

**Request body:** none  

**Response `200`:** Task (with toggled `completed`)

### `DELETE /tasks/:id`

**Response `200`:** `{ "message": "Task deleted successfully" }`  
**Response `404`:** `{ "message": "Task not found" }`

---

## Project Structure

```
task-manager/
├── client/                 # React + Vite frontend
│   └── src/
│       ├── components/     # TaskForm, TaskItem
│       ├── hooks/          # useTasks (fetch & mutations)
│       ├── services/       # Axios API client
│       ├── utils/          # Helpers (dates, errors)
│       ├── App.jsx         # Main page & layout
│       └── App.css         # UI styles
├── server/                 # Express API
│   ├── models/Task.js      # Mongoose schema
│   ├── routes/tasks.js     # REST handlers
│   ├── middleware/         # Error handling
│   ├── app.js              # Server entry
│   └── .env.example        # MONGO_URI, PORT template
└── README.md
```

---

## Next Steps

**Not implemented**

- User authentication / multi-user support  
- Drag-and-drop task reordering  
- Automated tests (API or UI)  

**Planned improvements**

- Expand test coverage (Supertest for API, Vitest for components)  
- Custom delete confirmation modal instead of `window.confirm`  
- Due-date reminders (notifications or email)  
- Keyboard shortcuts and deeper accessibility review  
