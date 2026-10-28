import { PrismaClient } from '@prisma/client';

// Singleton instance to prevent multiple connections in development
const prisma = new PrismaClient();

export default prisma;
