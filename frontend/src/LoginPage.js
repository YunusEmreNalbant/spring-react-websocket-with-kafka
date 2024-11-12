import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage({ setToken }) {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/chat');
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prevCredentials) => ({
            ...prevCredentials,
            [name]: value
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();

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

                navigate('/chat');
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
                    name="email"
                    placeholder="Email"
                    value={credentials.email}
                    onChange={handleChange}
                    className="form-input"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={credentials.password}
                    onChange={handleChange}
                    className="form-input"
                />
                <button type="submit" className="login-button">Giriş Yap</button>
                <p className="redirect-text">
                    Hesabınız yok mu? <span onClick={() => navigate('/register')} className="register-link">Kayıt olun</span>
                </p>
            </form>
        </div>
    );
}

export default LoginPage;