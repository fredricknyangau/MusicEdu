import React, { useState } from 'react';
import authService from '../services/authService'; // Import the auth service
import '../styles/Auth.css'; // Styling

const Login = () => {
    const [identifier, setIdentifier] = useState(''); // Email or Username
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log({ identifier, password }); // Log the payload for debugging

        try {
            const response = await authService.login({
                identifier, // Email or username
                password,
            });

            console.log(response); // Log the response for debugging

            // On successful login, the token and user data should be stored in localStorage.
            const token = localStorage.getItem('token');
            console.log('Token stored:', token); // Ensure token is saved in localStorage

            //Redirect based on user role
            if (response.user.role === 'admin') {
                window.location.href = '/admin';
            } else {
                window.location.href = '/dashboard'; // Redirect to dashboard or user area
            }
        } catch (error) {
            setError('Failed to log in. Please try again.');
            console.error(error); // Log error for debugging
        }
    };

    return (
        <div className="auth-container">
            <h1>Log In</h1>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Email or Username"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Log In</button>
            </form>
            <p>
                Don't have an account? <a href="/signup">Sign up</a>
            </p>
            <p>
                <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
            </p>
        </div>
    );
};

export default Login;
