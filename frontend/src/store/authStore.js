import { create } from "zustand";
import axios from "axios";
import api from '../services/api';  // Import the configured API instance

console.log('API instance baseURL:', api.defaults.baseURL);

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
			// Testing direct API call to verify exact URL
			const apiUrl = 'https://pomodorify-rsld.onrender.com/api/auth/signup';
			console.log(`Attempting direct signup using Axios to ${apiUrl}`);
			
			const response = await axios.post(apiUrl, 
				{ email, password, name }, 
				{ 
					withCredentials: true,
					headers: { 'Content-Type': 'application/json' }
				}
			);
			
			console.log("Signup successful");
			
			// Save token if provided
			if (response.data.token) {
				localStorage.setItem('token', response.data.token);
				api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
				console.log("Token saved to localStorage and set in headers");
			}
			
			set({ user: response.data.user, isAuthenticated: true, isLoading: false });
		} catch (error) {
			console.error("Signup error:", error);
			console.error("Request failed:", error.message);
			
			const errorMessage = handleApiError(error);
			set({ error: errorMessage, isLoading: false });
			throw error;
		}
	},
	login: async (email, password) => {
		set({ isLoading: true, error: null });
		try {
			// Testing direct API call to verify exact URL
			const apiUrl = 'https://pomodorify-rsld.onrender.com/api/auth/login';
			console.log(`Attempting direct login using Axios to ${apiUrl}`);
			
			const response = await axios.post(apiUrl, 
				{ email, password }, 
				{ 
					withCredentials: true,
					headers: { 'Content-Type': 'application/json' }
				}
			);
			
			console.log("Login successful");
			
			// Save token in localStorage for persistent sessions
			if (response.data.token) {
				localStorage.setItem('token', response.data.token);
				api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
				console.log("Token saved to localStorage and set in headers");
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
			// Testing direct API call to verify exact URL
			const apiUrl = 'https://pomodorify-rsld.onrender.com/api/auth/logout';
			console.log(`Attempting direct logout using Axios to ${apiUrl}`);
			
			await axios.post(apiUrl, {}, { 
				withCredentials: true,
				headers: { 'Content-Type': 'application/json' }
			});
			
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
			console.error("Logout error:", error);
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
			// Testing direct API call to verify exact URL
			const apiUrl = 'https://pomodorify-rsld.onrender.com/api/auth/verify-email';
			console.log(`Attempting direct email verification using Axios to ${apiUrl}`);
			
			const response = await axios.post(apiUrl, 
				{ code }, 
				{ 
					withCredentials: true,
					headers: { 'Content-Type': 'application/json' }
				}
			);
			
			// Save token if provided
			if (response.data.token) {
				localStorage.setItem('token', response.data.token);
				api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
			}
			
			set({ user: response.data.user, isAuthenticated: true, isLoading: false });
			return response.data;
		} catch (error) {
			console.error("Verification error:", error);
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
				console.log("Token found in localStorage, setting in headers for auth check");
			} else {
				console.log("No token found in localStorage for auth check");
				// If no token, don't even try the auth check
				set({ error: null, isCheckingAuth: false, isAuthenticated: false, user: null });
				return;
			}
			
			// Testing direct API call to verify exact URL
			const apiUrl = 'https://pomodorify-rsld.onrender.com/api/auth/check-auth';
			console.log(`Attempting direct auth check using Axios to ${apiUrl}`);
			
			const response = await axios.get(apiUrl, { 
				withCredentials: true,
				headers: { 
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				}
			});
			
			set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
		} catch (error) {
			console.error("Auth check error:", error);
			// Clear token if auth check fails
			localStorage.removeItem('token');
			set({ error: null, isCheckingAuth: false, isAuthenticated: false, user: null });
		}
	},
	forgotPassword: async (email) => {
		set({ isLoading: true, error: null });
		try {
			// Testing direct API call to verify exact URL
			const apiUrl = 'https://pomodorify-rsld.onrender.com/api/auth/forgot-password';
			console.log(`Attempting forgot password using Axios to ${apiUrl}`);
			
			const response = await axios.post(apiUrl, 
				{ email }, 
				{ 
					withCredentials: true,
					headers: { 'Content-Type': 'application/json' }
				}
			);
			
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			console.error("Forgot password error:", error);
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
			// Testing direct API call to verify exact URL
			const apiUrl = `https://pomodorify-rsld.onrender.com/api/auth/reset-password/${token}`;
			console.log(`Attempting password reset using Axios to ${apiUrl}`);
			
			const response = await axios.post(apiUrl, 
				{ password }, 
				{ 
					withCredentials: true,
					headers: { 'Content-Type': 'application/json' }
				}
			);
			
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			console.error("Reset password error:", error);
			const errorMessage = handleApiError(error);
			set({
				isLoading: false,
				error: errorMessage,
			});
			throw error;
		}
	},
}));
