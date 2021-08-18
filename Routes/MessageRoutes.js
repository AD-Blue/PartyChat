const express = require('express');
const router = express.Router();
const { postMessage, getMessages } = require('../Controllers/MessageController');
const { jwtVerify } = require('../Controllers/JwtMiddleware.js');

router.route('/').get(jwtVerify).get(getMessages); //RE-ADD JWTVERIFY BEFORE PUSHING. REMOVED FOR TESTING

router.route('/:id').post(postMessage);

module.exports = router;