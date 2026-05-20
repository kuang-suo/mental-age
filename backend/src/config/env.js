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
  nodeEnv: process.env.NODE_ENV || 'development',
  imageAnalysis: {
    apiUrl: process.env.IMAGE_API_URL || 'https://api.gptgod.online/v1',
    apiKey: process.env.IMAGE_API_KEY || 'sk-IM2qroshjRrGFuP2dL6MOLKHwtRpP12TwOUMayPI4DpY3j09',
    model: process.env.IMAGE_MODEL || 'gpt-image-2',
    photoExpireDays: parseInt(process.env.PHOTO_EXPIRE_DAYS || '3', 10),
    serverUrl: process.env.SERVER_URL || 'https://home.quceshi.asia'
  }
};
/* gpt-image-2-vip */
export default config;
