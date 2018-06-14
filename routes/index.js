var express = require("express");
var router  = express.Router();
var User = require("../models/userModel");
var passport = require("passport");


// Homg Page Route
router.get("/", function(req, res){
    res.render("landing");
})

//Show sign up form
router.get("/register", function(req, res){
    res.render("register");
})

//Handling user sign up
router.post("/register", function(req, res){
    User.register(new User({ username : req.body.username}), req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            res.redirect("/register");
        } else {
           passport.authenticate("local")(req, res, function(){
               res.redirect("/dogs");
           })
        }
    })
})

//Show login Page
router.get("/login", function(req, res){
    res.render("login");
})
//Handling user login
router.post("/login", passport.authenticate("local", {
    successRedirect: "/dogs",
    failureRedirect: "/login"
}));

//Handling user logout
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Log out");
    res.redirect("/dogs");
})


module.exports = router;