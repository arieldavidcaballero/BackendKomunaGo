// utils/emailSender.js
const nodemailer = require('nodemailer');

// Configuración del transportador de correo
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmailWithCode = async (email, code) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Tu código de acceso para KomunaGO',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #4a90e2;">¡Bienvenido a KomunaGO!</h1>
                    <p>Gracias por registrarte en nuestra plataforma. Tu código de acceso es:</p>
                    <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
                        <h2 style="color: #333; font-size: 24px;">${code}</h2>
                    </div>
                    <p>Usa este código para acceder a tu perfil de vendedor y gestionar tu tienda.</p>
                    <p>Por favor, mantén este código en un lugar seguro y no lo compartas con nadie.</p>
                    <p style="color: #666; font-size: 12px;">Este es un correo automático, por favor no respondas a este mensaje.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        throw error;
    }
};

module.exports = {
    sendEmailWithCode
};
