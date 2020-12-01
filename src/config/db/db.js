const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
let _db;
let _client;

const dbUrl = process.env.MONGODB_URI;

const initDb = async () => {
    if(_db || _client) {
        console.warn("Trying to initialize database again");
        return;
    }
    try {
        const client = await MongoClient.connect(dbUrl,{useNewUrlParser: true,useUnifiedTopology: true});
        if(client) {
            console.log('Database initialized successfully');
            _client = client;
            const db = {
                users: await client.db().collection('users'),
                blogs: await client.db().collection('blogs')
            }
            _db = db;
            return _db;
        }else{
            throw new Error('Database connection failed');
        }
    }catch(err) {
        console.log(err);
        throw new Error('Database connection failed');
    }

} 

function getDb(){
    return _db;
}

function getClient(){
    return _client;
}

module.exports = { initDb, getDb, getClient };





























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