import { useEffect, useState } from "react";
import api from "./services/api";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const response = await api.get("/tasks");
    setTasks(response.data);
  };

  const addTask = async () => {
    if (!title.trim()) return;

    await api.post("/tasks", {
      title,
    });

    setTitle("");
    fetchTasks();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Task Manager</h1>

      <input
        type="text"
        placeholder="Enter task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <button onClick={addTask}>
        Add Task
      </button>

      <hr />

      {tasks.length === 0 ? (
        <p>No tasks found</p>
      ) : (
        tasks.map((task) => (
          <div key={task.id}>
            {task.title}
          </div>
        ))
      )}
    </div>
  );
}

export default App;