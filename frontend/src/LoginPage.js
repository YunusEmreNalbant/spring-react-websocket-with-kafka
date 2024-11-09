import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage({ setToken }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();

        const credentials = { email, password };
        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });

            if (response.ok) {
                const data = await response.json();
                setToken(data.response.token);

                localStorage.setItem('token', data.response.token);
                localStorage.setItem('email', data.response.email);

                navigate('/dashboard');
            } else {
                alert('Giriş başarısız! Bilgilerinizi kontrol edin.');
            }
        } catch (error) {
            console.error('Login isteğinde bir hata oluştu:', error);
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
                <h2>Login</h2>
                <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                />
                <button type="submit" className="login-button">Login</button>
                <p className="redirect-text">
                    Hesabınız yok mu? <span onClick={() => navigate('/register')} className="register-link">Kayıt olun</span>
                </p>
            </form>
        </div>
    );
}

export default LoginPage;
