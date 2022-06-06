const express = require('express');
const router = express.Router();

const controllers = require("../controllers/auth.controllers");
const validateUser = require("../middleware/verify-sign-up");

router.post('/signup', [validateUser.checkDuplicateUsername, validateUser.checkRoleExisted], controllers.signUp);
router.post('/signin', controllers.signIn);

module.exports = router;
