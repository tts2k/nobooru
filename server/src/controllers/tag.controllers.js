const tagRepo = require("../repositories/tag.repo");
const AppError = require("../error/app-error");
const DbError = require("../error/db-error");
const { isStringNotNullOrEmpty, isPositiveInteger } = require("../utils/misc.util");
const { HttpResCode } = require("../constants");

const createTag = async (req, res, next) => {
    try {
        const tagName = req.body.name;
        const tagNamespaceId = req.body.namespaceId;

        if (!isStringNotNullOrEmpty(tagName) || !isPositiveInteger(tagNamespaceId)) {
            return res.status(HttpResCode.BadRequest).json({
                message: "Invalid request."
            });
        }

        const tag = await tagRepo.create(tagName, tagNamespaceId);

        return res.status(HttpResCode.Created).json({
            message: "success",
            id: tag.id
        });
    } catch (err) {
        if (err instanceof DbError) {
            next(err);
        }
        console.error(err);
        next(AppError.internalError());
    }
}

const deleteTagById = async (req, res, next) => {
    try {
        const tagId = toPositiveInteger(req.body.id);

        if (tagId === null) {
            return res.status(HttpResCode.BadRequest).json({
                message: "Invalid request."
            })
        }

        const tag = await tagRepo.create(tagName, tagNamespaceId);

        return res.status(HttpResCode.Created).json({
            message: "success",
            id: tag.id
        });
    } catch (err) {
        if (err instanceof DbError) {
            next(err);
        }
        console.error(err);
        next(AppError.internalError());
    }
}

const searchTagsByName = async (req, res, next) => {
    try {
        const tagQuery = req.body.query;

        if (!isStringNotNullOrEmpty(tagQuery)) {
            return res.status(HttpResCode.BadRequest).json({
                message: "Invalid request."
            });
        }

        const tags = await tagRepo.searchByName(tagQuery);

        return res.status(HttpResCode.Ok).json({
            tags: tags
        });
    } catch(err) {
        console.error(err);
        next(AppError.internalError());
    }
}

const searchTagsByNameStartsWith = async (req, res, next) => {
    try {
        const tagKeyword = req.query.key;

        if (!isStringNotNullOrEmpty(tagKeyword)) {
            return res.status(HttpResCode.BadRequest).json({
                message: "Invalid request."
            });
        }

        const tags = await tagRepo.searchByNameStartsWith(tagKeyword)

        return res.status(HttpResCode.Ok).json({
            tags: tags
        })

    }
    catch (err) {
        console.error(err);
        next(AppError.internalError());
    }
}

module.exports = {
    createTag,
    deleteTagById,
    searchTagsByName,
    searchTagsByNameStartsWith
}
