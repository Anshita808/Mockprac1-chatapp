const express=require("express");
const { connection } = require("./config/db");
require("dotenv").config()

const app=express()

app.use(express.json())


app.get("/", (req, res) => {
    res.send("Home Page");
});


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
