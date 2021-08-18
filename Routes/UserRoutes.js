const express = require('express');
const router = express.Router();
const { registerUser, loginUser, checkLogin, checkUserAuth, logout } = require('../Controllers/UserController.js');
const { jwtVerify } = require('../Controllers/JwtMiddleware.js');

router.route('/register').post(registerUser);

router.route('/isUserAuth').get(jwtVerify).get(checkUserAuth);

router.route('/login').post(loginUser).get(checkLogin);

router.route('/logout').get(logout)

module.exports = router;