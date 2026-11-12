import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import { config } from './config';
import routes from './routes';
import { errorHandler, notFound } from './middleware';

const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: config.corsOrigin.split(',').map(x => x.trim()), credentials: true }));
app.use(rateLimit({ windowMs: config.rateWindow, limit: config.rateMax, standardHeaders: true, legacyHeaders: false }));
app.use(express.json({ limit: '1mb' }));
app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use(['/api', '/api/v1'], routes);
app.use(notFound);
app.use(errorHandler);

mongoose.connect(config.mongoUri).then(() => app.listen(config.port, () => console.log(`API listening on ${config.port}`))).catch(err => { console.error('MongoDB connection failed', err); process.exit(1); });
export default app;
