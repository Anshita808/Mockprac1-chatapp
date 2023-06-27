const express=require("express");
const { connection } = require("./config/db");
const {userRouter}=require("./routes/userRoutes")
const socketio = require("socket.io")
const http = require("http")
// const app = express()

const cors=require("cors")
require("dotenv").config()

const app=express()

app.use(express.json())
app.use(cors())

// app.get("/", (req, res) => {
//     res.send("Home Page");
// });



app.use("/",userRouter)

app.listen(process.env.port, async () => {

    try {
        await connection
        console.log("MongoDb is connected. Successfully!")
    } catch (error) {
        console.log(error)
        console.log("Oops! MongoDb is not connected. Please connect the first.")
    }
    console.log(`Server is running on port ${process.env.port}`)
})
