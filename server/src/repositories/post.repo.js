const prisma = require("../prisma");
const { Prisma } = require('@prisma/client');
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
                fileDir: true,
                checksum: true,
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
            fileDir: e.fileDir,
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
    try {
        return await _getMany(page);
    } catch (err) {
        console.error(err);
        throw new Error("Internal server error");
    }
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
    try {
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

        console.log(post.postTags[0].tag.namespace.name);

        if (post === null)
            return post;

        const result = {
            id: post.id,
            checksum: post.checksum,
            originalName: post.originalName,
            fileDir: post.fileDir,
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
    } catch (err) {
        console.error(err);
        throw new Error("Internal server error");
    }
}

const deleteById = async (id) => {
    try {
        const deletePostTags = prisma.postTag.deleteMany({
            where: { postId: id }
        });
        const deletePost = prisma.post.delete({
            where: { id: id }
        });

        await prisma.$transaction([deletePostTags, deletePost]);
    } catch(err) {
        console.error(err);
        throw new Error("Internal server error");
    }
}

const createPost = async (imageFile, imageDir, checksum, imageDetails, postDetails, userId) => {
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
                format: imageFile.mimetype,
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
        console.error(err);
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
            throw err;
        }
        throw new Error("Internal server error");
    }
}

module.exports = {
    getLatest,
    getById,
    getByTags,
    deleteById,
    createPost
}
