const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
    name: { type: String, required: true },
    artistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist', required: true },
    imageUrl: String,
    releaseDate: Date,
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Album = mongoose.model('Album', albumSchema);

module.exports = Album;