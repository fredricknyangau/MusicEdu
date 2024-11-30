import React from 'react';
import { Navigate } from 'react-router-dom';

// PrivateRoute component accepts children and a required role
const PrivateRoute = ({ children, requiredRole }) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    // If no token or no user data, redirect to login
    if (!token || !user) {
        return <Navigate to="/login" />;
    }

    // Check if user has the required role
    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/" />; // Redirect to home if role doesn't match
    }

    // If authenticated and role matches, render the component
    return children;
};

export default PrivateRoute;
