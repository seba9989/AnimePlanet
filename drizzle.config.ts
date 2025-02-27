import { defineConfig } from 'drizzle-kit';
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

export default defineConfig({
	// verbose: true,
	// strict: true,
	// dialect: 'turso'
	dialect: 'turso',
	schema: './src/lib/server/db/schema.ts',
	dbCredentials: {
		url: process.env.DATABASE_URL,
		authToken: process.env.DATABASE_AUTH_TOKEN
	},
	casing: 'snake_case'
});
