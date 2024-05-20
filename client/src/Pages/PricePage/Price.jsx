import React, { useEffect, useState } from 'react';
import './stylesPrice.css';

const Price = ({ user }) => {
    const [coinInfo, setCoinInfo] = useState(null);
    const [priceColor, setPriceColor] = useState('yellow');
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:5000');

        ws.onopen = () => {
            ws.send(JSON.stringify({ email: user.email, password: user.password }));
        };
        
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.coin && data.wallet && data.price) {
                setCoinInfo(prevCoinInfo => {
                    if (prevCoinInfo && prevCoinInfo.price !== data.price) {
                        setPriceColor(trackPrice(data.price, prevCoinInfo.price));
                    }
                    return { coin: data.coin, wallet: data.wallet, price: data.price };
                });
            }
        };

        setSocket(ws);

        return () => {
            ws.close();
        };
    }, [user]);

    return (
        <div className="price-display-container">
        {coinInfo ? (
            <div>
                <h2>Текущая стоимость</h2>
                <p><strong>Криптовалюта:</strong> {coinInfo.coin}</p>
                <p><strong>Валюта:</strong> {coinInfo.wallet}</p>
                <p><strong>Цена:</strong><span className="price" style={{ color: priceColor }}> {coinInfo.price}</span></p>
            </div>
        ) : (
            <h2 className='loading-container'>Загрузка...</h2>
        )}
        </div>
    )
};

const trackPrice = (currentPrice, previousPrice) => {
    if (currentPrice > previousPrice) {
        return 'green';
    } else if (currentPrice < previousPrice) {
        return 'red';
    } else {
        return 'yellow';
    }
} 

export default Price;
