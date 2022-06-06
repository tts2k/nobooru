const prisma = require("../prisma");
const AppError = require("../error/app-error");

const checkDuplicateUsername = async (req, res, next) => {
    try {
        // Username
        const user = await prisma.user.findUnique({
            where: {
                name: req.body.username
            }
        });
        console.log(user);
        if (user) {
            return next(AppError.badRequest("Username has been used"));
        }

        next();
    }
    catch(error) {
        next(AppError.internalError(error.message));
    }
}

const checkRoleExisted = (req, res, next) => {
    if (req.body.role) {
        if (!Roles.includes(req.body.role)) {
            return next(AppError.badRequest(`Role does not exists = ${req.body.role}`));
        }
    }

    next();
}

const verifyUser = {
    checkDuplicateUsername: checkDuplicateUsername,
    checkRoleExisted: checkRoleExisted
}

module.exports = verifyUser;
