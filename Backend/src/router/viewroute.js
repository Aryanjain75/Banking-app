const express = require('express');
const router = express.Router();
const path = require('path');
const { adminMiddleware } = require('../middlewares/role');
const { authMiddleware ,logedin} = require("../middlewares/auth");
const jwt = require('jsonwebtoken');
const dotconfig= require("dotenv");
dotconfig.config();


router.get("/entry",(req,res)=>{
    const token = req.cookies.token;
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    if(req.user.role=="admin"){
        res.json({flag:true});
    }
    else{
        res.json({flag:false});
    }
})

router.get("/LoggedIn",(req,res)=>{
    const token = req.cookies.token;
    const accountno=req.cookies.accountno;
    if(token){
        res.json({flag:true,accountno:accountno});
    }
    else{
        res.json({flag:false});
    }
})

module.exports = router;
