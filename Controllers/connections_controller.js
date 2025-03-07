let express =require("express");
let model = require("../models/auth");
const { connection } = require("mongoose");
let {connections,profile}=model;
const root = async(req,res)=>{
    res.send("connection page");
}
// Api for Request adding to user
const assign = async(req,res)=>{
    let requestmail = req.params.email;
    let email = req.user.email;
    console.log("i'm invoked")
    try {
        let data = await connections.findOne({ useremail: requestmail });
        
            if (!data) {
                let newEntry = await connections.create({
                    useremail: requestmail,
                    requests: [email]
                });
                return res.status(200).send({ message: "Request sent successfully", details: newEntry });
            } else if(data){
                let updatedEntry = await connections.updateOne(
                    { useremail: requestmail },
                    { $push: { requests: email } } 
                );
    
                return res.send({ message: "Request sent successfully", details: updatedEntry });
            }
        
            else if(data.requests.includes(email)){
                res.send({message:"Request already sent,wait for response!"})
            }
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: "Bad request" });
    }
}

// Displaying the available request for user
const requests =async(req,res)=>{
    console.log("i'm invoked in connections");
    let email = req.user.email;
    console.log(email);
    // console.log(req.params);
    try {
        let data = await connections.findOne({useremail:email }); // Use findOne instead of find

        if (!data || !data.requests || data.requests.length === 0) {
            return res.status(200).json({ message: ["No requests to you"] });
        }
        const users = await profile.find({ email: { $in: data.requests } });

        return res.status(200).json({ message: users });
    } catch (error) {
        console.error("Error fetching requests:", error);
        return res.status(500).json({ error: "Server error" });
    }
      
}
// Api for Status ,wheather a user can be accepted or rejected
const response =async(req,res)=>{
    let email = req.user.email;
    console.log(email);
    let action =req.params.action;
    let responseemail=req.params.email;
    console.log(action);
    console.log(responseemail);
    console.log("i'm invoked in response");
    try{
        let currdata = await connections.findOne({useremail:email});
        let respdata = await connections.findOne({useremail:responseemail});
        console.log(currdata);
        console.log(respdata);
        // let 
        if(action === "Accept"){
            currdata.status.push(responseemail);
            currdata.requests = currdata.requests.filter(item=>item!==responseemail);
            currdata.save();
            if(!respdata){
                let newEntry = await connections.create({
                    useremail: responseemail,
                    status: [email]
                });
            }else{
                respdata.status.push(email);
                respdata.save();
            }
            res.status(200).send({message:"Accepted the user"});
        }else{
            currdata.requests = currdata.requests.filter(item=>item!=responseemail);
            currdata.save();
            res.send({message:"Rejects the user"});
        }
    }
    catch(err){
        res.status(400).send({messgae:"An server exception occured"});
    }
}
//Api for showing friends list
const friends = async(req,res)=>{
    let email = req.user.email;
    let data =await connections.findOne({useremail:email});
    try{
        if(!data){
            res.status(400).send({message:"No user Found"});
        }
        else{
            if(data.status.length<1){
                res.status(200).send({message:["You Have No friends ,Please make some friends"]});
            }
            else{
                const friendlist = await profile.find({ email: { $in: data.status} });
                res.status(200).send({message:friendlist});  
            }
        }
    }
    catch(err){
        res.status(500).send({message:"Error Occured At Server"});
    }

}
module.exports ={root,assign,requests,response,friends};