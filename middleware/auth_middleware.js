const User = require("../models/user.model")
const jwt = require("jsonwebtoken")

module.exports = {
    Authorization : async (req,res,next) => {
        let { authorization } = req.headers;
        if (authorization === undefined || !authorization.startsWith("Bearer "))
        {
            return res.status(401).end();
        }
        const token = authorization.substring("Bearer ".length);

        let payload;
        
        // Check that the token is valid
        try {
            payload = jwt.verify(token, process.env.TOKEN_SECRET);
        } catch (err) {
            if (err.name === "TokenExpiredError")
                return res.status(403).end("Token expired");
            else if (err.name === "JsonWebTokenError")
                return res.status(401).end("Invalid signature");
            else throw err;
        }

        // Get the associated user
        const user = await User.findById(payload.id);

        if (user === null) return res.status(401).end("Unknown user");

        // Sets req.user, then forwards request
        req.user = user;
        next();
    },

    IsManager : async (req, res, next) => {
        if (req.user.isAdmin === false)
            return res.status(403).end("You must be a manager");
        next();
    },
    
    TotalBankAccount : async(req,res,next)=>{ 
        const listUsers = await User.find(); 
        const length = listUsers.length; 
        
        req.totalCount = length; 
        next();     
    }
}