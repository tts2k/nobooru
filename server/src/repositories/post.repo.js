const prisma = require("../prisma");
const { Prisma } = require('@prisma/client');
const DbError = require("../error/db-error");

const _getMany = async (page, where) => {
    const posts = await prisma.$transaction([
        prisma.post.count(),
        prisma.post.findMany({
            orderBy: { createdAt: "asc" },
            where: where,
            take: 20,
            skip: 20 * page,
            select: {
                id: true,
                checksum: true,
                format: true,
                type: {
                    select: {
                        name: true
                    }
                },
                postTags: {
                    select: {
                        tag:  {
                            select: {
                                name: true,
                                namespace: { select: { name: true } }
                            }
                        }
                    }
                }
            }
        })
    ]);

    const result = {
        page: page + 1,
        totalPages: Math.ceil(posts[0] / 20)
    };
    result.posts = posts[1].map(e => {
        return {
            id: e.id,
            checksum: e.checksum,
            format: e.format,
            type: e.type.name,
            tags: e.postTags.map(e => {
                return {
                    name: e.tag.name,
                    namespace: (e.tag.namespace)
                        ? e.tag.namespace.name
                        : ""
                }
            })
        }
    });

    return result;
}

const getLatest = async (page) => {
    return _getMany(page);
}

const getByTags = async (tags, page) => {
    // Create where clause
    const where = { AND: []};
    tags.forEach(e => {
        where.AND.push({
            postTags: {
                some: {
                    tag: { name: e }
                }
            }
        })
    })

    return await _getMany(page, where);
}

const getById = async (id) => {
    // Get post
    const post = await prisma.post.findUnique({
        where: {
            id: id
        },
        include: {
            user:{
                select: {
                    id: true,
                    name: true
                }
            },
            type: {
                select: {
                    id: true,
                    name: true
                }
            },
            postTags: {
                select: {
                    tag:  {
                        select: {
                            id: true,
                            name: true,
                            namespace: {
                                select: { name: true }
                            }
                        }
                    }
                }
            }
        }
    });

    if (post === null)
        return post;

    const result = {
        id: post.id,
        checksum: post.checksum,
        originalName: post.originalName,
        width: post.width,
        height: post.height,
        fileSize: post.fileSize,
        format: post.format,
        description: post.description,
        type: post.type.name,
        tags: post.postTags.map(e => {
            return {
                name: e.tag.name,
                namespace: (e.tag.namespace)
                    ? e.tag.namespace.name
                    : ""
            }
        }),
        uploader: {
            id: post.user.id,
            name: post.user.name
        },
        uploadDate: post.createdAt
    }

    return result;
}

const deleteById = async (id) => {
    const deletePostTags = prisma.postTag.deleteMany({
        where: { postId: id }
    });
    const deletePost = prisma.post.delete({
        where: { id: id }
    });

    await prisma.$transaction([deletePostTags, deletePost]);
}

const create = async (imageFile, imageDir, checksum, imageDetails, postDetails, userId) => {
    const postTagsConnect = postDetails.tags.map(e => {
        return {
            tag: {
                connect: {
                    id: e
                }
            }
        }
    });
    try {
        const post = await prisma.post.create({
            data: {
                originalName: imageFile.originalname,
                fileDir: imageDir,
                checksum: checksum,
                fileSize: imageFile.size,
                format: imageDetails.format,
                description: postDetails.description,
                width: imageDetails.width,
                height: imageDetails.height,
                type: { connect: { id: postDetails.type } },
                user: { connect: { id: userId } },
                postTags: { create: postTagsConnect }
            }
        });

        return post;
    }
    catch(err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
            throw new DbError("Already exists image with the same hash.");
        }
        throw err;
    }
}

module.exports = {
    getLatest,
    getById,
    getByTags,
    deleteById,
    create
}
