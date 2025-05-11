import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5001/api/auth" : "/api/auth";
console.log(`Using Auth API URL: ${API_URL}`);

axios.defaults.withCredentials = true;

// Helper function to handle errors consistently
const handleApiError = (error) => {
	if (!error.response) {
		// Network error
		return "Unable to connect to the server. Please check your internet connection.";
	}
	return error.response?.data?.message || "An unexpected error occurred";
};

// Import resetTaskState function to clear Redux tasks state
// This will be imported in App.jsx to avoid circular dependencies
let resetTasksCallback = null;

export const setResetTasksCallback = (callback) => {
	resetTasksCallback = callback;
};

export const useAuthStore = create((set) => ({
	user: null,
	isAuthenticated: false,
	error: null,
	isLoading: false,
	isCheckingAuth: true,
	message: null,

	signup: async (email, password, name) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/signup`, { email, password, name });
			set({ user: response.data.user, isAuthenticated: true, isLoading: false });
		} catch (error) {
			const errorMessage = handleApiError(error);
			set({ error: errorMessage, isLoading: false });
			throw error;
		}
	},
	login: async (email, password) => {
		set({ isLoading: true, error: null });
		try {
			console.log(`Attempting login to ${API_URL}/login with email: ${email}`);
			const response = await axios.post(`${API_URL}/login`, { email, password });
			console.log("Login successful");
			// Save token in localStorage for persistent sessions
			if (response.data.token) {
				localStorage.setItem('token', response.data.token);
			}
			set({
				isAuthenticated: true,
				user: response.data.user,
				error: null,
				isLoading: false,
			});
			
			// Reset task state to ensure we fetch new tasks from server
			if (resetTasksCallback) {
				resetTasksCallback();
			}
		} catch (error) {
			console.error("Login error:", error);
			if (error.code === "ERR_NETWORK") {
				set({ error: "Unable to connect to server. Please check your internet connection or try again later.", isLoading: false });
			} else {
				set({ error: error.response?.data?.message || "Error logging in", isLoading: false });
			}
			throw error;
		}
	},

	logout: async () => {
		set({ isLoading: true, error: null });
		try {
			await axios.post(`${API_URL}/logout`);
			// Clear ALL app data from localStorage on logout
			localStorage.removeItem('token');
			localStorage.removeItem('localTasks');
			localStorage.removeItem('localSessions');
			localStorage.removeItem('currentSession');
			localStorage.removeItem('tasks');
			localStorage.removeItem('completedTasks');
			localStorage.removeItem('preferredCategories');
			localStorage.removeItem('workFocus');
			localStorage.removeItem('preferredTaskSize');
			set({ user: null, isAuthenticated: false, error: null, isLoading: false });
			
			// Reset task state when logging out
			if (resetTasksCallback) {
				resetTasksCallback();
			}
		} catch (error) {
			// Even if the logout API fails, we still want to clear local state
			localStorage.removeItem('token');
			localStorage.removeItem('localTasks');
			localStorage.removeItem('localSessions');
			localStorage.removeItem('currentSession');
			localStorage.removeItem('tasks');
			localStorage.removeItem('completedTasks');
			localStorage.removeItem('preferredCategories');
			localStorage.removeItem('workFocus');
			localStorage.removeItem('preferredTaskSize');
			set({ user: null, isAuthenticated: false, isLoading: false });
			
			// Reset task state even if API call fails
			if (resetTasksCallback) {
				resetTasksCallback();
			}
		}
	},
	verifyEmail: async (code) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/verify-email`, { code });
			set({ user: response.data.user, isAuthenticated: true, isLoading: false });
			return response.data;
		} catch (error) {
			const errorMessage = handleApiError(error);
			set({ error: errorMessage, isLoading: false });
			throw error;
		}
	},
	checkAuth: async () => {
		set({ isCheckingAuth: true, error: null });
		try {
			// Set token in header if it exists in localStorage
			const token = localStorage.getItem('token');
			if (token) {
				axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
			}
			
			const response = await axios.get(`${API_URL}/check-auth`);
			set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
		} catch (error) {
			// Clear token if auth check fails
			localStorage.removeItem('token');
			set({ error: null, isCheckingAuth: false, isAuthenticated: false, user: null });
		}
	},
	forgotPassword: async (email) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/forgot-password`, { email });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			const errorMessage = handleApiError(error);
			set({
				isLoading: false,
				error: errorMessage,
			});
			throw error;
		}
	},
	resetPassword: async (token, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			const errorMessage = handleApiError(error);
			set({
				isLoading: false,
				error: errorMessage,
			});
			throw error;
		}
	},
}));
