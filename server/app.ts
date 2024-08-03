import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import os from 'os';
import cluster from 'cluster';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';

dotenv.config();

if (cluster.isPrimary) {
  console.log(`Cluster Manager ${process.pid} is running`);

  const numCPUs = os.availableParallelism();
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker) => {
    console.log(`worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  const app = express();

  const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 100,
    message: 'Too many requests!',
  });

  const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'otps.log'),
    {
      flags: 'a',
    }
  );

  app.use(cors());
  app.use(helmet());
  app.use(limiter);
  app.use(bodyParser.json());
  app.use(morgan('tiny', { stream: accessLogStream }));

  app.listen(process.env.PORT);
  //   console.log('Server is running!');
}
