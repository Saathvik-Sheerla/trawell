const express = require('express');
const router =  express.Router();
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');

router.get('/signup', (req,res)=>{
    res.render('users/signup');
});

router.post('/signup', wrapAsync( async(req,res)=>{
    try{
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        await User.register(newUser, password);
        req.flash("success", `Hi ${username}, Welcome to Trawelh!`);
        res.redirect('/listings');
    } catch(err){
        req.flash('errorr', `username with '${req.body.username}' already exists try another name`);
        res.redirect('/signup');
    }
}));

router.get('/login', (req,res)=>{
    res.render('users/login.ejs');
});

router.post('/login',
        passport.authenticate('local', 
            {failureFlash: true, failureRedirect: '/login'}),
        async (req, res)=>{
            req.flash("success", `Welcome back ${req.body.username}`);
            res.redirect('/listings');
        }
);

router.get('/logout', (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash('deletee', 'You are logged out!');
        res.redirect('/listings');
    });
});

module.exports = router;