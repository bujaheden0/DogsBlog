var express = require("express");
var router  = express.Router({mergeParams: true});
var Dog     = require("../models/dogModel");
var Comment = require("../models/commentModel");
var middleware = require("../middleware/index");
var { isLoggedIn, checkUserDog, checkUserComment } = middleware;
//Show Comment Page
router.get("/new",isLoggedIn, function(req, res){
    Dog.findById(req.params.id, function(err, foundDog){
        if(err){
            console.log(err);
        } else {
            res.render("comment/new", { dog : foundDog});
        }
    })
})

//Handling post comment
router.post("/",isLoggedIn, function(req, res){
    Dog.findById(req.params.id, function(err, foundDog){
        if(err){
            console.log(err);
        } else {
            console.log(foundDog);
            var newComment = {
                text: req.body.comment,
                author: { id: req.user._id, username: req.user.username}
            }
            Comment.create(newComment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    foundDog.comments.push(comment);
                    foundDog.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect("/dogs/" + foundDog._id);
                }
            })
        }
    })
})

//Show edit comment page
router.get("/:comment_id/edit",isLoggedIn, checkUserComment, function(req, res){
    Dog.findById(req.params.id, function(err, foundDog){
        if(err || !foundDog){
            console.log(err);
            req.flash("error", "Dog not found");
            res.redirect("/dogs/" + req.params.id);
        } else {
            console.log(foundDog.comments);
        }
    })
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            console.log(err);
        } else {
            res.render("comment/edit", {dog_id : req.params.id, comment : foundComment});
        }
    })
})

//Handling user update comment
router.put("/:comment_id", isLoggedIn, checkUserComment,function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, {$set : { text : req.body.comment }}, function(err, comment){
        if(err){
            console.log(err);
        } else {
            req.flash("success", "Successfully updated comment!!");
            res.redirect("/dogs/" + req.params.id);
        }
    })
})
//Handling user delete comment
router.delete("/:comment_id", isLoggedIn, checkUserComment,function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            console.log(err);
        } else {
            Dog.findById(req.params.id, function(err, foundDog){
                if(err){
                    console.log(err);
                }else {
                    foundDog.comments.forEach(function(element, index, array){
                        if(element == req.params.comment_id){
                            array.splice(index,1);
                        }
                    })
                    foundDog.save(function(err){
                        if(err){
                            console.log(err);
                        } else {
                            req.flash("success", "Successfully deleted comment!!");
                            res.redirect("/dogs/" + req.params.id);
                        }
                    })
                }
            })
        }
    })
})

module.exports = router;