const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/auth';

// General API request function
const apiRequest = async (endpoint, method, data = null) => {
    try {
        const token = localStorage.getItem('token'); // Retrieve stored token
        const headers = {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }) // Include token if available
        };

        const response = await fetch(`${API_URL}/${endpoint}`, {
            method,
            headers,
            body: data ? JSON.stringify(data) : null,
            credentials: 'include', // Include credentials (cookies if needed)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg || 'An error occurred. Please try again.');
        }

        return await response.json(); // Return response data
    } catch (error) {
        console.error(`Error in ${endpoint}:`, error.message);
        throw error; // Rethrow the error for handling in components
    }
};

const authService = {
    // User Registration
    signUp: async (userData) => await apiRequest('signup', 'POST', userData),

    // User Login
    login: async (loginData) => {
        const data = await apiRequest('login', 'POST', loginData);
        localStorage.setItem('token', data.token); // Store JWT token
        localStorage.setItem('user', JSON.stringify(data.user)); // Store user data
        return data;
    },

    // User Logout
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Password Reset Request
    requestPasswordReset: async (email) => await apiRequest('forgot-password', 'POST', { identifier: email }),

    // Reset Password with Token
    resetPassword: async (token, newPassword) => await apiRequest('reset-password', 'POST', { token, newPassword }),

    // Fetch User Profile (Protected Route)
    getUserProfile: async () => await apiRequest('profile', 'GET'),
};

export default authService;
