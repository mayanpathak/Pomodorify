import { PomodoroSession } from "../models/pomodoroSession.model.js";

// Start a new Pomodoro session
export const startSession = async (req, res) => {
  try {
    const { taskId, sessionType } = req.body;
    const userId = req.user.userId;
    
    const startTime = new Date();
    
    const newSession = new PomodoroSession({
      userId,
      taskId,
      startTime,
      // Initialize with placeholder end time (will be updated on session end)
      endTime: startTime,
      duration: 0,
      sessionType: sessionType || "Pomodoro",
      completed: false,
    });
    
    await newSession.save();
    res.status(201).json(newSession);
  } catch (error) {
    console.error("Error starting Pomodoro session:", error);
    res.status(500).json({ error: "Failed to start Pomodoro session" });
  }
};

// End a Pomodoro session
export const endSession = async (req, res) => {
  try {
    const { sessionId, completed } = req.body;
    const userId = req.user.userId;
    
    const session = await PomodoroSession.findOne({ _id: sessionId, userId });
    
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    
    const endTime = new Date();
    const duration = endTime - new Date(session.startTime);
    
    session.endTime = endTime;
    session.duration = duration;
    session.completed = completed !== undefined ? completed : true;
    
    await session.save();
    
    res.status(200).json(session);
  } catch (error) {
    console.error("Error ending Pomodoro session:", error);
    res.status(500).json({ error: "Failed to end Pomodoro session" });
  }
};

// Get all sessions for a user
export const getUserSessions = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { limit = 20, page = 1, taskId, sessionType } = req.query;
    
    const query = { userId };
    
    if (taskId) {
      query.taskId = taskId;
    }
    
    if (sessionType) {
      query.sessionType = sessionType;
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const sessions = await PomodoroSession.find(query)
      .sort({ startTime: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('taskId', 'title');
    
    const total = await PomodoroSession.countDocuments(query);
    
    res.status(200).json({
      sessions,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching Pomodoro sessions:", error);
    res.status(500).json({ error: "Failed to fetch Pomodoro sessions" });
  }
};

// Get user statistics
export const getSessionStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { period } = req.query;
    
    let dateFilter = {};
    const now = new Date();
    
    // Define date ranges based on period
    if (period === 'day') {
      const startOfDay = new Date(now.setHours(0, 0, 0, 0));
      dateFilter = { startTime: { $gte: startOfDay } };
    } else if (period === 'week') {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      dateFilter = { startTime: { $gte: startOfWeek } };
    } else if (period === 'month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      dateFilter = { startTime: { $gte: startOfMonth } };
    } else if (period === 'year') {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      dateFilter = { startTime: { $gte: startOfYear } };
    }
    
    // Query for completed Pomodoro sessions only
    const completedSessions = await PomodoroSession.find({
      userId,
      completed: true,
      sessionType: "Pomodoro",
      ...dateFilter,
    });
    
    // Calculate statistics
    const totalSessions = completedSessions.length;
    const totalDuration = completedSessions.reduce((sum, session) => sum + session.duration, 0);
    const avgDuration = totalSessions > 0 ? totalDuration / totalSessions : 0;
    
    // Get sessions by day (for charts)
    const sessionsByDay = await PomodoroSession.aggregate([
      {
        $match: {
          userId: userId,
          completed: true,
          sessionType: "Pomodoro",
          ...dateFilter,
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$startTime" } },
          count: { $sum: 1 },
          totalDuration: { $sum: "$duration" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
    
    res.status(200).json({
      stats: {
        totalSessions,
        totalDuration,
        avgDuration,
        sessionsByDay,
      },
    });
  } catch (error) {
    console.error("Error fetching Pomodoro statistics:", error);
    res.status(500).json({ error: "Failed to fetch Pomodoro statistics" });
  }
}; 