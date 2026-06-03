import { useCallback, useEffect, useState } from "react";
import {
  createTask,
  deleteTask,
  getTasks,
  toggleTask,
  updateTask,
} from "../services/api";
import { countByStatus } from "../utils/taskHelpers";
import { getErrorMessage } from "../utils/apiErrors";

export function useTasks(filter, search) {
  const [tasks, setTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      setError(null);
      const params = {};
      if (filter !== "all") params.status = filter;
      if (search.trim()) params.search = search.trim();

      const [listRes, allRes] = await Promise.all([
        getTasks(params),
        getTasks(),
      ]);
      setTasks(listRes.data);
      setAllTasks(allRes.data);
    } catch (err) {
      setError(
        getErrorMessage(err, "Could not load tasks. Is the server running?")
      );
    } finally {
      setLoading(false);
    }
  }, [filter, search]);

  useEffect(() => {
    setLoading(true);
    fetchTasks();
  }, [fetchTasks]);

  const runAction = async (action, fallbackMessage) => {
    try {
      setActionError(null);
      setIsSubmitting(true);
      await action();
      await fetchTasks();
      return true;
    } catch (err) {
      setActionError(getErrorMessage(err, fallbackMessage));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTask = (data) =>
    runAction(() => createTask(data), "Failed to create task");

  const editTask = (id, data) =>
    runAction(() => updateTask(id, data), "Failed to update task");

  const toggleComplete = (id) =>
    runAction(() => toggleTask(id), "Failed to update task");

  const removeTask = (id) =>
    runAction(() => deleteTask(id), "Failed to delete task");

  return {
    tasks,
    counts: countByStatus(allTasks),
    loading,
    error,
    actionError,
    isSubmitting,
    fetchTasks,
    addTask,
    editTask,
    toggleComplete,
    removeTask,
    clearActionError: () => setActionError(null),
  };
}
