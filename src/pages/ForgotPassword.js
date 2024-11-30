import React, { useState } from 'react';
import authService from '../services/authService';
import '../styles/Auth.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handlePasswordReset = async (e) => {
        e.preventDefault();

        try {
            await authService.requestPasswordReset(email);
            setMessage('Password reset instructions have been sent to your email.');
            setError('');
        } catch (err) {
            setError('Failed to send reset instructions. Please try again.');
            setMessage('');
        }
    };

    return (
        <div className="auth-container">
            <h1>Forgot Password</h1>
            {message && <p className="message">{message}</p>}
            {error && <p className="error">{error}</p>}
            <form onSubmit={handlePasswordReset}>
                <input
                    type="email"
                    placeholder="Email or Username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Send Reset Instructions</button>
            </form>
            <p><a href="/login">Back to Login</a></p>
        </div>
    );
};

export default ForgotPassword;
