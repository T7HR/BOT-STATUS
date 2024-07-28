const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./user_accounts.db');

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS accounts (
            user_id TEXT PRIMARY KEY,
            balance INTEGER DEFAULT 0
        )
    `);
});

module.exports = db;