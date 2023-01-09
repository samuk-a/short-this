const crypto = require('crypto');

module.exports = {
    hashId: async (size = 14) => crypto.randomBytes(size / 2).toString('hex')
};