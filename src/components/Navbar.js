import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();

    // Function to handle logout
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login'); // Redirect to login page
    };

    const isLoggedIn = localStorage.getItem('token'); // Check if user is logged in

    return (
        <header className="navbar">
            <h1 className="logo">Music Edu System</h1>
            <nav>
                <ul className="nav-links">
                    <li><Link to="/">Home</Link></li>
                    {!isLoggedIn && <li><Link to="/login">Login</Link></li>}
                    {isLoggedIn && <li><button onClick={logout}>Logout</button></li>}
                </ul>
            </nav>
        </header>
    );
};

export default Navbar;
