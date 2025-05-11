import { useSelector, useDispatch } from "react-redux";
import { OptionBarIcon } from "../assets/Icons";
import CreateTaskArea from "./CreateTaskArea";
import Task from "./TaskTemplate.jsx";
import { 
    selectHighlightedTask, 
    showTaskArea, 
    hideTaskArea, 
    fetchTasks,
    createTaskAsync, 
    updateTaskAsync, 
    deleteTaskAsync,
    completeTaskAsync 
} from "../redux/taskSlice.js";
import { useEffect } from "react";
import TaskSuggestions from './TaskSuggestions';
import TaskBreakdown from './TaskBreakdown';

export default function TasksSection () {
    const dispatch = useDispatch();
    const tasks = useSelector((state) => state.tasks.tasks); // Get tasks from Redux state
    const status = useSelector((state) => state.tasks.status); // Get task loading status
    const isTaskAreaVisible = useSelector((state) => state.tasks.showTaskArea); // Get task area visibility from Redux
    const completedPomodoros = useSelector((state) => state.timer.completedPomodoros); // Get completed Pomodoros from Redux

    // Fetch tasks on component mount
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchTasks());
        }
    }, [dispatch, status]);

    const handleAddTaskClick = () => {
        dispatch(showTaskArea()); // Dispatch action to show the task area
    };

    const handleCancel = () => {
        dispatch(hideTaskArea()); // Dispatch action to hide the task area
    };

    const handleAddTask = (newTask) => {
        dispatch(createTaskAsync(newTask)); // Dispatch async action to add a new task
        dispatch(hideTaskArea()); // Hide the task area after adding a task
    };

    const handleDeleteTask = (id) => {
        dispatch(deleteTaskAsync(id)); // Dispatch async action to delete a task
    };

    const handleEditTask = (id, updatedTask) => {
        dispatch(updateTaskAsync({ id, updatedTask })); // Dispatch async action to edit a task
    };

    const handleCompleteTask = (id) => {
        dispatch(completeTaskAsync(id)); // Dispatch async action to complete a task
    };

    const highlightedTask = useSelector(selectHighlightedTask);
    const highlightedTaskId = highlightedTask ? highlightedTask.id : null;

    // Render loading state
    if (status === 'loading' && tasks.length === 0) {
        return <div className="flex justify-center mt-10">Loading tasks...</div>;
    }

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

            <div className="p-4 flex font-bold justify-between w-9/12 md:w-7/12 lg:w-9/12 mx-auto">
                <h2>Tasks</h2>
                <div className="flex items-center space-x-4">
                    <TaskSuggestions />
                    <a className="cursor-pointer">
                        <OptionBarIcon ClassProp={"text-slate-50"} />    
                    </a>
                </div>
            </div>
            
            <div className="flex justify-center border-t-2 w-9/12 md:w-7/12 lg:w-9/12 border-white mx-auto mb-5"></div>

            <div className="flex items-center flex-col">
                {tasks.map((taskItem) => (
                    <div key={taskItem._id || taskItem.id} className="w-full">
                        <Task
                            key={taskItem._id || taskItem.id} // Support both MongoDB _id and local id
                            id={taskItem._id || taskItem.id}
                            title={taskItem.title}
                            content={taskItem.content}
                            pomodoro={taskItem.pomodoro}
                            isDone={taskItem.isDone}
                            completedPomodoros={taskItem.completedPomodoros}
                            onDelete={handleDeleteTask}
                            onEdit={handleEditTask}
                            onComplete={handleCompleteTask}
                            onCancel={handleCancel}
                            isHighlighted={taskItem._id === highlightedTaskId || taskItem.id === highlightedTaskId}
                        />
                        <div className="flex justify-end w-9/12 md:w-7/12 lg:w-9/12 mx-auto mt-1 mb-3">
                            <TaskBreakdown task={taskItem} />
                        </div>
                    </div>
                ))}             
                
                {isTaskAreaVisible ? (
                    <CreateTaskArea onAdd={handleAddTask} onCancel={handleCancel} />
                ) : (
                    <div className="w-full flex justify-center">
                        <button 
                            className="my-1 round border-white w-9/12 md:w-7/12 lg:w-9/12 hover:border-white text-white border-2 border-dashed btn btn-lg font-bold off-white mx-auto"
                            onClick={handleAddTaskClick}>
                            Add Task
                        </button>
                    </div>
                )}                
            </div>

            {/* Show error if there is one */}
            {status === 'failed' && (
                <div className="text-center mt-4 text-red-500">Failed to load tasks. Please try again.</div>
            )}
        </>
    );
}