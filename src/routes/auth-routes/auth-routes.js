const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { getDb } = require('../../config/db/db');
const { validateJson } = require('../../lib/schema-validation');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const randToken = require('rand-token');
const { sendEmail }= require('../../lib/email');
const { getConfig, clearUser } = require('../../lib/config');

const apiRequestLimit = rateLimit({
    windowMs: 300000, //5 minutes
    max: 5
});

//User signup
router.post('/api/users/signup', apiRequestLimit, async (req, res) => {
    const db = getDb();
    try {

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
        req.session = { token: token, userPresent: true, userEmail: user.email };
        
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

router.post('/api/users/forgot', apiRequestLimit, async (req, res) => {
    const db = getDb();
    const passwordToken = randToken.generate(30);
    try {
        //finding the user with the given email
        const user = await db.users.findOne({ email: req.body.email });
        if(user === undefined || user === null) {
            res.status(401).json({ message: 'No user with this email'});
            return;
        }
        //if user found and is admin
        if(user.isAdmin) {
            res.status(200).json({ message: 'Admin account, contact to other admin members'});
        }
        const tokenExpiry = Date.now() + 3600000;
        await db.users.updateOne({email: req.body.email}, {$set: {resetToken: passwordToken, resetTokenExpiry: tokenExpiry}}, {multi: false}); 
        //Creating mail body
        const config = getConfig();
        let baseUrl = config.baseUrl;

        if(!baseUrl || baseUrl === '' || baseUrl === undefined) {
            baseUrl = 'http://localhost:8080'
        }

        const mailOptions = {
            to: req.body.email,
            subject: "Forgotten password request",
            body: `You are receiving this because you (or someone else) have requested the reset of the password for your user account.\n\n
                Please click on the following link, or paste this into your browser to complete the process:\n\n
                ${baseUrl}/users/reset/${passwordToken}\n\n
                If you did not request this, please ignore this email and your password will remain unchanged.\n`
        }

        //Sending email
        const sendEmailSuccess = await sendEmail(mailOptions.to, mailOptions.subject, mailOptions.body);
        console.log('email successfully', sendEmailSuccess);
        //Return email not send response
        if(!sendEmailSuccess || sendEmailSuccess === undefined) {
            res.status(401).json({messgae: 'Due to some issues with your account email has not been sent, please try again later.'});
            return;
        }
        //return status 
        res.status(200).json({message: 'If your account exists, a password reset has been sent to your email'});
        return;

    }catch(err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error'});
        return;
    }
});

router.post('/api/users/reset/:token', async (req, res) => {
    const db = getDb();
    //get user
    const user = await db.users.findOne({resetToken: req.params.token, resetTokenExpiry: { $gt: Date.now() }});
    if(!user) {
        res.status(400).json({message: 'Reset password token is not valid or is expired'});
        return;
    }

    //update the password and remove token
    const password = await bcrypt.hashSync(req.body.password,10);
    try {
        await db.users.updateOne({email: user.email},{$set:{password: password, resetToken: undefined, resetTokenExpiry: undefined}},{multi: false});
        const mailOptions = {
            to: user.email,
            subject: 'Password successfully updated',
            body: 'This is a confirmation email that password of your account has been updated'
        }
        await sendEmail(mailOptions);
        res.status(200).json({success: true});
        return;
    }catch(err) {  
        console.log(err); 
        res.status(500).json({message: 'Internal Server Error'});
    }
});

router.post('/api/users/logout', async (req, res) => {
    clearUser(req);
    res.status(200).json({message: 'Sign out successfully'});
    return;
});


module.exports = router;