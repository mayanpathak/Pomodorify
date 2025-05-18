// redux/taskSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { taskService } from "../services/taskService";
import { aiService } from '../services/aiService';
import { createSelector } from '@reduxjs/toolkit';

// Async thunks for API operations
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, { rejectWithValue }) => {
    try {
      return await taskService.getTasks();
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch tasks");
    }
  }
);

export const createTaskAsync = createAsyncThunk(
  "tasks/createTask",
  async (taskData, { rejectWithValue }) => {
    try {
      return await taskService.createTask(taskData);
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create task");
    }
  }
);

export const updateTaskAsync = createAsyncThunk(
  "tasks/updateTask",
  async ({ id, updatedTask }, { rejectWithValue }) => {
    try {
      return await taskService.updateTask(id, updatedTask);
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update task");
    }
  }
);

export const deleteTaskAsync = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId, { rejectWithValue }) => {
    try {
      await taskService.deleteTask(taskId);
      return taskId;
    } catch (error) {
      // If the error is from our taskService with a special message indicating
      // that the task was deleted locally or not found (404), still return the taskId
      // so we can remove it from the state
      if (error.response?.status === 404 || 
          (error.message && error.message.includes("Task deleted successfully"))) {
        console.warn(`Task ${taskId} not found on server, removing from local state`);
        return taskId;
      }
      
      return rejectWithValue(error.response?.data || "Failed to delete task");
    }
  }
);

export const completeTaskAsync = createAsyncThunk(
  "tasks/completeTask",
  async (taskId, { rejectWithValue }) => {
    try {
      return await taskService.completeTask(taskId);
    } catch (error) {
      // If the task is not found (404), it may have been deleted or never existed
      // In this case, we want to handle it gracefully instead of showing an error
      if (error.response?.status === 404) {
        console.warn(`Task ${taskId} not found for completion, may have been deleted`);
        return { _id: taskId, id: taskId, isDone: true };
      }
      
      return rejectWithValue(error.response?.data || "Failed to complete task");
    }
  }
);

export const incrementTaskPomodoroAsync = createAsyncThunk(
  "tasks/incrementTaskPomodoro",
  async (taskId, { rejectWithValue }) => {
    try {
      return await taskService.incrementTaskPomodoro(taskId);
    } catch (error) {
      // If the task is not found (404), it may have been deleted or never existed
      // In this case, we want to handle it gracefully instead of showing an error
      if (error.response?.status === 404) {
        console.warn(`Task ${taskId} not found for incrementing pomodoro, may have been deleted`);
        return { _id: taskId, id: taskId, completedPomodoros: 0 };
      }
      
      return rejectWithValue(error.response?.data || "Failed to increment pomodoro");
    }
  }
);

export const getSuggestedTasks = createAsyncThunk(
  'tasks/getSuggestedTasks',
  async (_, { rejectWithValue }) => {
    try {
      const result = await aiService.getSuggestions();
      return result.suggestions;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to get task suggestions");
    }
  }
);

export const breakdownTask = createAsyncThunk(
  'tasks/breakdownTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const result = await aiService.breakdownTask(taskData);
      return result;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to break down task");
    }
  }
);

