const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNewForm = (req, res) => {
     res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Nouveau campement créé!');
    res.redirect(`campgrounds/${ campground._id }`);
  }

  module.exports.showCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
      path: 'reviews',
      populate: {
          path: 'author'
    }}).populate('author');
    if(!campground){
      req.flash('error', 'Campement non trouvé!');
      return res.redirect('/campgrounds');
    };
    res.render('campgrounds/show', { campground });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
      req.flash('error', 'Campement non trouvé!');
      return res.redirect('/campgrounds');
    };
    res.render('campgrounds/edit', { campground });
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground});
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.images.push(...imgs);
    await campground.save();
    if(req.body.deleteImages){
      for (let filename of req.body.deleteImages) {
        await cloudinary.uploader.destroy(filename);
      }
     await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    console.log(req.body);
    req.flash('success', 'Campement mis à jour!');
    res.redirect(`/campgrounds/${ campground._id }`);
}

module.exports.destroyCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campement supprimé!');
    res.redirect('/campgrounds');
  }