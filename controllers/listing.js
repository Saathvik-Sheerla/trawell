const Listing = require('../models/listing.js');

module.exports.index = async (req,res)=>{
        const alllistings = await Listing.find({});
        res.render('listings/index.ejs', {alllistings});
    };


module.exports.renderNewForm = (req,res)=>{
        res.render('listings/new.ejs');
    };


module.exports.showListing = async (req,res)=>{
        const listing = await Listing.findById((req.params).id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author',
            },
        })
        .populate('owner');

        if(!listing){
            req.flash("errorr", "The listing you requested for does not exist!");
            res.redirect('/listings');
        }
        res.render('listings/show.ejs', {listing});
    };


module.exports.createListing = async (req,res)=>{
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash("success", "New Listing Created!");
        res.redirect('/listings');
    };


module.exports.renderEditForm = async (req,res)=>{
        let {id} = req.params;
        const listing = await Listing.findById(id);
        if(!listing){
            req.flash("errorr", "The listing you requested for does not exist!");
            res.redirect('/listings');
        }
        res.render('listings/edit.ejs', {listing});
    };


module.exports.updateListing = async (req,res)=>{
        let {id} = req.params;
        await Listing.findByIdAndUpdate(id, {...req.body.listing} );
        req.flash("update", "Listing info Updated!");
        res.redirect(`/listings/${id}`);
    };


module.exports.removeListing = async (req,res)=>{
        await Listing.findByIdAndDelete(req.params.id);
        req.flash("deletee", "Listing Deleted!");
        res.redirect('/listings');
    };