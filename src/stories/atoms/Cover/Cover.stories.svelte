<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Cover from './Cover.svelte';

	const { Story } = defineMeta({
		title: 'Molocules/Cover',
		component: Cover,
		tags: ['autodocs'],
		argTypes: {
		}
	});
</script>

<Story name="Default" />

