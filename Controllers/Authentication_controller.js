let model = require("../models/auth.js");
let bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");
require("dotenv").config();
let {S3Client, PutObjectCommand, GetObjectCommand} =require("@aws-sdk/client-s3");
let path=require("path");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
let s3Clientconfig = new S3Client({
    region:process.env.REGION,
    credentials:{
        accessKeyId:process.env.ACCESS_KEY,
        secretAccessKey:process.env.SECRET_ACCESS_KEY

    }
})
const Bucketname= process.env.BUCKET_NAME;
// console.log("hello i'm bucketname"+Bucketname);
// console.log(Bucketname);
let root =(req,res)=>{
    res.send({message:"welcome to Authentication"});
}
const register = async(req,res)=>{
    let {email,password,firstname,lastname}=req.body;
    const data = await model.Sign.find({email});
    if(data.length>0){
        res.status(400).send({message:"User Already Exixts"});
    }else{
        let hashed_pswd = await bcrypt.hash(password,10);
        await model.Sign.create({email:email,password:hashed_pswd,firstname:firstname,lastname:lastname});
        res.status(200).send({message:"user Registered Successfully"});
    }
}
const login = async (req,res)=>{
    let {email,password}=req.body;
    let data = await model.Sign.find({email});
    // console.log(data);
    if(data.length<1){
        res.status(400).send({message:"user not found"});
    }
    else{
        let verification =await bcrypt.compare(password,data[0].password);
        if(!verification){
            res.status(400).send({message:"Invalid Credintials"});
        }else{
            let token = await jwt.sign({email:email},process.env.SECRET_KEY);
            console.log(token)
            res.status(200).send({message:"Login Successfull",token})
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
    res.status(200).json({ token, message: "Google Login Successful" });
}
const profile = async (req,res)=>{
    let {country,company,job_title,about,skills,description,price}=req.body;
    let email = req.user.email;
    let file =req.file;
    if(!file){
        return res.status(400).send({message:"File not found"})
    }
    let userData = await model.Sign.findOne({email});
    console.log(userData);
    let firstname =userData.firstname ? userData.firstname: userData.name.split(" ")[0];
    let lastname =userData.lastname ? userData.lastname : userData.name.split(" ")[1];
    // let imagePath = `http://localhost:3002/uploads/${req.file.filename}`;
    console.log(req.file);
    try{
        let s3Key = `${file.originalname}${Date.now()}`;
        await s3Clientconfig.send(new PutObjectCommand({
            Bucket:Bucketname,
            Key:s3Key,
            Body:file.buffer,
            ContentType:file.mimetype
        }))
        let data =await model.profile.find({email});
        if(data.length>0){
            res.status(400).send({message:"User Already Exixted"});
        }else{
            console.log(req.file.originalname);
            console.log(s3Key)
            await model.profile.create({firstname:firstname,lastname:lastname,email:email,country:country,company:company,job_title:job_title,price:price,
                about:about,description:description,skills:skills,image:s3Key,filename:req.file.originalname,file:null
            })
            res.status(200).send({message:"Account Created Successfull"});
        }
    } 
    catch(err){
        res.status(500).send({message:"Error Occured At server"});
    }
}
const profile_check =async(req,res)=>{
    let email = req.user.email;
    console.log(email);
    let data = await model.Sign.findOne({email});
    if(!data){
        res.send({message:"No user found"});
    }else{
        res.send({message:data});
    }
}
const GetObjectURL= async(s3Key)=>{
    const command =new GetObjectCommand({Bucket:Bucketname,Key:s3Key});
    return await getSignedUrl(s3Clientconfig,command)
}
const getData =async(req,res)=>{
    let email =req.user.email;
    console.log(email);
    let data =await model.profile.find({email});
    console.log(data);
    if(data.length<1){
        res.status(200).send({message:"no data please create profile"});
    }
    else if(data[0].image.startsWith("https") && !data[0].filename){
        res.status(200).send({message:data[0]});
    }
    else{
        const files= await Promise.all(data.map(async ({filename,image})=>({
            filename:filename,
            fileUrl:await GetObjectURL(image)
        })))
        // console.log(files);
        // console.log("URL file",files[0]);
        let updateData =await model.profile.updateOne(
            {email:data[0].email},
            {$set: { file: files[0].fileUrl }}
        )
        console.log(files);
        // data[0].file=files[0].fileUrl;
        res.status(200).send({message:data[0]});
    }
}
const All_data=async (req,res)=>{
    let AllData =await model.profile.find();
    if(AllData.length<0){
        res.status(400).send({message:"No users Found"});
    }else{
        res.status(200).send({message:AllData});
    }
}
module.exports ={register,root,login,profile_check,profile,profile,All_data,google_login,getData};


