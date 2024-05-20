import mongoose from "mongoose";

const CoinInfoSchema = new mongoose.Schema({
    nameCoin: {
        type: String,
        required: true
    },
    priceCoin: {
        type: Number,
        required: true
    },
    walletPrice: {
        type: String,
        required: true
    },
    users: {
        type: [mongoose.Schema.Types.ObjectId]
    }
},
{
    timestamps: true
}
);

export default mongoose.model('CoinInfo', CoinInfoSchema);