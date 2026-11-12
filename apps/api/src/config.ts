import 'dotenv/config';

const required = (key: string, fallback?: string) => {
  const value = process.env[key] || fallback;
  if (!value) throw new Error(`Missing environment variable: ${key}`);
  return value;
};
export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  mongoUri: required('MONGODB_URI', 'mongodb://127.0.0.1:27017/anon'),
  jwtSecret: required('JWT_SECRET', 'development-only-change-me'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:3000',
  rateWindow: Number(process.env.RATE_LIMIT_WINDOW_MS || 900000),
  rateMax: Number(process.env.RATE_LIMIT_MAX || 100)
};
