const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const AppError = require("../error/app-error");
const DbError = require("../error/db-error");
const userRepo = require("../repositories/user.repo");
const { isStringNotNullOrEmpty } = require("../utils/misc.util");
const HttpResCode = require("../constants").HttpResCode;

const signUp = async (req, res, next) => {
    try {
        const username = req.body?.username;
        const password = req.body?.password;
        //Better input checking will be implemented later
        if (!isStringNotNullOrEmpty(username) || !isStringNotNullOrEmpty(password)) {
            return next(AppError.badRequest("Username or password cannot be empty"));
        }

        await userRepo.createUser(username, password);
        return res.status(HttpResCode.Created).send({ message: "User was registered successfully"});
    }
    catch(err){
        if (err instanceof DbError) {
            next(err);
        }
        console.error(err);
        next(AppError.internalError())
    }
}

const signIn = async (req, res, next) => {
    try {
        if (!req.body?.username || req.body?.username.length === 0) {
            return next(AppError.badRequest("Username cannot be empty."));
        }

        const user = await userRepo.getUserByName();

        let passwordCorrect =
            user
            ? bcrypt.compareSync(req.body.password, user.passwordHash)
            : false

        if (!passwordCorrect) {
            return next(AppError.unauthorized("Invalid username or password"));
        }

        let token = jwt.sign({ id: user.id }, process.env.SECRET, {
            expiresIn: 86400 // 24 hours
        });

        res.status(HttpResCode.Ok).send({
            message: "Login success",
            token: token
        });
    }
    catch(err) {
        console.error(err);
        next(AppError.internalError())
    };
}

module.exports = { signUp, signIn }
