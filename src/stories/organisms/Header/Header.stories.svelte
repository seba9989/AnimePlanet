<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Header from './Header.svelte';

	const { Story } = defineMeta({
		title: 'organisms/Header',
		component: Header,
		tags: ['autodocs']
	});
</script>

<Story name="Desktop" />
