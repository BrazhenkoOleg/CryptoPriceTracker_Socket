import './styles.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login/Login';
import Price from './Pages/PricePage/Price';

const App = () => {
    const [user, setUser] = useState(null);

    return (
        <Router>
            <div className="app-container">
                <Routes>
                    <Route path="/" element={<Login setUser={setUser} />} />
                    {user && <Route path="/price" element={<Price user={user} />} />}
                </Routes>
            </div>
        </Router>
    );
};

export default App;
