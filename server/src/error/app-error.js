const HttpResCode = require("../constants").HttpResCode;

class AppError {
    constructor(message, status) {
        this.message = message;
        this.status = status;

        Error.captureStackTrace(this, this.constructor);
    }

    static badRequest(message) {
        return new AppError(message, HttpResCode.BadRequest);
    }

    static unauthorized(message) {
        return new AppError(message, HttpResCode.Unauthorized);
    }

    static forbidden(message) {
        return new AppError(message, HttpResCode.Forbidden);
    }

    static notFound(message) {
        return new AppError(message, HttpResCode.NotFound);
    }

    static internalError() {
        return new AppError("Internal server error.", HttpResCode.Internal);
    }
}

module.exports = AppError;
