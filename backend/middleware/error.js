import handleError from "../utilis/handlError.js";

export default (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";   
    // Mongoose validation errors -> return combined messages
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((el) => el.message).join(', ');
        err = new handleError(messages, 400);
    }

    // Duplicate key (unique) error
    if (err.code === 11000) {
        const message = `This ${Object.keys(err.keyValue)[0]} is already registered please login to continue`;
        err = new handleError(message, 400);
    }

    // CastError (invalid ObjectId etc.)
    if (err.name === 'CastError') {
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new handleError(message, 400);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
}