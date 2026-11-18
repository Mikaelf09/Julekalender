const express = require("express")
require("dotenv").config();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")
const cookieparser = require("cookie-parser")
const nodemailer = require("nodemailer")

const app = express();

mongoose.connect(process.env.MONGODB_URI);

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/login', (req, res) => {
  res.render('login');
});
app.get('/registerUser', (req, res) => {
  res.render('registerUser');
});



app.listen(process.env.PORT,()=>{
  console.log(`listening on port http://localhost:${process.env.PORT}`);
});

