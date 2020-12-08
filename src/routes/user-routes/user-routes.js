const express = require('express');
const router = express.Router();
const { getDb, getClient } = require('../../config/db/db');
const { isAuthenticated, isAdmin } = require('../../middlewares/isAuthenticated');
const bcrypt = require('bcrypt');
const { getId } = require('../../lib/common');


router.get('/api/users/allusers', isAuthenticated, isAdmin, async (req, res) => {
    const db = getDb();
    try {
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

router.delete('/api/users/delete/:id', isAuthenticated, async (req, res) => {
    const db = getDb();
    const client = getClient();
    const ID = req.params.id;
    const user = await db.users.findOne({_id: getId(ID)});
    console.log(user);
    if (!user || user === null) {
        res.status(400).json({message: 'User not found'});
        return;
    }
    let checkUser = false;
    if(!req.currentUser.isAdmin){
        if(req.currentUser._id === req.params.id){
            const matchPassword = await bcrypt.compare(req.body.password,user.password);
            if(matchPassword) {
                checkUser = true;
            }else{
                checkUser = false;
            }
        }
    } 
    if(req.currentUser.isAdmin === user.isAdmin){
        res.status(400).json({message: 'Admin user can not delete his own account'});
        return;
    }
    if(req.currentUser.isAdmin && !user.isAdmin){
        checkUser = true;
    }
    if(!checkUser){
        res.status(400).json({message: 'Access denied'});
        return;
    }
    const session = await client.startSession();
    session.startTransaction();
    try {
        await db.users.deleteOne({_id: getId(ID)});
        await db.blogs.deleteMany({author: getId(ID)});
        await session.commitTransaction();
        session.endSession();
        res.status(200).json({message: 'User account deleted successfully'});
        return;

    }catch(err){
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({message: 'Internal Server Error', error: err});
        return;
    }
});

module.exports = router;