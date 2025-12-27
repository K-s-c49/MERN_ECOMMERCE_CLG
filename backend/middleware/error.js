import handleError from "../utilis/handlError.js";

export default (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";   


    //  duplicate error handling
    if (err.code === 11000) {
        const message = `This ${Object.keys(err.keyValue)[0]} is already registered please login to continue`;
        err = new handleError(message, 400);
    }
    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
}