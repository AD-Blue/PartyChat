const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        required: true,
        type: String,
        unique: true
    },

    password: {
        required: true,
        type: String,
        minLength: [8, 'Minimum required password length is 8 characters']
    }
})

module.exports = mongoose.model('User', UserSchema);