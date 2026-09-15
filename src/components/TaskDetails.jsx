import { useParams } from "react-router-dom";

function TaskDetails({ tasks }) {
  const { id } = useParams();
  const task = tasks?.find((item) => item.id === Number(id));
  if(!task){
    return <h2>Task not Found!</h2>
  }

  if (!task) {
    return (
      <div>
        <h1>Task Details</h1>
        <p>Task not found.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Task Details</h1>
      <h2>{task.title}</h2>
      <p>{task.description}</p>
      <p>Status: {task.status}</p>
    </div>
  );
}

export default TaskDetails;