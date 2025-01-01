import type { Preview, SvelteRenderer } from '@storybook/svelte';
import { withThemeByDataAttribute } from '@storybook/addon-themes';

import '../src/app.css';

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i
			}
		},
		backgrounds: {
			values: [{ name: 'Rose', value: '#252229' }],
			default: 'Roes'
		}
	},
	decorators: [
		withThemeByDataAttribute<SvelteRenderer>({
			themes: {
				rose: 'rose'
			},
			defaultTheme: 'rose',
			attributeName: 'data-theme',
			parentSelector: 'body'
		})
	]
};

export default preview;
