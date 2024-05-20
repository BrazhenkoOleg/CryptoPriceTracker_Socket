import React, { useState } from 'react';
import axios from '../../axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUser }) => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState();
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const res = await axios.post('/', { email, password });
            setUser(res.data.user);
            navigate('/price');
        } catch (err) {
            setError('Неверный email или пароль');
        }
    };

    return (
        <div className="login-container">
            <h2>Вход в аккаунт</h2>
            <form onSubmit={handleLogin}>
                <input
                type="email"
                placeholder="Электронная почта"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
                <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Войти</button>
            </form>
            {error && <p className='error'>{error}</p>}
        </div>
    );
};

export default Login;
