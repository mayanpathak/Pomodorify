// import bcryptjs from "bcryptjs";
// import crypto from "crypto";

// import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
// import {
// 	sendPasswordResetEmail,
// 	sendResetSuccessEmail,
// 	sendVerificationEmail,
// 	sendWelcomeEmail,
// } from "../mailtrap/emails.js";
// import { User } from "../models/user.model.js";

// export const signup = async (req, res) => {
// 	const { email, password, name } = req.body;

// 	try {
// 		if (!email || !password || !name) {
// 			throw new Error("All fields are required");
// 		}

// 		const userAlreadyExists = await User.findOne({ email });
// 		console.log("userAlreadyExists", userAlreadyExists);

// 		if (userAlreadyExists) {
// 			return res.status(400).json({ success: false, message: "User already exists" });
// 		}

// 		const hashedPassword = await bcryptjs.hash(password, 10);
// 		const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

// 		const user = new User({
// 			email,
// 			password: hashedPassword,
// 			name,
// 			verificationToken,
// 			verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
// 		});

// 		await user.save();

// 		// Generate JWT token and set cookie
// 		const token = generateTokenAndSetCookie(res, user._id);

// 		await sendVerificationEmail(user.email, verificationToken);

// 		res.status(201).json({
// 			success: true,
// 			message: "User created successfully",
// 			token,
// 			user: {
// 				...user._doc,
// 				password: undefined,
// 			},
// 		});
// 	} catch (error) {
// 		res.status(400).json({ success: false, message: error.message });
// 	}
// };

// export const verifyEmail = async (req, res) => {
// 	const { code } = req.body;
// 	try {
// 		const user = await User.findOne({
// 			verificationToken: code,
// 			verificationTokenExpiresAt: { $gt: Date.now() },
// 		});

// 		if (!user) {
// 			return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
// 		}

// 		user.isVerified = true;
// 		user.verificationToken = undefined;
// 		user.verificationTokenExpiresAt = undefined;
// 		await user.save();

// 		await sendWelcomeEmail(user.email, user.name);

// 		res.status(200).json({
// 			success: true,
// 			message: "Email verified successfully",
// 			user: {
// 				...user._doc,
// 				password: undefined,
// 			},
// 		});
// 	} catch (error) {
// 		console.log("error in verifyEmail ", error);
// 		res.status(500).json({ success: false, message: "Server error" });
// 	}
// };

// export const login = async (req, res) => {
// 	const { email, password } = req.body;
// 	try {
// 		const user = await User.findOne({ email });
// 		if (!user) {
// 			return res.status(400).json({ success: false, message: "Invalid credentials" });
// 		}
// 		const isPasswordValid = await bcryptjs.compare(password, user.password);
// 		if (!isPasswordValid) {
// 			return res.status(400).json({ success: false, message: "Invalid credentials" });
// 		}

// 		const token = generateTokenAndSetCookie(res, user._id);

// 		user.lastLogin = new Date();
// 		await user.save();

// 		res.status(200).json({
// 			success: true,
// 			message: "Logged in successfully",
// 			token,
// 			user: {
// 				...user._doc,
// 				password: undefined,
// 			},
// 		});
// 	} catch (error) {
// 		console.log("Error in login ", error);
// 		res.status(400).json({ success: false, message: error.message });
// 	}
// };

// export const logout = async (req, res) => {
// 	// Clear cookie with same settings as when it was set
// 	res.cookie("token", "", {
// 		httpOnly: true,
// 		secure: process.env.NODE_ENV === "production",
// 		sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
// 		expires: new Date(0), // Set expiration to epoch time (effectively deleting it)
// 	});
	
// 	res.status(200).json({ success: true, message: "Logged out successfully" });
// };

// export const forgotPassword = async (req, res) => {
// 	const { email } = req.body;
// 	try {
// 		const user = await User.findOne({ email });

// 		if (!user) {
// 			return res.status(400).json({ success: false, message: "User not found" });
// 		}

// 		const resetToken = crypto.randomBytes(20).toString("hex");
// 		const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; 

// 		user.resetPasswordToken = resetToken;
// 		user.resetPasswordExpiresAt = resetTokenExpiresAt;

// 		await user.save();

// 		await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

// 		res.status(200).json({ success: true, message: "Password reset link sent to your email" });
// 	} catch (error) {
// 		console.log("Error in forgotPassword ", error);
// 		res.status(400).json({ success: false, message: error.message });
// 	}
// };

// export const resetPassword = async (req, res) => {
// 	try {
// 		const { token } = req.params;
// 		const { password } = req.body;

// 		const user = await User.findOne({
// 			resetPasswordToken: token,
// 			resetPasswordExpiresAt: { $gt: Date.now() },
// 		});

