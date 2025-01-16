import { goto } from '$app/navigation';
import { page } from '$app/state';

export const setQueryParam = (name: string, value: string) => {
	page.url.searchParams.set(name, value);
	goto(`/anime?${page.url.searchParams.toString()}`, { keepFocus: true });
	return;
};
