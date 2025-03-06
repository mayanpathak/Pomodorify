// import {
// 	PASSWORD_RESET_REQUEST_TEMPLATE,
// 	PASSWORD_RESET_SUCCESS_TEMPLATE,
// 	VERIFICATION_EMAIL_TEMPLATE,
// } from "./emailTemplates.js";
// import { mailtrapClient, sender } from "./mailtrap.config.js";

// export const sendVerificationEmail = async (email, verificationToken) => {
// 	const recipient = [{ email }];

// 	try {
// 		const response = await mailtrapClient.send({
// 			from: sender,
// 			to: recipient,
// 			subject: "Verify your email",
// 			html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
// 			category: "Email Verification",
// 		});

// 		console.log("Email sent successfully", response);
// 	} catch (error) {
// 		console.error(`Error sending verification`, error);

// 		throw new Error(`Error sending verification email: ${error}`);
// 	}
// };

// export const sendWelcomeEmail = async (email, name) => {
// 	const recipient = [{ email }];

// 	try {
// 		const response = await mailtrapClient.send({
// 			from: sender,
// 			to: recipient,
// 			template_uuid: "2237d1b1-8489-4d8f-b42f-65db91ada4e0",
// 			template_variables: {
// 				company_info_name: "Auth Company",
// 				name: name,
// 			},
// 		});

// 		console.log("Welcome email sent successfully", response);
// 	} catch (error) {
// 		console.error(`Error sending welcome email`, error);

// 		throw new Error(`Error sending welcome email: ${error}`);
// 	}
// };

// export const sendPasswordResetEmail = async (email, resetURL) => {
// 	const recipient = [{ email }];

// 	try {
// 		const response = await mailtrapClient.send({
// 			from: sender,
// 			to: recipient,
// 			subject: "Reset your password",
// 			html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
// 			category: "Password Reset",
// 		});
// 	} catch (error) {
// 		console.error(`Error sending password reset email`, error);

// 		throw new Error(`Error sending password reset email: ${error}`);
// 	}
// };

// export const sendResetSuccessEmail = async (email) => {
// 	const recipient = [{ email }];

// 	try {
// 		const response = await mailtrapClient.send({
// 			from: sender,
// 			to: recipient,
// 			subject: "Password Reset Successful",
// 			html: PASSWORD_RESET_SUCCESS_TEMPLATE,
// 			category: "Password Reset",
// 		});

// 		console.log("Password reset email sent successfully", response);
// 	} catch (error) {
// 		console.error(`Error sending password reset success email`, error);

// 		throw new Error(`Error sending password reset success email: ${error}`);
// 	}
// };
import { 
	PASSWORD_RESET_REQUEST_TEMPLATE, 
	PASSWORD_RESET_SUCCESS_TEMPLATE, 
	VERIFICATION_EMAIL_TEMPLATE 
  } from "./emailTemplates.js";
  import { transporter, sender } from "./nodemailer.config.js";
  
  export const sendVerificationEmail = async (email, verificationToken) => {
	try {
	  const mailOptions = {
		from: `${sender.name} <${sender.email}>`,
		to: email,
		subject: "Verify your email",
		html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
	  };
  
	  const response = await transporter.sendMail(mailOptions);
	  console.log("Email sent successfully", response);
	} catch (error) {
	  console.error(`Error sending verification`, error);
	  throw new Error(`Error sending verification email: ${error}`);
	}
  };
  
  export const sendWelcomeEmail = async (email, name) => {
	try {
	  // For welcome email, you'll need to create a template or HTML content
	  // since Nodemailer doesn't have built-in template functionality like Mailtrap
	  const welcomeEmailHtml = `
		<!DOCTYPE html>
		<html lang="en">
		<head>
		  <meta charset="UTF-8">
		  <meta name="viewport" content="width=device-width, initial-scale=1.0">
		  <title>Welcome to Auth Company</title>
		</head>
		<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
		  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
			<h1 style="color: white; margin: 0;">Welcome to Auth Company</h1>
		  </div>
		  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
			<p>Hello ${name},</p>
			<p>Thank you for joining Auth Company! We're excited to have you as a member.</p>
			<p>You can now access all features of our platform with your verified account.</p>
			<p>If you have any questions or need assistance, feel free to contact our support team.</p>
			<p>Best regards,<br>Auth Company Team</p>
		  </div>
		  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
			<p>This is an automated message, please do not reply to this email.</p>
		  </div>
		</body>
		</html>
	  `;
  
	  const mailOptions = {
		from: `${sender.name} <${sender.email}>`,
		to: email,
		subject: "Welcome to Auth Company",
		html: welcomeEmailHtml,
	  };
  
	  const response = await transporter.sendMail(mailOptions);
	  console.log("Welcome email sent successfully", response);
	} catch (error) {
	  console.error(`Error sending welcome email`, error);
	  throw new Error(`Error sending welcome email: ${error}`);
	}
  };
  
  export const sendPasswordResetEmail = async (email, resetURL) => {
	try {
	  const mailOptions = {
		from: `${sender.name} <${sender.email}>`,
		to: email,
		subject: "Reset your password",
		html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
	  };
  
	  const response = await transporter.sendMail(mailOptions);
	  console.log("Password reset email sent successfully", response);
	} catch (error) {
	  console.error(`Error sending password reset email`, error);
	  throw new Error(`Error sending password reset email: ${error}`);
	}
  };
  
  export const sendResetSuccessEmail = async (email) => {
	try {
	  const mailOptions = {
		from: `${sender.name} <${sender.email}>`,
		to: email,
		subject: "Password Reset Successful",
		html: PASSWORD_RESET_SUCCESS_TEMPLATE,
	  };
  
	  const response = await transporter.sendMail(mailOptions);
	  console.log("Password reset email sent successfully", response);
	} catch (error) {
	  console.error(`Error sending password reset success email`, error);
	  throw new Error(`Error sending password reset success email: ${error}`);
	}
  };