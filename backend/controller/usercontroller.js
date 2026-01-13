import handleAsyncError from "../middleware/handleAsyncerror.js";
import User from "../model/usermodel.js";
import crypto from "crypto";
import mongoose from "mongoose";
import handleError from "../utilis/handlError.js";
import { sendToken } from "../utilis/jwtTOKEN.js";
import { sendEmial } from "../utilis/sendEmail.js";
import cloudinary from "../utilis/cloudinary.js";
 

// register user
export const registeruser = handleAsyncError (async (req, res, next) => {
    const { name, email, password, avatar } = req.body;
    // Server-side validation
    if (!name || !email || !password) {
        return next(new handleError("All fields are required", 400));
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        return next(new handleError("Invalid email format", 400));
    }
    if (password.length < 8) {
        return next(new handleError("Password must be at least 8 characters", 400));
    }
    // Check for duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new handleError("Email already registered", 400));
    }
    // Avatar upload to Cloudinary
    let avatarObj = { public_id: "default_id", url: "default_url" };
    // Support either file upload (req.files.avatar) or base64 string (req.body.avatar)
    let avatarData = null;
    if (req.files && req.files.avatar) {
        // express-fileupload with useTempFiles: true provides tempFilePath
        console.log('Received file upload in req.files.avatar');
        avatarData = req.files.avatar.tempFilePath || req.files.avatar.data;
    } else if (avatar) {
        console.log('Received avatar in req.body.avatar');
        avatarData = avatar;
    }
    if (avatarData) {
        try {
            console.log("Uploading avatar to Cloudinary...");
            const myCloud = await cloudinary.uploader.upload(avatarData, {
                folder: "avatars",
                width: 150,
                crop: "scale",
            });
            avatarObj = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            };
            console.log("Cloudinary upload success:", avatarObj);
        } catch (err) {
            console.error("Cloudinary upload error:", err);
            return next(new handleError("Avatar upload failed: " + (err.message || "Unknown error"), 500));
        }
    }
    try {
        const user = await User.create({
            name,
            email,
            password,
            avatar: avatarObj
        });
        sendToken(user, 201, res);
    } catch (err) {
        console.error("User creation error:", err);
        return next(new handleError("User creation failed: " + (err.message || "Unknown error"), 500));
    }
});
// login user
export const loginuser = handleAsyncError (async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new handleError("Please enter email and password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new handleError("Invalid email or password", 401));
    }

    

    const isPasswordMatched = await user.verifyPassword(password);

    if (!isPasswordMatched) {
        return next(new handleError("Invalid email or password", 401));
    }

    sendToken(user, 200, res);
}
);

// logout user

export const logoutuser = handleAsyncError (async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
});

// FORGOT password request

export const requestPasswordReset = handleAsyncError (async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    
    if (!user) {
        return next(new handleError("User not found with this email", 404));
    }
    // generate reset token

    let resetToken;

    try {
        resetToken = user.generatePasswordResetToken();
        await user.save({ validateBeforeSave: false });

    } catch (error) {
        return next(new handleError("Could not generate reset token", 500));
    }
    const resetPasswordURL = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
    const message = `Your password reset token is:\n\n${resetPasswordURL}\n\nIf you did not request this email, please ignore it.`;
    try {
        // Email sending is not configured; respond success generically
        await sendEmial({
            email: user.email,
            subject: "Password Recovery",
            message,
        });
        return res.status(200).json({
            success: true,
            message: `Email is send to  ${user.email} successfully`,
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new handleError(error.message, 500));
    }
});

// reset password

export const resetPassword = handleAsyncError (async (req, res, next) => {
    // Hash the token from URL params
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    // Find user with this token and check if token hasn't expired
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new handleError("Reset password token is invalid or has expired", 400));
    }

    // Check if password and confirm password match
    if (req.body.password !== req.body.confirmPassword) {
        return next(new handleError("Password and confirm password do not match", 400));
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    // Log the user in, send JWT
    sendToken(user, 200, res);
});
// GET USER DETAILS
export const getUserDetails = handleAsyncError (async (req, res, next) => {
    const user = await User.findById(req.user._id);
    res.status(200).json({  
        success: true,
        user,
    }); 
});

// UPDATE PASSWORD
export const updatePassword = handleAsyncError (async (req, res, next) => {
    const user = await User.findById(req.user._id).select("+password"); 
    const isPasswordMatched = await user.verifyPassword(req.body.oldPassword);
    if (!isPasswordMatched) {
        return next(new handleError("Old password is incorrect", 400));
    }
    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new handleError("Password does not match", 400));
    }
    user.password = req.body.newPassword;
    await user.save();
    sendToken(user, 200, res);
});

// UPDATE USER PROFILE
export const updateUserProfile = handleAsyncError (async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    };

    // Support avatar update sent as a file (req.files.avatar) or base64 string (req.body.avatar)
    let avatarData = null;
    if (req.files && req.files.avatar) {
        avatarData = req.files.avatar.tempFilePath || req.files.avatar.data;
    } else if (req.body.avatar) {
        avatarData = req.body.avatar;
    }

    // If avatar is being updated, delete old image from Cloudinary
    if (avatarData) {
        try {
            const user = await User.findById(req.user._id);
            if (user.avatar && user.avatar.public_id && user.avatar.public_id !== 'default_id') {
                await cloudinary.uploader.destroy(user.avatar.public_id);
            }
            const myCloud = await cloudinary.uploader.upload(avatarData, {
                folder: 'avatars',
                width: 150,
                crop: 'scale',
            });
            newUserData.avatar = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        } catch (err) {
            console.error('Cloudinary upload failed during profile update:', err);
            return next(new handleError('Avatar upload failed: ' + (err.message || 'Unknown error'), 500));
        }
    }

    const user = await User.findByIdAndUpdate(req.user._id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        user,
    });
});

// ADMIN: Get all users
export const getUsersList = handleAsyncError (async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        users,
    });
});

// ADMIN: Get single user details
export const getSinghleUser = handleAsyncError (async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return next(new handleError(`User does not exist with id: ${req.params.id}`, 404));
    }
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new handleError(`User does not exist with id: ${req.params.id}`, 404));
    }
    res.status(200).json({
        success: true,
        user,
    });
});

// Admin-change user role and details
export const updateUserRole = handleAsyncError (async (req, res, next) => {
    const newUserData = {
        name: req.body.name,    
        email: req.body.email,
        role: req.body.role,
    };
    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    if (!user) {
        return next(new handleError(`User does not exist with id: ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        message: "User role updated successfully",
        user,
    });
});

// ADMIN: Delete user
export const deleteUser = handleAsyncError (async (req, res, next) => {
   const user = await User.findByIdAndDelete(req.params.id);

   if (!user) {
       return next(new handleError(`User does not exist with id: ${req.params.id}`, 404));
   }
   res.status(200).json({
       success: true,
       message: "User deleted successfully",
   });
});