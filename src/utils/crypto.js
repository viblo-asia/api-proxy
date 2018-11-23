import { AES, enc } from 'crypto-js';
import { APP_KEY } from '../env';

const encrypt = data => AES.encrypt(data, APP_KEY).toString();
const decrypt = data => AES.decrypt(data, APP_KEY).toString(enc.Utf8);

export {
    encrypt,
    decrypt
};
