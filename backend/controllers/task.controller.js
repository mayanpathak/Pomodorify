import { Task } from "../models/task.model.js";

// Get all tasks for a user
export const getTasks = async (req, res) => {
  try {
    console.log("getTasks called with req.user:", req.user);
    const userId = req.user.userId;
    console.log("Fetching tasks for userId:", userId);
    
    const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
    console.log(`Found ${tasks.length} tasks for user ${userId}`);
    
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
    console.error(error.stack);
    res.status(500).json({ error: "Failed to fetch tasks", details: error.message });
  }
};

// Get a specific task
export const getTaskById = async (req, res) => {
  try {
    console.log("getTaskById called with req.user:", req.user);
    const { taskId } = req.params;
    const userId = req.user.userId;
    
    // Check if taskId is in valid MongoDB ObjectId format
    if (!taskId.match(/^[0-9a-fA-F]{24}$/)) {
      console.log(`Invalid task ID format: ${taskId}`);
      return res.status(400).json({ error: "Invalid task ID format" });
    }
    
    console.log(`Looking for task ${taskId} for user ${userId}`);
    
    const task = await Task.findOne({ _id: taskId, userId });
    
    if (!task) {
      console.log(`Task ${taskId} not found for user ${userId}`);
      return res.status(404).json({ error: "Task not found" });
    }
    
    console.log("Task found, returning to client");
    res.status(200).json(task);
  } catch (error) {
    console.error("Error fetching task:", error.message);
    console.error(error.stack);
    
    // If it's a MongoDB CastError (invalid ObjectId), return a 400 error
    if (error.name === "CastError" && error.kind === "ObjectId") {
      return res.status(400).json({ error: "Invalid task ID format" });
    }
    
    res.status(500).json({ error: "Failed to fetch task", details: error.message });
  }
};

// Create a new task
export const createTask = async (req, res) => {
  try {
    console.log("createTask called with req.user:", req.user);
    console.log("Request body:", req.body);
    const { title, content, pomodoro } = req.body;
    const userId = req.user.userId;
    
    console.log(`Creating new task for user ${userId}: ${title}`);
    const newTask = new Task({
      userId,
      title,
      content,
      pomodoro: pomodoro || 1,
    });
    
    await newTask.save();
    console.log(`Task created with ID: ${newTask._id}`);
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error creating task:", error.message);
    console.error(error.stack);
    res.status(500).json({ error: "Failed to create task", details: error.message });
  }
};

// Update a task
export const updateTask = async (req, res) => {
  try {
    console.log("updateTask called with req.user:", req.user);
    console.log("Request body:", req.body);
    const { taskId } = req.params;
    const userId = req.user.userId;
    const updates = req.body;
    
    // Check if taskId is in valid MongoDB ObjectId format
    if (!taskId.match(/^[0-9a-fA-F]{24}$/)) {
      console.log(`Invalid task ID format: ${taskId}`);
      return res.status(400).json({ error: "Invalid task ID format" });
    }
    
    console.log(`Updating task ${taskId} for user ${userId}`);
    const task = await Task.findOneAndUpdate(
      { _id: taskId, userId },
      updates,
      { new: true }
    );
    
    if (!task) {
      console.log(`Task ${taskId} not found for update`);
      return res.status(404).json({ error: "Task not found" });
    }
    
    console.log("Task updated successfully");
    res.status(200).json(task);
  } catch (error) {
    console.error("Error updating task:", error.message);
    console.error(error.stack);
    
    // If it's a MongoDB CastError (invalid ObjectId), return a 400 error
    if (error.name === "CastError" && error.kind === "ObjectId") {
      return res.status(400).json({ error: "Invalid task ID format" });
    }
    
    res.status(500).json({ error: "Failed to update task", details: error.message });
  }
};

// Delete a task
export const deleteTask = async (req, res) => {
  try {
    console.log("deleteTask called with req.user:", req.user);
    const { taskId } = req.params;
    const userId = req.user.userId;
    
    // Check if taskId is in valid MongoDB ObjectId format
    if (!taskId.match(/^[0-9a-fA-F]{24}$/)) {
      console.log(`Invalid task ID format: ${taskId}`);
      return res.status(400).json({ error: "Invalid task ID format" });
    }
    
    console.log(`Deleting task ${taskId} for user ${userId}`);
    const task = await Task.findOneAndDelete({ _id: taskId, userId });
    
    if (!task) {
      console.log(`Task ${taskId} not found for deletion`);
      return res.status(404).json({ error: "Task not found" });
    }
    
    console.log("Task deleted successfully");
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error.message);
    console.error(error.stack);
    
    // If it's a MongoDB CastError (invalid ObjectId), return a 400 error
    if (error.name === "CastError" && error.kind === "ObjectId") {
      return res.status(400).json({ error: "Invalid task ID format" });
    }
    
    res.status(500).json({ error: "Failed to delete task", details: error.message });
  }
};

// Mark a task as complete
export const completeTask = async (req, res) => {
  try {
    console.log("completeTask called with req.user:", req.user);
    const { taskId } = req.params;
    const userId = req.user.userId;
    
    // Check if taskId is in valid MongoDB ObjectId format
    if (!taskId.match(/^[0-9a-fA-F]{24}$/)) {
      console.log(`Invalid task ID format: ${taskId}`);
      return res.status(400).json({ error: "Invalid task ID format" });
    }
    
    console.log(`Marking task ${taskId} as complete for user ${userId}`);
    const task = await Task.findOneAndUpdate(
      { _id: taskId, userId },
      { isDone: true },
      { new: true }
    );
    
    if (!task) {
      console.log(`Task ${taskId} not found for completion`);
      return res.status(404).json({ error: "Task not found" });
    }
    
    console.log("Task marked as complete");
    res.status(200).json(task);
  } catch (error) {
    console.error("Error completing task:", error.message);
    console.error(error.stack);
    
    // If it's a MongoDB CastError (invalid ObjectId), return a 400 error
    if (error.name === "CastError" && error.kind === "ObjectId") {
      return res.status(400).json({ error: "Invalid task ID format" });
    }
    
    res.status(500).json({ error: "Failed to complete task", details: error.message });
  }
};

// Increment completed pomodoro count for a task
export const incrementTaskPomodoro = async (req, res) => {
  try {
    console.log("incrementTaskPomodoro called with req.user:", req.user);
    const { taskId } = req.params;
    const userId = req.user.userId;
    
    // Check if taskId is in valid MongoDB ObjectId format
    if (!taskId.match(/^[0-9a-fA-F]{24}$/)) {
      console.log(`Invalid task ID format: ${taskId}`);
      return res.status(400).json({ error: "Invalid task ID format" });
    }
    
    console.log(`Incrementing pomodoro count for task ${taskId}, user ${userId}`);
    const task = await Task.findOneAndUpdate(
      { _id: taskId, userId },
      { $inc: { completedPomodoros: 1 } },
      { new: true }
    );
    
    if (!task) {
      console.log(`Task ${taskId} not found for incrementing pomodoro`);
      return res.status(404).json({ error: "Task not found" });
    }
    
    console.log(`Task pomodoro count updated to ${task.completedPomodoros}`);
    res.status(200).json(task);
  } catch (error) {
    console.error("Error incrementing pomodoro count:", error.message);
    console.error(error.stack);
    
    // If it's a MongoDB CastError (invalid ObjectId), return a 400 error
    if (error.name === "CastError" && error.kind === "ObjectId") {
      return res.status(400).json({ error: "Invalid task ID format" });
    }
    
    res.status(500).json({ error: "Failed to update pomodoro count", details: error.message });
  }
}; 