import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import os from 'os';
import cluster from 'cluster';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';

import { errorHandler } from './middlewares/errorHandler';

import authRoutes from './routes/authentication.route';
import projectRoutes from './routes/project.route';
import issueRoutes from './routes/issue.route';
import searchRoutes from './routes/search.route';
import invitationRoutes from './routes/invitation.route';
import userRoutes from './routes/user.route';

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

  const gracefullyShutdown = () => {
    for (const id in cluster.workers) {
      cluster.workers[id]?.send('shutdown');
      // for IPC Connection
      cluster.workers[id]?.disconnect();
    }
    process.exit(0);
  };

  process.on('SIGTERM', gracefullyShutdown);
  process.on('SIGINT', gracefullyShutdown);
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

  const shouldCompress = (req: express.Request, res: express.Response) => {
    if (req.headers['x-no-compression']) {
      return false;
    }

    return compression.filter(req, res);
  };

  app.use(
    compression({
      threshold: 1,
      filter: shouldCompress,
    })
  );
  app.use(cors());
  app.use(helmet());
  app.use(limiter);
  app.use(bodyParser.json());
  app.use(morgan('tiny', { stream: accessLogStream }));

  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/projects', projectRoutes);
  app.use('/api/v1/projects', issueRoutes);
  app.use('/api/v1/projects', searchRoutes);
  app.use('/api/v1/projects', invitationRoutes);
  app.use('/api/v1/user', userRoutes);

  app.use(errorHandler);

  const server = app.listen(process.env.PORT);
  console.log('Server is running');

  // Worker can be closed gracefully by Cluster Manager.
  process.on('message', (msg) => {
    if (msg === 'shutdown') {
      console.log('Child process received shutdown message, closing server...');
      server.close(() => {
        console.log('Worker shutting down gracefully');
        process.exit(0);
      });
    }
  });

  const shutdownChildProcess = () => {
    console.log('Worker received shutdown signal, closing server...');
    server.close(() => {
      process.exit(0);
    });
  };

  // Worker can be closed gracefully by external sources
  // or directly by "kill" command.
  process.on('SIGTERM', shutdownChildProcess);
  process.on('SIGINT', shutdownChildProcess);
}
