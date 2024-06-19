import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // o el servicio de correo que prefieras
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password',
  },
});

export const sendRecoveryEmail = async (email: string, link: string) => {
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Password Recovery',
    text: `You requested a password reset. Click this link to reset your password: ${link}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error('Error sending recovery email');
  }
};
