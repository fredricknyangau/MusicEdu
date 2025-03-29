import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Admin.css';

const API_URL = 'https://music-edu-backend.vercel.app/api';

const AdminDashboard = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [historicalBackground, setHistoricalBackground] = useState('');
    const [allCategories, setAllCategories] = useState([]);
    const [instruments, setInstruments] = useState([]);
    const [instrumentName, setInstrumentName] = useState('');
    const [instrumentDescription, setInstrumentDescription] = useState('');
    const [image, setImage] = useState(null);
    const [video, setVideo] = useState(null);
    const [audio, setAudio] = useState(null);
    const [categorySelection, setCategorySelection] = useState([]);
    const [message, setMessage] = useState('');
    const [users, setUsers] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [securityLogs, setSecurityLogs] = useState([]);

    // Fetch Categories, Instruments, Users, Feedbacks, and Security Logs
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_URL}/categories`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch categories');
                }

                const data = await response.json();
                setAllCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
                setMessage('Error fetching categories: ' + error.message);
            }
        };

        const fetchInstruments = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_URL}/instruments`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch instruments');
                }

                const data = await response.json();
                setInstruments(data);
            } catch (error) {
                console.error('Error fetching instruments:', error);
                setMessage('Error fetching instruments: ' + error.message);
            }
        };

        const fetchAllUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_URL}/users`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }

                const data = await response.json();
                console.log(data);
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
                setMessage('Error fetching users: ' + error.message);
            }
        };

        const fetchFeedbacks = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('No token found!');
                    setMessage('No token found. Please log in.');
                    return;
                }
        
                // Set loading state
                setMessage('Fetching feedbacks...');
        
                const response = await fetch(`${API_URL}/feedback`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
        
                if (!response.ok) {
                    throw new Error('Failed to fetch feedbacks');
                }
        
                const data = await response.json(); // Parse the response body
                setFeedbacks(data); // Set the feedbacks to state
                setMessage(''); // Clear any previous messages
            } catch (error) {
                console.error('Error fetching feedbacks:', error);
                setMessage('Error fetching feedbacks: ' + error.message);
            }
        };
        

        const fetchSecurityLogs = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_URL}/security-logs`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` },
                });
        
                if (!response.ok) {
                    throw new Error('Failed to fetch security logs');
                }
        
                const data = await response.json();
                console.log(data);  //Handle logs
                setSecurityLogs(data);
            } catch (error) {
                console.error('Error fetching security logs:', error);
            }
        };
        
        fetchCategories();
        fetchInstruments();
        fetchAllUsers();
        fetchFeedbacks();
        fetchSecurityLogs();
    }, []);

    // Handle Category Selection
    const handleCategoryChange = (event) => {
        const selectedOptions = Array.from(event.target.selectedOptions).map(option => option.value);
        setCategorySelection(selectedOptions);
    };

    // Handle Category Submit
    const handleCategorySubmit = async (event) => {
        event.preventDefault();

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/categories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ name, description }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setMessage(errorData.message || 'Error adding category');
                return;
            }

            const data = await response.json();
            setMessage('Category added successfully!');
            setName('');
            setDescription('');
            setAllCategories(prev => [...prev, data]);
        } catch (error) {
            setMessage('Error adding category: ' + error.message);
        }
    };

    // Handle Instrument Submit
    const handleInstrumentSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('name', instrumentName);
        formData.append('description', instrumentDescription);
        formData.append('historicalBackground', historicalBackground);
        formData.append('categories', JSON.stringify (categorySelection));

        if (image) formData.append('image', image);
        if (video) formData.append('video', video);
        if (audio) formData.append('audio', audio);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/instruments`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                setMessage('Error adding instrument: ' + errorData.message);
                return;
            }

            const data = await response.json();
            setInstruments(prev => [...prev, data]);
            setMessage('Instrument added successfully!');
            setInstrumentName('');
            setInstrumentDescription('');
            setHistoricalBackground('');
            setImage(null);
            setVideo(null);
            setAudio(null);
            setCategorySelection([]);
        } catch (error) {
            setMessage('Error adding instrument: ' + error.message);
        }
    };

    // Delete User
    const handleDeleteUser = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("Token Missing");
                return;
            }
            const response = await fetch(`${API_URL}/users/${userId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });
    
            if (response.ok) {
                // Assuming the user was deleted successfully
                setUsers(users.filter(user => user._id !== userId));
            } else {
                console.error('Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };


    // Respond to Feedback
    const handleRespondToFeedback = async (feedbackId, responseMessage) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found!');
            return;
        }
    
        try {
            const response = await fetch(`${API_URL}/feedback/${feedbackId}/response`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ response: responseMessage }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to save response');
            }
    
            setMessage('Response saved successfully!');
        } catch (error) {
            console.error('Error responding to feedback:', error);
            setMessage('Error responding to feedback: ' + error.message);
        }
    };
    

    return (
        <div className="container">
            <header>
                <h1>Admin Dashboard</h1>
                <button onClick={() => window.location.href = '/profile'} className="btn">View Profile</button>
            </header>

            <section>
                <h2>Add New Category</h2>
                <form onSubmit={handleCategorySubmit}>
                    <label htmlFor="name">Category Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>

                    <button type="submit">Add Category</button>
                </form>
            </section>

            <section>
                <h2>Current Categories</h2>
                <ul>
                    {allCategories.map((category) => (
                        <li key={category._id}>{category.name}</li>
                    ))}
                </ul>
            </section>

            <section>
                <h2>Add New Instrument</h2>
                <form onSubmit={handleInstrumentSubmit}>
                    <label htmlFor="instrumentName">Instrument Name:</label>
                    <input
                        type="text"
                        id="instrumentName"
                        value={instrumentName}
                        onChange={(e) => setInstrumentName(e.target.value)}
                        required
                    />

                    <label htmlFor="instrumentDescription">Description:</label>
                    <textarea
                        id="instrumentDescription"
                        value={instrumentDescription}
                        onChange={(e) => setInstrumentDescription(e.target.value)}
                        required
                    ></textarea>

                    <label htmlFor="historicalBackground">Historical Background:</label>
                    <textarea
                        id="historicalBackground"
                        value={historicalBackground}
                        onChange={(e) => setHistoricalBackground(e.target.value)}
                    ></textarea>

                    <label htmlFor="categories">Categories:</label>
                    <select
                        id="categories"
                        multiple
                        value={categorySelection}
                        onChange={handleCategoryChange}
                    >
                        {allCategories.map(category => (
                            <option key={category._id} value={category._id}>{category.name}</option>
                        ))}
                    </select>

                    <label htmlFor="image">Image:</label>
                    <input
                        type="file"
                        id="image"
                        onChange={(e) => setImage(e.target.files[0])}
                    />

                    <label htmlFor="video">Video:</label>
                    <input
                        type="file"
                        id="video"
                        onChange={(e) => setVideo(e.target.files[0])}
                    />

                    <label htmlFor="audio">Audio:</label>
                    <input
                        type="file"
                        id="audio"
                        onChange={(e) => setAudio(e.target.files[0])}
                    />

                    <button type="submit">Add Instrument</button>
                </form>
            </section>

            <section>
                <h2>Manage Instruments</h2>
                <ul>
        {instruments.map((instrument) => (
          <li key={instrument._id}>
            <h4>{instrument.name}</h4>
            <p>{instrument.description}</p>
            {/* Link to Edit Instrument Page */}
            <Link to={`/edit-instrument/${instrument._id}`}>
              <button>Edit</button>
            </Link>
          </li>
        ))}
      </ul>
            </section>

            <section>
                <h2>Manage Users</h2>
                <ul>
                    {users && users.length > 0 ? (
                        users.map(user=> (
                            <li key={user._id}>
                                <p><strong>Role:</strong>{user.role}</p>
                                <p><strong>Names:</strong> {user.firstName} {user.lastName}</p>
                                <p><strong>Email: </strong>{user.email}</p>
                                <button onClick={() => handleDeleteUser(user._id)}>Delete User</button>
                            </li>
                        ))

                    ) : (
                        <p>No users Found</p>
                    )}
                </ul>
            </section>

            <section>
            <h2>Feedbacks</h2>
            {message && <p>{message}</p>} {/* Display status message */}
            <ul>
                {feedbacks.map(feedback => (
                    <li key={feedback._id}>
                        <p>{feedback.feedback}</p> {/* Ensure you're using the correct field name */}
                        <textarea
                            placeholder="Respond to feedback"
                            onChange={(e) => handleRespondToFeedback(feedback._id, e.target.value)}
                        ></textarea>
                    </li>
                ))}
            </ul>
        </section>

        <div className="admin-logs-container">
            <h1>Security Logs</h1>

            <section>
                <h2>Security Logs</h2>
                {securityLogs.length === 0 ? (
                    <p>No logs available</p> 
                ) : (
                    <ul>
                        {securityLogs.map((log) => (
                            <li key={log._id}>
                                <p>{log.action} - {new Date(log.timestamp).toLocaleString()}</p>
                                {log.additionalInfo && <p><strong>Details:</strong> {log.additionalInfo}</p>}
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>

            {message && <div className="message">{message}</div>}
        </div>
    );
};

export default AdminDashboard;
