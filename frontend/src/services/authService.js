// import api from './api';

// const API_URL = import.meta.env.VITE_API_URL || 'https://pomodorify-rsld.onrender.com/api';

// class AuthService {
//   constructor() {
//     this.token = localStorage.getItem('token');
//     console.log('AuthService initialized with baseURL:', API_URL);
//   }

//   async register(email, password, name) {
//     try {
//       const response = await api.post('/auth/signup', {
//         email,
//         password,
//         name
//       });

//       if (response.data.token) {
//         localStorage.setItem('token', response.data.token);
//         this.token = response.data.token;
//       }

//       return response.data;
//     } catch (error) {
//       console.error('Registration error:', error);
//       throw error;
//     }
//   }

//   async login(email, password) {
//     try {
//       const response = await api.post('/auth/login', {
//         email,
//         password
//       });

//       if (response.data.token) {
//         localStorage.setItem('token', response.data.token);
//         this.token = response.data.token;
//       }

//       return response.data;
//     } catch (error) {
//       console.error('Login error:', error);
//       throw error;
//     }
//   }

//   async logout() {
//     try {
//       await api.post('/auth/logout');
//     } catch (error) {
//       console.error('Logout error:', error);
//     } finally {
//       localStorage.removeItem('token');
//       this.token = null;
//     }
//   }

//   async checkAuth() {
//     try {
//       if (!this.token) {
//         throw new Error('No token found');
//       }
      
//       const response = await api.get('/auth/check-auth');
//       return response.data;
//     } catch (error) {
//       console.error('Auth check error:', error);
//       localStorage.removeItem('token');
//       this.token = null;
//       throw error;
//     }
//   }

//   async verifyEmail(code) {
//     try {
//       const response = await api.post('/auth/verify-email', { code });
      
//       if (response.data.token) {
//         localStorage.setItem('token', response.data.token);
//         this.token = response.data.token;
//       }
      
//       return response.data;
//     } catch (error) {
//       console.error('Email verification error:', error);
//       throw error;
//     }
//   }

//   async forgotPassword(email) {
//     try {
//       const response = await api.post('/auth/forgot-password', { email });
//       return response.data;
//     } catch (error) {
//       console.error('Forgot password error:', error);
//       throw error;
//     }
//   }

//   async resetPassword(token, password) {
//     try {
//       const response = await api.post(`/auth/reset-password/${token}`, { password });
//       return response.data;
//     } catch (error) {
//       console.error('Reset password error:', error);
//       throw error;
//     }
//   }

//   getToken() {
//     return this.token;
//   }

//   isLoggedIn() {
//     return !!this.token;
//   }
// }

// export const authService = new AuthService(); 

import api from './api';

const API_URL = import.meta.env.VITE_API_URL || 'https://pomodorify-rsld.onrender.com/api';

class AuthService {
  constructor() {
    this.initializeToken();
    console.log('AuthService initialized with baseURL:', API_URL);
  }

  initializeToken() {
    this.token = localStorage.getItem('token');
    if (this.token) {
      this.setAuthToken(this.token);
    }
  }

  setAuthToken(token) {
    this.token = token;
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete api.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }

  async register(email, password, name) {
    try {
      const response = await api.post('/auth/signup', {
        email,
        password,
        name
      });

      if (response.data?.token) {
        this.setAuthToken(response.data.token);
      }

      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw this.normalizeError(error);
    }
  }

  async login(email, password) {
    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });

      if (response.data?.token) {
        this.setAuthToken(response.data.token);
      }

      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw this.normalizeError(error);
    }
  }

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.setAuthToken(null);
    }
  }

  async checkAuth() {
    try {
      if (!this.token) {
        throw new Error('No token found');
      }
      
      const response = await api.get('/auth/check-auth');
      return response.data;
    } catch (error) {
      console.error('Auth check error:', error);
      this.setAuthToken(null);
      throw this.normalizeError(error);
    }
  }

  async verifyEmail(code) {
    try {
      const response = await api.post('/auth/verify-email', { code });
      
      if (response.data?.token) {
        this.setAuthToken(response.data.token);
      }
      
      return response.data;
    } catch (error) {
      console.error('Email verification error:', error);
      throw this.normalizeError(error);
    }
  }

  async forgotPassword(email) {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw this.normalizeError(error);
    }
  }

  async resetPassword(token, password) {
    try {
      const response = await api.post(`/auth/reset-password/${token}`, { password });
      return response.data;
    } catch (error) {
      console.error('Reset password error:', error);
      throw this.normalizeError(error);
    }
  }

  normalizeError(error) {
    // Handle Axios errors and others consistently
    if (error.response) {
      // Server responded with a status code outside 2xx
      return new Error(error.response.data?.message || error.response.statusText || 'Request failed');
    } else if (error.request) {
      // Request was made but no response received
      return new Error('No response from server. Please check your connection.');
    } else {
      // Something happened in setting up the request
      return error instanceof Error ? error : new Error('An unknown error occurred');
    }
  }

  getToken() {
    return this.token;
  }

  isLoggedIn() {
    return !!this.token;
  }
}

export const authService = new AuthService();