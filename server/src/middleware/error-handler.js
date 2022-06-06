const AppError = require('../error/app-error');

const errorHandler = (error, req, res, next) =>{
    console.error(error.stack);

    if (error instanceof AppError) {
        return res.status(error.status).json({ message: error.message });
    }

    // unknow error
    return res.status(500).json({
        message: 'Internal server error'
    });
}

module.exports = errorHandler;
