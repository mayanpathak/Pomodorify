// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import taskReducer from './taskSlice';
import appReducer from './appSlice';  // Import the new app slice
import timerReducer from './timerSlice';

const store = configureStore({
    reducer: {
        tasks: taskReducer,
        app: appReducer,  // Add the app slice to the store
        timer: timerReducer
    },
});

export default store;
