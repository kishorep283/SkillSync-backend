let express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
let secretkey = process.env.SECRET_KEY;
const authenticate = (req,res,next)=>{
    let token = req.cookies.token;
    console.log(token);
    if(!token){
        res.send({message:"No token "});
    }
    try{
        let data =jwt.verify(token,secretkey);
        req.user=data;
        next();
    }
    catch(error){
        res.send({message:error});
    }
}
module.exports={authenticate};