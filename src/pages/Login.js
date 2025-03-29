import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService'; // Import the auth service
import '../styles/Auth.css'; // Import styling

const Login = () => {
    const [identifier, setIdentifier] = useState(''); // Email or Username
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate(); // React Router navigation

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        try {
            const response = await authService.login({ identifier, password });

            console.log('Login response:', response); // Log response for debugging

            if (response.token) {
                localStorage.setItem('token', response.token); // Store token properly
                console.log('Token stored:', response.token);
            } else {
                throw new Error('No token received');
            }

            // Redirect based on user role
            navigate(response.user.role === 'admin' ? '/admin' : '/dashboard');
        } catch (error) {
            console.error('Login error:', error);
            setError(error.response?.data?.msg || 'Failed to log in. Please try again.');
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
                    autoComplete="username"
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
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
