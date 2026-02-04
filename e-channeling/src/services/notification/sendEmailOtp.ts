import nodemailer from "nodemailer";
//import { Resend } from "resend";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

//const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmailOtp = async (to: string, subject: string, html: string) => {
    await sgMail.send({
        //from: "Auth <onboarding@resend.dev>",
        from: {
            email: "echanneling.revamp.v3@gmail.com", // verified sender
            name: "eChanneling",
        },
        to,
        subject,
        html,
    });
};
