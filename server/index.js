import http from 'http';
import express from 'express';
import WebSocket, { WebSocketServer } from 'ws';
import cors from'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import { UserController, CoinInfoController } from './controllers/index.js';
import UserModel from './models/User.js';
import CoinInfoModel from './models/CoinInfo.js';
import CryptoSocket from './utils/CryptoSocket.js';
import sendEmail from './utils/SendEmail.js';

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const clients = new Map();

mongoose
    .connect(process.env.DB_URL)
    .then(() => console.log('База данных подключена успешно!'))
    .catch((err) => console.log('Ошибка базы данных', err));

app.post('/', UserController.login);

const startServer = async () => {
    CryptoSocket(clients);

    wss.on('connection', async (socket) => {
        console.log('Пользователь подключился');
        
        socket.on('message', async (message) => {
            try {
                const data = JSON.parse(message);
                const user = await UserModel.findOne({ email: data.email, password: data.password });
      
                if (user) {
                    clients.set(socket, { userId: user._id });
      
                    const coinInfo = await CoinInfoModel.findOne(); 
                    const price = coinInfo ? coinInfo.priceCoin : 0;
                    
                    socket.send(JSON.stringify({ message: "Вход выполнен успешно!" }));
      
                    if (coinInfo) {
                        if (!coinInfo.users.includes(user._id)) {
                            coinInfo.users.push(user._id);
                            await coinInfo.save();
                        }
                    } else {
                        CoinInfoController.createSession;
                    }
                } else {
                    socket.send(JSON.stringify({ message: 'Неверный email или пароль' }));
                }
            } catch (error) {
                console.error('Ошибка сообщения:', error);
                socket.send(JSON.stringify({ message: 'Ошибка запроса' }));
            }
        });
      
        socket.on('close', async () => {
            const clientData = clients.get(socket);
      
            if (clientData) {
                const userId = clientData.userId;
      
                CoinInfoController.updateSession(userId);
      
                clients.delete(socket);
            }
      
            console.log('Пользователь отключился');
        });
    });

    server.listen(PORT, () => {
        console.log(`Сервер запущен на порте = ${PORT}`);
    });
};

startServer();

