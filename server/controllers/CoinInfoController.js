import CoinInfoModel from '../models/CoinInfo.js';

export const updateInfo = async (coin, wallet, price) => {
    try{
        await CoinInfoModel.updateOne(
            { 
                nameCoin: coin,
                walletPrice: wallet
            },
            {
                $set: {
                    priceCoin: price
                }
            },
            {
                upsert: true
            }
        );
    } catch(err) {
        console.log(err);
    }
};

export const createSession = async () => {
    try{
        await CoinInfoModel.create({
            nameCoin: 'BTC',
            priceCoin: price,
            walletPrice: 'USD',
            users: [user._id]
        });
    } catch(err) {
        console.log(err);
    }
};

export const updateSession = async (userId) => {
    try{
        await CoinInfoModel.updateOne(
            { $pull: { users: userId } }
        );
    } catch(err) {
        console.log(err);
    }
};
