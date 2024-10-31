const User = require("../model/user.js");


module.exports.getSignupForm = (req, res) => {
    res.render("signup.ejs");
}

module.exports.postUserForm = async (req, res) => {
    try{
        let {username, email, password} = req.body;
        const newUser = new User({ email, username});
        const registeredUser = await User.register(newUser, password);
        
        req.flash("success", "Welcome to Wanderlust!");
        res.redirect("/listing");
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

module.exports.getLoginForm = (req, res)=>{
    res.render("login.ejs");
}

module.exports.postLoginForm = async(req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    // console.log("---------",req.locals.redirectUrl)
    res.redirect(res.locals.redirectUrl);
}

module.exports.getLogout = (req, res, next) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }

        req.flash("success", "Your are logged out!!")
        res.redirect("/listing")
    })
}