const jwt = require('jsonwebtoken');
const { getDb } = require('../config/db/db');
const ObjectId = require('mongodb').ObjectID;

const isAuthenticated = async (req, res, next) => {
    if(!req.session || !req.session.token || !req.session.userPresent) {
        res.status(401).json({message: 'Access denied, Please log in with your credentials'});
        return;
    }
    const payload = await jwt.verify(req.session.token,process.env.JWT_SECRET);
    try {
        const db = getDb();
        const user = await db.users.findOne({_id: ObjectId(payload.id)});
        req.currentUser = user;
        next();
    }catch(err){
        res.status(500).json({message: 'Internal Server Error', error:err});
        return;
    }
}

const isAdmin = async (req, res, next) => {
    if(!req.currentUser.isAdmin) {
        res.status(400).json({message: 'Access denied, Admin access only'});
    }
    next();
}

module.exports = { isAuthenticated, isAdmin };
