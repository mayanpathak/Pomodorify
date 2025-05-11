import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      default: "",
    },
    pomodoro: {
      type: Number,
      default: 1,
    },
    isDone: {
      type: Boolean,
      default: false,
    },
    completedPomodoros: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Task = mongoose.model("Task", taskSchema);