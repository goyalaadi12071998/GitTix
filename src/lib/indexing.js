const { getDb } = require('../config/db/db');

const runIndex = async () => {
    const db = getDb();
    await db.users.createIndex({email: 1});
    await db.blogs.createIndex({title: 1});
    await db.blogs.createIndex({title: 1, author: 1});
    return;
}

module.exports = { runIndex };