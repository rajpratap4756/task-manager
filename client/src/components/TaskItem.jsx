import TaskForm from "./TaskForm";
import { formatDueDate, isOverdue, toInputDate } from "../utils/taskHelpers";

export default function TaskItem({
  task,
  isEditing,
  editForm,
  onEditFormChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onToggle,
  onDelete,
  style,
  disabled = false,
}) {
  const overdue = isOverdue(task);

  if (isEditing) {
    return (
      <li className="task-item task-item--editing" style={style}>
        <div className="edit-banner">Editing task</div>
        <TaskForm
          title={editForm.title}
          description={editForm.description}
          dueDate={editForm.dueDate}
          onTitleChange={(v) => onEditFormChange({ ...editForm, title: v })}
          onDescriptionChange={(v) =>
            onEditFormChange({ ...editForm, description: v })
          }
          onDueDateChange={(v) => onEditFormChange({ ...editForm, dueDate: v })}
          onSubmit={onSaveEdit}
          submitLabel="Save changes"
          onCancel={onCancelEdit}
        />
      </li>
    );
  }

  return (
    <li
      className={`task-item${task.completed ? " task-item--completed" : ""}${
        overdue ? " task-item--overdue" : ""
      }`}
      style={style}
    >
      <label className="task-check" title={task.completed ? "Mark incomplete" : "Mark complete"}>
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task._id)}
          disabled={disabled}
          aria-label={`Mark "${task.title}" as ${
            task.completed ? "incomplete" : "complete"
          }`}
        />
        <span className="checkmark">
          <svg className="check-icon" viewBox="0 0 12 10" fill="none" aria-hidden="true">
            <path
              d="M1 5.5L4.5 9L11 1"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </label>

      <div className="task-body">
        <div className="task-head">
          <span className="task-title">{task.title}</span>
          {overdue && (
            <span className="badge badge-overdue">Overdue</span>
          )}
          {task.completed && (
            <span className="badge badge-done">Done</span>
          )}
        </div>
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}
        {task.dueDate && (
          <span className={`task-meta${overdue ? " task-meta--overdue" : ""}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.75" />
              <path d="M3 10h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
            {formatDueDate(task.dueDate)}
          </span>
        )}
      </div>

      <div className="task-actions">
        <button
          type="button"
          className="icon-btn"
          disabled={disabled}
          onClick={() =>
            onStartEdit(task, {
              title: task.title,
              description: task.description || "",
              dueDate: toInputDate(task.dueDate),
            })
          }
          aria-label={`Edit ${task.title}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
            <path
              d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          type="button"
          className="icon-btn icon-btn--danger"
          disabled={disabled}
          onClick={() => onDelete(task)}
          aria-label={`Delete ${task.title}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </li>
  );
}
