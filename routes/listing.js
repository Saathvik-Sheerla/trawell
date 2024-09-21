const express = require('express');
const router =  express.Router({mergeParams: true});

const wrapAsync = require('../utils/wrapAsync.js')
const {isLoggedIn, isOwner, validateListing} = require('../middleware.js');

const listingController = require('../controllers/listing.js');


//index ,create route
router.route('/')
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn, 
        validateListing, 
        wrapAsync(listingController.createListing)
    );


//crete new listing
router.get('/new', 
    isLoggedIn, 
    listingController.renderNewForm
);


//show, update and delete route
router.route('/:id')
    .get(wrapAsync(listingController.showListing))
    .put(
        isLoggedIn, 
        isOwner, 
        validateListing, 
        wrapAsync(listingController.updateListing)
    )
    .delete(
        isLoggedIn, 
        isOwner, 
        wrapAsync(listingController.removeListing)
    );


//edit route
router.get('/:id/edit', 
    isLoggedIn, 
    isOwner, 
    wrapAsync(listingController.renderEditForm)
);


module.exports = router;