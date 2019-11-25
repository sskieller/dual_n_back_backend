const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const scoreController = require('../controllers/scoreController');

/* 
 * /scores
*/

router.post('/', auth, scoreController.addNewScore);

module.exports = router;