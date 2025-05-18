import api from './api';
import axios from 'axios';

// API URL
const API_BASE_URL = 'https://pomodorify-rsld.onrender.com/api';

// Helper function to get authorization headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Default fallback suggestions if API fails
const DEFAULT_SUGGESTIONS = [
  {
    title: "Review your tasks",
    description: "Take time to organize and prioritize your pending tasks",
    estimatedPomodoros: 1,
    category: "productivity",
    priority: "medium",
    reasoning: "Regular task review improves efficiency"
  },
  {
    title: "Break for mindfulness",
    description: "Take a short mindfulness break to clear your mind",
    estimatedPomodoros: 1,
    category: "wellness",
    priority: "medium",
    reasoning: "Helps maintain mental clarity during work sessions"
  }
];

// Default fallback subtasks if API fails
const getDefaultSubtasks = (taskTitle) => [
  {
    title: `Plan: ${taskTitle}`,
    description: "Outline the requirements and steps for this task",
    estimatedPomodoros: 1,
    order: 1
  },
  {
    title: `Execute: ${taskTitle}`,
    description: "Complete the main work for this task",
    estimatedPomodoros: 2,
    order: 2
  },
  {
    title: `Review: ${taskTitle}`,
    description: "Review and finalize the completed work",
    estimatedPomodoros: 1,
    order: 3
  }
];

export const aiService = {
  /**
   * Get task suggestions based on user history
   */
  getSuggestions: async () => {
    try {
      // Get current tasks from local store
      let tasks = [];
      try {
        const tasksJson = localStorage.getItem('tasks');
        if (tasksJson) {
          tasks = JSON.parse(tasksJson);
        }
      } catch (parseError) {
        console.warn('Error parsing stored tasks:', parseError);
      }
      
      // Get completed tasks
      let completedTasks = [];
      try {
        const completedTasksJson = localStorage.getItem('completedTasks');
        if (completedTasksJson) {
          completedTasks = JSON.parse(completedTasksJson);
        }
      } catch (parseError) {
        console.warn('Error parsing stored completed tasks:', parseError);
      }
      
      // User preferences with defaults
      const userPreferences = {
        workFocus: localStorage.getItem('workFocus') || 'study',
        preferredTaskSize: localStorage.getItem('preferredTaskSize') || 'medium',
        categories: ['study', 'personal', 'work']
      };
      
      try {
        const preferredCategories = localStorage.getItem('preferredCategories');
        if (preferredCategories) {
          userPreferences.categories = JSON.parse(preferredCategories);
        }
      } catch (err) {
        console.warn('Error parsing preferred categories:', err);
      }
      
      // Make API request with the data
      const apiUrl = `${API_BASE_URL}/ai/suggest-tasks`;
      console.log(`Getting AI suggestions from ${apiUrl}`);
      
      const response = await axios.post(apiUrl, {
        tasks,
        completedTasks,
        userPreferences
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        }
      });
      
      if (response.data && response.data.suggestions && response.data.suggestions.length > 0) {
        return response.data;
      }
      
      // If no suggestions returned, use defaults
      return { 
        success: true, 
        fallback: true,
        suggestions: DEFAULT_SUGGESTIONS 
      };
    } catch (error) {
      console.error('Error getting task suggestions:', error);
      // Return default suggestions on error
      return { 
        success: true, 
        fallback: true, 
        error: error.message,
        suggestions: DEFAULT_SUGGESTIONS 
      };
    }
  },
  
  /**
   * Break down a task into subtasks
   */
  breakdownTask: async (taskData) => {
    try {
      const apiUrl = `${API_BASE_URL}/ai/breakdown-task`;
      console.log(`Breaking down task at ${apiUrl}`, taskData);
      
      const response = await axios.post(apiUrl, taskData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        }
      });
      
      if (response.data && response.data.subtasks && response.data.subtasks.length > 0) {
        return response.data;
      }
      
      // If no subtasks returned, use defaults
      return {
        success: true,
        fallback: true,
        taskId: taskData.taskId,
        subtasks: getDefaultSubtasks(taskData.taskTitle)
      };
    } catch (error) {
      console.error('Error breaking down task:', error);
      // Return default subtasks on error
      return {
        success: true,
        fallback: true,
        error: error.message,
        taskId: taskData.taskId,
        subtasks: getDefaultSubtasks(taskData.taskTitle)
      };
    }
  }
}; 