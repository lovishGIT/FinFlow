import app from '@/app.js';
import env from '@/config/validateEnv.config.js';

const port = env.PORT;

app.listen(port, () => {
    console.log(`Server Listenning to port:${port}`);
});