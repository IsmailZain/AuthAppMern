const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const session = require('express-session');

const flash = require('connect-flash');


const User = require("./models/User")

// Database
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/CrissCrossAuth', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log("Database connected!!")
})
.catch((err) => {
    console.log("OH NO!! Error")
    console.log(err)
})




// defining app
const app = express()

// flash
app.use(flash()) 

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'notagoodsecret', resave: false,  saveUninitialized: true }))


// flashing messages
app.use((req, res, next) => {
    
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})



// Authentication
const authenticateUser = (req,res,next) => {
    
    if (!req.session.user_id) {
        req.flash("error" , "You need to Login first please")
       // alert("Log in first Please")
        return res.redirect('/login')
    }
 
    next();
}


// Routes
app.get("/login", (req,res) => {
     return res.render("login")

})

app.post("/login",async (req,res) => {

    const { username, password } = req.body;
    const foundUser = await User.findAndValidate(username, password);
    if (foundUser) {
        req.flash("success"," Logged in Successfully")
        req.session.user_id = foundUser._id;
        console.log("hello")
        res.redirect('/home')
    }
    else {
       // alert("Username or password is incoreect")
       req.flash("error", "Username or password is incoreect")
        res.redirect('/login')
    }
})

app.get('/register', (req, res) => {
     return res.render('register')
})

app.post("/register", async (req,res) => {

    const {username} =  req.body
    const foundUser = User.findOne({username})
    if(foundUser)
    {
        console.log("herer")
        req.flash("error","This Username already exists")
        return res.redirect("/register")
    }

    const user = new User( req.body)
     await user.save();
    req.session.user_id = user._id;
    req.flash("success","Registered in Successfully")
     return res.redirect("/home")
})



app.get('/logout', (req, res) => {
    req.flash("success", "Logged out successfully")
    req.session.rider_id = null;
    // req.session.destroy();
    res.redirect('/login');
})



app.get("/home", authenticateUser ,async (req,res) => {
    const user = await User.findById(req.session.user_id)
   
     return res.render('home', {user})
})







app.get("/", (req,res) => {
    res.render("index")
})




app.listen(3000, () => {
    console.log(`Serving on port 3000`)
})





















