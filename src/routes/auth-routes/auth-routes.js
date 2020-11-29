const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { getDb } = require('../../config/db/db');
const { validateJson } = require('../../lib/schema-validation');

router.post('/api/users/signup', async (req, res) => {
    const db = getDb();
    try {
        await db.users.createIndex({email: 1});    
        let isAdmin = false;
        const countUsers = await db.users.countDocuments({});
        if(countUsers === 0){
            isAdmin = true;
        }
        const userObj = {
            name: req.body.name,
            email: req.body.email,
            isAdmin: isAdmin,
            password: await bcrypt.hashSync(req.body.password,10)
        }
        const schemaResult = validateJson("newUser",userObj);
        if(!schemaResult){
            res.status(400).json({message: 'Failed to create user. Check inputs.', error: schemaResult.errors});
            return;
        }
        const user = await db.users.findOne({email: req.body.email});
        if(user) {
            res.status(400).json({message: 'A user with that email already exists'});
            return;
        }
        const newUser = await db.users.insertOne(userObj);
        res.status(200).json({
            message: 'User account created',
            userId: newUser.insertedId
        });
        return;
    }catch(err){
        console.log(err);
        res.status(400).json({message: 'New user account creation failed'});
        return;
    }
});

router.post('/api/users/signin', async (req, res) => {
    const db = getDb();
    try {
        const user = await db.users.findOne({email: req.body.email});
        if (!user) {
            res.status(400).json({message: 'No user with that email'});
            return;
        }
        const isMatch = await bcrypt.compare(req.body.password,user.password);
        if(!isMatch){
            res.status(400).json({message: 'Invalid credentials'});
            return;
        }
    }catch(err) {
        console.log(err);
        res.status(400).json({message: 'User account login failed'});
        return;
    }
})

module.exports = router;