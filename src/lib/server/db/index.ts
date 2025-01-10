import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { env } from '$env/dynamic/private';
import * as schema from './schema';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
if (!env.DATABASE_AUTH_TOKEN) throw new Error('DATABASE_AUTH_TOKEN is not set');
if (!env.DATABASE_SYNC_URL) throw new Error('DATABASE_SYNC_URL is not set');

const client = createClient({
	url: env.DATABASE_SYNC_URL,
	syncUrl: env.DATABASE_SYNC_URL,
	authToken: env.DATABASE_AUTH_TOKEN
});

export const db = drizzle(client, { schema });
