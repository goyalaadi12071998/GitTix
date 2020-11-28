const mongoose = require('mongoose');
const app = require('./app');
const port = process.env.PORT || 8080;
const db = require('./config/db/db');

function start(){
    if(process.env.NODE_ENV === 'production') {
        if(!process.env.MONGODB_URI){
            throw new Error('MONGODB_URI must be defined');
        }
    }
    db.initDb((err,db) => {
        if(err) {
            throw new Error('Database connection failed');
        }else{
            app.listen(port, () => {
                console.log('Listening on port ' + port);
                console.clear();
            });
        }
    });
}

start();
