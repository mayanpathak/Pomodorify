import api from './api';

// Default settings to use as fallback when server is unavailable
const defaultSettings = {
  pomodoroTime: 25 * 60 * 1000, // 25 minutes in milliseconds
  shortBreakTime: 5 * 60 * 1000, // 5 minutes in milliseconds
  longBreakTime: 15 * 60 * 1000, // 15 minutes in milliseconds
  pomodorosBeforeLongBreak: 4,
  selectedAlarm: "/alarm1.mp3", // Using relative path instead of import
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
      const response = await api.get('/settings');
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
      const response = await api.patch('/settings', settingsData);
      return response.data;
    } catch (error) {
      console.error('Error updating user settings:', error);
      // Return updated settings locally if server call fails
      console.log('Settings not saved to server, using local only');
      return { ...defaultSettings, ...settingsData };
    }
  },
}; 