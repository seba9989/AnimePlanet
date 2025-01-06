<script lang="ts">
	import Logo from '$components/atoms/Logo/Logo.svelte';
	import Input from '$components/atoms/Input/Input.svelte';
	import Navbar from '$components/molecules/Navbar/Navbar.svelte';
	import type { User } from '$lib/server/db/schema';
</script>

<header
	class="z-10 flex items-center justify-between gap-8 border-b-2 border-surface-500/20 px-4 py-2 bg-surface-50-950"
>
	<Logo />
	<Input
		wrapperClass="w-full max-w-2xl"
		type="search"
		placeholder="Co chcesz dziś obejrzeć?"
		onclick={() => console.log('test')}
	/>
	<Navbar />
</header>
