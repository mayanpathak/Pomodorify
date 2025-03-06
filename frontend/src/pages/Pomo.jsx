import React from 'react'
import FooterSection from '../components/FooterSections';
import NavbarSection from '../components/NavbarSection';
import TasksSection from '../components/TaskSection';
import TimerSection from '../components/TimerSection';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTab } from '../redux/appSlice'; // Import the action
import "../App.css"

const Pomo = () => {
    const dispatch = useDispatch();
    const activeTab = useSelector((state) => state.app.activeTab); // Get activeTab from Redux

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
        <div className={`${backgroundClass} min-h-screen min-w-screen flex flex-col`}>
            <div className="max-w-2xl mx-auto w-full flex-grow items-center">
                <NavbarSection />
                <TimerSection activeTab={activeTab} setActiveTab={handleTabChange} /> {/* Pass the Redux state and handler */}
                <TasksSection />
            </div>
            <FooterSection />
        </div>
    );
}

export default Pomo