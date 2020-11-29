const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { getDb } = require('../../config/db/db');
const { validateJson } = require('../../lib/schema-validation');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const { isAuthenticated, isAdmin } = require('../../middlewares/isAuthenticated');
const ObjectId = require("mongodb").ObjectID;

const apiRequestLimit = rateLimit({
    windowMs: 300000, //5 minutes
    max: 5
});

//User signup
router.post('/api/users/signup', apiRequestLimit, async (req, res) => {
    const db = getDb();
    try {
        //Create indexing on user collection
        await db.users.createIndex({email: 1});    
        let isAdmin = false;

        //Count documents
        const countUsers = await db.users.countDocuments({});
        if(countUsers === 0){
            isAdmin = true;
        }

        //Create a user object
        const userObj = {
            name: req.body.name,
            email: req.body.email,
            isAdmin: isAdmin,
            password: await bcrypt.hashSync(req.body.password,10)
        }

        //Validate user
        const schemaResult = validateJson("newUser",userObj);
        if(!schemaResult){
            res.status(400).json({message: 'Failed to create user. Check inputs.', error: schemaResult.errors});
            return;
        }

        //Check for existing user
        const user = await db.users.findOne({email: req.body.email});
        if(user) {
            res.status(400).json({message: 'A user with that email already exists'});
            return;
        }

        //Store in database
        const newUser = await db.users.insertOne(userObj);
        return res.status(200).json({
            message: 'User account created',
            userId: newUser.insertedId
        });

    }catch(err){
        console.log(err);
        res.status(400).json({message: 'New user account creation failed'});
        return;
    }
});


//User signin
router.post('/api/users/signin', async (req, res) => {
    const db = getDb();
    try{
        // Clearing the pre saved session
        req.session = null;

        //finding user in database
        const user = await db.users.findOne({email: req.body.email});
        if(user === undefined || user === null){
            res.status(400).json({message: 'User with that email does not exist'});
            return;
        }

        //Check Password
        const match = await bcrypt.compare(req.body.password,user.password);
        if(!match) {
            res.status(400).json({message: 'Access denied, check your password and try again later'});
        }

        //Generate jsonwebtoken
        const token = await jwt.sign({id: user._id},process.env.JWT_SECRET);
        
        //Set token into session
        req.session = { token: token, userPresent: true };
        
        //Returning the response
        res.status(200).json({message: 'Successfully logged in', user: user, token: token});
        return;
    }
    catch(err) {
        console.log(err);
        res.status(500).json({message: 'Internal Server Error during login'});
        return;
    }
});

router.post('/api/users/logout', async (req, res) => {
    req.session = null;
    res.status(200).json({message: 'Sign out successfully'});
    return;
});

module.exports = router;