const { AES, enc } = require('crypto-js');
const { APP_KEY } = require('./config');

const encrypt = data => AES.encrypt(data, APP_KEY).toString();
const decrypt = data => AES.decrypt(data, APP_KEY).toString(enc.Utf8);

module.exports = {
    encrypt,
    decrypt
};
