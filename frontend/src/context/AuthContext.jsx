import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            setError(null);
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem('user', JSON.stringify(data));
            setCurrentUser(data);
            return true;
        } catch (err) {
            setError(
                err.response && err.response.data.message
                    ? err.response.data.message
                    : 'Login failed. Please try again.'
            );
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        setCurrentUser(null);
    };

    return (
        <AuthContext.Provider value={{ currentUser, loading, error, login, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};