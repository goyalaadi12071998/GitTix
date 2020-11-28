const mongoose = require('mongoose');
const app = require('./app');
const port = process.env.PORT || 8080;
const db = require('./config/db/db');

async function start(){
    if(process.env.NODE_ENV === 'production') {
        if(!process.env.MONGODB_URI){
            throw new Error('MONGODB_URI must be defined');
        }
    }

    try{

        await db.initDb(db);
        
        app.listen(port, () => {
            console.log('Listening on port ' + port);
        });

    }catch(err){
        throw new Error(err);
    }
}

start();
