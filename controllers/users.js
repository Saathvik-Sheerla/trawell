const User = require('../models/user.js');

module.exports.renderSignupForm = (req,res)=>{
        res.render('users/signup');
    };


module.exports.signupUser = async(req,res)=>{
        try{
            let {username, email, password} = req.body;
            const newUser = new User({email, username});
            
            req.login(await User.register(newUser, password),
                    (err)=>{
                        if(err){
                            return next(err);
                        }
                        req.flash("success", `Hi ${username}, Welcome to Trawelh!`);
                        res.redirect('/listings');
                    }
            );
        } catch(err){
            req.flash('errorr', `username with '${req.body.username}' already exists try another name`);
            res.redirect('/signup');
        }
    };


module.exports.renderLoginForm = (req,res)=>{
        res.render('users/login.ejs');
    };


module.exports.loginUser = async (req, res)=>{
        req.flash("success", `Welcome back ${req.body.username}`);
        let redirectUrl = res.locals.redirectUrl || '/listings'; //taking care incase of undefined
        res.redirect('/listings');
    };


module.exports.logoutUser = (req,res,next)=>{
        req.logout((err)=>{
            if(err){
                return next(err);
            }
            req.flash('deletee', 'You are logged out!');
            res.redirect('/listings');
        });
    };