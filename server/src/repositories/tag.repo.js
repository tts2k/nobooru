const prisma = require("../prisma");
const { Prisma } = require('@prisma/client');
const DbError = require("../error/db-error");

const create = async (name, namespaceId) => {
    try {
        const tag = prisma.tag.create({
            data: {
                name: name,
                namespaceId: namespaceId
            }
        });

        return tag;
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
            throw new DbError("Already exists tag with the same name and namespace");
        }
        throw err;
    }
}

const searchByName = async (name) => {
    const tags = await prisma.tag.findMany({
        where: {
            name: {
                contains: name
            }
        },
        take: 20,
        select: {
            id: true,
            name: true,
            namespace: {
                select: {
                    name: true
                }
            },
        }
    });

    const result = tags.map(e => {
        return {
            id: e.id,
            name: e.name,
            namespace: e.namespace ? e.namespace.name : "",
        }
    });

    return result;
}

const searchByNameStartsWith = async (keyword) => {
    const tags = await prisma.tag.findMany({
        where: {
            name: {
                startsWith: keyword
            }
        },
        take: 10,
        select: {
            name: true,
            postTag: {
                select: {
                    tag:  {
                        select: {
                            name: true,
                        }
                    }
                }
            }
        },
    })

    const result = tags.map(e => {
        return {
            id: e.id,
            name: e.name,
            postCount: e.postTag.length // Number of post with this tag
        }
    })

    return result;
}

const deleteById = async (id) => {
    const tag = prisma.tag.delete({
        where: { id: id }
    })

    return tag;
}

module.exports = {
    create,
    searchByName,
    searchByNameStartsWith,
    deleteById
}
