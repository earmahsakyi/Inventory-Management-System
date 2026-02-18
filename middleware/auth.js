const jwt = require('jsonwebtoken');


module.exports = function (req, res , next) {
    // get Token from Header
    const token = req.cookies.token;

    //Check if not token
    if (!token){
        return res.status(401).json({msg: 'authorization denied!!'})
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.admin = decoded.admin;
        next();
    }catch(err){
        res.status(401).json({msg: 'Token is not Valid'})

    }
}