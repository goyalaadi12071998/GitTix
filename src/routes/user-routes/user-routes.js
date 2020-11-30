const express = require('express');
const router = express.Router();
const { getDb } = require('../../config/db/db');
const ObjectId = require('mongodb').ObjectID;
const { isAuthenticated, isAdmin } = require('../../middlewares/isAuthenticated');

router.get('/api/users/allusers', isAuthenticated, isAdmin, async (req, res) => {
    const db = getDb();
    try {
        const users = await db.users.countDocuments();
        console.log(users);
        res.status(200).json({message: 'Fetching users successfully', users: users});
        return;
    }catch(err) {
        console.log(err);
        res.status(500).json({message: 'Internal Server Error'});
        return;
    }
});

module.exports = router;