import mongoose from "mongoose";

const userSettingsSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    pomodoroTime: {
      type: Number,
      default: 25 * 60 * 1000, // 25 minutes in milliseconds
    },
    shortBreakTime: {
      type: Number,
      default: 5 * 60 * 1000, // 5 minutes in milliseconds
    },
    longBreakTime: {
      type: Number,
      default: 15 * 60 * 1000, // 15 minutes in milliseconds
    },
    pomodorosBeforeLongBreak: {
      type: Number,
      default: 4,
    },
    selectedAlarm: {
      type: String,
      default: "hardcore",
    },
    alarmVolume: {
      type: Number,
      default: 0.4,
      min: 0,
      max: 1,
    },
    alarmRepeatCount: {
      type: Number,
      default: 1,
      min: 1,
    },
    theme: {
      type: String,
      default: "default",
    },
  },
  { timestamps: true }
);

export const UserSettings = mongoose.model("UserSettings", userSettingsSchema); 