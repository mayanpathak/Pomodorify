import mongoose from "mongoose";

const pomodoroSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    taskId: {
      type: String,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number, // in milliseconds
      required: true,
    },
    sessionType: {
      type: String,
      enum: ["Pomodoro", "Short Break", "Long Break"],
      default: "Pomodoro",
    },
    completed: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const PomodoroSession = mongoose.model("PomodoroSession", pomodoroSessionSchema);