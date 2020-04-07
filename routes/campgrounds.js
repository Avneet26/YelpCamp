var express = require("express");
var router = express.Router();
var campground = require("../models/campground")
var user = require("../models/User")
var middleware= require("../middleware")

//INDEX ROUTE
router.get("/",function(req,res){
	campground.find({},function(err,allcampgrounds){
		if(err){
			console.log(err)
		}else{
			res.render("campground/index",{campgrounds : allcampgrounds});
		}
	})
})

//CREATE ROUTE
router.post("/",middleware.isLoggedIn,function(req,res){
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCamp = {name: name , image: image , description : description , author: author};
	
	campground.create(newCamp,function(err,newAdedd){
		if(err){
			console.log(err);
		}else{
			console.log(newAdedd)
			res.redirect("/campgrounds");
		}
	})
})

//NEW ROUTE
router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("campground/new")
})

//SHOW ROUTE
router.get("/:id",function(req,res){
	campground.findById(req.params.id).populate("comment").exec(function(err,foundCampground){
		if(err){
			console.log(err);
		}else{
			res.render("campground/show",{campground : foundCampground});
		}
	})
});

//EDIT ROUTE
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
	campground.findById(req.params.id,function(err,foundCampground){
		res.render("campground/edit",{campground : foundCampground});
	});	
})

//UPDATE ROUTE
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
	campground.findByIdAndUpdate(req.params.id, req.body.campgrounds , function(err,updatedCampground){
		if(err){
			res.redirect("/campgrounds")
		} else {
			res.redirect("/campgrounds/"+req.params.id)
		}
	})
})

//DESTROY ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
	campground.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/campgrounds")
		} else {
			res.redirect("/campgrounds")
		}
	})
})

module.exports = router;