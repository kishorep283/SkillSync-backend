let model = require("../models/auth.js");
let bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");
require("dotenv").config();
let root =(req,res)=>{
    res.send({message:"welcome to Authentication"});
}
const register = async(req,res)=>{
    let {email,password,firstname,lastname}=req.body;
    const data = await model.Sign.find({email});
    if(data.length>0){
        res.send({message:"User Already Exixts"});
    }else{
        let hashed_pswd = await bcrypt.hash(password,10);
        await model.Sign.create({email:email,password:hashed_pswd,firstname:firstname,lastname:lastname});
        res.send({message:"user Registered Successfully"});
    }
}
const login = async (req,res)=>{
    let {email,password}=req.body;
    let data = await model.Sign.find({email});
    // console.log(data);
    if(data.length<1){
        res.send({message:""});
    }
    else{
        let verification =await bcrypt.compare(password,data[0].password);
        if(!verification){
            res.send({message:"Invalid Credintials"});
        }else{
            let token = await jwt.sign({email:email},process.env.SECRET_KEY);
            res.send({message:"Login Successfull",token:token})
        }
    }
}
const google_login = async(req,res)=>{
    const { email, name } = req.body;

    let user = await model.Sign.findOne({ email });
    // console.log(user);
    if (!user) {
        // Register user if not found
        user = await model.Sign.create({ name, email, password: "google-auth" });
    }
    // console.log(user);
    const token = jwt.sign({ email: user.email}, process.env.SECRET_KEY, { expiresIn: "3h" });
    res.json({ token, message: "Google Login Successful" });
}
const profile = async (req,res)=>{
    let {firstname,lastname,email,Address,company,profession,About,skills}=req.body;
    await model.profile.create({firstname:firstname,lastname:lastname,email:email,Address:Address,company:company,profession:profession,
        About:About,skills:skills,image:req.file?req.file.path:null
    })
    res.send({message:"Account Created Successfull"});
}
const profile_check =async(req,res)=>{
    let rest = req.headers["authorization"].split(" ")[1];
    // console.log(rest);
    let data = jwt.verify(rest,process.env.SECRET_KEY);
    // console.log(data);
    let {email}=data;
    // console.log(email);
    let response =await model.Sign.find({email});
    if(response.length<0){
        res.send({message:"User Profile Not Created",response:""});
    }else{
        res.send({response:response});
    }

}
const All_data=async (req,res)=>{
    let AllData =await model.profile.find();
    if(AllData.length<0){
        res.send({message:"No users Found"});
    }else{
        res.send({data:AllData});
    }
}
module.exports ={register,root,login,profile,profile_check,All_data,google_login};