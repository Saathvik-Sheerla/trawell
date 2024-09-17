const express = require('express');
const router =  express.Router({mergeParams: true});

const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsync.js')
const expressError = require('../utils/expressError.js')
const {ListingSchema} = require('../schema.js');


const validateListing = (req,res,next)=>{
    let {error} = ListingSchema.validate(req.body);

    if(error){
        let errMsg = error.details.map((el) => el.message).join(',');
        throw new expressError(400, errMsg)
    } else{
        next();
    }
}


//index route
router.get('/', wrapAsync( async (req,res)=>{
    const alllistings = await Listing.find({});
    res.render('listings/index.ejs', {alllistings});
    }
));

//crete new listing
router.get('/new', (req,res)=>{
    res.render('listings/new.ejs');
});

//create route
router.post('/', validateListing, wrapAsync( async (req,res)=>{
        console.log(req.body);
        await Listing.insertMany(req.body.listing);
        req.flash("success", "New Listing Created!");
        res.redirect('/listings');
    }
));

//show route
router.get('/:id', wrapAsync( async (req,res)=>{
    const listing = await Listing.findById((req.params).id).populate('reviews');
    if(!listing){
        req.flash("errorr", "The listing you requested for does not exist!");
        res.redirect('/listings');
    }
    res.render('listings/show.ejs', {listing});
    }
));

//edit route
router.get('/:id/edit', wrapAsync( async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("errorr", "The listing you requested for does not exist!");
        res.redirect('/listings');
    }
    res.render('listings/edit.ejs', {listing});
    }
));

//update route
router.put('/:id', validateListing, wrapAsync( async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,req.body.listing);
    req.flash("update", "Listing info Updated!");
    res.redirect(`/listings/${id}`);
    }
));

//delete route
router.delete('/:id', wrapAsync( async (req,res)=>{
    await Listing.findByIdAndDelete(req.params.id);
    req.flash("deletee", "Listing Deleted!");
    res.redirect('/listings');
    }
));



module.exports = router;