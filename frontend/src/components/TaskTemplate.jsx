import { ThreeDotsIcon, CheckBoxIcon, UpArrowIcon, DownArrowIcon } from "../assets/Icons.jsx";
import {TitleInput, ContentInput, NumberInput, SecondaryButton, ZincButton } from "./InputFields.jsx";
import {toggleDone, highlightTask, updateTaskAsync, deleteTaskAsync, toggleEditMode, toggleExpand } from '../redux/taskSlice.js';
import { useSelector, useDispatch } from 'react-redux';


export default function Task({id, isHighlighted }) {
    const dispatch = useDispatch();
    const task = useSelector((state) => state.tasks.tasks.find((task) => task.id === id || task._id === id));
    const isEditing = useSelector((state) => state.tasks.isEditing);
    const isExpanded = useSelector((state) => state.tasks.isExpanded[id]);
    const completedPomodoros = useSelector((state) => state.timer.completedPomodoros); // Get completed Pomodoros from Redux


    const handleEdit = () => {
        dispatch(toggleEditMode(task.id || task._id));
    };

    const handleSave = () => {
        if (!task.title.trim()) {
            alert("Title cannot be empty!");
            return;
        }
        dispatch(updateTaskAsync({ id: task.id || task._id, updatedTask: task }));
        dispatch(toggleEditMode());
    };

    const handleDelete = () => {
        dispatch(deleteTaskAsync(id));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "title" && value.trim() === "") {
            return;
        }
        // Only update the local state, we'll save it when the user clicks Save
        const updatedTask = { ...task, [name]: value };
        dispatch({ type: 'tasks/localUpdate', payload: { id, updatedTask: { [name]: value } } });
    };

    const handleDone = () => {
        dispatch(toggleDone(id));
    };

    const handlePomodoroChange = (newPomodoroValue) => {
        // Only update the local state, we'll save it when the user clicks Save
        dispatch({ type: 'tasks/localUpdate', payload: { id, updatedTask: { pomodoro: newPomodoroValue } } });
    };

    const handleHighlight = () => {
        dispatch(highlightTask(id)); // Pass the task's ID to highlight only this task
    };

    // Skip rendering if task not found
    if (!task) return null;

    return (
        <>
            <div className="w-full flex justify-center">
                <div className="card my-2 w-9/12 md:w-7/12 lg:w-9/12 bg-white text-zinc-700 shadow-xl mx-auto">
                    {isHighlighted && !isEditing && (
                        <div className="absolute top-0 left-0 h-full w-3 bg-zinc-700"></div>
                    )}
                    <div type="button" className="card-body" onClick={handleHighlight} >
                        {isEditing ? (
                            <>
                                <TitleInput value={task.title} onChange={handleInputChange} placeholder={"Change the task to"}/>
                                
                                <p className="font-bold text-zinc-700">Est. Pomodoros</p>
                                <div className="flex items-center">
                                    <p className="font-bold text-xl text-zinc-400">
                                        <NumberInput value={task.pomodoro} onChange={handlePomodoroChange} />
                                    </p>
                                </div>

                                <ContentInput value={task.content} onChange={handleInputChange} />

                                <div className="flex justify-between">
                                    <div>
                                        {/* Left-aligned delete button */}
                                        <SecondaryButton value="Delete" onClick={handleDelete} />
                                    </div>

                                    <div className="flex space-x-2">
                                        {/* Right-aligned save and cancel buttons */}
                                        <SecondaryButton value="Cancel" onClick={() => dispatch(toggleEditMode())} />
                                        <ZincButton value="Save" onClick={handleSave} />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex justify-between">
                                    <div className="flex justify-start space-x-2">
                                        <a onClick={handleDone} className="cursor-pointer m-1">
                                            <CheckBoxIcon ClassProp={task.isDone ? 'text-red-900' : 'text-zinc-400'} />
                                        </a>
                                        <h2 className={task.isDone ? "line-through text-zinc-400 mt-1" : "mt-1 text-zinc-700 font-bold"}>
                                            {task.title}
                                        </h2>
                                    </div>
                                    
                                    <div className="flex justify-end space-x-2">
                                        <div className="flex items-end">
                                            <p className="font-bold text-lg text-zinc-400">{`${task.completedPomodoros || 0} / ${task.pomodoro}`}</p>
                                            <a type="button" onClick={handleEdit} className="m-1 cursor-pointer">
                                                <ThreeDotsIcon ClassProp="text-zinc-400" />
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between">
                                    <p className={`ml-10 ${isExpanded ? '' : 'line-clamp-2'}`}>
                                        {task.content}
                                    </p>
                                    <button
                                        className="btn border-none m-1 rounded-full bg-white btn-xs hover:bg-white"
                                        onClick={() => dispatch(toggleExpand({ id }))}
                                    >
                                        {isExpanded ? <> less <UpArrowIcon /></> : <> more <DownArrowIcon/></>}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}