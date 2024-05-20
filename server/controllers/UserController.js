import UserModel from '../models/User.js';

export const login = async (req, res) => { 
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email, password });
        //const token = jwt.sign({ userId: user._id }, 'secret123', { expiresIn: '1h' });
        if (user) {
            res.status(200).json({ user });
        } else {
            res.status(401).json({ message: 'Неверный email или пароль' });
        }
    } catch (err) {
        console.error('Ошибка входа:', err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};
