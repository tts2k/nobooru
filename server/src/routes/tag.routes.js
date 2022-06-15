const express = require('express');
const controllers = require("../controllers/tag.controllers");
const authJwt = require("../middleware/jwt");

const router = express.Router();

router.get('/', controllers.searchTagsByName);
router.post('/', [authJwt.verifyToken, authJwt.isAdmin], controllers.createTag);
router.delete('/', [authJwt.verifyToken, authJwt.isAdmin], controllers.deleteTagById);

module.exports = router;
