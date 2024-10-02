const Listing = require('../models/listing.js');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

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
        let locationResponse = await geocodingClient
            .forwardGeocode({
                query: req.body.listing.location+", "+req.body.listing.country,
                limit: 1,
            })
            .send();

        let url = req.file.path;
        let filename = req.file.filename;

        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = {url, filename};
        
        if(locationResponse.statusCode != 200){
            req.flash('errorr', 'unable to find your location, try to be more broad');
            res.redirect('/listings/new');
        } else {
            newListing.geometry = locationResponse.body.features[0].geometry;
        }

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

        let originalImageUrl = listing.image.url;
        originalImageUrl = originalImageUrl.replace('/upload', '/upload/w_250,r_5');

        res.render('listings/edit.ejs', {listing, originalImageUrl});
    };


module.exports.updateListing = async (req,res)=>{
        let {id} = req.params;
        let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing} );

        if(typeof req.file!=='undefined'){
            let url = req.file.path;
            let filename = req.file.filename;
            listing.image = { url, filename };
            await listing.save();
        }

        req.flash("update", "Listing info Updated!");
        res.redirect(`/listings/${id}`);
    };


module.exports.removeListing = async (req,res)=>{
        await Listing.findByIdAndDelete(req.params.id);
        req.flash("deletee", "Listing Deleted!");
        res.redirect('/listings');
    };