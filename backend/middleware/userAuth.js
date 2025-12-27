import handleError from "../utilis/handlError.js";
import handleAsyncerror from "./handleAsyncerror.js";
import jwt from "jsonwebtoken";
import User from "../model/usermodel.js";

export const verifyUserAuth = handleAsyncerror (async (req, res, next) => {
   
    const {token} = req.cookies;

    if (!token) {
        return next(new handleError("Please login to access this resource. Authorization is missing", 401));
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);
    next();
});

export const roleBasedAccess = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new handleError(`Role: ${req.user.role} is not allowed to access this resource`, 403));
        }
        next();
    };
}
