class AppError {
    constructor(message, status) {
        this.message = message;
        this.status = status;

        Error.captureStackTrace(this, this.constructor);
    }

    static badRequest(message) {
        return new AppError(message, 400);
    }

    static unauthorized(message) {
        return new AppError(message, 401);
    }

    static forbidden(message) {
        return new AppError(message, 403);
    }

    static notFound(message) {
        return new AppError(message, 404);
    }

    static internalError(message) {
        return new AppError(message, 500);
    }
}

module.exports = AppError;
