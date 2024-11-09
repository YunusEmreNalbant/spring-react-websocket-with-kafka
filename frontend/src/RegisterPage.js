import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';

function RegisterPage() {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('ROLE_MANAGER');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        const newUser = { firstname, lastname, email, password, role };
        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser),
            });

            if (response.ok) {
                alert('Kayıt başarılı! Giriş yapabilirsiniz.');
                navigate('/login');
            } else {
                alert('Kayıt başarısız! Bilgilerinizi kontrol edin.');
            }
        } catch (error) {
            console.error('Register isteğinde bir hata oluştu:', error);
        }
    };

    return (
        <div className="register-container">
            <form className="register-form" onSubmit={handleRegister}>
                <h2>Register</h2>
                <input
                    type="text"
                    placeholder="First Name"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    className="form-input"
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    className="form-input"
                />
                <input
                    type="email"
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
                <button type="submit" className="register-button">Register</button>
                <p className="redirect-text">
                    Zaten hesabınız var mı? <span onClick={() => navigate('/login')} className="login-link">Giriş yapın</span>
                </p>
            </form>
        </div>
    );
}

export default RegisterPage;
