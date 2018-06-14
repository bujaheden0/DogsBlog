var express = require("express");
var router  = express.Router();
var Dog     = require("../models/dogModel");
var middleware = require("../middleware/index");
var { isLoggedIn, checkUserDog } = middleware;
// Dogs Page Route
router.get("/", function(req, res){
    Dog.find({}, function(err, dogs){
        if(err){
            console.log(err);
        } else {
            res.render("dog/index", { dogs : dogs });
        }
    })
})

// Add new dog route
router.get("/new",isLoggedIn, function(req, res){
    res.render("dog/new");
})

// Post dog route
router.post("/",isLoggedIn, function(req, res){
    var newDog = {
        name: req.body.name,
        image: req.body.image,
        description: req.body.description,
        author: { id: req.user._id, username: req.user.username }
    }
    Dog.create(newDog, function(err, dog){
        if(err){
            req.flash("error", err.message);
        } else {
            req.flash("success", "Post successfully created");
            res.redirect("/dogs");
        }
    })
})

//get specific dog id
router.get("/:id", function(req, res){
    Dog.findById(req.params.id).populate("comments").exec(function(err, foundDog){
        if(err || !foundDog){
            req.flash('error', "Sorry this blog not found");
            return res.redirect('/dogs');
        } else {
            res.render("dog/show", {dog : foundDog});
        }
    })
})

//Show Edit Page
router.get("/:id/edit",isLoggedIn, checkUserDog, function(req, res){
    Dog.findById({ _id: req.params.id}, function(err, foundData){
        if(err){
            console.log(err);
        } else {
            res.render("dog/edit", {dog : foundData});
        }
    })
})

//Handling User Update blog
router.put("/:id", function(req, res){
    var updateBlog = {
        name: req.body.name,
        image: req.body.image,
        description: req.body.description
    }
    Dog.findByIdAndUpdate(req.params.id, updateBlog, function(err, updated){
        if(err){
            console.log(err);
        } else {
            req.flash("success", "Successfully updated post!!");
            res.redirect("/dogs/" + req.params.id);
        }
    })
})
//Handling User delete blog
router.delete("/:id",isLoggedIn, checkUserDog, function(req, res){
    Dog.findByIdAndRemove(req.params.id, function(err, dog){
        if(err){
            console.log(err);
        } else {
            req.flash("success", "Successfully deleted Post!!");
            res.redirect("/dogs");
        }
    })
})

module.exports = router;