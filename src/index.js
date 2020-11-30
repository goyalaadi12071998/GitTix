const app = require('./app');
const port = process.env.PORT || 8080;
const db = require('./config/db/db');
const { addSchemas } = require('./lib/schema-validation');
const { runIndex } = require('./lib/indexing');

async function start(){
    if(process.env.NODE_ENV === 'production') {
        if(!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI must be defined');
        }
        if(!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET must be defined');
        }
        if(!process.env.SEND_GRID){
            throw new Error('SEND_GRID must be defined');
        }
    }
    try {
        await db.initDb();
        try {
            console.log('Create database indexs..');
            await runIndex();
        }
        catch(err) {
            console.error('Error creating database indexes', )
        }
        await addSchemas();
        try {
            app.listen(port, () => {
                console.log('Server listening on port ' + port);
            });
        }catch(err) {
            console.error('Error starting gittix server',err);
            process.exit(2);
        }
    }catch(err) {
        console.log(err);
        throw new Error('Internal Server Error');
    }
}

start();
