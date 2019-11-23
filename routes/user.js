const express = require('express');
const User = require('../models/User');
const router = express.Router();
const auth = require('../middleware/auth');
/* 
 * /users 
*/

router.post('/', async(req,res) => {
  // Register new user
  try {
    const user = new User(req.body);
    // Check if user already existing
    const query = User.where({username: user.username});
    query.findOne( async (err, userAlreadyCreated) => {
      if (userAlreadyCreated) return res.status(409).send({error: 'User already created'});
      // Continue with user registration
      await user.save();
      const token = await user.generateAuthToken();
      res.status(201).send({user,token});
    });
    
  } catch (error) {
    res.status(400).send(error);
  };
});

router.post('/login', async(req,res) => {
  // Login registered user
  try {
    console.log("loging in")
    const {username, password} = req.body;

    const user = await User.findByCredentials(username, password);
    if (!user) {
      return res.status(401).send({error: 'Login failed! Check authentication credentials'});
    }
    const token = await user.generateAuthToken();
    res.send({user, token});
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post('/logout', auth, async (req,res) => {
  // Logout user
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token != req.token
    });

    await req.user.save();
    res.send();

  } catch (error) {
    res.status(500).send(error);
  };
});

router.post('/logoutall', auth, async(req,res) => {
  // Logout user from all devices
  try {
    req.user.tokens.splice(0, req.user.tokens.length);

    await req.user.save();
    res.send();

  } catch (error) {
    res.status(500).send(error);
  };
});


module.exports = router;