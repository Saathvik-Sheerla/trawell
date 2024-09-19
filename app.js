const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const ejs = require('ejs');
const ejsMate = require('ejs-mate');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');

const methodOverride = require('method-override');

const expressError = require('./utils/expressError.js')


async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
main().then(()=>{
    console.log("database connected DB");
}).catch((err)=>{
    console.log(err);
});


app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
    extended: true,
    }),
);

const port = 8080;
app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'/public')));
app.set(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.engine('ejs',ejsMate);

const listingsRoute = require('./routes/listing.js');
const reviewsRoute = require('./routes/review.js');


const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() * 7 * 24 * 60 * 60 * 1000,
        maxAge:  7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}

app.get('/',(req,res)=>{
    res.send("Home page");
});

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.deletee = req.flash('deletee');
    res.locals.update = req.flash('update');
    res.locals.errorr = req.flash('errorr');
    next();
});

//listings
app.use('/listings', listingsRoute);


//reviews
app.use('/listings/:id/reviews', reviewsRoute);


app.all('*', (req,res,next)=>{
    next(new expressError(404, 'page not found!'));
});

app.use((err,req,res,next)=>{
    let {statusCode=500, message="something went wrong!"} = err;
    // res.status(statusCode).send(message);

    res.status(statusCode).render('error.ejs', {err});
});

app.listen(port, ()=>{
    console.log(`Listening on http://localhost:${port}`);
});