const mongoose=require("mongoose");
const authSchema = new mongoose.Schema({
    firstname:String,
    lastname:String,
    password:String,
    email:String,
    
})
const RegSchema = new mongoose.Schema({
    firstname:String,
    lastname:String,
    email:String,
    image:String,
    password:String,
    Address:String,
    company:String,
    profession:String,
    category:String,
    skills:[String],
    Bio:[String],
    Linkdin:String,
    reason:String
})
const Sign = mongoose.model("Details",authSchema);
const mentor = mongoose.model("register",RegSchema);
module.exports={Sign,mentor}
