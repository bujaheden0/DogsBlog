var Dog = require("../models/dogModel");
var Comment = require("../models/commentModel");
module.exports = {
    //Check if user logged In
    isLoggedIn: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }else{
            req.flash("error", "Please Login First");
            res.redirect("/login");
        }
    },
    //Check owner dog blog
    checkUserDog: function(req, res, next){
        Dog.findById(req.params.id, function(err, foundDog){
            if(err){
                console.log(err);
            }
            if(foundDog.author.id.equals(req.user._id)){
                return next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("/dogs/" + req.params.id);
            }
        })
    },
    //check owner comment
    checkUserComment: function(req, res, next){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                req.flash("error", err.message);
            }
            if(foundComment.author.id.equals(req.user._id)){
                return next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("/dogs/" + req.params.id);
            }
        })
    }
}