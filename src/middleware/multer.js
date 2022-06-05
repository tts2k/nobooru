const multer = require("multer");
const { AllowedMimeTypes } = require("../constants");
const AppError = require("../error/app-error");

const upload = multer({
    storage: multer.memoryStorage({
        fileFilter: (req, file, cb) => {
            if (file.fieldname !== "image" && file.fieldname !== "json") {
                return next(AppError.badRequest("Invalid field name"));
            } else if (file.fieldname === "image" && !AllowedMimeTypes.includes(file.mimetype)) {
                return next(AppError.badRequest("Not an image"));
            } else if (file.fieldname === "json" && file.mimetype !== "application/json") {
                return next(AppError.badRequest("Not a json file"));
            }
        }
    })
});

module.exports = upload;
