const { resolve } = require("path");
const { toPositiveInteger } = require("../utils/misc.util");
const AppError = require("../error/app-error");
const DbError = require("../error/db-error");
const postRepo = require("../repositories/post.repo");
const { generateSha256Sum, processImage, writeBufferToPath } = require("../utils/file.util");
const HttpResCode = require("../constants").HttpResCode;

/* GET */
const getPostsLatest = async (req, res, next) => {
    try {
        const page = req.body.page ? req.body.page : 0;
        const result = await postRepo.getLatest(page);
        return res.status(200).json(result);
    } catch (err) {
        console.error(err);
        next(AppError.internalError())
    }
}

const getPostById = async (req, res, next) => {
    try {
        // Input checking
        const id = toPositiveInteger(req.params.id);
        if (id === null) {
            return next(AppError.badRequest("Invalid request."));
        }

        const post = await postRepo.getById(id);

        if (post === null) {
            return next(AppError.notFound("Post not found."));
        }

        return res.status(HttpResCode.Ok).json({
            post: post
        })

    } catch (err) {
        console.error(err);
        next(AppError.internalError());
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

        // Get posts
        const result = await postRepo.getByTags(tags, page);

        return res.status(HttpResCode.Ok).json(result);
    } catch (err) {
        console.error(err);
        next(AppError.internalError());
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

        // Process image (get image metadata, generate thumbnail)
        const imageDetails = await processImage(imageFile.buffer);

        // Get image checksum
        const checksum = generateSha256Sum(imageFile.buffer);

        // Create new post record
        const postDetails = JSON.parse(jsonFile.buffer.toString()); // Parse json for post metadata

        await postRepo.create(imageFile, imageDir, checksum, imageDetails, postDetails, req.userId);

        // Move image to configured directory
        const fileName = `${checksum}.${imageDetails.format}`;
        const moveRaw = writeBufferToPath(imageFile.buffer, `${imageDir}/raws/`, fileName);
        const moveThumb = writeBufferToPath(imageDetails.thumbnailBuffer, `${imageDir}/thumbnails/`, `thumb-${fileName}`);

        const post = await Promise.all([moveRaw, moveThumb]);

        return res.status(HttpResCode.Created).send({
            status: "success",
            postId: post.id
        });
    } catch(err) {
        if (err instanceof DbError) {
            next(err);
        }
        console.error(err);
        next(AppError.internalError());
    }
}

/* DELETE */
const deletePostById = async (req, res, next) =>{
    try {
        if (!req.body.postId) {
            next(AppError.badRequest("Post id is empty"));
        }
        await postRepo.deleteById(req.body.postId);
        return res.status(HttpResCode.Ok).json({ message: "Post deleted" });
    }
    catch (err) {
        console.error(err);
        next(AppError.internalError());
    }
}

module.exports = { getPostsLatest, getPostById, getPostsByTags, createPostFromFile, deletePostById }
