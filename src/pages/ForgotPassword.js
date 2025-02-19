import React, { useState } from 'react';
import '../styles/Auth.css';
import authService from '../services/authService';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handlePasswordReset = async (e) => {
        e.preventDefault();

        try {
            await authService.requestPasswordReset(email);
            setMessage('Password reset instructions have been sent to your email.');
            setErrorMessage('');
        } catch (err) {
            setErrorMessage('Failed to send reset instructions. Please try again.');
            setMessage('');
        }
    };

    return (
        <div className="auth-container">
            <h1>Forgot Password</h1>
            {message && <p className="message">{message}</p>}
            {errorMessage && <p className="error">{errorMessage}</p>}
            <form onSubmit={handlePasswordReset}>
                <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit" className="auth-button">Send Reset Instructions</button>
            </form>
            <p><a href="/login" className="auth-link">Back to Login</a></p>
        </div>
    );
};

export default ForgotPassword;
