import { UserSettings } from "../models/userSettings.model.js";

// Get user settings
export const getUserSettings = async (req, res) => {
  try {
    console.log("getUserSettings called with req.user:", req.user);
    const userId = req.user.userId;
    console.log("Looking for settings with userId:", userId);
    
    let settings = await UserSettings.findOne({ userId });
    console.log("Settings found:", settings ? "Yes" : "No");
    
    // If settings don't exist, create default settings
    if (!settings) {
      console.log("Creating default settings for userId:", userId);
      settings = new UserSettings({ 
        userId,
        pomodoroTime: 25 * 60 * 1000, // 25 minutes in milliseconds
        shortBreakTime: 5 * 60 * 1000, // 5 minutes in milliseconds
        longBreakTime: 15 * 60 * 1000, // 15 minutes in milliseconds
        pomodorosBeforeLongBreak: 4,
        selectedAlarm: "default",
        alarmVolume: 0.4,
        alarmRepeatCount: 1,
        theme: "default"
      });
      await settings.save();
      console.log("Default settings created successfully");
    }
    
    console.log("Returning settings to client");
    res.status(200).json(settings);
  } catch (error) {
    console.error("Error fetching user settings:", error.message);
    console.error(error.stack);
    res.status(500).json({ error: "Failed to fetch user settings", details: error.message });
  }
};

// Update user settings
export const updateUserSettings = async (req, res) => {
  try {
    console.log("updateUserSettings called with req.user:", req.user);
    console.log("Request body:", req.body);
    const userId = req.user.userId;
    const updates = req.body;
    
    // Find settings document or create one if it doesn't exist
    let settings = await UserSettings.findOne({ userId });
    console.log("Settings found:", settings ? "Yes" : "No");
    
    if (!settings) {
      console.log("Creating new settings with updates for userId:", userId);
      settings = new UserSettings({
        userId,
        ...updates,
      });
      await settings.save();
      console.log("New settings created successfully");
    } else {
      // Apply updates
      console.log("Applying updates to existing settings");
      Object.keys(updates).forEach(key => {
        if (settings.schema.paths[key]) {
          console.log(`Updating ${key} from ${settings[key]} to ${updates[key]}`);
          settings[key] = updates[key];
        } else {
          console.log(`Ignoring unknown field: ${key}`);
        }
      });
      
      await settings.save();
      console.log("Settings updated successfully");
    }
    
    console.log("Returning updated settings to client");
    res.status(200).json(settings);
  } catch (error) {
    console.error("Error updating user settings:", error.message);
    console.error(error.stack);
    res.status(500).json({ error: "Failed to update user settings", details: error.message });
  }
}; 