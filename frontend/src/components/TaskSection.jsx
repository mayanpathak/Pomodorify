import { OptionBarIcon } from "../assets/Icons";
import CreateTaskArea from "./CreateTaskArea";
import { useSelector, useDispatch } from "react-redux";
import Task from "./TaskTemplate.jsx";
import { showTaskArea, selectHighlightedTask, hideTaskArea, addTask, deleteTask, editTask } from "../redux/taskSlice.js";


export default function TasksSection () {
    const dispatch = useDispatch();
    const tasks = useSelector((state) => state.tasks.tasks); // Get tasks from Redux state
    const isTaskAreaVisible = useSelector((state) => state.tasks.showTaskArea); // Get task area visibility from Redux
    const completedPomodoros = useSelector((state) => state.timer.completedPomodoros); // Get completed Pomodoros from Redux

    const handleAddTaskClick = () => {
        dispatch(showTaskArea()); // Dispatch action to show the task area
    };

    const handleCancel = () => {
        dispatch(hideTaskArea()); // Dispatch action to hide the task area
    };

    const handleAddTask = (newTask) => {
        dispatch(addTask(newTask)); // Dispatch action to add a new task
        dispatch(hideTaskArea()); // Optionally hide the task area after adding a task
    };

    const handleDeleteTask = (id) => {
        dispatch(deleteTask(id)); // Dispatch action to delete a task
    };

    const handleEditTask = (id, updatedTask) => {
        dispatch(editTask({ id, updatedTask }));         // Dispatch action to edit a task
    };

    const highlightedTask = useSelector(selectHighlightedTask);
    const highlightedTaskId = highlightedTask ? highlightedTask.id : null;

    return (
        <>  
            <p className="text-center mt-5 font-bold">#{completedPomodoros}</p> {/* Display completed Pomodoros */}
            {highlightedTask ? (
                <>
                    <h1 className="text-center mt-4 font-bold">{highlightedTask.title}</h1>

                </>
            ) : (
                <>
                    <h1 className="text-center mt-4 font-bold">Highlighted task here</h1>
                </>
            )}

            {/* ++  flex justify-between lg:w-9/12 md:w-7/12 w-7/12 mx-auto <div></div> */}
            <div className="p-4 flex font-bold justify-between lg:w-9/12 md:w-7/12 w-9/12 mx-auto">
                <h2>Tasks</h2>
                {/* ++ button*/}
                <a className="cursor-pointer" >
                <OptionBarIcon ClassProp={"text-slate-50"} />    
                </a>
            </div>

            
            {/* ++ divider*/}
            
            <div className="flex justify-center border-t-2 lg:w-9/12 md:w-7/12 w-9/12 border-white mx-auto mb-5"></div>

            {/* ++ flex justify-center<div></div> */}
            <div className="flex items-center flex-col">


             
                {tasks.map((taskItem, index) => {
                    console.log("id of index" + index)
                    return <Task
                        key={taskItem.id} // Ensure key is unique
                        id={taskItem.id}
                        title={taskItem.title}
                        content={taskItem.content}
                        pomodoro={taskItem.pomodoro}
                        onDelete={handleDeleteTask}
                        onEdit={handleEditTask}
                        onCancel={handleCancel}
                        isHighlighted={taskItem.id === highlightedTaskId} // Pass highlighted status

                    />
                })}             
                
                {/* ++ round lg:w-9/12 and large button */}
                 {isTaskAreaVisible ? (
                    <CreateTaskArea onAdd={handleAddTask} onCancel={handleCancel} onDelete={deleteTask} />
                ) : (
                    <button
                        className="my-1 round border-white lg:w-9/12 w-9/12  md:w-7/12 hover:border-white text-white border-2 border-dashed btn btn-lg font-bold off-white"
                        onClick={handleAddTaskClick}>
                        Add Task
                    </button>)}                
            </div>

        </>
    );
}