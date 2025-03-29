import React, { useState, useEffect } from 'react';
import '../styles/Profile.css';

const Profile = () => {
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: ''
    });
    const [message, setMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: ''
    });
    const [loading, setLoading] = useState(false);

    // Function to send logs to the backend
    const sendLogToBackend = async (action, username, details) => {
        try {
            const response = await fetch('https://music-edu-backend.vercel.app/api/security-logs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action,
                    user: username,
                    additionalInfo: details,
                    actionDetails: details,
                }),
            });

            if (!response.ok) {
                console.error('Failed to send log');
            }
        } catch (error) {
            console.error('Error sending log:', error);
        }
    };

    // Fetch the user's profile data
    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage('You are not logged in.');
                return;
            }

            setLoading(true);
            try {
                const response = await fetch('http://localhost:5000/api/users/profile', {
                    method: 'GET',
                    headers: {'Authorization': `Bearer ${token}`}
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch profile');
                }

                const data = await response.json();
                setUser(data);
                setFormData(data);

                // Log profile fetching action with details
                sendLogToBackend('Profile Fetch', data.username, `User ${data.username} fetched their profile`);
            } catch (error) {
                setMessage('Error fetching profile: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            setMessage('You are not logged in.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            const data = await response.json();
            setUser(data);
            setIsEditing(false);
            setMessage('Profile updated successfully!');

            // Log profile update action with details (updated fields)
            sendLogToBackend('Profile Update', data.username, `User ${data.username} updated their profile. Updated fields: ${Object.keys(formData).join(', ')}`);
        } catch (error) {
            setMessage('Error updating profile: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h1>Profile</h1>
            {message && <div className="message">{message}</div>}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="profile-info">
                    {!isEditing ? (
                        <>
                            <p><strong>Username:</strong> {user.username}</p>
                            <p><strong>Full Name:</strong> {user.firstName} {user.lastName}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <button onClick={() => setIsEditing(true)}>Edit Profile</button>
                        </>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="username">Username:</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />

                            <label htmlFor="firstName">First Name:</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />

                            <label htmlFor="lastName">Last Name:</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />

                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />

                            <button type="submit">Save Changes</button>
                            <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
};

export default Profile;
