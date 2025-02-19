import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import '../styles/Auth.css';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Extract the reset token from the URL
    const query = new URLSearchParams(useLocation().search);
    const token = query.get('token');

    const handlePasswordReset = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            await authService.resetPassword(token, newPassword);
            setMessage('Password has been reset successfully.');
            setError('');
            setTimeout(() => {
                navigate('/login');
            }, 3000);// Redirect to login page after 3 seconds
        } catch (err) {
            setError('Failed to reset password. Please try again.');
            setMessage('');
        }
    };

    return (
        <div className="auth-container">
            <h1>Reset Password</h1>
            {message && <p className="message">{message}</p>}
            {error && <p className="error">{error}</p>}
            <form onSubmit={handlePasswordReset}>
                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button type="submit">Reset Password</button>
            </form>
        </div>
    );
};

export default ResetPassword;
