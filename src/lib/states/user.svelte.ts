import type { User } from '$lib/server/db/schema';
import { writable } from 'svelte/store';

export const userData = writable<User | null>(null);
