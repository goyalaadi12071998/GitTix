const mongoose = require('mongoose');
const app = require('./app');
const port = process.env.PORT || 8080;

async function start(){
    app.listen(port, () => {
        console.log('Listening on port ' + port);
    });
}

start();