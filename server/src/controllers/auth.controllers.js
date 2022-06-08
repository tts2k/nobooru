const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const AppError = require("../error/app-error");
const prisma = require("../prisma");

const SALT_ROUNDS = 10;

const signUp = async (req, res, next) => {
    try {
        // only normal user can be registered for now
        const userRole = await prisma.role.findUnique({ where: { name: "user"}});
        await prisma.user.create({
            data: {
                name: req.body.username,
                passwordHash: bcrypt.hashSync(req.body.password, SALT_ROUNDS),
                role: { connect: { id: userRole.id } }
            }
        })
        res.status(200).send({ message: "User was registered successfully"});
    }
    catch(err){
        next(AppError.internalError(err.message))
    }
}

const signIn = async (req, res, next) => {
    try {
        if (!req.body.username || req.body.username.length === 0) {
            return next(AppError.badRequest("Username cannot be empty."));
        }

        const user = await prisma.user.findUnique({
            where: { name: req.body.username },
        });

        let passwordCorrect =
            user
            ? bcrypt.compareSync(req.body.password, user.passwordHash)
            : false

        if (!passwordCorrect) {
            return next(AppError.unauthorized("Invalid username or password"));
        }

        let token = jwt.sign({ id: user.id }, process.env.SECRET, {
            expiresIn: 86400
        });

        res
            .status(200)
            .send({
                message: "Login success",
                token: token
            });
    }
    catch(err) {
        next(AppError.internalError(err.message))
    };
}

module.exports = { signUp, signIn }
