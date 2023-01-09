const express = require("express");
const jwt = require('jsonwebtoken')

const authMiddleware=(req,res,next)=>{
    try{
        const jwt_token=req.cookies.jwt_token
        const decoded_token=jwt.verify(jwt_token, process.env.jwt_key);
        res.locals.userID=decoded_token.id
        next()
    }
    catch{
        res.status(401)
        res.json({success:false,msg:'Not Authorized'})
    }
}


module.exports= authMiddleware