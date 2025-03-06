import { useState } from "react";
import {TitleInput, ContentInput, NumberInput, SecondaryButton, ZincButton } from "./InputFields";

export default function CreateTaskAreq({ onCancel, onAdd}) {
    const [showTextarea, setShowTextarea] = useState(false);
    const [task, setTask] = useState({
        title: '', 
        content: '',
        pomodoro: 1
    });

    // Prevent form refresh
    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your save logic here
        console.log("Task Submitted:", task);
        onAdd(task)
        setTask({
            title: '', 
            content: '',
            pomodoro: 0
        })
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTask((prevTask) => ({
            ...prevTask,
            [name]: value
        }));
    };

    // Function to handle the pomodoro value change
    const handlePomodoroChange = (newPomodoroValue) => {
        setTask((prevTask) => ({
            ...prevTask,
            pomodoro: newPomodoroValue
        }));
    };


    const toggleTextarea = () => setShowTextarea(!showTextarea);
    
    return (
        <>
            {/* copy and paste from tasksection */}
             <div className="card my-2  lg:w-9/12 md:w-7/12 w-9/12 bg-white text-zinc-700 shadow-xl">
             <form >
              <div className="card-body">
                  {/* ++ flex justifycenter <div></div> 2x */}
                  <div className="flex justify-between">

                    {/* -- boredr 7 xs*/}
                    {/* ++  placeholder:text-lg*/}
                    <TitleInput value={task.title} onChange={handleInputChange} placeholder={"What are you working on?"} />
                    </div>

                    <p className="font-bold  text-zinc-700" >Est. Pomodoros</p>
                
                    <div className="flex items-center">
                    <NumberInput
                            value={task.pomodoro}
                            onChange={handlePomodoroChange}
                        />
                    </div>

                    {!showTextarea && (
                        <a className="underline text-zinc-400" onClick={toggleTextarea}>+ Add Note</a> 
                    )}

                    {showTextarea && (
                        <ContentInput value={task.content} onChange={handleInputChange} placeholder={"Write Description here"} />
                    )}
                {/* ++ div container for buttons */} 
                <div className="flex justify-end space-x-2">

                    <SecondaryButton value="Cancel" onClick={onCancel} />
                    <ZincButton value="Save" onClick={handleSubmit} />
                            
                </div>
                </div>
            </form>

              </div>
        </>
    )
}