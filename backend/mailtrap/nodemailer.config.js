import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create a transporter object using SMTP
export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // e.g., "smtp.gmail.com" for Gmail
  port: process.env.EMAIL_PORT || 587, // 587 for TLS, 465 for SSL, 25 for non-secure
  secure: process.env.EMAIL_PORT == 465, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});

export const sender = {
  email: process.env.EMAIL_USER,
  name: "Mayan",
};

