
import { Link } from "react-router-dom";

function TaskCard(props) {

    return (
        <div className="task-card">

            <h3>
                {props.title}
            </h3>

            <p>
                {props.description}
            </p>

            <p>
                <strong>Status:</strong>{" "}
                {props.status}
            </p>

            <Link to={`/tasks/${props.id}`}>View Details</Link>


            {/* CHANGE STATUS */}
            <button
                type="button"
                onClick={props.onToggle}
            >
                {props.status === "Completed"
                    ? "Mark as Pending"
                    : "Mark as Completed"}
            </button>


            {/* DELETE */}
            <button
                type="button"
                onClick={props.onDelete}
            >
                Delete
            </button>

        </div>
    );
}

export default TaskCard;

