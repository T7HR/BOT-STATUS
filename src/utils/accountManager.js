const db = require('./database');

module.exports = {
    getBalance: (userId) => {
        return new Promise((resolve, reject) => {
            db.get('SELECT balance FROM accounts WHERE user_id = ?', [userId], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row ? row.balance : 0);
                }
            });
        });
    },
    
    updateBalance: (userId, amount) => {
        return new Promise((resolve, reject) => {
            db.run('INSERT INTO accounts (user_id, balance) VALUES (?, ?) ON CONFLICT(user_id) DO UPDATE SET balance = balance + ?', [userId, amount, amount], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    },
    
    deductBalance: (userId, amount) => {
        return new Promise((resolve, reject) => {
            db.run('UPDATE accounts SET balance = balance - ? WHERE user_id = ? AND balance >= ?', [amount, userId, amount], function(err) {
                if (err) {
                    reject(err);
                } else if (this.changes === 0) {
                    reject(new Error('Insufficient balance'));
                } else {
                    resolve();
                }
            });
        });
    }
};
