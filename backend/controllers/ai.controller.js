import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize the Gemini API with the key from environment variables
let genAI;
let model;

try {
  if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-pro" });
    console.log("Gemini API initialized successfully");
  } else {
    console.warn("No GEMINI_API_KEY found in environment variables. AI features will use fallbacks.");
  }
} catch (error) {
  console.error("Error initializing Gemini API:", error);
}

/**
 * Generate task suggestions based on user history
 */
export const generateTaskSuggestions = async (req, res) => {
  try {
    const { tasks = [], completedTasks = [], userPreferences = {} } = req.body;
    const userId = req.user?.userId || 'anonymous';
    
    console.log(`Generating task suggestions for user: ${userId}`);
    console.log(`Tasks count: ${tasks.length}, Completed tasks count: ${completedTasks.length}`);
    
    // If no tasks data or API not initialized, return some defaults
    if (!tasks.length && !completedTasks.length || !model) {
      console.log("No task data provided or API not initialized, using default suggestions");
      return res.status(200).json({
        success: true,
        suggestions: [
          {
            title: "Create your first task",
            description: "Add a new task to get started with Pomodorify",
            estimatedPomodoros: 1,
            category: "personal",
            priority: "high",
            reasoning: "Getting started with task management"
          },
          {
            title: "Try a focused Pomodoro session",
            description: "Complete a 25-minute focused work session",
            estimatedPomodoros: 1,
            category: "productivity",
            priority: "medium",
            reasoning: "Experience the Pomodoro technique"
          }
        ]
      });
    }
    
    // Format the data for the prompt
    const prompt = createSuggestionPrompt(tasks, completedTasks, userPreferences);
    
    // Call Gemini API with error handling
    let result;
    try {
      result = await model.generateContent(prompt);
      const response = await result.response;
      const suggestions = response.text();
      
      // Parse the suggestions 
      const parsedSuggestions = parseSuggestions(suggestions);
      
      // If parsing failed, return fallback suggestions
      if (!parsedSuggestions.length) {
        throw new Error("Failed to parse suggestions from AI response");
      }
      
      res.status(200).json({
        success: true,
        suggestions: parsedSuggestions
      });
    } catch (aiError) {
      console.error("AI API error:", aiError);
      // Provide fallback suggestions
      return res.status(200).json({
        success: true,
        fallback: true,
        suggestions: [
          {
            title: "Review your daily tasks",
            description: "Take time to review and prioritize your tasks for the day",
            estimatedPomodoros: 1,
            category: "productivity",
            priority: "high",
            reasoning: "Helps with organization and planning"
          },
          {
            title: "Take a short break",
            description: "Step away from your work for a few minutes to refresh",
            estimatedPomodoros: 1,
            category: "wellness",
            priority: "medium",
            reasoning: "Prevents burnout and maintains productivity"
          }
        ]
      });
    }
  } catch (error) {
    console.error("Error generating task suggestions:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate suggestions",
      details: error.message
    });
  }
};

/**
 * Break down a large task into subtasks
 */
export const breakdownTask = async (req, res) => {
  try {
    const { taskId, taskTitle, taskDescription, estimatedPomodoros } = req.body;
    const userId = req.user?.userId || 'anonymous';
    
    if (!taskId || !taskTitle) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
        details: "taskId and taskTitle are required"
      });
    }
    
    console.log(`Breaking down task ${taskId} for user: ${userId}`);
    
    // If API is not initialized, return default subtasks
    if (!model) {
      console.log("API not initialized, using default subtasks");
      return res.status(200).json({
        success: true,
        taskId,
        fallback: true,
        subtasks: generateDefaultSubtasks(taskTitle, estimatedPomodoros || 4)
      });
    }
    
    // Format the prompt for breaking down tasks
    const prompt = createBreakdownPrompt(taskTitle, taskDescription || "", estimatedPomodoros || 4);
    
    // Call Gemini API with error handling
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const breakdown = response.text();
      
      // Parse the breakdown
      const parsedSubtasks = parseSubtasks(breakdown);
      
      // If parsing failed or no subtasks returned, use fallbacks
      if (!parsedSubtasks.length) {
        console.warn("No valid subtasks parsed from AI response");
        return res.status(200).json({
          success: true,
          taskId,
          fallback: true,
          subtasks: generateDefaultSubtasks(taskTitle, estimatedPomodoros || 4)
        });
      }
      
      res.status(200).json({
        success: true,
        taskId,
        subtasks: parsedSubtasks
      });
    } catch (aiError) {
      console.error("AI API error:", aiError);
      // Provide fallback subtasks
      return res.status(200).json({
        success: true,
        taskId,
        fallback: true,
        subtasks: generateDefaultSubtasks(taskTitle, estimatedPomodoros || 4)
      });
    }
  } catch (error) {
    console.error("Error breaking down task:", error);
    res.status(500).json({
      success: false,
      error: "Failed to break down task",
      details: error.message
    });
  }
};

