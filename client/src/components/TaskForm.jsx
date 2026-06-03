export default function TaskForm({
  title,
  description,
  dueDate,
  onTitleChange,
  onDescriptionChange,
  onDueDateChange,
  onSubmit,
  submitLabel = "Add task",
  onCancel,
  compact = false,
  disabled = false,
}) {
  return (
    <form
      className={`task-form${compact ? " task-form--compact" : ""}`}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="form-row form-row--title">
        <label htmlFor="task-title" className="sr-only">
          Title
        </label>
        <input
          id="task-title"
          type="text"
          className="input input-title"
          placeholder="What do you need to do?"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          required
          autoComplete="off"
        />
      </div>

      <div className="form-grid">
        <div className="form-row">
          <label htmlFor="task-description">Description</label>
          <textarea
            id="task-description"
            className="input"
            placeholder="Add notes (optional)"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            rows={2}
          />
        </div>
        <div className="form-row">
          <label htmlFor="task-due">Due date</label>
          <input
            id="task-due"
            type="date"
            className="input input-date"
            value={dueDate}
            onChange={(e) => onDueDateChange(e.target.value)}
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={disabled}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 5v14M5 12h14"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
          {submitLabel}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
