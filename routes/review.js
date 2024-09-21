const express = require('express');
const router =  express.Router({mergeParams: true});

const Listing = require('../models/listing.js');
const Review = require('../models/review.js');
const wrapAsync = require('../utils/wrapAsync.js')
const {isLoggedIn, validateReview, isReviewAuthor} = require('../middleware.js');


//post for reviews
router.post('/',isLoggedIn, validateReview, wrapAsync ( async (req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "New Review Added!");
    res.redirect(`/listings/${listing.id}`);
}
));

//delete reviews
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync ( async (req, res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    
    req.flash("deletee", "Review Deleted!");
    res.redirect(`/listings/${id}`);
}
));


module.exports = router;