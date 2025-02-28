let express=require("express");
let router = express.Router();
let multer =require("multer");
let path=require("path");
let storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, path.join(__dirname, "../uploads"));
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+file.originalname);
    }
})
let upload = multer({storage:storage});
let Auth_control = require("../Controllers/Authentication_controller.js");
router.get("/",Auth_control.root);
router.post("/register",Auth_control.register);
router.post("/login",Auth_control.login);
router.post("/google-login",Auth_control.google_login);
router.post("/create-profile",upload.single("image"),Auth_control.profile);
router.get("/profile",Auth_control.profile_check);
router.get("/AllData",Auth_control.All_data);
module.exports=router;