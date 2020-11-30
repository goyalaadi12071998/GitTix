const express = require('express');
const router = express.Router();
const { getDb } = require('../../config/db/db');
const ObjectId = require('mongodb').ObjectID;
const { isAuthenticated, isAdmin } = require('../../middlewares/isAuthenticated');

module.exports = router;