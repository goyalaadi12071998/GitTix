const app = require('./app');
const port = process.env.PORT || 8080;
const db = require('./config/db/db');
const { addSchemas } = require('./lib/schema-validation');

async function start(){
    if(process.env.NODE_ENV === 'production') {
        if(!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI must be defined');
        }
        if(!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET must be defined');
        }
    }
    try {

        await addSchemas();
        await db.initDb();
        app.listen(port);
        
    
    }catch(err) {
        
        console.log(err);
        throw new Error('Internal Server Error');
    
    }
}

start();
