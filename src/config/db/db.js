const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const initDb = callback => {
    if(_db) {
        console.log('Database is already initialized');
        callback(null, _db);
    }
    MongoClient.connect(process.env.MONGODB_URI).then(client => {
        _db = client.db();
        callback(null, _db);
    }).catch(err => {
        callback(err);
    });
}

const getDb = () => {
    if(_db) {
        throw new Error('Database is not initialized');
    }
    return _db;
}

module.exports = { initDb, getDb };