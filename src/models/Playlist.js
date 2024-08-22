const playlistSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: String,
    isPublic: { type: Boolean, default: true },
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;