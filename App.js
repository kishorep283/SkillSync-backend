const express =require("express");
let app=express();
let dbConnect =require("./database.js");
dbConnect();
app.use(express.json());
let cors=require("cors");
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
let AuthRouter = require("./Router/Authentication_router.js");
let connectionRouter  =require("./Router/connection_router.js");
app.use("/Auth",AuthRouter);
app.use("/connection",connectionRouter)
app.get("/",(req,res)=>{
    res.send("elcome to ");
})

app.listen(3002,()=>{
    console.log("server started");
})