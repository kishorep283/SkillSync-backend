const express=require("express");
const Auth = require("../models/auth.js");
const bcrypt=require("bcrypt");
const jwtwebtoken = require("jsonwebtoken");
require("dotenv").config();
let secretkey = process.env.SECRET_KEY;
let root=(req,res)=>{
    res.send("welcome to Login Page");
}
let signUp = async (req,res)=>{
    // console.log(req.body);
    const{firstname,lastname,password,email}=req.body;
    try{
        let data = await Auth.Sign.find({email});
        console.log(data);
        if(data.length>0){
            res.send({message:"user already exixts"});
        }else{
            let hashedpassword = await bcrypt.hash(password,10);
            let info = await Auth.Sign.create({firstname:firstname,lastname:lastname,password:hashedpassword,email:email});
            res.send({statuscode:200,message:"user Registered Successfully",data:info});
        }
    }
    catch(error){
        console.log(error);
        res.send({statuscode:500,message:error})
    }
}
let Login = async (req,res)=>{
    const {email,password}=req.body;
    try{
        let data =await Auth.Sign.find({email});
        // console.log(data);
        if(data.length<1){
            res.send({message:"user Not found"});
        }else{
            let valid = await bcrypt.compare(password,data[0].password);
            if(!valid){
                res.send({message:"Invalid Credintials"});
            }else{
                
                let{email} =data[0];
                let token=await jwtwebtoken.sign({email},secretkey,{expiresIn:"1hr"});
                console.log(token);
                res.cookie("token",token,{
                    httpOnly: true, 
                    secure: true, 
                    sameSite: "Strict",
                    maxAge: 3600000, 
                })
                res.send({message:"login successfull"})
            }
        }
    }
    catch(error){
        res.send({message:error});
    }
}



module.exports = {root,signUp,Login};