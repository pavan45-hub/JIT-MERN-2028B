import StatCard from "./StatCard";
import TaskCard from "./TaskCard";
import AddTask from "./AddTask";

function Dashboard(props) {

    async function toggleTask(id, currentStatus) {
        const newStatus = currentStatus === "Completed" ? "Pending" : "Completed";

        try {
            const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    status: newStatus
                })
            });

            if (!response.ok) {
                throw new Error("Failed to update task");
            }

            const updatedTask = await response.json();

            props.setTasks((currentTasks) =>
                currentTasks.map((task) =>
                    String(task._id) === String(id) ? updatedTask : task
                )
            );
        } catch (error) {
            console.error("Status update error:", error);
        }
    }

    function addTask(newTask) {
        props.setTasks((currentTasks) => [...currentTasks, newTask]);
    }

    async function deleteTask(id) {
        try {
            const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                throw new Error("Failed to delete task");
            }

            props.setTasks((currentTasks) =>
                currentTasks.filter((task) => String(task._id) !== String(id))
            );
        } catch (error) {
            console.error("Delete error:", error);
        }
    }

    const totalTasks = props.tasks.length;
    const completedTasks = props.tasks.filter((task) => task.status === "Completed").length;
    const pendingTasks = props.tasks.filter((task) => task.status === "Pending").length;

    return (
        <main>
            <div className="stats-container">
                <StatCard title="Total Tasks" value={totalTasks} />
                <StatCard title="Completed" value={completedTasks} />
                <StatCard title="Pending" value={pendingTasks} />
            </div>

            <AddTask onAddTask={addTask} />

            <h2>Recent Tasks</h2>

            <div className="tasks-container">
                {props.tasks.map((task) => (
                    <TaskCard
                        key={task._id}
                        id={task._id}
                        title={task.title}
                        description={task.description}
                        status={task.status}
                        onToggle={() => toggleTask(task._id, task.status)}
                        onDelete={() => deleteTask(task._id)}
                    />
                ))}
            </div>
        </main>
    );
}

export default Dashboard;

