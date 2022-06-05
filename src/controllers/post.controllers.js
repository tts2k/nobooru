const { resolve } = require("path");
const prisma = require("../prisma");
const { toPositiveInteger } = require("../utils/misc.util");
const { generateSha256Sum, processImage, writeBufferToPath } = require("../utils/file.util");
const AppError = require("../error/app-error");
const { Prisma } = require("@prisma/client");

/* GET */
const getPostsLatest = async (req, res, next) => {
    try {
        const page = req.body.page ? req.body.page : 0;

        const result = await prisma.$transaction([
            prisma.post.count(),
            prisma.post.findMany({
                orderBy: { createdAt: "asc" },
                take: 20,
                skip: 20 * page,
                select: {
                    id: true,
                    fileDir: true,
                    checksum: true,
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
                                    name: true
                                }
                            }
                        }
                    }
                }
            })
        ]);

        res.status(200).json({
            posts: result[1],
            page: page + 1,
            totalPages: Math.ceil(result[0] / 20)
        });
    } catch (err) {
        next(AppError.internalError(err.message))
    }
}

const getPostById = async (req, res, next) => {
    try {
        // Input checking
        const id = toPositiveInteger(req.params.id);
        if (id === null) {
            return next(AppError.badRequest("Invalid request."));
        }

        // Get post
        const post = await prisma.post.findUnique({
            where: {
                id: id
            },
            include: {
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
                                name: true
                            }
                        }
                    }
                }
            }
        });

        if (post === null) {
            return next(AppError.notFound("Post not found."));
        }

        return res.status(200).json({
            post: post
        })

    } catch (err) {
        next(AppError.internalError(err.message));
    }
}

const getPostsByTags = async (req, res, next) => {
    try {
        const page = req.body.page ? req.body.page : 0;
        const tagsQuery = req.query.tags;
        if (!tagsQuery || !tagsQuery.length === 0) {
            return next(AppError.badRequest("Invalid request."));
        }

        const tags = tagsQuery.split('+');
        if (tags.length === 0) {
            return next(AppError.badRequest("Tag cannot be empty."));
        }

        // Creating where clause
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

        // Get post
        const result = await prisma.$transaction([
            prisma.post.count({ where: where }),
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
                                }
                            }
                        }
                    }
                }
            })
        ]);

        return res.status(200).json({
            posts: result[1],
            page: page + 1,
            totalPages: result[0]
        });
    } catch (err) {
        next(AppError.internalError(err.message));
    }
}

/* POST */
const createPostFromFile = async (req, res, next) => {
    // Hardcode for now, will move to user config later
    const imageDir = resolve("images");
    try {
        const files = req.files;
        if (!files) {
            return next(AppError.badRequest("File upload failed."));
        }

        const imageFile = files.image[0];
        const jsonFile = files.json[0];

        // Process image (check image type, generate thumbnail)
        const imageDetails = await processImage(imageFile.buffer);

        // Get image checksum
        const checksum = generateSha256Sum(imageFile.buffer);


        // Create new post record
        const postDetails = JSON.parse(jsonFile.buffer.toString()); // Parse json for post metadata
        const postTagsConnect = postDetails.tags.map(e => {
            return {
                tag: {
                    connect: {
                        id: e
                    }
                }
            }
        });

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
                user: { connect: { id: req.userId } },
                postTags: { create: postTagsConnect }
            }
        });

        // Move image to configured directory
        const fileName = `${checksum}.${imageDetails.format}`;
        const moveRaw = writeBufferToPath(imageFile.buffer, `${imageDir}/raws/`, fileName);
        const moveThumb = writeBufferToPath(imageDetails.thumbnailBuffer, `${imageDir}/thumbnails/`, `thumb-${fileName}`);

        await Promise.all([moveRaw, moveThumb]);

        res.status(200).send({
            status: "success",
            postId: post.id
        });
    } catch(err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2002')
                next(AppError.badRequest('Duplicate image. An image with the same hash has already been uploaded.'));
        }
        next(AppError.internalError(err.message));
    }
}

/* DELETE */
const deletePostById = async (req, res, next) =>{
    try {
        if (!req.body.postId) {
            next(AppError.badRequest("Post id is empty"));
        }

        const deletePostTags = prisma.postTag.deleteMany({
            where: { postId: req.body.postId }
        });
        const deletePost = prisma.post.delete({
            where: { id: req.body.postId }
        });

        await prisma.$transaction([deletePostTags, deletePost]);

        return res.status(200).json({ message: "Post deleted" });
    }
    catch (err) {
        next(AppError.internalError(err.message));
    }
}

module.exports = { getPostsLatest, getPostById, getPostsByTags, createPostFromFile, deletePostById }
