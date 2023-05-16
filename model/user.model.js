const mongoose=require('mongoose')

let userSchema=mongoose.Schema({
        userID:String,
        name: String,
        email: String,
        password: String,
        profilePic:String,
        contactList:[String]
})

let userModel=mongoose.model("users",userSchema)

module.exports={
    userModel
}