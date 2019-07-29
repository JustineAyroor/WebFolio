// console.log('This example is different!');
// console.log('The result is displayed in the Command Line Interface');
var express         = require("express"),
    app             = express(),
    mongoose        = require('mongoose'),
    bodyParser      = require("body-parser"),
    flash           = require("connect-flash"),
    methodOverride  = require("method-override"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    User            = require("./models/user");
    
//MongoDB Configuration
mongoose.connect('mongodb://localhost:27017/WebFolio',{useNewUrlParser:true});

app.use(bodyParser.urlencoded({extended: true}));

app.use(methodOverride("_method"));

app.use(flash());

app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

//Landing Route
app.get("/", function(req, res){
    res.render("landing");
});

//Login Route
app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/home",
        failureRedirect: "/login"
    }), function(req, res){
});

// logout route
app.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "LOGGED YOU OUT!!");
   res.redirect("/");
});

//Register Route
app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
   var newUser = new User(
        {
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName, 
            email: req.body.email, 
            avatar: req.body.avatar,
            phone: req.body.phone
        });
    if(req.body.adminCode === 'halkahalka1234'){
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            //console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
           res.redirect("/home"); 
        });
    }); 
});

//Home Route
app.get("/home", function(req, res){
    // res.send("This will be the Home Page");
    var user_id = res.locals.currentUser.id;
    res.redirect("/home/" + user_id);
});

app.get('/home/:id', function(req, res) {
    User.findById(req.params.id, function(err, foundUser){
       if(err){
           req.flash("error", "User Profile Not Found");
           res.redirect("/");
       }
       res.render("show", {user: foundUser});
    });
});

//
app.get("/home/:id/edit", function(req, res){
    // res.send("This PAGE is Reserved for Future Use");
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            req.flash("error", "User Not Found");
            res.redirect("/");
        }
        res.render("edit", {user: foundUser});
    });
});

app.put("/home/:id", function(req, res) {
    User.findByIdAndUpdate(req.params.id, req.body.user, function(err, updatedUser){
        if(err){
            console.log("Failed the test");
            req.flash("error", "User Not Found");
            res.redirect("/");
        }
        req.flash("success","SUCCESSFULLY UPDATED!");
        console.log("Passed the test");
        res.redirect("/home/" + updatedUser.id);
    });
});


app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The WebFolio Server Has Started!");
});