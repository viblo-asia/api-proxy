import app from './src/app';
import { HOST, PORT } from './src/env';

app.listen(PORT, HOST, () => {
    process.stdout.write(`Proxy listening on ${HOST}:${PORT}`);
});
