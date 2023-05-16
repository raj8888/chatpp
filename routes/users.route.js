const express=require('express')
const bcrypt=require("bcrypt")
var jwt = require('jsonwebtoken');
const{userModel}=require("../model/user.model")
const{authenticate}=require("../middlewares/authentication.middleware")


const userRouter=express.Router()

userRouter.post("/register",async(req,res)=>{
    try {
        let {email,password}=req.body
        let findEmail=await userModel.findOne({email})
        if(findEmail){
            res.status(401).send({"Message":"Already registered"})
        }else{
            bcrypt.hash(password,5,async(err,hash)=>{
                if(err){
                    console.log(err)
                    res.status(401).send({"Message":"Server Error"})
                }else{
                    let user=new userModel({email,password:hash})
                    await user.save()
                    res.status(200).send({"Message":"User Registered"})
                }
            });
        }
    } catch (error) {
        console.log(error.message)
        res.status(401).send({"Message":"Server Error"})
    }
})

userRouter.post("/login",async(req,res)=>{
    try {
        let {email,password}=req.body
        let findEmail=await userModel.findOne({email})
        if(!findEmail){
            res.status(201).send({"Message":"Register First"})
        }else{
            let hashpass=findEmail.password
            bcrypt.compare(password, hashpass, function(err, result) {
                if(err){
                    console.log(err)
                    res.status(401).send({"Message":"Please login again"})
                }else if(result){
                    let token=jwt.sign({userID:findEmail._id},process.env.seckey)
                    res.status(200).send({"Message":"Login Successfull","token":token})
                }else{
                    res.status(401).send({"Message":"Please login again"})
                }
            });
        }
    } catch (error) {
        console.log(error.message)
        res.status(401).send({"Message":"Server Error"})
    }
})

userRouter.use(authenticate)

userRouter.get("/name",async(req,res)=>{
    let id=req.body.userID
    let data=await userModel.findById({_id:id})
    let name=data.name
    res.send({"name":name})
})

module.exports={
    userRouter
}