// Initial state
const initialState = {
    tasks: [], // Ensure tasks is initialized as an empty array
    showTaskArea: false,
    isExpanded: {},
    lastId: 0,
    highlightedTaskId: null,
    status: "idle", // 'idle', 'loading', 'succeeded', 'failed'
    error: null,
    suggestedTasks: [],
    subtasks: {},
    aiStatus: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
    aiError: null,
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
        highlightTask: (state, action) => {
            state.highlightedTaskId = action.payload; // Set the highlighted task ID
        },
        toggleDone: (state, action) => {
            const task = state.tasks.find(task => task.id === action.payload || task._id === action.payload);
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
        // Add a localUpdate reducer for updating task fields locally before saving to backend
        localUpdate: (state, action) => {
            const { id, updatedTask } = action.payload;
            const taskIndex = state.tasks.findIndex(task => task.id === id || task._id === id);
            if (taskIndex !== -1) {
                // Only update the specified fields
                state.tasks[taskIndex] = { 
                    ...state.tasks[taskIndex], 
                    ...updatedTask 
                };
            }
        },
        // Reset the task state to initial values - used when logging in/out
        resetTaskState: (state) => {
            Object.assign(state, initialState);
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch tasks
            .addCase(fetchTasks.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.tasks = action.payload;
                state.lastId = action.payload.length > 0 
                    ? Math.max(...action.payload.map(task => task.id || task._id).filter(id => id)) 
                    : 0;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            
            // Create task
            .addCase(createTaskAsync.pending, (state) => {
                state.status = "loading";
            })
            .addCase(createTaskAsync.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.tasks.push(action.payload);
                if (action.payload.id || action.payload._id) {
                    const id = action.payload.id || action.payload._id;
                    state.lastId = Math.max(state.lastId, id);
                }
            })
            .addCase(createTaskAsync.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            
            // Update task
            .addCase(updateTaskAsync.pending, (state) => {
                state.status = "loading";
            })
            .addCase(updateTaskAsync.fulfilled, (state, action) => {
                state.status = "succeeded";
                const taskId = action.payload.id || action.payload._id;
                const index = state.tasks.findIndex(task => 
                    (task.id && task.id === taskId) || (task._id && task._id === taskId)
                );
                if (index !== -1) {
                    state.tasks[index] = action.payload;
                }
            })
            .addCase(updateTaskAsync.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            
            // Delete task
            .addCase(deleteTaskAsync.pending, (state) => {
                state.status = "loading";
            })
            .addCase(deleteTaskAsync.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.tasks = state.tasks.filter(task => 
                    (task.id !== action.payload) && (task._id !== action.payload)
                );
                if (state.highlightedTaskId === action.payload) {
                    state.highlightedTaskId = null;
                }
            })
            .addCase(deleteTaskAsync.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            
            // Complete task
            .addCase(completeTaskAsync.fulfilled, (state, action) => {
                const taskId = action.payload.id || action.payload._id;
                const index = state.tasks.findIndex(task => 
                    (task.id && task.id === taskId) || (task._id && task._id === taskId)
                );
                if (index !== -1) {
                    state.tasks[index].isDone = true;
                }
            })
            
            // Increment pomodoro
            .addCase(incrementTaskPomodoroAsync.fulfilled, (state, action) => {
                const taskId = action.payload.id || action.payload._id;
                const index = state.tasks.findIndex(task => 
                    (task.id && task.id === taskId) || (task._id && task._id === taskId)
                );
                if (index !== -1) {
                    state.tasks[index].completedPomodoros = action.payload.completedPomodoros;
                }
            })
            
            // Get suggested tasks
            .addCase(getSuggestedTasks.pending, (state) => {
                state.aiStatus = 'loading';
            })
            .addCase(getSuggestedTasks.fulfilled, (state, action) => {
                state.aiStatus = 'succeeded';
                state.suggestedTasks = action.payload;
            })
            .addCase(getSuggestedTasks.rejected, (state, action) => {
                state.aiStatus = 'failed';
                state.aiError = action.payload;
            })
            
            // Breakdown task
            .addCase(breakdownTask.pending, (state) => {
                state.aiStatus = 'loading';
            })
            .addCase(breakdownTask.fulfilled, (state, action) => {
                state.aiStatus = 'succeeded';
                // Store subtasks with the parent task ID as the key
                state.subtasks[action.payload.taskId] = action.payload.subtasks;
            })
            .addCase(breakdownTask.rejected, (state, action) => {
                state.aiStatus = 'failed';
                state.aiError = action.payload;
            });
    }
});

// Export actions and reducer
export const { 
    localUpdate, 
    highlightTask, 
    toggleDone, 
    toggleEditMode, 
    toggleExpand, 
    showTaskArea, 
    hideTaskArea,
    resetTaskState 
} = taskSlice.actions;
export default taskSlice.reducer;

// Base selectors
export const selectTasksState = state => state.tasks;
export const selectAllTasks = state => state.tasks.tasks;
export const selectHighlightedTaskId = state => state.tasks.highlightedTaskId;
export const selectTasksStatus = state => state.tasks.status;
export const selectTasksError = state => state.tasks.error;
export const selectSuggestedTasks = state => state.tasks.suggestedTasks;
export const selectAiStatus = state => state.tasks.aiStatus;
export const selectSubtasks = state => state.tasks.subtasks;

// Memoized selectors
export const selectTaskById = createSelector(
    [selectAllTasks, (_, taskId) => taskId],
    (tasks, taskId) => tasks.find(task => 
        (task.id && task.id === taskId) || 
        (task._id && task._id === taskId)
    )
);

export const selectHighlightedTask = createSelector(
    [selectAllTasks, selectHighlightedTaskId],
    (tasks, highlightedTaskId) => {
        if (!highlightedTaskId) return null;
        return tasks.find(task => 
            (task.id && task.id === highlightedTaskId) || 
            (task._id && task._id === highlightedTaskId)
        );
    }
);

export const selectCompletedTasks = createSelector(
    [selectAllTasks],
    (tasks) => tasks.filter(task => task.isDone)
);

export const selectIncompleteTasks = createSelector(
    [selectAllTasks],
    (tasks) => tasks.filter(task => !task.isDone)
);

export const selectTaskSubtasks = createSelector(
    [selectSubtasks, (_, taskId) => taskId],
    (subtasks, taskId) => subtasks[taskId] || []
);

export const selectIsAiLoading = createSelector(
    [selectAiStatus],
    (aiStatus) => aiStatus === 'loading'
);

