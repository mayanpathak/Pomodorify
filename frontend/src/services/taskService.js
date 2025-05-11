import api from './api';

// Default empty tasks array to use as fallback
const defaultTasks = [];

// Local ID counter for offline tasks
let localIdCounter = 1000;

export const taskService = {
  /**
   * Get all tasks for the authenticated user
   */
  getTasks: async () => {
    try {
      const response = await api.get('/tasks');
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      // Return whatever tasks we might have in localStorage as a fallback
      const localTasks = localStorage.getItem('localTasks');
      return localTasks ? JSON.parse(localTasks) : defaultTasks;
    }
  },

  /**
   * Get a specific task by ID
   */
  getTaskById: async (taskId) => {
    try {
      const response = await api.get(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching task ${taskId}:`, error);
      // Try to find the task in localStorage
      const localTasks = localStorage.getItem('localTasks');
      if (localTasks) {
        const tasks = JSON.parse(localTasks);
        const task = tasks.find(t => t.id === taskId || t._id === taskId);
        if (task) return task;
      }
      throw error;
    }
  },

  /**
   * Create a new task
   */
  createTask: async (taskData) => {
    try {
      const response = await api.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      // Create a local task if server is unavailable
      const newTask = {
        ...taskData,
        id: `local_${localIdCounter++}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDone: false,
        completedPomodoros: 0
      };
      
      // Add to localStorage
      const localTasks = localStorage.getItem('localTasks');
      const tasks = localTasks ? JSON.parse(localTasks) : [];
      tasks.push(newTask);
      localStorage.setItem('localTasks', JSON.stringify(tasks));
      
      return newTask;
    }
  },

  /**
   * Update an existing task
   */
  updateTask: async (taskId, taskData) => {
    try {
      const response = await api.put(`/tasks/${taskId}`, taskData);
      return response.data;
    } catch (error) {
      console.error(`Error updating task ${taskId}:`, error);
      // Update task locally if server is unavailable
      const localTasks = localStorage.getItem('localTasks');
      if (localTasks) {
        const tasks = JSON.parse(localTasks);
        const index = tasks.findIndex(t => t.id === taskId || t._id === taskId);
        if (index !== -1) {
          tasks[index] = { ...tasks[index], ...taskData, updatedAt: new Date().toISOString() };
          localStorage.setItem('localTasks', JSON.stringify(tasks));
          return tasks[index];
        }
      }
      throw error;
    }
  },

  /**
   * Delete a task
   */
  deleteTask: async (taskId) => {
    try {
      const response = await api.delete(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting task ${taskId}:`, error);
      
      // If it's a 404 error, the task doesn't exist on the server
      // This is not really an error - it means the task is already gone
      if (error.response && error.response.status === 404) {
        // Remove from localStorage if it exists there
        const localTasks = localStorage.getItem('localTasks');
        if (localTasks) {
          const tasks = JSON.parse(localTasks);
          const filteredTasks = tasks.filter(t => t.id !== taskId && t._id !== taskId);
          localStorage.setItem('localTasks', JSON.stringify(filteredTasks));
        }
        // Return success since the goal was to delete the task, and it's not there anymore
        return { message: "Task deleted successfully" };
      }
      
      // Handle other errors or offline mode
      // Delete task locally if server is unavailable
      const localTasks = localStorage.getItem('localTasks');
      if (localTasks) {
        const tasks = JSON.parse(localTasks);
        const filteredTasks = tasks.filter(t => t.id !== taskId && t._id !== taskId);
        localStorage.setItem('localTasks', JSON.stringify(filteredTasks));
        return { message: "Task deleted successfully (local only)" };
      }
      throw error;
    }
  },

  /**
   * Mark a task as complete
   */
  completeTask: async (taskId) => {
    try {
      const response = await api.patch(`/tasks/${taskId}/complete`);
      return response.data;
    } catch (error) {
      console.error(`Error completing task ${taskId}:`, error);
      
      // If it's a 404 error, the task doesn't exist on the server
      if (error.response && error.response.status === 404) {
        // Remove from localStorage if it exists there
        const localTasks = localStorage.getItem('localTasks');
        if (localTasks) {
          const tasks = JSON.parse(localTasks);
          const index = tasks.findIndex(t => t.id === taskId || t._id === taskId);
          if (index !== -1) {
            tasks[index] = { ...tasks[index], isDone: true, updatedAt: new Date().toISOString() };
            localStorage.setItem('localTasks', JSON.stringify(tasks));
            return tasks[index];
          }
        }
        // Return a dummy object if not in localStorage either
        return { id: taskId, _id: taskId, isDone: true };
      }
      
      // Handle other errors or offline mode
      const localTasks = localStorage.getItem('localTasks');
      if (localTasks) {
        const tasks = JSON.parse(localTasks);
        const index = tasks.findIndex(t => t.id === taskId || t._id === taskId);
        if (index !== -1) {
          tasks[index] = { ...tasks[index], isDone: true, updatedAt: new Date().toISOString() };
          localStorage.setItem('localTasks', JSON.stringify(tasks));
          return tasks[index];
        }
      }
      throw error;
    }
  },

  /**
   * Increment the completed Pomodoro count for a task
   */
  incrementTaskPomodoro: async (taskId) => {
    try {
      const response = await api.patch(`/tasks/${taskId}/increment-pomodoro`);
      return response.data;
    } catch (error) {
      console.error(`Error incrementing pomodoro for task ${taskId}:`, error);
      
      // If it's a 404 error, the task doesn't exist on the server
      if (error.response && error.response.status === 404) {
        // Remove from localStorage if it exists there
        const localTasks = localStorage.getItem('localTasks');
        if (localTasks) {
          const tasks = JSON.parse(localTasks);
          const index = tasks.findIndex(t => t.id === taskId || t._id === taskId);
          if (index !== -1) {
            const completedPomodoros = (tasks[index].completedPomodoros || 0) + 1;
            tasks[index] = { ...tasks[index], completedPomodoros, updatedAt: new Date().toISOString() };
            localStorage.setItem('localTasks', JSON.stringify(tasks));
            return tasks[index];
          }
        }
        // Return a dummy object if not in localStorage either
        return { id: taskId, _id: taskId, completedPomodoros: 0 };
      }
      
      // Handle other errors or offline mode
      const localTasks = localStorage.getItem('localTasks');
      if (localTasks) {
        const tasks = JSON.parse(localTasks);
        const index = tasks.findIndex(t => t.id === taskId || t._id === taskId);
        if (index !== -1) {
          const completedPomodoros = (tasks[index].completedPomodoros || 0) + 1;
          tasks[index] = { ...tasks[index], completedPomodoros, updatedAt: new Date().toISOString() };
          localStorage.setItem('localTasks', JSON.stringify(tasks));
          return tasks[index];
        }
      }
      throw error;
    }
  },
};
