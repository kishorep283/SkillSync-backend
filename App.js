const express =require("express");
let app=express();
let cookie=require("cookie-parser");
app.use(cookie());
const dbConnect =require("./database.js");
dbConnect();
app.use(express.json());
const user = require("./router/userAuth.js");
let mentor = require("./router/mentorAuth.js");

app.use("/user",user);
app.use("/mentor",mentor);
app.get("/",(req,res)=>{
    res.send("elcome to ");
})
app.listen(3002,()=>{
    console.log("server started");
})