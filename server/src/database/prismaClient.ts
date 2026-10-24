import type { PrismaClient as PrismaClientType } from '@prisma/client';

// Lazy Prisma client — only instantiated when DATABASE_URL is set
// to avoid crashing when running with in-memory fallback.
let _prisma: PrismaClientType | null = null;

export function getPrismaClient(): PrismaClientType {
  if (!_prisma) {
    const { PrismaClient } = require('@prisma/client');
    _prisma = new PrismaClient({ log: ['error'] });
  }
  return _prisma!;
}

// Convenience export – use getPrismaClient() for safe lazy access
export const prisma = new Proxy({} as PrismaClientType, {
  get(_target, prop) {
    return (getPrismaClient() as any)[prop];
  },
});
