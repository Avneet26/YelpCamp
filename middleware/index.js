// var campground = require("../models/campground")
// var comment = require("../models/comment")
// var User = require("../models/User")
// var middlewareObj = {};
// middlewareObj.checkCommentOwner = function(req,res,next){
// 	if(req.isAuthenticated()){
// 		comment.findById(req.params.comment_id,function(err,foundComment){
// 			if(err){
// 				console.log(err)
// 				res.redirect("back")
// 			}else{
// 				if(foundComment.author.id.equals(req.user._id)){
// 					next()
// 				}else{
// 					res.redirect("back")   
// 				}
// 			}
// 		})
// 	}else{
// 		res.redirect("back")
// 	}	
// }

// middlewareObj.checkCampgroundOwner = function(req,res,next){
// 	if(req.isAuthenticated()){
// 		campground.findById(req.params.id,function(err,foundCampground){
// 			if(err){
// 				console.log(err)
// 				res.redirect("back")
// 			}else{
// 				if(foundCampground.author.id.equals(req.user._id)){
// 					next()
// 				}else{
// 					res.redirect("back")   
// 				}
// 			}
// 		})
// 	}else{
// 		res.redirect("back")
// 	}
// }

// middlewareObj.isLoggedIn = function(req,res,next){
// 	if(req.isAuthenticated()){
// 		return next();
// 	}else{
		
// 		res.redirect("/login")
// 	}
// }

// module.exports = middlewareObj

var Campground = require("../models/campground");
var Comment = require("../models/comment");

// all the middleare goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
           if(err){
               req.flash("error", "Campground not found");
               res.redirect("back");
           }  else {
               // does user own the campground?
            if(foundCampground.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the comment?
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

module.exports = middlewareObj;