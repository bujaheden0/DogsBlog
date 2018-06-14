var express         = require("express"),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    flash           = require("connect-flash"),
    User            = require("./models/userModel"),
    Dog             = require("./models/dogModel"),
    Comment         = require("./models/commentModel"),
    dogRoutes       = require("./routes/dog"),
    indexRoutes     = require("./routes/index"),
    commentRoutes   = require("./routes/comment");

mongoose.connect("mongodb://localhost:27017/dogBlog");

var app = express();
var PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(require("express-session")({
    secret: "This is a secret",
    resave: false,
    saveUninitialized: false
}))
app.use(flash());
//Initialize passport
app.use(passport.initialize());
//Passport use session
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Set Express local variables
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
app.locals.moment = require('moment');

app.use("/", indexRoutes);
app.use("/dogs", dogRoutes);
app.use("/dogs/:id/comments", commentRoutes);
app.all("*", function(req, res, next){
    res.render("notfound");
})
// Start server
app.listen(PORT, function(){
    console.log("Server is running");
})