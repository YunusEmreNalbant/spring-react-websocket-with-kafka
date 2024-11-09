import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import ChatRoom from './ChatRoom';
import RegisterPage from "./RegisterPage";

function App() {
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        }
    }, [token]);

    const ProtectedRoute = ({ children }) => {
        return token ? children : <Navigate to="/login" />;
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage setToken={setToken} />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <ChatRoom />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
