const express = require("express");
const userRouter = express.Router()
const { UserModel } = require("../models/usersModels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const { v4: uuidv4 } = require('uuid');
// const path=require("path")
const nodemailer = require("nodemailer");
require("dotenv").config()
// const userRouter = express.Router();
// app.use(express.static(path.join(__dirname, "public")));



userRouter.post("/register", async (req, res) => {
  try {
    const { Username, Email, Password} = req.body;

    const userExist = await UserModel.findOne({ Email });

    if (userExist) {
      return res.status(401).send({ msg: "User Already Registered" });
    }

    const hash = await bcrypt.hash(Password, 8);

    const newUser = new UserModel({ Username, Email, Password: hash });

    const userData = await newUser.save();
    if (userData) {
      sendVerificationMail(Username, Email, userData._id);
      res.status(200).json({ msg: "Registration successful", userData });
    } else {
      res.status(401).json({ msg: "Registration failed" });
    }
    // res.sendFile(path.join(__dirname, "../public/verify.html"));

  } catch (error) {
    res.status(400).json({ msg: "Something went wrong" });
  }
});

const sendVerificationMail = async (name, email, userId) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: "chauhanrohit716@gmail.com",
        pass: "jlwzvtwyabofnqso",
      },
    });

    const mailOptions = {
      from: "chauhanrohit716@gmail.com",
      to: email,
      subject: "For verification mail",
      html: `<p>Hi ${name}, please click here to <a href="http://localhost:8800/verify?id=${userId}">verify</a> your mail</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};
userRouter.post("/login", async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const user = await UserModel.findOne({ Email });

    if (!user) {
      return res.status(401).send("User not found");
    }

    if (!user.isVerified) {
      return res.status(401).send("User is not verified");
    }

    const isPasswordValid = await bcrypt.compare(Password, user.Password);

    if (!isPasswordValid) {
      return res.status(401).send("Invalid credentials");
    }

    const token = await jwt.sign(
      {
        userId: user._id,
      },
      process.env.SECRET,
      { expiresIn: "1hr" }
    );

    res.send({
      msg: "Login successful",
      token,
      userId: user._id,
      isVerified: user.isVerified,
    });
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});


userRouter.get("/verify", async (req, res) => {
  try {
    const userId = req.query.id;

    const user = await UserModel.findOneAndUpdate(
      { _id: userId },
      { $set: { isVerified: true } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.isVerified) {
      return res.status(200).json({ message: "Email verified" });
    }

    // res.sendFile(path.join(__dirname, "../public/verify.html"));
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});



module.exports = {
  userRouter,
};
