const express = require('express');
const app = express();
const mongoose = require('mongoose');
const colors = require('colors');   //says its unused but it isn't
const cors = require('cors');
const jwt = require('jsonwebtoken');
const csrf = require('csrf');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const csrfProtection = csrf({
    cookie: true
});

require('dotenv').config({ path: './config.env'});

app.set("trust proxy", 1);

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    key: "userId",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        expires: 60 * 60 * 24
    }
}));

const connectDB = () => {
    try {
        mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        console.log('Successfully connected to database'.underline.green);

    } catch (err) {
        console.log(`Error connecting to database: ${err}`.red);
    }
}

connectDB();

const messages = require('./Routes/MessageRoutes'); //Sets the message router to the const 'messages'
const users = require('./Routes/UserRoutes');

app.use('/api/messages', messages);
app.use('/api/users', users);

app.get('/csrf-token', (req, res) => {
    res.json({
        csrfToken: req.csrfToken()
    })
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`.cyan);
})