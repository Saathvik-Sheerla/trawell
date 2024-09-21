const Listing = require('./models/listing');
const Review = require('./models/review.js');
const expressError = require('./utils/expressError.js')
const {ListingSchema, ReviewSchema} = require('./schema.js');


module.exports.isLoggedIn = (req, res, next)=>{
                                if(!req.isAuthenticated()){
                                    req.session.redirectUrl = req.originalUrl;
                                    req.flash('errorr', 'you must be logged-in');
                                    return res.redirect('/login');
                                }
                                next();
                            };

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(req.user._id)){
        req.flash('deletee', `You are not authorized to ${(req.method).toLowerCase()==='delete'?'Delete':'Edit'} this listing!`);
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req,res,next)=>{
    let {error} = ListingSchema.validate(req.body);

    if(error){
        let errMsg = error.details.map((el) => el.message).join(',');
        throw new expressError(400, errMsg);
    } else{
        next();
    }
};

module.exports.validateReview = (req,res,next)=>{
    let {error} = ReviewSchema.validate(req.body);

    if(error){
        let errMsg = error.details.map((el) => el.message).join(',');
        throw new expressError(400, errMsg)
    } else{
        next();
    }
};

module.exports.isReviewAuthor = async (req, res, next)=>{
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(req.user._id)){
        res.locals.isReviewAuthor = false;
        req.flash('errorr', 'this is not your review!');
        return res.redirect(`/listings/${id}`);
    }
    next();
};