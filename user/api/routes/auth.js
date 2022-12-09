const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verify = require('../controller/middleware');
require("dotenv").config();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
    });

    const token = jwt.sign(
      { user_id: newUser._id, email },
      "secret",
      {
        expiresIn: "2h",
      }
    );
    // save user token
    newUser.token = token;

    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/nija',function(req,res){
  res.send({type: 'GET'});
})

router.post('/nija',function(req,res){
  res.send({type: 'post'});
})

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const  email  = req.body.email;
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(400).json("Wrong credentials!");

    const validated = await bcrypt.compare(req.body.password, user.password);
    
    if(validated){
       const token = jwt.sign(
      { user_id: user._id, email },
      "secret",
      {
        expiresIn: "2h",
      }
    );

    // save user token
    user.token = token;
    console.log(token)
    }
   


    !validated && res.status(400).json("Wrong credentials!");

    

    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

//verification 
router.get("/welcome", verify, (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});

module.exports = router;