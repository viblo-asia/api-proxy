import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import session from './session';
import csrf from './middlewares/csrf';
import proxy from './middlewares/proxy';

import {
    TRUST_PROXIES,
    ETAG_ENABLE
} from './env';

const app = express();

app.set('trust proxy', TRUST_PROXIES);
app.set('etag', ETAG_ENABLE);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session);

app.use(csrf);
app.use(proxy);

// Handle XSRF token error
app.use((err, req, res, next) => {
    if (err.code !== 'EBADCSRFTOKEN') {
        return next(err);
    }

    return res.status(403).json({
        error: 'session has expired or been tampered with'
    });
});

export default app;
