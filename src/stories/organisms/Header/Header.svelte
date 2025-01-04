<script>
	import Logo from '$components/atoms/Logo/Logo.svelte';
	import Input from '$components/atoms/Input/Input.svelte';
	import Navbar from '$components/molecules/Navbar/Navbar.svelte';
</script>

<header
	class="grid grid-flow-col items-center border-b-2 border-surface-500/20 px-4 py-2 bg-surface-50-950"
>
	<Logo />
	<Input type="search" placeholder="Co chcesz dziś obejrzeć?" onclick={() => console.log('test')} />
	<Navbar />
</header>
