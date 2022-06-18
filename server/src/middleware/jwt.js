const jwt = require("jsonwebtoken");
const AppError = require("../error/app-error");
const prisma = require("../prisma");
const config = require("../config/config");

const verifyToken = (req, res, next) => {
    let token = req.body.token;
    if (!token) {
        return next(AppError.unauthorized("No token provided."));
    }

    jwt.verify(token, config.secret, (err, decoded) =>{
        if (err) {
            return next(AppError.unauthorized("Invalid token."));
        }
        req.userId = decoded.id;
        next();
    })
}

const isAdmin = async (req, res, next) => {
    let userRole = await prisma.user.findUnique({
        where: { id: req.userId },
        select: {
            role: {
                select: { name: true }
            }
        }
    });
    if (userRole.role.name !== "admin") {
        console.log("Wrong user");
        return next(AppError.unauthorized("Insufficient permission to perform this action."));
    }
    next();
}

module.exports = {
    verifyToken: verifyToken,
    isAdmin: isAdmin,
}
