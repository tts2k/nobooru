const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const AppError = require("../error/app-error");
const DbError = require("../error/db-error");
const userRepo = require("../repositories/user.repo");
const { isStringNotNullOrEmpty } = require("../utils/misc.util");
const { HttpResCode, AccessTokenLife } = require("../constants");
const config = require("../config/config");

const checkInput = (req) => {
    const username = req.body?.username;
    const password = req.body?.password;
    //Better input checking will be implemented later
    if (!isStringNotNullOrEmpty(username) || !isStringNotNullOrEmpty(password)) {
        return next(AppError.badRequest("Username or password cannot be empty"));
    }

    return {username, password};
}

const signUp = async (req, res, next) => {
    try {
        const {username, password} = checkInput(req);
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
        const {username, password} = checkInput(req);

        const user = await userRepo.getUserByName(username);

        let passwordCorrect =
            user
            ? bcrypt.compareSync(password, user.passwordHash)
            : false

        if (!passwordCorrect) {
            return next(AppError.unauthorized("Invalid username or password"));
        }

        const accessToken = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: AccessTokenLife
        });

        res.status(HttpResCode.Ok)
        .cookie("accessToken", accessToken, { httpOnly: true, maxAge: AccessTokenLife })
        .send({
            message: "Login success"
        });
    }
    catch(err) {
        console.error(err);
        next(AppError.internalError())
    };
}

module.exports = { signUp, signIn }
