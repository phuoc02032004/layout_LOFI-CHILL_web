const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    imageUrl: String,
    bio: String,
    socialLinks: {
        facebook: String,
        instagram: String,
        twitter: String
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist;