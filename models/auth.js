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
    country:String,
    company:String,
    job_title:String,
    about:String,
    description:String,
    price:String,
    skills:[String]
})
const ConnectionSchema = new mongoose.Schema({
    useremail:String,
    requests:[],
    status:[]
})
const Sign = mongoose.model("Authentication",authSchema);
const profile = mongoose.model("Profile",RegSchema);
const connections = mongoose.model("Connections",ConnectionSchema);
module.exports={Sign,profile,connections}
