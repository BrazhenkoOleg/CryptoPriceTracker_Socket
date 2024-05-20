import nodemailer from 'nodemailer';

const sendEmail = async (price) => {
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: '587',
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_PASS
        },
        secure: 'true',
        tls: {
            ciphers: 'SSLv3'

        }   
      });
  
      const mailOptions = {
        from: process.env.EMAIL_APP,
        to: 'brazhenko.oleg@yandex.ru',
        subject: 'Bitcoin Price Alert',
        text: `Bitcoin price has crossed $100 threshold.\nCurrent price: $${price}`,
      };
  
      await transporter.sendMail(mailOptions);
      console.log('Сообщение отправлено на email успешно!');
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
    }
};

export default sendEmail;
  