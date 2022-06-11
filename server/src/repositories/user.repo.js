const bcrypt = require('bcryptjs');
const prisma = require("../prisma");
const { Prisma } = require("@prisma/client");
const DbError = require("../error/db-error");

const SALT_ROUNDS = 10;

const getUserRoleId = async () => {
    return prisma.role.findUnique({ where: { name: "user"}});
}

const createUser = async (username, password) => {
    try {
        // only normal user can be registered for now
        const userRole = await getUserRoleId();
        await prisma.user.create({
            data: {
                name: username,
                passwordHash: bcrypt.hashSync(password, SALT_ROUNDS),
                role: { connect: { id: userRole.id } }
            }
        });
    } catch(err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002")
            throw new DbError("User has been used.");
        throw err;
    }
}

const getUserByName = async (name) => {
    return prisma.user.findUnique({
        where: { name: name },
    });
}

module.exports = { createUser, getUserByName }
