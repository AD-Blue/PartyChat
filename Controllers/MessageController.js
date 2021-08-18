const Pusher = require('pusher');
const Message = require('../Models/Message.js');
const User = require('../Models/User.js');

const pusher = new Pusher({
    appId: "1247316",
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: "mt1",
    useTLS: true
})

exports.postMessage = async (req, res, next) => {
    try {
        const postingUser = await User.findById(req.params.id);

        const newMessage = await Message.create({
            authorId: req.params.id,
            authorName: postingUser.username,
            body: req.body.body,
            timestamp: new Date().toDateString()
        })

        pusher.trigger('chat', 'message-sent', newMessage)

        return res.status(200).json({
            success: true,
            data: newMessage
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: `POSTMESSAGE: Error posting message: ${err}`
        })
    }
}

exports.getMessages = async (req, res) => {
    try {
        const messages = await Message.find();

        if(!messages) {
            return res.status(404).json({
                success: true,
                data: `No messages found. Start a conversation`
            })
        }
        return res.status(200).json({
            success: true,
            data: messages
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: `Error getting messages: ${err}`
        })
    }
}