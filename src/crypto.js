const {
    ENCRYPT_KEY,
} = require('./config')

const {
    AES,
    enc,
} = require('crypto-js')

const encrypt = (data) => AES.encrypt(data, ENCRYPT_KEY).toString()
const decrypt = (data) => AES.decrypt(data, ENCRYPT_KEY).toString(enc.Utf8)

module.exports = {
    encrypt,
    decrypt,
}
