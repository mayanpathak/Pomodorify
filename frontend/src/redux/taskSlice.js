// redux/taskSlice.js
import { createSlice } from "@reduxjs/toolkit";


// Initial state
const initialState = {
    tasks: [], // Ensure tasks is initialized as an empty array
    showTaskArea: false,
    isExpanded: {},
    lastId:0,
    highlightedTaskId: null, 
};

// Create the slice
const taskSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        showTaskArea: (state) => {
            state.showTaskArea = true;
        },
        hideTaskArea: (state) => {
            state.showTaskArea = false;
        },
        addTask: (state, action) => {
            const newTask = {
                ...action.payload,
                id: ++state.lastId // Increment lastId and assign it to the new task
            };
            state.tasks.push(newTask);
        },        
        editTask: (state, action) => {
            const { id, updatedTask } = action.payload;
            const taskIndex = state.tasks.findIndex(task => task.id === id);
            if (taskIndex !== -1) {
                state.tasks[taskIndex] = { ...state.tasks[taskIndex], ...updatedTask };
            }
        },
        deleteTask: (state, action) => {
            state.tasks = state.tasks.filter(task => task.id !== action.payload);
        },
         // Highlight only the task with the given ID
        highlightTask: (state, action) => {
            state.highlightedTaskId = action.payload; // Set the highlighted task ID
        },
        toggleDone: (state, action) => {
            const task = state.tasks.find(task => task.id === action.payload);
            if (task) {
                task.isDone = !task.isDone;
            }
        },
        toggleEditMode: (state, action) => {
            state.isEditing = !state.isEditing;
            state.editedTask = action.payload ? action.payload : null;
        },
        toggleExpand: (state, action) => {
            const { id } = action.payload;
            state.isExpanded[id] = !state.isExpanded[id];
        },
    }
});

// Export actions and reducer
export const { addTask, highlightTask, editTask, deleteTask, toggleDone, toggleEditMode, toggleExpand, showTaskArea, hideTaskArea } = taskSlice.actions;
export default taskSlice.reducer;
export const selectHighlightedTask = (state) => {
    return state.tasks.tasks.find(task => task.id === state.tasks.highlightedTaskId);
};

