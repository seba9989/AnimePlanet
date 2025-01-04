<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Input from './Input.svelte';

	const { Story } = defineMeta({
		title: 'Atoms/Input',
		component: Input,
		tags: ['autodocs'],
		argTypes: {
			type: {
				control: 'text'
			}
		}
	});
</script>

<Story name="Text" args={{ type: 'text', placeholder: 'Text' }} />
<Story name="Password" args={{ type: 'password', placeholder: 'Password' }} />
