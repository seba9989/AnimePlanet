<script lang="ts">
	import { enhance } from '$app/forms';
	import type { DeclaredType } from '$lib/server/utils/formValidator';
	import type { ToastContext } from '@skeletonlabs/skeleton-svelte';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { getContext, setContext, type Snippet } from 'svelte';
	import type { HTMLFormAttributes } from 'svelte/elements';

	type ActionFunctionArgs = Parameters<Exclude<Awaited<ReturnType<SubmitFunction>>, void>>[0];
	type ActionFunction = (args: ActionFunctionArgs) => void;

	type Props = HTMLFormAttributes & {
		children?: Snippet;
		onSuccess?: ActionFunction;
		onError?: ActionFunction;
		onFailure?: ActionFunction;
		onRedirect?: ActionFunction;
		onAll?: ActionFunction;
		isLoad?: boolean;
		isErrorHandl?: boolean;
		isReset?: boolean;

		types?: Record<string, DeclaredType>;
	};

	let {
		onsubmit: onSubmit,
		onSuccess,
		onError,
		onFailure,
		onRedirect,
		onAll,
		isLoad = $bindable(false),
		isErrorHandl,
		isReset = true,

		types = {},
		children,
		...formProps
	}: Props = $props();

	const toast = getContext<ToastContext>('toast');

	const onsubmit: HTMLFormAttributes['onsubmit'] = (event) => {
		isLoad = true;
		onSubmit?.(event);
	};

	setContext('form', {
		get isLoad() {
			return isLoad;
		}
	});
</script>

<form
	method="post"
	{...formProps}
	{onsubmit}
	use:enhance={() => {
		return async (enhanceArgs) => {
			const { result, update } = enhanceArgs;
			if (result.type == 'success') {
				onSuccess?.(enhanceArgs);
			}
			if (result.type == 'error') {
				if (!isErrorHandl)
					toast.create({ title: 'Error', description: result.error.message, type: 'error' });
				onError?.(enhanceArgs);
			}
			if (result.type == 'failure') {
				onFailure?.(enhanceArgs);
			}
			if (result.type == 'redirect') {
				onRedirect?.(enhanceArgs);
			}

			onAll?.(enhanceArgs);

			isLoad = false;
			if (!isErrorHandl && result.type == 'error') return;
			update({ reset: isReset });
		};
	}}
>
	{#each Object.entries(types) as [name, value]}
		<input type="checkbox" defaultChecked class="hidden" name="__type__{name}" {value} />
	{/each}
	{@render children?.()}
</form>
