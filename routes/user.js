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
        let {username, email, password} = req.body.user;
        const newUser = new User({email, username});
        await User.register(newUser, password);
        req.flash("success", `Hi ${username}, Welcome to Trawelh!`);
        res.redirect('/listings');
    } catch(err){
        req.flash('errorr', `username with '${req.body.user.username}' already exists try another name`);
        res.redirect('/signup');
    }
}));

router.get('/login', (req,res)=>{
    res.render('users/login.ejs');
});

router.post('/login',
    passport.authenticate('local', {failureRedirect: 'login', failureFlash: true}),
    async (req, res)=>{
        res.send("logged-in");
    }
);

module.exports = router;