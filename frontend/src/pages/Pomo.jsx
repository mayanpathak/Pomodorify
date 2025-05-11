import React, { useEffect } from 'react';
import FooterSection from '../components/FooterSections';
import NavbarSection from '../components/NavbarSection';
import TasksSection from '../components/TaskSection';
import TimerSection from '../components/TimerSection';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTab } from '../redux/appSlice';
import { fetchUserSettings } from '../redux/timerSlice';
import { fetchTasks } from '../redux/taskSlice';
import "../App.css";

const Pomo = () => {
    const dispatch = useDispatch();
    const activeTab = useSelector((state) => state.app.activeTab);
    const timerStatus = useSelector((state) => state.timer.status);
    const taskStatus = useSelector((state) => state.tasks.status);

    // Load settings and tasks on component mount
    useEffect(() => {
        // Load user settings if not already loaded
        if (timerStatus === 'idle') {
            dispatch(fetchUserSettings());
        }
        
        // Load tasks if not already loaded
        if (taskStatus === 'idle') {
            dispatch(fetchTasks());
        }
    }, [dispatch, timerStatus, taskStatus]);

    // Determine background class based on activeTab
    const backgroundClass = 
        activeTab === 'Long Break' ? 'bg-long-break' :
        activeTab === 'Short Break' ? 'bg-short-break' :
        'bg-pomodoro';

    // Function to update activeTab in Redux
    const handleTabChange = (tab) => {
        dispatch(setActiveTab(tab)); // Dispatch the action to update Redux state
    };

    return (
        <div className={`${backgroundClass} min-h-screen w-screen flex flex-col overflow-hidden`}>
            <div className="flex flex-col flex-grow w-full max-w-2xl mx-auto overflow-y-auto">
                <NavbarSection />
                <TimerSection activeTab={activeTab} setActiveTab={handleTabChange} />
                <div className="flex-grow overflow-y-auto"> {/* Ensure scrolling */}
                    <TasksSection />
                </div>
            </div>
            <FooterSection />
        </div>
    );
}

export default Pomo;
