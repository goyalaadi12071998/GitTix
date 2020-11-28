const express = require('express');
const { ObjectID } = require('mongodb');
const router = express.Router();
const { getDb } = require('../../config/db/db');

router.get('/api/user', async (req, res) => {
    const db = getDb();
    const user = await db.users.insertOne({name: "test6 user"});
    console.log('User',user.ops);
    res.send('Hello');    
});

module.exports = router;