const express = require("express");
const userrouter = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {User} = require("../models/Models");
const authMiddleware =require('../middleware/auth')
userrouter.get('/me',authMiddleware,async(req,res)=>{
  try{
    const user_data=await User.findOne({where:{id:res.locals.userID},attributes :['id','firstname','lastname','email','username']})
    res.json({success:true,...user_data.dataValues})
  }catch(err){
    res.status(500)
    res.json({success:false})
  }
})
userrouter.post("/verify_account", async (req, res, next) => {
  const { token } = req.body;

  jwt.verify(token, process.env.jwt_key, async (err, valid_token) => {
    if (err) {
      res.json({ status: false });
      return;
    }

    const id = valid_token.id;

    const findAccount = await User.findOne({ 
      where: {
        id
      }
    })


    if (!findAccount) {
      res.json({ status: false });
      return;
    }

    res.json({
      status: true,
      username: findAccount.username,
      email: findAccount.email,
    });
  });
});

userrouter.post(
  "/login",
  [
    check("username", "Enter username").not().isEmpty(),
    check("password", "Enter password").not().isEmpty(),
  ],
  async (req, res, next) => {
    const { username, password } = req.body;

    const error = validationResult(req);

    if (!error.isEmpty()) {
      res.json({ error: error.array(), error_type: 0 });
      return;
    }

    const findone = await User.findOne({ 
      where: {
        username:username
      }
    })

    if (!findone) {
      res.json({ message: "Invalid account", error_type: 1 });
      return;
    }

    await bcrypt.compare(password, findone.password, (err, isValid) => {
      if (isValid) {
        const id = findone.id;
        const token = jwt.sign({ id }, process.env.jwt_key, {
          expiresIn: "7d",
        });

        res
          .cookie("jwt_token", token)
          .status(200)
          .send({ message: "Loggin ", token, created: true });
      } else {
        res.json({ message: "Invalid Account", created: false });
      }
    });
  }
);

userrouter.post(
  "/register",
  [
    check("firstname", "Enter firstname").not().isEmpty(),
    check("lastname", "Enter lastname").not().isEmpty(),
    check("username", "Enter username").not().isEmpty(),
    check("email", "Enter email").not().isEmpty().isEmail(),
    check("password", "Enter Password").not().isEmpty().isLength({ min: 5 }),
    check("confirm_password", "Confirm Password").not().isEmpty(),
  ],
  async (req, res, next) => {
    let { firstname, lastname, email, username, password, confirm_password } =
      req.body;

    const error = validationResult(req);

    if (!error.isEmpty()) {
      res.json({ error: error.array(), error_type: 0, created: false });
      return;
    }

    const findOne_username = await User.findOne({ 
      where: {
        username
      }
    })
    const findOne_email = await User.findOne({ 
      where: {
        email
      }
    })

    if (findOne_username) {
      res.json({
        message: "Username already exist",
        error_type: 1,
        created: false,
      });
      return;
    }

    if (findOne_email) {
      res.json({
        message: "Email already exist",
        error_type: 1,
        created: false,
      });
      return;
    }

    if (password !== confirm_password) {
      res.json({
        message: "Both password do not match",
        error_type: 1,
        created: false,
      });
      return;
    }
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    try{

    const user = await User.create({ 
        firstname,
        lastname,
        email,
        username,
        password,
      });


    const createdUser = await User.findOne({ 
      where: {
        username:username
      }
    })
    const token = jwt.sign({ id:createdUser.id }, process.env.jwt_key, { expiresIn: "7d" });

      res
        .cookie("jwt_token", token)
        .status(201)
        .send({ id:createdUser.id, created: true, token, message: "Registered" });
  }catch{
    res.json({succes:false, message: "Internal server error" });
  }
  }
);

module.exports = userrouter;