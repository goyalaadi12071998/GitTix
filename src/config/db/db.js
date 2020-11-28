const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
let _db;

const dbUrl = process.env.MONGODB_URI;
function initDb(callback) {
    if(_db) {
        console.warn('Trying to init db again');
        return callback(null,_db);
    }

    MongoClient.connect(dbUrl,{useNewUrlParser: true, useUnifiedTopology: true}, connected);

    async function connected(err,client) {
        if(err) {
            console.log('Error connecting to database');
            console.log(err);
            return callback(err);
        }
        const db = {
            users: await client.db().collection('users')
        }
        _db = db
        return callback(null,_db);
    }   
}

function getDb(){
    return _db;
}

module.exports = { initDb, getDb };





























// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;

// let _db;

// const initDb = callback => {
//     if(_db) {
//         console.log('Database is already initialized');
//         callback(null, _db);
//     }
//     MongoClient.connect('mongodb+srv://goyalaadesh461:11710461Aa@test.d3lnu.mongodb.net/gittixdb?retryWrites=true&w=majority',{
        
//         useNewUrlParser: true,
//         useUnifiedTopology: true
    
//     }).then(client => {
//         console.log('Database connection established');
//         _db = client.db();
//         callback(null, _db);
    
//     }).catch(err => {
//         callback(err);
//     });
// }

// const getDb = () => {
//     if(_db) {
//         throw new Error('Database is not initialized');
//     }
//     return _db;
// }

// module.exports = { initDb, getDb };