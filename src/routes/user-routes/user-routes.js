const express = require('express');
const router = express.Router();
const { getDb, getClient } = require('../../config/db/db');
const ObjectId = require('mongodb').ObjectID;
const { isAuthenticated, isAdmin } = require('../../middlewares/isAuthenticated');
const bcrypt = require('bcrypt');
const { getId } = require('../../lib/common');


router.get('/api/users/allusers', isAuthenticated, isAdmin, async (req, res) => {
    const db = getDb();
    try {
        //Finding all non admin users and delete password
        const users = await db.users.findById({isAdmin : {$ne: true}}).toArray();
        users.map(user => delete user.password)
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