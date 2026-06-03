import { useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskItem from "./components/TaskItem";
import { useTasks } from "./hooks/useTasks";
import "./App.css";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "completed", label: "Done" },
];

const emptyForm = { title: "", description: "", dueDate: "" };

export default function App() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);

  const {
    tasks,
    counts,
    loading,
    error,
    actionError,
    isSubmitting,
    addTask,
    editTask,
    toggleComplete,
    removeTask,
  } = useTasks(filter, search);

  const displayError = error || actionError;

  const handleAdd = async () => {
    if (!form.title.trim() || isSubmitting) return;

    const ok = await addTask({
      title: form.title,
      description: form.description,
      dueDate: form.dueDate || undefined,
    });
    if (ok) {
      setForm(emptyForm);
      setShowAddForm(false);
    }
  };

  const handleToggle = async (id) => {
    if (isSubmitting) return;
    await toggleComplete(id);
  };

  const handleSaveEdit = async () => {
    if (!editForm.title.trim() || isSubmitting) return;

    const ok = await editTask(editingId, {
      title: editForm.title,
      description: editForm.description,
      dueDate: editForm.dueDate || null,
    });
    if (ok) setEditingId(null);
  };

  const handleDelete = async (task) => {
    if (isSubmitting) return;

    const confirmed = window.confirm(
      `Delete "${task.title}"? This cannot be undone.`
    );
    if (!confirmed) return;

    const ok = await removeTask(task._id);
    if (ok && editingId === task._id) setEditingId(null);
  };

  return (
    <div className="app">
      <div className="app-bg" aria-hidden="true" />

      <header className="hero">
        <div className="hero-badge">Personal workspace</div>
        <h1 className="hero-title">Task Manager</h1>
        <p className="hero-subtitle">
          Capture, prioritize, and finish what matters.
        </p>

        <div className="stat-row" aria-live="polite">
          <div className="stat-card stat-card--active">
            <span className="stat-value">{counts.active}</span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat-card stat-card--done">
            <span className="stat-value">{counts.completed}</span>
            <span className="stat-label">Completed</span>
          </div>
          <div className="stat-card stat-card--total">
            <span className="stat-value">{counts.total}</span>
            <span className="stat-label">Total</span>
          </div>
        </div>
      </header>

      <main className="main">
        <section className="card card-add" aria-label="Add a task">
          <button
            type="button"
            className="card-add-toggle"
            onClick={() => setShowAddForm((v) => !v)}
            aria-expanded={showAddForm}
          >
            <span className="card-add-icon" aria-hidden="true">
              {showAddForm ? "−" : "+"}
            </span>
            <span className="card-add-label">
              {showAddForm ? "Hide form" : "Add new task"}
            </span>
          </button>

          <div
            className={`card-add-body${showAddForm ? " card-add-body--open" : ""}`}
          >
            <TaskForm
              title={form.title}
              description={form.description}
              dueDate={form.dueDate}
              onTitleChange={(v) => setForm({ ...form, title: v })}
              onDescriptionChange={(v) => setForm({ ...form, description: v })}
              onDueDateChange={(v) => setForm({ ...form, dueDate: v })}
              onSubmit={handleAdd}
              submitLabel={isSubmitting ? "Adding…" : "Add task"}
              disabled={isSubmitting}
              compact
            />
          </div>
        </section>

        <section className="card card-list" aria-label="Task list">
          <div className="list-header">
            <h2 className="list-title">Your tasks</h2>
            {!loading && tasks.length > 0 && (
              <span className="list-count">{tasks.length} shown</span>
            )}
          </div>

          <div className="toolbar">
            <div className="search-field">
              <svg
                className="search-icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20L16 16" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                className="search-input"
                placeholder="Search tasks…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search tasks"
              />
            </div>

            <div className="filters" role="tablist" aria-label="Filter tasks">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  aria-selected={filter === f.id}
                  className={`filter-pill${filter === f.id ? " filter-pill--active" : ""}`}
                  onClick={() => setFilter(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {displayError && (
            <div className="alert alert-error" role="alert">
              <span className="alert-icon" aria-hidden="true">
                !
              </span>
              {displayError}
            </div>
          )}

          <div className="list-body">
            {loading ? (
              <ul className="skeleton-list" aria-label="Loading tasks">
                {[1, 2, 3].map((i) => (
                  <li key={i} className="skeleton-item" />
                ))}
              </ul>
            ) : tasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-illustration" aria-hidden="true">
                  <span className="empty-ring" />
                  <span className="empty-dot" />
                </div>
                <h3 className="empty-title">
                  {search.trim()
                    ? "No matching tasks"
                    : filter === "completed"
                      ? "Nothing completed yet"
                      : filter === "active"
                        ? "You're all caught up"
                        : "Start your first task"}
                </h3>
                <p className="empty-text">
                  {search.trim() || filter !== "all"
                    ? "Try another filter or search term."
                    : "Use the form above to add something to your list."}
                </p>
                {!search.trim() && filter === "all" && (
                  <button
                    type="button"
                    className="btn btn-primary empty-cta"
                    onClick={() => setShowAddForm(true)}
                  >
                    Add new task
                  </button>
                )}
              </div>
            ) : (
              <ul className="task-list" aria-busy={isSubmitting}>
                {tasks.map((task, index) => (
                  <TaskItem
                    key={task._id}
                    task={task}
                    style={{ animationDelay: `${index * 40}ms` }}
                    isEditing={editingId === task._id}
                    editForm={editForm}
                    disabled={isSubmitting}
                    onEditFormChange={setEditForm}
                    onStartEdit={(t, formState) => {
                      setEditingId(t._id);
                      setEditForm(formState);
                    }}
                    onSaveEdit={handleSaveEdit}
                    onCancelEdit={() => setEditingId(null)}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                  />
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <p>Sorted by newest first · Data saved to MongoDB</p>
      </footer>
    </div>
  );
}
