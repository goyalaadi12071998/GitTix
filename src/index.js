const app = require('./app');
const port = process.env.PORT || 8080;
const db = require('./config/db/db');
const { addSchemas } = require('./lib/schema-validation');

async function start(){
    if(process.env.NODE_ENV === 'production') {
        if(!process.env.MONGODB_URI){
            throw new Error('MONGODB_URI must be defined');
        }
    }
    await addSchemas();
    console.log('All schema added successfully');
    db.initDb((err,db) => {
        if(err) {
            throw new Error('Database connection failed');
        }else{
            console.log('Database connection established successfully');
            app.listen(port, () => {
                console.log('Listening on port ' + port);
                //console.clear();
            });
        }
    });
}

start();
