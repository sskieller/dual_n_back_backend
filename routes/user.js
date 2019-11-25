const express = require('express');
const User = require('../models/User');
const router = express.Router();
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');

/* 
 * /users 
*/

router.post('/', userController.registerNewUser);
router.post('/login', userController.loginUser);
router.post('/logout', auth, userController.logoutUser);
router.post('/logoutall', auth, userController.logoutAll);

module.exports = router;