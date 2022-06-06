const express = require('express');
const controllers = require("../controllers/post.controllers");
const authJwt = require("../middleware/jwt");

const router = express.Router();
const upload = require("../middleware/multer");

router.get('/latest', controllers.getPostsLatest);
router.get('/:id',  controllers.getPostById);
router.get('/', controllers.getPostsByTags);

router.post('/',
    [
        authJwt.verifyToken,
        upload.fields(
        [
            {
                name: "image",
                maxCount: 1
            },
            {
                name: "json",
                maxCount: 1
            }
        ])
    ],
    controllers.createPostFromFile
);

router.delete('/', [authJwt.verifyToken, authJwt.isAdmin], controllers.deletePostById);

module.exports = router;
