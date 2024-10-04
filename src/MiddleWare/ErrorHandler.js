// middleware/errorHandler.js
function errorHandler(err, req, res, next) {
    const statusCode = Number(err.status) || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        statusCode,
        data: [],
        message: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
}

module.exports = errorHandler;
