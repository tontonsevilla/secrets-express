//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

// MongoDB Schema
const userSchema = {
  email: String,
  password: String
};
const User = mongoose.model("User", userSchema);

// Home
app.get("/", (req, res) => {
  res.render("home");
});

// Register
app.route("/register")
.get((req, res) => {
  res.render("register");
})
.post((req, res) => {

  createUser().catch(err => console.log(err));

  async function createUser() {
    let user = new User({
      email: req.body.username,
      password: req.body.password
    });

    await mongoDbConnect();
    user.save(err => {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/secrets")
      }
    });
  }
});

// Login
app.get("/login", (req, res) => {
  res.render("login");
});

// Secrets
app.get("/secrets", (req, res) => {
  res.render("secrets");
});

let port = 3000;
app.listen(port, console.log(`Server is now listening to port ${port}`));

async function mongoDbConnect() {
  await mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});
}
