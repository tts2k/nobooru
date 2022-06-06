const { PrismaClient } = require('@prisma/client');
const data = require("./seeds/data");

const prisma = new PrismaClient();

const main = async () => {
    await prisma.type.createMany({
        data: data.types
    });

    await prisma.role.createMany({
        data: data.roles
    });

    await prisma.tagNamespace.createMany({
        data: data.tagNamespaces
    });

    await prisma.tag.createMany({
        data: data.tags
    });

    await prisma.user.create({
        data: data.user
    });
}

main()
    .catch((err) => {
        console.error(err);
    })
    .finally(async () => {
        await prisma.$disconnect;
    });
