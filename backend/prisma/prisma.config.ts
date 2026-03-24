import { PrismaConfig } from '@prisma/config'

export default {
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
} satisfies PrismaConfig