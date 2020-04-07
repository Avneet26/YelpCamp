var express = require("express");
var router = express.Router({mergeParams : true});
var campground = require("../models/campground")
var comment = require("../models/comment")
var middleware = require("../middleware")

//COMMENT CREATE ROUTE
router.get("/new",middleware.isLoggedIn,function(req,res){
	campground.findById(req.params.id,function(err,camp){
		if(err){
			console.log(err);
		}else{
			res.render("comment/new",{campground : camp});
		}
	})
	
})

router.post("/",middleware.isLoggedIn,function(req,res){
	campground.findById(req.params.id,function(err,camp){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}else{	
			var text = req.body.text;
			var author = req.body.author;
			var commentObj = {text: text,author: author}
			comment.create(commentObj,function(err,comm){
				comm.author.id = req.user._id;
				comm.author.username = req.user.username;
				comm.save();
				camp.comment.push(comm);
				camp.save();
				res.redirect("/campgrounds/"+camp._id);
		 	})
		}
		
	})
})

//EDIT ROUTE
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
	comment.findById(req.params.comment_id,function(err,foundComment){
		if(err){
			res.redirect("back")
		}else{
			res.render("comment/edit",{campground_id : req.params.id , comment: foundComment})
		}
	})
})

router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
	comment.findByIdAndUpdate(req.params.comment_id, req.body.comments , function(err,updatedComment){
		if(err){
			res.redirect("back")
		} else {
			res.redirect("/campgrounds/"+req.params.id)
		}
	})
})

router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
	comment.findByIdAndRemove(req.params.comment_id,function(err){
		if(err){
			res.redirect("back")
		} else {
			res.redirect("back")
		}
	})
})

module.exports = router;