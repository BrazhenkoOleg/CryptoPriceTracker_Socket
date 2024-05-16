import express from 'express';
import WebSocket, { WebSocketServer } from 'ws';
import cors from'cors';
import mongoose from 'mongoose';
import colors from 'colors';

//mongoose
//    .connect('mongodb+srv://admin:12345@cluster0.vr3cq5n.mongodb.net/cryptowallets?retryWrites=true&w=majority&appName=Cluster0')
//    .then(() => console.log('DataBase OK!'))
//    .catch((err) => console.log('DataBase Error', err));

const PORT = 3000;

const app = express();

app.use(express.json());
app.use(cors());

//app.post('/auth/login', loginValidation, handleValiddationErrors, UserController.login);
//app.patch('/posts/:id', checkAuth, postCreateValidation, handleValiddationErrors, update);

const API_KEY = "23931b1925830f760b8ee06c6280f777b0d90137f5243b15e38f753309e8fba0";
const ws = new WebSocket('wss://streamer.cryptocompare.com/v2?api_key=' + API_KEY);
const wss = new WebSocketServer({port: PORT});

let price = 0;
let old_price = 0;
let coin = '';
let wallet = '';

//открытие соединения(сокета)
ws.on('open', function open() {
    const subRequest = {
        "action": "SubAdd",
        "subs": ["0~Coinbase~BTC~USD"]
    };
    
    
    ws.send(JSON.stringify(subRequest));
});

//отправка сообщения с сервера на сокет
ws.on('message', function incoming(data) {  
    data = JSON.parse(data);
    coin = data.FSYM;
    wallet = data.TSYM;

    if (data.P) {
        price = parseFloat(data.P).toFixed(2);
    }

    if (price > old_price) {
        console.log(colors.green(`Current price ${coin}: ${price} ${wallet}`));
    }
    else if (price === old_price) {
        console.log(colors.yellow(`Current price ${coin}: ${price} ${wallet}`));
    }
    else {
        console.log(colors.red(`Current price ${coin}: ${price} ${wallet}`));
    }
    old_price = price;

    //ws.close(); //закрытие соединения(сокета)
});

