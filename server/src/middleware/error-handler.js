const AppError = require('../error/app-error');
const DbError = require('../error/db-error');
const HttpResCode = require('../constants').HttpResCode;

const errorHandler = (error, req, res, next) =>{
    console.error(error.stack);

    if (error instanceof DbError) {
        return res.status(HttpResCode.BadRequest).json({ message: error.message });
    }

    if (error instanceof AppError) {
        return res.status(error.status).json({ message: error.message });
    }

    // unknow error
    return res.status(HttpResCode.Internal).json({
        message: 'Internal server error'
    });
}

module.exports = errorHandler;
