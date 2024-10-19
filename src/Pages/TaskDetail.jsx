import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const url = process.env.REACT_APP_API_URL;

const TaskDetail = () => {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`${url}/tasks/${taskId}`);
        setTask(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchTask();
  }, [taskId]);

  return (
    <div>
      <h2>Task Detail</h2>
      {loading ? (
        <p>Loading task...</p>
      ) : error ? (
        <p>Error loading task: {error}</p>
      ) : task ? (
        <div>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <p>Status: {task.state}</p>
        </div>
      ) : (
        <p>No task found.</p>
      )}
    </div>
  );
};

export default TaskDetail;
