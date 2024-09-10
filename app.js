const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const ejs = require('ejs');
const ejsMate = require('ejs-mate');
const path = require('path');
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const methodOverride = require('method-override');
const wrapAsync = require('./utils/wrapAsync.js')
const expressError = require('./utils/expressError.js')
const {ListingSchema} = require('./schema.js');
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


async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
main().then(()=>{
    console.log("database connected DB");
}).catch((err)=>{
    console.log(err);
});


const validateListing = (req,res,next)=>{
    let {error} = ListingSchema.validate(req.body);

    if(error){
        let errMsg = error.details.map((el) => el.message).join(',');
        throw new expressError(400, errMsg)
    } else{
        next();
    }
}


app.get('/',(req,res)=>{
    res.send("Home page");
});

//index route
app.get('/listings', wrapAsync( async (req,res)=>{
    const alllistings = await Listing.find({});
    res.render('listings/index.ejs', {alllistings});
    }
));

//crete new listing
app.get('/listings/new', (req,res)=>{
    res.render('listings/new.ejs');
});

//create route
app.post('/listings', validateListing, wrapAsync( async (req,res)=>{
        console.log(req.body);
        await Listing.insertMany(req.body.listing);
        res.redirect('/listings');
    }
));

//show route
app.get('/listings/:id', wrapAsync( async (req,res)=>{
    const listing = await Listing.findById((req.params).id);
    res.render('listings/show.ejs', {listing});
    }
));

//edit route
app.get('/listings/:id/edit', wrapAsync( async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/edit.ejs', {listing});
    }
));

//update route
app.put('/listings/:id', validateListing, wrapAsync( async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,req.body.listing);
    res.redirect(`/listings/${id}`);
    }
));

//delete route
app.delete('/listings/:id', wrapAsync( async (req,res)=>{
    await Listing.findByIdAndDelete(req.params.id);
    res.redirect('/listings');
    }
));


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