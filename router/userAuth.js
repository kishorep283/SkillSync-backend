const express=require("express");
const authControl =require("../controllers/userAuth.js");
let middle = require("../Middleware/usermiddle.js");
let router = express.Router();
router.get("/",authControl.root)
router.post("/signUp",authControl.signUp);
router.post("/login",authControl.Login);
router.get("/user",middle.authenticate,(req,res)=>{
    res.send({ message: "User verified", user: req.user });
});
module.exports=router;