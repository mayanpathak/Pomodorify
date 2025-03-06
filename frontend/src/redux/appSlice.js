// redux/appSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    activeTab: 'Pomodoro',
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setActiveTab: (state, action) => {
            state.activeTab = action.payload;
        },
    },
});

export const { setActiveTab, } = appSlice.actions;
export default appSlice.reducer;
