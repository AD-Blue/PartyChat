const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    authorId: {
        type: String,
        required: true
    },

    authorName: {
        type: String,
        required: true
    },

    body: {
        type: String,
        required: true
    },

    timestamp: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Message', MessageSchema);