import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { env } from 'bun';
import * as schema from './schema';
import { sql } from 'drizzle-orm';
import { migrate } from 'drizzle-orm/libsql/migrator';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
if (!env.DATABASE_AUTH_TOKEN) throw new Error('DATABASE_AUTH_TOKEN is not set');

const client = createClient({
	url: env.DATABASE_URL,
	authToken: env.DATABASE_AUTH_TOKEN
});

export const db = drizzle(client, { schema });

await db.run(sql`PRAGMA foreign_keys=OFF;`);

try {
	await migrate(db, { migrationsFolder: './drizzle' });
} finally {
	await db.run(sql`PRAGMA foreign_keys=ON;`);
}