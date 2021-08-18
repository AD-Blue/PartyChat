const User = require('../Models/User.js');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    try {
        const hashedPass = await bcrypt.hash(req.body.password, saltRounds);
        
        const newUser = await User.create({
            username: req.body.username,
            password: hashedPass
        })
        
        return res.status(200).json({
            success: true,
            data: newUser
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: `Error, could not upload user: ${err}`
        })
    }
}

exports.loginUser = async (req, res) => {
    try {
        const loginUser = await User.findOne({username: req.body.username});

        if (loginUser) {
            bcrypt.compare(req.body.password, loginUser.password, (error, response) => {    //compare the client-provided password with the existing user password
                if (response) { //i.e if there is no error/the passwords match successfully
                    
                    const id = loginUser.id;
                    const token = jwt.sign({id}, process.env.JWT_SECRET, {
                        expiresIn: 3600,
                    })

                    res.cookie('token', token, { expires: 0, httpOnly: true }); //expires: 0 makes it a session cookie

                    req.session.user = loginUser;
                    
                    console.log(`DEBUG: ID = ${id}`);

                    return res.status(200).json({
                        success: true,
                        auth: true,
                        token: token,
                        data: loginUser
                    })
                }
                else {
                    return res.status(200).json({
                        success: false,
                        auth: false,
                        data: `Login info incorrect`
                    })
                }
            })            
        }
        else {
            return res.status(404).json({
                success: false,
                auth: false,
                data: 'User not found'
            })
        }

    } catch (err) {
        return res.status(500).json({
            success: false,
            data: `Server error: ${err}`
        })
    }
}

exports.checkLogin = async (req, res) => {
    if (req.session.user) {
        res.json({
            loggedIn: true, 
            user: req.session.user
        })
    }
    else {
        res.json({
            loggedIn: false
        })
    }
}

exports.checkUserAuth = async (req, res) => {
    console.log('checking auth...')
    try {
        console.log("Check auth successful")
        console.log(req.cookies.token)
        res.set('x-access-token', req.cookies.token)

        return res.status(200).json({
            sucess: true,
            auth: true,
            data: `Authentication successful`
        })
    } catch (err) {
        console.log('Check auth failed')
        return res.status(500).json({
            success: false,
            auth: false,
            data: `Authentication failed: ${err}`
        })
    }
    
}

exports.logout = (req, res) => {
    //res.cookie('token', '', { maxAge: 1 });
    res.clearCookie('token');
    res.clearCookie('userId');
    return res.send('Cookies cleared');
}