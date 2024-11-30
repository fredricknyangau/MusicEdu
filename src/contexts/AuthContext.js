import React, { createContext, useContext, useState } from 'react';
import authService from '../services/authService'; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const handleLogin = async (email, password) => {
        try {
            const userData = await authService.login(email, password); // Call the login method
            setUser(userData);
        } catch (error) {
            console.error("Login error:", error); // Handle error as needed
        }
    };

    const handleRegister = async (userData) => {
        try {
            const newUser = await authService.register(userData); // Call the register method
            setUser(newUser);
        } catch (error) {
            console.error("Registration error:", error); // Handle error as needed
        }
    };

    return (
        <AuthContext.Provider value={{ user, handleLogin, handleRegister }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
