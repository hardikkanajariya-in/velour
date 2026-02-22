import { PrismaClient } from '@prisma/client';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';

// Use the ws package for WebSocket support in Node.js (required for Node < 21)
neonConfig.webSocketConstructor = ws;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Convert an opaque ErrorEvent (from WebSocket failures) into a proper Error.
 */
function toReadableError(error: unknown): Error {
  if (error instanceof Error) return error;
  if (error && typeof error === 'object') {
    const msg =
      ('message' in error && error.message) ||
      ('error' in error && error.error) ||
      ('reason' in error && error.reason) ||
      '';
    return new Error(
      `[Prisma/Neon] Database connection failed: ${msg || 'WebSocket ErrorEvent'}. Verify DATABASE_URL and network connectivity.`
    );
  }
  return new Error(`[Prisma/Neon] Unknown connection error: ${String(error)}`);
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const pool = new Pool({ connectionString });

  // Prevent unhandled 'error' events on the pool from crashing the process
  pool.on('error', (err: unknown) => {
    console.error('[Prisma/Neon] Pool error:', toReadableError(err).message);
  });

  const adapter = new PrismaNeon(pool as unknown as ConstructorParameters<typeof PrismaNeon>[0]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new PrismaClient({ adapter } as any);
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
