import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import ChatRoom from './ChatRoom';
import RegisterPage from "./RegisterPage";

const ProtectedRoute = ({ token, children }) => {
    return token ? children : <Navigate to="/login" replace />;
};

function App() {
    const [token, setToken] = useState(() => localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }, [token]);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage setToken={setToken} />} />
                <Route
                    path="/chat"
                    element={
                        <ProtectedRoute token={token}>
                            <ChatRoom />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
