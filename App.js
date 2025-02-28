const express =require("express");
let app=express();
let dbConnect =require("./database.js");
dbConnect();
app.use(express.json());
let cors=require("cors");
app.use(cors())
let AuthRouter = require("./Router/Authentication_router.js");
app.use("/Auth",AuthRouter);
app.get("/",(req,res)=>{
    res.send("elcome to ");
})

app.listen(3002,()=>{
    console.log("server started");
})