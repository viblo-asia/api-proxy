const CryptoJS = require('crypto-js')

const key = process.env.APP_KEY

const encrypt = (data) => CryptoJS.AES.encrypt(data, key).toString()
const decrypt = (data) => CryptoJS.AES.decrypt(data, key).toString(CryptoJS.enc.Utf8)
const token = (req) => {
    if (req.cookies && req.cookies['Auth']) {
        const authCookie = req.cookies['Auth']
        return decrypt(authCookie)
    }

    return null
}

module.exports = {
    encrypt,
    decrypt,
    token
}
