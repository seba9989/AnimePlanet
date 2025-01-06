import { contentPath, skeleton } from '@skeletonlabs/skeleton/plugin';
import * as themes from '@skeletonlabs/skeleton/themes';
import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

import type { Config } from 'tailwindcss';

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
		})
	]
} satisfies Config;