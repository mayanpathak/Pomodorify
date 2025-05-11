import api from './api';

// Local ID counter for offline sessions
let localIdCounter = 1000;

export const pomodoroService = {
  /**
   * Start a new Pomodoro session
   */
  startSession: async (sessionData) => {
    try {
      const response = await api.post('/pomodoro/start', sessionData);
      return response.data;
    } catch (error) {
      console.error('Error starting pomodoro session:', error);
      // Create a local session object
      const startTime = new Date();
      const newSession = {
        _id: `local_${localIdCounter++}`,
        userId: 'anonymous',
        taskId: sessionData.taskId,
        startTime,
        endTime: startTime,
        duration: 0,
        sessionType: sessionData.sessionType || 'Pomodoro',
        completed: false,
        createdAt: startTime.toISOString(),
        updatedAt: startTime.toISOString()
      };

      // Store current session in localStorage
      localStorage.setItem('currentSession', JSON.stringify(newSession));
      
      return newSession;
    }
  },

  /**
   * End a Pomodoro session
   */
  endSession: async (sessionData) => {
    try {
      const response = await api.post('/pomodoro/end', sessionData);
      return response.data;
    } catch (error) {
      console.error('Error ending pomodoro session:', error);
      // Get stored session from localStorage
      const sessionJson = localStorage.getItem('currentSession');
      if (sessionJson) {
        const session = JSON.parse(sessionJson);
        const endTime = new Date();
        const updatedSession = {
          ...session,
          endTime,
          duration: endTime - new Date(session.startTime),
          completed: sessionData.completed !== undefined ? sessionData.completed : true,
          updatedAt: endTime.toISOString()
        };
        
        // Save completed sessions history
        const localSessions = localStorage.getItem('localSessions');
        const sessions = localSessions ? JSON.parse(localSessions) : [];
        sessions.push(updatedSession);
        localStorage.setItem('localSessions', JSON.stringify(sessions));
        
        // Clear current session
        localStorage.removeItem('currentSession');
        
        return updatedSession;
      }
      
      // Create a dummy result if no session found
      return { completed: true };
    }
  },

  /**
   * Get all Pomodoro sessions for the authenticated user
   */
  getUserSessions: async (params = {}) => {
    try {
      const response = await api.get('/pomodoro/sessions', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching pomodoro sessions:', error);
      // Return local sessions
      const localSessions = localStorage.getItem('localSessions');
      const sessions = localSessions ? JSON.parse(localSessions) : [];
      return {
        sessions,
        pagination: {
          total: sessions.length,
          page: 1,
          pages: 1
        }
      };
    }
  },

  /**
   * Get Pomodoro statistics for the authenticated user
   */
  getSessionStats: async (period = 'week') => {
    try {
      const response = await api.get('/pomodoro/stats', {
        params: { period }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching pomodoro statistics:', error);
      // Calculate basic stats from local sessions
      const localSessions = localStorage.getItem('localSessions');
      const sessions = localSessions ? JSON.parse(localSessions) : [];
      
      // Filter completed Pomodoro sessions
      const completedSessions = sessions.filter(s => 
        s.completed && s.sessionType === 'Pomodoro'
      );
      
      // Calculate basic statistics
      const totalSessions = completedSessions.length;
      const totalDuration = completedSessions.reduce((sum, session) => 
        sum + (session.duration || 0), 0);
      const avgDuration = totalSessions > 0 ? totalDuration / totalSessions : 0;
      
      return {
        stats: {
          totalSessions,
          totalDuration,
          avgDuration,
          sessionsByDay: []
        }
      };
    }
  },
}; 