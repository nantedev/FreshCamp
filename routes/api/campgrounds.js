const express = require('express');
const router = express.Router();
const campgrounds = require('../../controllers/api/campgrounds');
const catchAsync = require('../../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../../middleware');
const multer  = require('multer');
const { storage } = require('../../cloudinary')
const upload = multer({ storage });

// GET all campgrounds
router.get('/', catchAsync(campgrounds.getCampgrounds));

// GET single campground
router.get('/:id', catchAsync(campgrounds.getCampground));

// POST new campground
router.post('/', isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));

// PUT update campground
router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground));

// DELETE campground
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router;
