import http from 'http';
import express from 'express';
import { addSocketServer } from './socketServer';
import { getLogger } from './logger';
import env from '../env';

const logger = getLogger();
const app = express();

app.get('/', (req, res) => {
  res.send({ message: 'Welcome to web-sockets!' });
});

const server = http.createServer(app);

addSocketServer(server);

const port = env.PORT;
server.listen(port, () => {
  logger.info(`listening at http://localhost:${port}`);
});
