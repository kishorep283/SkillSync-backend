const express= require("express");
let router = express.Router();
let control=require("../controllers/mentorcontrol.js");
router.get("/",(req,res)=>{
    res.send("welcome mentor");
})
router.post("/register",control.register);
module.exports=router;