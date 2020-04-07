var express    = require("express");
var app        = express();
var bodyParser = require("body-parser");
var mongoose   = require("mongoose");
var flash      = require("connect-flash");
var passport   = require("passport");
var LocalStrategy= require("passport-local");
var methodOverride = require("method-override");
var passportLocalMongoose = require("passport-local-mongoose")
var campground = require("./models/campground")
var seedDB     = require("./seeds");
var User       = require("./models/User")
var comment    = require("./models/comment")

var campgroundRoutes = require("./routes/campgrounds")
var commentRoutes = require("./routes/comments")
var indexRoutes = require("./routes/index")

mongoose.connect("mongodb://localhost/yelp_camp",{ useNewUrlParser: true });
mongoose.set('useUnifiedTopology', true);

app.use(require("express-session")({
	secret: "Rusty is cute dog",
	resave: false,
	saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"))
app.use(flash());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine","ejs")
app.use(express.static(__dirname+"/public"));


//seedDB();

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
})

app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(3000,function(){
	console.log("Yelp Camp Server has Started");
	
})