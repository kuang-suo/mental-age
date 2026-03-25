import dotenv from 'dotenv';

dotenv.config();

export const config = {
  database: {
    url: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/mental_age_test'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production'
  },
  admin: {
    initPassword: process.env.INIT_ADMIN_PASSWORD || 'admin123'
  },
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000'
  },
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development'
};

export default config;
