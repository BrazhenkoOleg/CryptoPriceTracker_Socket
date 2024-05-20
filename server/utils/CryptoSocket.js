import WebSocket from 'ws';
import { CoinInfoController } from '../controllers/index.js';

const CryptoSocket = async (clients) => {
    try {   
        const ws = new WebSocket(`wss://streamer.cryptocompare.com/v2?api_key=${process.env.API_KEY}`);
        ws.on('open', () => {
            const subRequest = {
                "action": "SubAdd",
                "subs": ["0~Coinbase~BTC~USD"]
            };
               
            ws.send(JSON.stringify(subRequest));
        });
            
        ws.on('message', async (message) => {  
            const data = JSON.parse(message);
            const coin = data.FSYM;
            const wallet = data.TSYM;
            const price = parseFloat(data.P).toFixed(2);
            
            if (data.P){
                CoinInfoController.updateInfo(coin, wallet, price);

                clients.forEach((client, socket) => {
                    socket.send(JSON.stringify({ coin, wallet, price }));
                });
            } 
        });
    } catch (error) {
        console.log(error);
    }
};

export default CryptoSocket;