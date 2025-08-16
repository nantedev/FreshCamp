const Campground = require('../../models/campground');
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;
const { cloudinary } = require('../../cloudinary');

module.exports.getCampgrounds = async (req, res) => {
    try {
        const campgrounds = await Campground.find({});
        res.status(200).json(campgrounds);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports.getCampground = async (req, res) => {
    try {
        const { id } = req.params;
        const campground = await Campground.findById(id)
            .populate({
                path: 'reviews',
                populate: {
                    path: 'author'
                }
            })
            .populate('author');
        
        if (!campground) {
            return res.status(404).json({ error: 'Campement non trouvé' });
        }
        
        res.status(200).json(campground);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports.createCampground = async (req, res) => {
    try {
        const geoData = await maptilerClient.geocoding.forward(req.body.location, { limit: 1 });
        const campground = new Campground({
            title: req.body.title,
            price: req.body.price,
            description: req.body.description,
            location: req.body.location,
            geometry: geoData.features[0].geometry,
            author: req.user._id
        });
        
        if (req.files && req.files.length > 0) {
            campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
        }
        
        await campground.save();
        res.status(201).json(campground);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

module.exports.updateCampground = async (req, res) => {
    try {
        const { id } = req.params;
        
        const campground = await Campground.findById(id);
        if (!campground) {
            return res.status(404).json({ error: 'Campement non trouvé' });
        }
        
        if (campground.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Vous n\'êtes pas autorisé à modifier ce campement' });
        }
        
        // Update fields
        campground.title = req.body.title || campground.title;
        campground.price = req.body.price || campground.price;
        campground.description = req.body.description || campground.description;
        campground.location = req.body.location || campground.location;
        
        // If location changed, update geometry
        if (req.body.location && req.body.location !== campground.location) {
            const geoData = await maptilerClient.geocoding.forward(req.body.location, { limit: 1 });
            campground.geometry = geoData.features[0].geometry;
        }
        
        // Add new images
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(f => ({ url: f.path, filename: f.filename }));
            campground.images.push(...newImages);
        }
        
        // Delete images if specified
        if (req.body.deleteImages && req.body.deleteImages.length) {
            // Delete from cloudinary
            for (let filename of req.body.deleteImages) {
                await cloudinary.uploader.destroy(filename);
            }
            // Delete from database
            await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
        }
        
        await campground.save();
        res.status(200).json(campground);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

module.exports.deleteCampground = async (req, res) => {
    try {
        const { id } = req.params;
        
        const campground = await Campground.findById(id);
        if (!campground) {
            return res.status(404).json({ error: 'Campement non trouvé' });
        }
        
        if (campground.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Vous n\'êtes pas autorisé à supprimer ce campement' });
        }
        
        // Delete images from cloudinary
        for (let image of campground.images) {
            await cloudinary.uploader.destroy(image.filename);
        }
        
        await Campground.findByIdAndDelete(id);
        res.status(200).json({ message: 'Campement supprimé avec succès' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
