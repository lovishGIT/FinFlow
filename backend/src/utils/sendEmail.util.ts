import nodemailer from 'nodemailer';
import env from '@/config/validateEnv.config.js';

interface EmailOptions {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}

const emailCredentials = {
    email: env.EMAIL_EMAIL,
    password: env.EMAIL_PASSWORD
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
    if (!emailCredentials || emailCredentials?.email === 'stop-this-service') {
        console.error(`Email Service Disabled. Check Your Environment Variables.`);
        console.log("Text is: ", options.text);
        return;
    }
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: emailCredentials.email,
                pass: emailCredentials.password,
            },
        });

        const mailOptions = {
            from: `"FinFlow" <${emailCredentials.email}>`,
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html,
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};