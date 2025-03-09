<script lang="ts">
	import Logo from '$components/atoms/Logo/Logo.svelte';
	import Search from '$components/atoms/Input/Assets/Search.svelte';
	import Navbar from '$components/molecules/Navbar/Navbar.svelte';
	import { Modal } from '@skeletonlabs/skeleton-svelte';
	import { Menu, X } from 'lucide-svelte';

	let drawerState = $state(false);
	function drawerClose() {
		drawerState = false;
	}
</script>

<header
	class="z-10 flex items-center justify-between gap-8 border-b-2 border-surface-500/20 px-4 py-2 bg-surface-50-950"
>
	<Logo />
	<Modal
		bind:open={drawerState}
		triggerBase="btn-icon preset-tonal md:hidden"
		contentBase="bg-surface-100-900 p-4 space-y-4 shadow-xl w-[480px] h-screen"
		positionerJustify="justify-start"
		positionerAlign=""
		positionerPadding=""
		transitionsPositionerIn={{ x: -480, duration: 200 }}
		transitionsPositionerOut={{ x: -480, duration: 200 }}
	>
		{#snippet trigger()}<Menu />{/snippet}
		{#snippet content()}
			<header class="flex justify-between">
				<Logo />
				<button type="button" class="btn-icon preset-tonal" onclick={drawerClose}>
					<X />
				</button>
			</header>
			<Search
				class="w-full max-w-2xl"
				placeholder="Co chcesz dziś obejrzeć?"
				setQueryParam={{
					name: 'title',
					pathname: '/anime'
				}}
			/>
			<Navbar onclick={drawerClose} />
		{/snippet}
	</Modal>
	<div class="hidden md:contents">
		<Search
			class="w-full max-w-2xl"
			placeholder="Co chcesz dziś obejrzeć?"
			setQueryParam={{
				name: 'title',
				pathname: '/anime'
			}}
		/>
		<Navbar />
	</div>
</header>
