const mongoose = require('mongoose');
const app = require('./app');
const port = process.env.PORT || 8080;

async function start(){
    if(process.env.NODE_ENV === 'production') {
        if(!process.env.MONGODB_URI){
            throw new Error('MONGODB_URI must be defined');
        }
    }

    try{

        await mongoose.connect(process.env.MONGODB_URI,{
            useCreateIndex: true,
            useUnifiedTopology: true,
            useNewUrlParser: true
        });

        app.listen(port, () => {
            console.log('Listening on port ' + port);
        });

    }catch(err){
        throw new Error(err);
    }
}

start();
