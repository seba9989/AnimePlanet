<script lang="ts">
	import Logo from '$components/atoms/Logo/Logo.svelte';
	import Input from '$components/atoms/Input/Input.svelte';
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
			<Input
				wrapperClass="w-full max-w-2xl"
				type="search"
				placeholder="Co chcesz dziś obejrzeć?"
				onclick={drawerClose}
			/>
			<Navbar onclick={drawerClose} />
		{/snippet}
	</Modal>
	<div class="hidden md:contents">
		<Input wrapperClass="w-full max-w-2xl" type="search" placeholder="Co chcesz dziś obejrzeć?" />
		<Navbar />
	</div>
</header>
