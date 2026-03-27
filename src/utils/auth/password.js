const crypto = require('crypto');

const hashPassword = async (password) => {
    return new Promise((resolve, reject) => {
        try {
            // Generate a random salt
            const salt = crypto.randomBytes(16).toString('hex');
            
            // Hash the password using scrypt algorithm
            crypto.scrypt(password, salt, 64, (err, derivedKey) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                resolve({
                    hash: derivedKey.toString('hex'),
                    salt: salt
                });
            });
        } catch (error) {
            reject(error);
        }
    });
};

const verifyPassword = async (password, salt, hash) => {
    return new Promise((resolve, reject) => {
        try {
            crypto.scrypt(password, salt, 64, (err, derivedKey) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                // Compare the generated hash with the stored hash
                const isValid = crypto.timingSafeCompare(derivedKey, Buffer.from(hash, 'hex'));
                resolve(isValid === true);
            });
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    hashPassword,
    verifyPassword
};