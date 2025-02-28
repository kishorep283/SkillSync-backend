const mongoose=require("mongoose");
const authSchema = new mongoose.Schema({
    email:String,
    password:String,
    name:String,
    firstname:String,
    lastname:String
 
})
const RegSchema = new mongoose.Schema({
    firstname:String,
    lastname:String,
    email:String,
    image:String,
    Address:String,
    company:String,
    profession:String,
    About:String,
    skills:[String]
})
const Sign = mongoose.model("Authentication",authSchema);
const profile = mongoose.model("Profile",RegSchema);
module.exports={Sign,profile}
