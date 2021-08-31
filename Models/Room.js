const mongoose = require('mongoose');
const Message = require('./Message').schema;
const User = require('./User').schema;

const RoomSchema = new mongoose.Schema({
    messages: {
        type: [Message],
        required: true
    },
    users: {
        type: [User],
        required: true
    },
    password: {
        type: String,
    }
})

module.exports = mongoose.model('Room', RoomSchema);