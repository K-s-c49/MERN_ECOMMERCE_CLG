import handleError from "../utilis/handlError.js";
import handleAsyncerror from "./handleAsyncerror.js";
import jwt from "jsonwebtoken";
import User from "../model/usermodel.js";

export const verifyUserAuth = handleAsyncerror (async (req, res, next) => {
    console.log('[verifyUserAuth] Cookies:', req.cookies);
    const { token } = req.cookies;

    if (!token) {
        console.warn('[verifyUserAuth] No token found in cookies');
        return next(new handleError("Please login to access this resource. Authorization is missing", 401));
    }
    try {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decodedData.id);
        if (!req.user) {
            console.warn('[verifyUserAuth] No user found for decoded token:', decodedData);
            return next(new handleError("User not found for this token", 401));
        }
        next();
    } catch (err) {
        console.error('[verifyUserAuth] JWT verification failed:', err);
        return next(new handleError("Invalid or expired token", 401));
    }
});

export const roleBasedAccess = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new handleError(`Role: ${req.user.role} is not allowed to access this resource`, 403));
        }
        next();
    };
}
