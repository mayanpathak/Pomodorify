// redux/timerSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { settingsService } from '../services/settingsService';
import { pomodoroService } from '../services/pomodoroService';

export const fetchUserSettings = createAsyncThunk(
  'timer/fetchUserSettings',
  async (_, { rejectWithValue }) => {
    try {
      return await settingsService.getUserSettings();
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch user settings");
    }
  }
);

export const updateUserSettings = createAsyncThunk(
  'timer/updateUserSettings',
  async (settingsData, { rejectWithValue }) => {
    try {
      return await settingsService.updateUserSettings(settingsData);
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update user settings");
    }
  }
);

export const startPomodoroSession = createAsyncThunk(
  'timer/startPomodoroSession',
  async (sessionData, { rejectWithValue }) => {
    try {
      return await pomodoroService.startSession(sessionData);
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to start pomodoro session");
    }
  }
);

export const endPomodoroSession = createAsyncThunk(
  'timer/endPomodoroSession',
  async (sessionData, { rejectWithValue }) => {
    try {
      return await pomodoroService.endSession(sessionData);
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to end pomodoro session");
    }
  }
);

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
    status: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
    error: null,
    currentSession: null, // To track the current Pomodoro session
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
    extraReducers: (builder) => {
        builder
            // Fetch user settings
            .addCase(fetchUserSettings.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUserSettings.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Update timer settings from user settings
                if (action.payload) {
                    state.pomodoroTime = action.payload.pomodoroTime;
                    state.shortBreakTime = action.payload.shortBreakTime;
                    state.longBreakTime = action.payload.longBreakTime;
                    state.pomodorosBeforeLongBreak = action.payload.pomodorosBeforeLongBreak;
                    state.selectedAlarm = action.payload.selectedAlarm;
                    state.alarmVolume = action.payload.alarmVolume;
                    state.alarmRepeatCount = action.payload.alarmRepeatCount;
                }
            })
            .addCase(fetchUserSettings.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            
            // Update user settings
            .addCase(updateUserSettings.fulfilled, (state, action) => {
                if (action.payload) {
                    state.pomodoroTime = action.payload.pomodoroTime;
                    state.shortBreakTime = action.payload.shortBreakTime;
                    state.longBreakTime = action.payload.longBreakTime;
                    state.pomodorosBeforeLongBreak = action.payload.pomodorosBeforeLongBreak;
                    state.selectedAlarm = action.payload.selectedAlarm;
                    state.alarmVolume = action.payload.alarmVolume;
                    state.alarmRepeatCount = action.payload.alarmRepeatCount;
                }
            })
            
            // Start Pomodoro session
            .addCase(startPomodoroSession.fulfilled, (state, action) => {
                state.currentSession = action.payload;
            })
            
            // End Pomodoro session
            .addCase(endPomodoroSession.fulfilled, (state) => {
                state.currentSession = null;
            });
    },
});

// Export the action
export const {
    setAlarmRepeatCount, 
    setVolume,
    setSelectedAlarm, 
    setAlarmList,
    incrementPomodoroCount, 
    pomodorosBeforeLongBreak, 
    toggleTimer,
    incrementCompletedPomodoros, 
    resetCompletedPomodoros, 
    updatePomodorosBeforeLongBreak, 
    updatePomodoroTime, 
    updateShortBreakTime, 
    updateLongBreakTime 
} = timerSlice.actions;

export default timerSlice.reducer;