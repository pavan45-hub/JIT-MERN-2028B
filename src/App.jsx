import "./App.css";

import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Tasks from "./components/Tasks";
import TaskDetails from "./components/TaskDetails";
import Login from "./components/login";
import Register from "./components/Register";

import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

function App() {
    const [tasks, setTasks] = useState([]);
    const [backendError, setBackendError] = useState(false);

    // Get tasks from backend
    useEffect(() => {
        fetch("http://localhost:5000/api/tasks")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Backend error");
                }

                return response.json();
            })
            .then((data) => {
                setTasks(data);
                setBackendError(false);
            })
            .catch((error) => {
                console.error("Error fetching tasks:", error);
                setBackendError(true);
            });
    }, []);

    return (
        <>
            <Navbar />

            {backendError && (
                <div className="backend-error">
                    Backend server is not connected.
                </div>
            )}

            <Routes>

                {/* Login */}
                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* Register */}
                <Route
                    path="/register"
                    element={<Register />}
                />

                {/* Dashboard */}
                <Route
                    path="/"
                    element={
                        <Dashboard
                            tasks={tasks}
                            setTasks={setTasks}
                        />
                    }
                />

                {/* Tasks */}
                <Route
                    path="/tasks"
                    element={
                        <Tasks
                            tasks={tasks}
                            setTasks={setTasks}
                        />
                    }
                />

                {/* Task Details */}
                <Route
                    path="/tasks/:id"
                    element={
                        <TaskDetails
                            tasks={tasks}
                        />
                    }
                />

            </Routes>
        </>
    );
}

export default App;