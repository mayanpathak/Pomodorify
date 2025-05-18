import api from './api';
import axios from 'axios';

// API URL
const API_BASE_URL = 'https://pomodorify-rsld.onrender.com/api';

// Default settings to use as fallback when server is unavailable
const defaultSettings = {
  pomodoroTime: 25 * 60 * 1000, // 25 minutes in milliseconds
  shortBreakTime: 5 * 60 * 1000, // 5 minutes in milliseconds
  longBreakTime: 15 * 60 * 1000, // 15 minutes in milliseconds
  pomodorosBeforeLongBreak: 4,
  selectedAlarm: "classic", // Default alarm name
  alarmVolume: 0.4,
  alarmRepeatCount: 1,
  theme: "default"
};

export const settingsService = {
  /**
   * Get user settings
   */
  getUserSettings: async () => {
    try {
      const apiUrl = `${API_BASE_URL}/settings`;
      console.log(`Fetching settings from ${apiUrl}`);
      
      // Get token from localStorage for authorization
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      const response = await axios.get(apiUrl, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching user settings:', error);
      // Return default settings if server call fails
      console.log('Using default settings fallback');
      return defaultSettings;
    }
  },

  /**
   * Update user settings
   */
  updateUserSettings: async (settingsData) => {
    try {
      const apiUrl = `${API_BASE_URL}/settings`;
      console.log(`Updating settings at ${apiUrl}`);
      
      // Get token from localStorage for authorization
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      const response = await axios.patch(apiUrl, settingsData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error updating user settings:', error);
      // Return updated settings locally if server call fails
      console.log('Settings not saved to server, using local only');
      return { ...defaultSettings, ...settingsData };
    }
  },
}; 