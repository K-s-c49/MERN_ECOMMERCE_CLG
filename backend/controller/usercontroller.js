import handleAsyncError from "../middleware/handleAsyncerror.js";
import User from "../model/usermodel.js";
import handleError from "../utilis/handlError.js";
import { sendToken } from "../utilis/jwtTOKEN.js";
 

// register user
export const registeruser = handleAsyncError (async (req, res, next) => {
    const { name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: "this is temp id",
            url: "this is temp url"
        }
    });

   sendToken(user, 201, res);

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

// reset password request

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
        return res.status(200).json({
            success: true,
            message: `Password reset instructions have been initiated for ${user.email}`,
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new handleError(error.message, 500));
    }
});
