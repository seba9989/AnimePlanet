import { contentPath, skeleton } from '@skeletonlabs/skeleton/plugin';
import * as themes from '@skeletonlabs/skeleton/themes';
import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}', contentPath(import.meta.url, 'svelte')],

	theme: {
		extend: {}
	},

	plugins: [
		typography,
		forms,
		containerQueries,
		skeleton({
			// NOTE: each theme included will increase the size of your CSS bundle
			themes: [themes.cerberus, themes.mint, themes.mona, themes.pine]
			// themes: [...themes]
		}),
		plugin(({ matchUtilities, theme }) => {
			matchUtilities(
				{
					'grid-grow': (value) => ({
						'grid-template-columns': `repeat(auto-fill, minmax(${value}, 1fr))`
					})
				},
				{
					values: theme('width')
				}
			);
		})
	]
} satisfies Config;
