const jwt = require('jsonwebtoken');

exports.jwtVerify = async (req, res, next) => {
    //const token = req.headers["x-access-token"];

    const token = req.cookies.token;

    if (!token) {
        //console.log(`COOKIE: ${req.cookies.token}`)
        return res.send("No token provided/token is missing");
    }
    else {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                //console.log(`Something went wrong, ${err}`)
                return res.json({
                    auth: false,
                    message: "Error: Failed to authenticate"
                })
            }
            else {
                req.userId = decoded.id;
                next();
            }
        })
    }
}