/**
 * Generate default subtasks if AI fails
 */
function generateDefaultSubtasks(taskTitle, estimatedPomodoros) {
  const count = Math.min(estimatedPomodoros, 4);
  const subtasks = [];
  
  for (let i = 1; i <= count; i++) {
    subtasks.push({
      title: `${taskTitle} - Part ${i}`,
      description: `Part ${i} of ${count} for this task`,
      estimatedPomodoros: 1,
      order: i
    });
  }
  
  return subtasks;
}

/**
 * Create a prompt for the Gemini API to generate task suggestions
 */
function createSuggestionPrompt(tasks, completedTasks, userPreferences) {
  return `
    As a productivity assistant for a Pomodoro application, analyze the following user data and suggest 3-5 new tasks that align with the user's goals, preferences, and work patterns. Provide suggestions that are specific, actionable, and realistic.

    ## Current Tasks:
    ${JSON.stringify(tasks, null, 2)}

    ## Recently Completed Tasks:
    ${JSON.stringify(completedTasks, null, 2)}

    ## User Preferences:
    ${JSON.stringify(userPreferences, null, 2)}

    Please provide suggestions in the following JSON format:
    [
      {
        "title": "Suggested task title",
        "description": "Brief description of the task",
        "estimatedPomodoros": 2,
        "category": "work/study/personal",
        "priority": "high/medium/low",
        "reasoning": "Brief explanation of why this task is suggested"
      }
    ]
  `;
}

/**
 * Create a prompt for the Gemini API to break down a task into subtasks
 */
function createBreakdownPrompt(taskTitle, taskDescription, estimatedPomodoros) {
  return `
    As a productivity assistant for a Pomodoro application, please break down the following task into smaller, manageable subtasks. 
    The task is estimated to take approximately ${estimatedPomodoros} pomodoro sessions (25 minutes each).

    ## Task:
    Title: ${taskTitle}
    Description: ${taskDescription}
    Estimated Pomodoros: ${estimatedPomodoros}

    Please break this down into ${Math.min(estimatedPomodoros * 2, 10)} subtasks, with each subtask being specific and actionable.
    Provide the response in the following JSON format:
    [
      {
        "title": "Subtask title",
        "description": "Brief description of the subtask",
        "estimatedPomodoros": 1,
        "order": 1
      }
    ]
  `;
}

/**
 * Parse the suggestions from the Gemini API response
 */
function parseSuggestions(suggestions) {
  try {
    // Find JSON content in the response
    const jsonMatch = suggestions.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // If no valid JSON is found, return an empty array
    console.warn("No valid JSON found in suggestions:", suggestions);
    return [];
  } catch (error) {
    console.error("Error parsing suggestions:", error);
    return [];
  }
}

/**
 * Parse the subtasks from the Gemini API response
 */
function parseSubtasks(breakdown) {
  try {
    // Find JSON content in the response
    const jsonMatch = breakdown.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // If no valid JSON is found, return an empty array
    console.warn("No valid JSON found in breakdown:", breakdown);
    return [];
  } catch (error) {
    console.error("Error parsing subtasks:", error);
    return [];
  }
} 