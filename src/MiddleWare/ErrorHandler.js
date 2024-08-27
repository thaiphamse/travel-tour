// middleware/errorHandler.js
function errorHandler(err, req, res, next) {
    const status = err.status || "ERROR";
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        status,
        message: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }), // Hiển thị stack trace trong môi trường development
    });
}

module.exports = errorHandler;
