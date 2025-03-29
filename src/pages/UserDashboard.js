import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaUserCircle, FaArrowLeft } from 'react-icons/fa';
import '../styles/UserDashboard.css';
import DOMPurify from 'dompurify';

const API_URL = 'https://music-edu-backend.vercel.app/api';

const UserDashboard = () => {
    const [user, setUser] = useState(null);
    const [instruments, setInstruments] = useState([]);
    const [filteredInstruments, setFilteredInstruments] = useState([]);
    const [selectedInstrument, setSelectedInstrument] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState('');
    const [submitStatus, setSubmitStatus] = useState(null);
    const [feedbackResponse, setFeedbackResponse] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch user data from localStorage
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
        }
        
        //fetch instruments and categories
        const fetchInstruments = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('No token found!');
                    return;
                }

                const response = await fetch(`${API_URL}/instruments`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setInstruments(data);
                    setFilteredInstruments(data);
                } else {
                    console.error('Failed to fetch instruments, status:', response.status);
                    const fallbackData = await fetchFallbackData();
                    setInstruments(fallbackData);
                    setFilteredInstruments(fallbackData);
                    
                }
            } catch (error) {
                console.error('Error fetching instruments:', error);
                // Use the fallback dataset from the JSON file if there is an error
                const fallbackData = await fetchFallbackData();
                setInstruments(fallbackData);
                setFilteredInstruments(fallbackData);
            } finally {
                setLoading(false);
            }
        };

        // Function to fetch the fallback dataset from the instruments.json file
        const fetchFallbackData = async () => {
            try {
            const response = await fetch('/instruments.json');
            if (!response.ok) {
                throw new Error('Failed to fetch fallback data');
            }
            return await response.json();
            } catch (error) {
            console.error('Error loading fallback data:', error);
            return []; // Return an empty array if there's an error fetching the fallback data
            }
        };

        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('No token found!');
                    return;
                }

                const response = await fetch(`${API_URL}/categories`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setCategories(data);
                } else {
                    console.error('Failed to fetch categories, status:', response.status);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchInstruments();
        fetchCategories();
    }, []);

    const handleCategoryClick = useCallback((category) => {
        setSelectedCategory(category);
        setSelectedInstrument(null); // Clear selected instrument when changing category
        console.log("Selected Category:", category); // Log selected category
        console.log("Instruments before filter:", instruments); // Log instruments before filtering
      
        const filtered = instruments.filter(instrument => {
          // Assuming category might be an object with a name property
          console.log("Instrument categories for filtering:", instrument.categories);
      
          return category === '' || 
            instrument.categories.some(c => {
              // Assuming category might be an object with 'name' property
              const categoryName = typeof c === 'object' && c.name ? c.name : c;
              return typeof categoryName === 'string' && categoryName.toLowerCase() === category.toLowerCase();
            });
        });
        
        console.log("Filtered instruments after category click:", filtered); // Log filtered instruments
        setFilteredInstruments(filtered);
      }, [instruments, setFilteredInstruments, setSelectedCategory, setSelectedInstrument]);

    const handleSearch = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        setFilteredInstruments(
            instruments.filter(instrument =>
                instrument.name.toLowerCase().includes(query.toLowerCase()) &&
                (selectedCategory ? instrument.category === selectedCategory : true)
            )
        );
        setSelectedInstrument(null); // Clear selected instrument on new search
    };

    const handleInstrumentClick = (instrument) => {
        setSelectedInstrument(instrument);
    };

    const handleFeedbackChange = (event) => {
        setFeedback(event.target.value);
    };

    const handleFeedbackSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            setSubmitStatus('No token found. Please log in.');
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus('Submitting feedback...');

        try {
            const response = await fetch(`${API_URL}/feedback`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    instrumentId: selectedInstrument._id,
                    feedback,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSubmitStatus('Feedback submitted successfully!');
                setFeedback(''); // Clear feedback after submission
                fetchFeedbackResponse(data._id);
            } else {
                setSubmitStatus(`Failed to submit feedback. ${data.message || ''}`);
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            setSubmitStatus('Error submitting feedback.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const fetchFeedbackResponse = async (feedbackId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/feedback/${feedbackId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            if (response.ok) {
                setFeedbackResponse(data.adminResponse);
            } else {
                console.error('Error fetching feedback response:', data.message || data);
            }
        } catch (error) {
            console.error('Error fetching feedback response:', error);
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="dashboard">
            <h2>Dashboard</h2>
            <p className="greeting">Welcome, {user.firstName}!</p>

            <nav className="dashboard-nav">
                <ul className="nav-list">
                    <li className="nav-item">
                        <Link to="/profile" className="nav-link"><FaUserCircle className="icon" />My Profile</Link>
                    </li>
                </ul>
            </nav>

            <div className="instrument-section">
                <h3>Instruments</h3>

                {/* Search Bar */}
                <div className="search-bar">
                    <FaSearch className="icon"/>
                    <input
                        type="text"
                        placeholder="Search instruments..."
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                </div>

                {/* Categories List */}
                <div className="categories-list">
                    <button onClick={() => handleCategoryClick('')} className={selectedCategory === '' ? 'active' : ''}>All</button>
                    {categories.map((category) => (
                        <button
                            key={category._id}
                            onClick={() => handleCategoryClick(category.name)}
                            className={selectedCategory === category.name ? 'active' : ''}>
                            {category.name}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <p>Loading instruments...</p>
                ) : selectedInstrument ? (
                    <div className="instrument-card">
                        <button onClick={() => setSelectedInstrument(null)} className="back-button"><FaArrowLeft className="icon" />
                            Available Categories
                        </button>
                        <h3 className="instrument-title">{selectedInstrument.name}</h3>

                        {selectedInstrument.image && (
                            <img
                            src={`https://music-edu-backend.vercel.app/${selectedInstrument.image}`}
                            alt={selectedInstrument.name}
                            className="instrument-image"
                            />
                        )}

                        <div className="instrument-section instrument-card">
                            <h4>Description</h4>
                            <p
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(selectedInstrument.description),
                            }}
                            />
                        </div>

                        <div className="instrument-section instrument-card">
                            <h4>Historical Background</h4>
                            <p>{DOMPurify.sanitize(selectedInstrument.historicalBackground)}</p>
                        </div>

                        <div className="instrument-section instrument-card">
                            <h4>Sound/Audio</h4>
                            {selectedInstrument.audio ? (
                            <audio controls>
                                <source
                                src={`https://music-edu-backend.vercel.app/${selectedInstrument.audio}`}
                                type="audio/mp3"
                                />
                                Your browser does not support the audio element.
                            </audio>
                            ) : (
                            <p>No audio available for this instrument.</p>
                            )}
                        </div>

                        <div className="instrument-section instrument-card">
                            <h4>Video</h4>
                            {selectedInstrument.video ? (
                            <video controls>
                                <source
                                src={`https://music-edu-backend.vercel.app/${selectedInstrument.video}`}
                                type="video/mp4"
                                />
                                Your browser does not support the video element.
                            </video>
                            ) : (
                            <p>No video available for this instrument.</p>
                            )}
                        </div>

                        <div className="feedback-section">
                            <h4>Submit Feedback</h4>
                            <form onSubmit={handleFeedbackSubmit}>
                            <textarea
                                value={feedback}
                                onChange={handleFeedbackChange}
                                placeholder="Enter your feedback..."
                                required
                            />
                            <button
                                type="submit"
                                className="submit-feedback-btn"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </button>
                            </form>
                            {submitStatus && <p>{submitStatus}</p>}

                            {feedbackResponse && (
                            <div className="admin-response">
                                <h4>Admin Response</h4>
                                <p>{feedbackResponse}</p>
                            </div>
                            )}
                        </div>
                    </div>
                ) : filteredInstruments.length > 0 ? (
                    <div className="instruments-list">
                        {filteredInstruments.map((instrument) => (
                            <div
                                key={instrument._id}
                                className="instrument-card"
                                onClick={() => handleInstrumentClick(instrument)} >
                                <img
                                    src={`https://music-edu-backend.vercel.app/${instrument.image}`}
                                    alt={instrument.name}
                                    className="instrument-image"
                                />
                                <div className="instrument-info">
                                    <h3>{instrument.name}</h3>
                                    <p>{instrument.category}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No instruments found</p>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;