// 		if (!user) {
// 			return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
// 		}

// 		// update password
// 		const hashedPassword = await bcryptjs.hash(password, 10);

// 		user.password = hashedPassword;
// 		user.resetPasswordToken = undefined;
// 		user.resetPasswordExpiresAt = undefined;
// 		await user.save();

// 		await sendResetSuccessEmail(user.email);

// 		res.status(200).json({ success: true, message: "Password reset successful" });
// 	} catch (error) {
// 		console.log("Error in resetPassword ", error);
// 		res.status(400).json({ success: false, message: error.message });
// 	}
// };

// export const checkAuth = async (req, res) => {
// 	try {
// 		const user = await User.findById(req.user.userId).select("-password");
// 		if (!user) {
// 			return res.status(400).json({ success: false, message: "User not found" });
// 		}

// 		res.status(200).json({ success: true, user });
// 	} catch (error) {
// 		console.log("Error in checkAuth ", error);
// 		res.status(400).json({ success: false, message: error.message });
// 	}
// };



import bcryptjs from "bcryptjs";
import crypto from "crypto";

import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../mailtrap/emails.js";
import { User } from "../models/user.model.js";

// Helper function for error responses
const errorResponse = (res, statusCode, message) => {
  return res.status(statusCode).json({ success: false, message });
};

export const signup = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    // Validate input
    if (!email || !password || !name) {
      return errorResponse(res, 400, "All fields are required");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return errorResponse(res, 400, "Invalid email format");
    }

    // Validate password strength
    if (password.length < 8) {
      return errorResponse(res, 400, "Password must be at least 8 characters");
    }

    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return errorResponse(res, 409, "User already exists");
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

    const user = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    await user.save();

    // Generate JWT token and set cookie
    const token = generateTokenAndSetCookie(res, user._id);

    // Send verification email (fire and forget)
    sendVerificationEmail(user.email, verificationToken).catch(console.error);

    // Remove sensitive data before sending response
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.verificationToken;
    delete userResponse.verificationTokenExpiresAt;

    res.status(201).json({
      success: true,
      message: "User created successfully. Verification email sent.",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Signup error:", error);
    errorResponse(res, 500, "Internal server error");
  }
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  
  if (!code) {
    return errorResponse(res, 400, "Verification code is required");
  }

  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return errorResponse(res, 400, "Invalid or expired verification code");
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    // Send welcome email (fire and forget)
    sendWelcomeEmail(user.email, user.name).catch(console.error);

    // Remove sensitive data before sending response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("Email verification error:", error);
    errorResponse(res, 500, "Internal server error");
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return errorResponse(res, 400, "Email and password are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, 401, "Invalid credentials");
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return errorResponse(res, 401, "Invalid credentials");
    }

    // Check if email is verified
    if (!user.isVerified) {
      return errorResponse(res, 403, "Please verify your email first");
    }

    const token = generateTokenAndSetCookie(res, user._id);

    user.lastLogin = new Date();
    await user.save();

    // Remove sensitive data before sending response
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.verificationToken;
    delete userResponse.verificationTokenExpiresAt;

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Login error:", error);
    errorResponse(res, 500, "Internal server error");
  }
};

export const logout = async (req, res) => {
  try {
    // Clear cookie with same settings as when it was set
    res.cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      expires: new Date(0),
      path: "/", // Ensure same path as when cookie was set
    });
    
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    errorResponse(res, 500, "Internal server error");
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return errorResponse(res, 400, "Email is required");
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal whether user exists or not for security
      return res.status(200).json({ 
        success: true, 
        message: "If an account exists, a password reset link has been sent" 
      });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;
    await user.save();

    // Send reset email (fire and forget)
    sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`)
      .catch(console.error);

    res.status(200).json({ 
      success: true, 
      message: "If an account exists, a password reset link has been sent" 
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    errorResponse(res, 500, "Internal server error");
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password || password.length < 8) {
    return errorResponse(res, 400, "Password must be at least 8 characters");
  }

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return errorResponse(res, 400, "Invalid or expired reset token");
    }

    // Check if new password is different from old password
    const isSamePassword = await bcryptjs.compare(password, user.password);
    if (isSamePassword) {
      return errorResponse(res, 400, "New password must be different from current password");
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    // Send success email (fire and forget)
    sendResetSuccessEmail(user.email).catch(console.error);

    res.status(200).json({ 
      success: true, 
      message: "Password reset successful" 
    });
  } catch (error) {
    console.error("Reset password error:", error);
    errorResponse(res, 500, "Internal server error");
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return errorResponse(res, 404, "User not found");
    }

    res.status(200).json({ 
      success: true, 
      user 
    });
  } catch (error) {
    console.error("Check auth error:", error);
    errorResponse(res, 500, "Internal server error");
  }
};