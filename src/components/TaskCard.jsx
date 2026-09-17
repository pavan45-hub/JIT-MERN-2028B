
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

