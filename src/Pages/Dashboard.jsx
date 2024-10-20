import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import TaskCard from "../components/TaskCard.jsx";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import DeleteIcon from "@mui/icons-material/Delete";

import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { Grid } from "@mui/material";

const url = process.env.REACT_APP_API_URL;

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    assignedTo: "",
    state: "Todo",
  });
  const [isTaskLoading, setIsTaskLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Fetch tasks from the API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${url}/tasks`);
        setTasks(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // Function to get task count by state
  const getTaskCountByState = (state) => {
    return tasks.filter((task) => task.state === state).length;
  };

  // Prepare data for the pie chart
  const pieChartData = {
    labels: ["Todo", "In Progress", "Completed"],
    datasets: [
      {
        data: [
          getTaskCountByState("Todo"),
          getTaskCountByState("In Progress"),
          getTaskCountByState("Completed"),
        ],
        backgroundColor: ["#f39c12", "#2980b9", "#16a085"],
        hoverBackgroundColor: ["#f39c12", "#2980b9", "#16a085"],
      },
    ],
  };

  // Handle task card click
  const handleCardClick = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
    setIsEditing(false); // Open the modal in view mode
  };

  // Handle closing the modal
  const closeModal = () => {
    setSelectedTask(null);
    setIsModalOpen(false);
    setIsEditing(false);
  };

  // Handle task deletion
  const deleteTask = async () => {
    if (selectedTask) {
      try {
        await axios.delete(`${url}/tasks/${selectedTask.id}`);
        setTasks(tasks.filter((task) => task.id !== selectedTask.id));
        closeModal();
      } catch (err) {
        console.error("Failed to delete the task:", err);
      }
    }
  };
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  // Toggle editing mode
  const enableEditing = () => {
    setIsEditing(true);
  };

  const updateTask = async () => {
    if (selectedTask) {
      setIsTaskLoading(true); // Start loading
      try {
        await axios.put(`${url}/tasks`, selectedTask);
        setTasks(
          tasks.map((task) =>
            task.id === selectedTask.id ? selectedTask : task
          )
        );
        closeModal();
      } catch (err) {
        console.error("Failed to update the task:", err);
      } finally {
        setIsTaskLoading(false); // End loading
      }
    }
  };

  // Handle adding a new task
  const addTask = async () => {
    const errors = validateForm(formValues);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsTaskLoading(true); // Start loading
    try {
      const response = await axios.post(`${url}/tasks`, formValues);
      setTasks([...tasks, response.data]);
      setIsAddTaskModalOpen(false);
      setFormValues({
        title: "",
        description: "",
        assignedTo: "",
        state: "Todo",
      });
      setFormErrors({});
    } catch (err) {
      console.error("Failed to add the task:", err);
    } finally {
      setIsTaskLoading(false); // End loading
    }
  };

  const validateForm = (values) => {
    const errors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!values.title) errors.title = "Title is required";
    if (!values.description) errors.description = "Description is required";
    if (!values.assignedTo) errors.assignedTo = "Assigned To is required";
    else if (!emailPattern.test(values.assignedTo))
      errors.assignedTo = "Invalid email format";
    if (!values.state) errors.state = "Status is required";

    return errors;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}>
      <h2>Dashboard</h2>

      {loading ? (
        <p>Loading tasks...</p>
      ) : error ? (
        <p>Error loading tasks: {error}</p>
      ) : (
        <Grid
          container
          spacing={10}
          sx={{
            marginLeft: "10px",
            width: {
              xs: "90%",
              md: "50%",
            },
          }}>
          <Grid item xs={12}>
            <Grid container>
              <Grid item xs={6} md={8}>
                {" "}
                <h3>Task List</h3>
              </Grid>
              <Grid item xs={6} md={4}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setIsAddTaskModalOpen(true)}
                  sx={{
                    marginTop: {
                      xs: "10%",
                    },
                  }}>
                  Add Task
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid container rowSpacing={1} columnSpacing={5}>
            {tasks.map((task) => (
              <Grid item xs={12} sm={6} md={6} lg={4} key={task.id}>
                <TaskCard task={task} onClick={() => handleCardClick(task)} />
              </Grid>
            ))}
          </Grid>
          <Grid item xs={12}>
            <h3>Task State Distribution</h3>
          </Grid>
          <Grid item xs={12}>
            <div
              style={{
                width: "100%",
                maxWidth: "80%",
                height: "400px",
                margin: "20px auto",
              }}>
              <Pie
                data={pieChartData}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                }}
              />
            </div>
          </Grid>
        </Grid>
      )}
      {isTaskLoading && <p>Loading...</p>}

      <Dialog
        open={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        fullWidth
        maxWidth="md">
        <DialogTitle>Add New Task</DialogTitle>
        <DialogContent sx={{ minHeight: "400px" }}>
          <TextField
            label="Title"
            name="title"
            fullWidth
            onChange={handleInputChange}
            value={formValues.title}
            error={Boolean(formErrors.title)}
            helperText={formErrors.title}
            sx={{ my: 2 }}
          />
          <TextField
            label="Description"
            name="description"
            multiline
            rows={4}
            fullWidth
            onChange={handleInputChange}
            value={formValues.description}
            error={Boolean(formErrors.description)}
            helperText={formErrors.description}
            sx={{ my: 2 }}
          />
          <TextField
            label="Assigned To"
            name="assignedTo"
            fullWidth
            onChange={handleInputChange}
            value={formValues.assignedTo}
            error={Boolean(formErrors.assignedTo)}
            helperText={formErrors.assignedTo}
            sx={{ my: 2 }}
          />
          <FormControl fullWidth>
            <InputLabel id="state-select-label">Status</InputLabel>
            <Select
              labelId="state-select-label"
              name="state"
              value={formValues.state}
              onChange={handleInputChange}>
              <MenuItem value="Todo">Todo</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
            {formErrors.state && (
              <div style={{ color: "red" }}>{formErrors.state}</div>
            )}
          </FormControl>
          <Button
            type="button"
            color="primary"
            variant="contained"
            onClick={addTask}
            sx={{ mt: 2 }}
            disabled={isTaskLoading}>
            {isTaskLoading ? "Loading..." : "Add Task"}
          </Button>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsAddTaskModalOpen(false)}
            color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isModalOpen} onClose={closeModal} fullWidth maxWidth="md">
        <DialogTitle>{selectedTask?.title}</DialogTitle>
        <DialogContent sx={{ minHeight: "400px" }}>
          <TextField
            label="Title"
            value={selectedTask?.title || ""}
            fullWidth
            onChange={(e) =>
              setSelectedTask({
                ...selectedTask,
                title: e.target.value,
              })
            }
            disabled={!isEditing}
            sx={{ my: 2 }}
          />
          <TextField
            label="Description"
            value={selectedTask?.description || ""}
            multiline
            rows={4}
            fullWidth
            onChange={(e) =>
              setSelectedTask({
                ...selectedTask,
                description: e.target.value,
              })
            }
            disabled={!isEditing}
            sx={{ my: 2 }}
          />
          <TextField
            label="Assigned To"
            value={selectedTask?.assignedTo || ""}
            fullWidth
            onChange={(e) =>
              setSelectedTask({
                ...selectedTask,
                assignedTo: e.target.value,
              })
            }
            disabled={!isEditing}
            sx={{ my: 2 }}
          />
          <FormControl fullWidth>
            <InputLabel id="state-select-label">Status</InputLabel>
            <Select
              labelId="state-select-label"
              value={selectedTask?.state || ""}
              onChange={(e) =>
                setSelectedTask({
                  ...selectedTask,
                  state: e.target.value,
                })
              }
              disabled={!isEditing}>
              <MenuItem value="Todo">Todo</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          {isEditing ? (
            <>
              <Button
                onClick={updateTask}
                color="primary"
                disabled={isTaskLoading}>
                {isTaskLoading ? "Loading..." : "Save"}
              </Button>
              <Button onClick={closeModal} color="secondary">
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button onClick={enableEditing} color="primary">
                Edit
              </Button>
              <Button
                onClick={deleteTask}
                color="secondary"
                startIcon={<DeleteIcon />}>
                Delete
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Dashboard;
