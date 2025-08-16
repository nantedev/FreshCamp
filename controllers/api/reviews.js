const Review = require('../../models/review');
const Campground = require('../../models/campground');

module.exports.createReview = async (req, res) => {
    try {
        const campground = await Campground.findById(req.params.id);
        if (!campground) {
            return res.status(404).json({ error: 'Campement non trouvé' });
        }
        
        const review = new Review({
            body: req.body.body,
            rating: req.body.rating,
            author: req.user._id
        });
        
        campground.reviews.push(review);
        
        await review.save();
        await campground.save();
        
        // Populate author pour le renvoyer
        await review.populate('author');
        
        res.status(201).json(review);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports.deleteReview = async (req, res) => {
    try {
        const { id, reviewId } = req.params;
        
        // Vérifier si l'avis existe
        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ error: 'Avis non trouvé' });
        }
        
        // Vérifier si l'utilisateur est l'auteur
        if (review.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Vous n\'êtes pas autorisé à supprimer cet avis' });
        }
        
        // Supprimer la référence à l'avis dans le campement
        await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        
        // Supprimer l'avis
        await Review.findByIdAndDelete(reviewId);
        
        res.status(200).json({ message: 'Avis supprimé avec succès' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
