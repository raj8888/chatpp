const express=require("express")
const{connection}=require("./config/db")
const {userRouter}=require("./routes/users.route")
const http = require('http');
const socketIO = require('socket.io');
var cors = require('cors')

require('dotenv').config()

const app=express()
app.use(cors())

app.use(express.json())
app.use("/user",userRouter)

app.get("/",(req,res)=>{
    res.send("HOME PAGE")
})

const server = http.createServer(app);
const io = socketIO(server);

server.listen(process.env.port,async()=>{
    try {
        await connection 
        console.log("Connected to db")
    } catch (error) {
        console.log(error)
    }
    console.log(`listining on port ${process.env.port}`)
})


const users = {};
io.on("connection", socket  =>{
  socket.on("new-user-joined", name =>{
      // console.log(name);
      users[socket.id] = name;    
      socket.broadcast.emit("user-joined", name);
  })

  socket.on("send_message", message =>{
      socket.broadcast.emit("receive_message", {message, name:users[socket.id]});
  })

  socket.on("disconnect", message =>{
      socket.broadcast.emit("left_message", users[socket.id]);
      delete users[socket.id];
  })
})

app.get("/users",(req,res)=>{
    let arr=[];
    for(let i in users){
        arr.push(users[i])
    }
    res.send(arr.join("\n"))
})