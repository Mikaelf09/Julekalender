const express = require("express")
require("dotenv").config();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")
const cookieparser = require("cookie-parser")
const nodemailer = require("nodemailer")


const sporsmal = require("./data/Questions");
const User = require("./models/User")


const app = express();

mongoose.connect(process.env.MONGODB_URI);

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/luke', (req, res) => {
  res.render('luke');
});

app.get("/admin", async (req, res) => {

    console.log(req.cookies)

    const cookie = req.cookies.jwt;
    const jwtToken = jwt.decode(cookie, process.env.SECRET_KEY)
    console.log("user", jwtToken)
    let userId = jwtToken.userId
    const user = await User.findById(userId);
    console.log(user);

    if(user.role !== "admin") {
        res.redirect("/");
    } else {

        const users = await User.find();
        // const answers = await Svar.find();
        // const winner = await Vinner.find();

        console.log(users)

        res.render("admin", {users})
    }
})


function youtubeEmbed(url) {
  try {
    const id = new URL(url).searchParams.get("v");
    if (id && /^[\w-]{11}$/.test(id)) {
      return `https://www.youtube-nocookie.com/embed/${id}`;
    }
  } catch (err) {

  }
  return null;
}


app.get('/luke/:id', (req, res) => {
  const id = Number(req.params.id);
  const spm = sporsmal.find((s) => s.id === id);

  if (!spm) {
    return res.status(404).send("Fant ikke luken");
  }


  res.render('luke', {
    id: id,
    type: spm.type,
    sporsmal: spm.question,
    alternativer: spm.options || [],
    videoUrl: spm.type === "video" ? youtubeEmbed(spm.video_url) : null
  });
});

app.post("/login", async (req, res) =>{
  const {email} = req.body;
  
  console.log(email);

  const user = await User.insertOne({email});



  console.log(user);


  const jwtToken = jwt.sign({"userId": user._id}, process.env.SECRET_KEY, {
    expiresIn: "30d"
  })

  res.cookie("jwt", jwtToken)
  res.redirect("/admin");


})

app.listen(process.env.PORT, () => {
  console.log(`listening on port http://localhost:${process.env.PORT}`);
});