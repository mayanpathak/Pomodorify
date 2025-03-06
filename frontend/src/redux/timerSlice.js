// redux/appSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    toggleTimer: false,
    pomodoroTime: 25 * 60 * 1000, // 25 minutes in milliseconds
    shortBreakTime: 5 * 60 * 1000, // 5 minutes in milliseconds
    longBreakTime: 15 * 60 * 1000, // 15 minutes in milliseconds
    completedPomodoros: 0, // Track completed Pomodoro cycles
    pomodorosBeforeLongBreak: 4,
    selectedAlarm: 'hardcore', // Default to 'hardcore'
    alarmList: [], // To store the list of alarm sounds // Default to 4 Pomodoros before a long break
    alarmVolume: 0.4, // Default volume (0.0 to 1.0)
    alarmRepeatCount: 1,

};

const timerSlice = createSlice({
    name: 'timer',
    initialState,
    reducers: {
        toggleTimer: (state) => {
            state.toggleTimer = !state.toggleTimer; // Toggle the timer state
        },
        updatePomodoroTime: (state, action) => {
            state.pomodoroTime = action.payload * 60 * 1000; // convert to milliseconds
        },
        updateShortBreakTime: (state, action) => {
            state.shortBreakTime = action.payload * 60 * 1000;
        },
        updateLongBreakTime: (state, action) => {
            state.longBreakTime = action.payload * 60 * 1000;
        },
        incrementCompletedPomodoros: (state) => {
            state.completedPomodoros += 1;
        },
        resetCompletedPomodoros: (state) => {
            state.completedPomodoros = 0;
        },
        updatePomodorosBeforeLongBreak: (state, action) => {
            state.pomodorosBeforeLongBreak = action.payload;
        },
        setSelectedAlarm: (state, action) => {
            state.selectedAlarm = action.payload;
        },
        setAlarmList: (state, action) => {
            state.alarmList = action.payload;
        },
        setVolume: (state, action) => {
            state.alarmVolume = action.payload;
        },
        setAlarmRepeatCount: (state, action) => {
            state.alarmRepeatCount = action.payload;
        },
    },
});

// Export the action
export const {setAlarmRepeatCount, setVolume,setSelectedAlarm, setAlarmList ,incrementPomodoroCount, pomodorosBeforeLongBreak, toggleTimer,incrementCompletedPomodoros, resetCompletedPomodoros, updatePomodorosBeforeLongBreak, updatePomodoroTime, updateShortBreakTime, updateLongBreakTime } = timerSlice.actions;
export default timerSlice.reducer;