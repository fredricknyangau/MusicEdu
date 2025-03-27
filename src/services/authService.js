const API_URL = 'https://music-edu-backend.vercel.app/api/auth'; //backend API URL(http://localhost:5000/api/auth)

// General API request function
const apiRequest = async (endpoint, method, data) => {
    try {
        const response = await fetch(`${API_URL}/${endpoint}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg || 'An error occurred. Please try again.');
        }

        return await response.json(); // Return the response data (e.g., user info, token)
    } catch (error) {
        console.error(`Error in ${endpoint}:`, error.message);
        throw error; // Rethrow to propagate the error up to the caller
    }
};

const authService = {
    // Sign Up Function
    signUp: async (userData) => {
        return await apiRequest('signup', 'POST', userData); // Calls the generic function for sign up
    },

    // Login Function
    login: async (loginData) => {
        const data = await apiRequest('login', 'POST', loginData); // Fetch user and token
        localStorage.setItem('token', data.token); // Store token for authenticated requests
        localStorage.setItem('user', JSON.stringify(data.user)); // Store user data
        return data; // Return user data and token
    },

    // Forgot password request
    requestPasswordReset: async (email) => await apiRequest('forgot-password', 'POST', { identifier: email }),

    // Reset password with token
    resetPassword: async (token, newPassword) => await apiRequest('reset-password', 'POST', { token, newPassword }),

};

export default authService;
