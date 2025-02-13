<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/state';

	let { data }: { data: PageData } = $props();

	const { coverImageUrl, title, episodes, tags } = data.anime;

	const malData = data.malData;

	const altTitles = new Set(malData?.titles.map(({ title }) => title));

	function capitalizeFirstLetter(str: string) {
		return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase());
	}

	const bonusData = {
		season:
			malData?.season && malData?.year
				? `${malData?.season ?? ''} ${malData?.year ?? ''}`
				: (new Date(malData?.aired.from ?? '').getFullYear() as unknown as string),
		duration: malData?.duration ?? '',
		episodes: `${episodes.length} / ${malData?.episodes ?? '?'}`,
		status: malData?.status ?? ''
	};
</script>

{#snippet Title(visible = true)}
	<h1 class="h1 {visible ? '' : 'invisible'} text-nowrap">{title}</h1>
{/snippet}

{#snippet InLineList(items: string[])}
	<div class="flex items-center gap-1">
		{#each items as item, i}
			<p class="text-nowrap">{capitalizeFirstLetter(item)}</p>
			{#if i < items.length - 1}
				<div class="inline-block min-h-[1em] w-0.5 self-stretch bg-surface-200-800"></div>
			{/if}
		{/each}
	</div>
{/snippet}

<div class="grid min-h-screen *:col-start-1 *:row-start-1">
	<div class="grid grid-cols-[auto_1fr]">
		<div class="w-fit bg-black">
			{@render Title(false)}
		</div>
		<div
			class="bg-cover bg-no-repeat"
			style="background-image: url({coverImageUrl}); background-position: 0% 10%;"
		>
			<div
				class="h-full bg-gradient-radial from-transparent to-black backdrop-blur-sm backdrop-brightness-90"
			></div>
		</div>
	</div>
	<div class="z-10 grid w-fit content-end gap-20 overflow-visible px-4 py-8">
		<div>
			{@render InLineList(tags.map(({ tag }) => tag))}
			{@render Title()}
			<h2 class="flex flex-wrap gap-2">
				{#each altTitles as _title, i}
					{#if _title !== title}
						<p>
							{_title}
							{#if i < altTitles.size - 1}
								,
							{/if}
						</p>
					{/if}
				{/each}
			</h2>
		</div>

		<div class=" grid w-full max-w-[50rem] gap-5 overflow-hidden">
			{@render InLineList(Object.values(bonusData))}
			<div class="flex items-center">
				<div class=" overflow-hidden text-ellipsis sm:text-left">
					{malData?.background}
				</div>
			</div>
			<div class="flex gap-4">
				<button class="btn btn-lg preset-filled-primary-100-900">Oglądaj</button>
				<button class="btn btn-lg preset-outlined-primary-100-900">Trailer</button>
			</div>
		</div>
	</div>
</div>
<div class="bg-black px-4 py-8" id="Episodes">
	<h3 class="h5">Lista Odcinków:</h3>
	<div class="grid gap-5 grid-grow-52">
		{#each episodes as { episodeNumber, title }}
			<a
				href="{page.params.title}/{episodeNumber}"
				class="flex h-20 overflow-hidden preset-filled-surface-50-950"
			>
				<div class="h2 flex aspect-square items-center justify-center bg-primary-800 font-bold">
					{episodeNumber}
				</div>
				<h3 class="truncate px-2 py-3">{title}</h3>
			</a>
		{/each}
	</div>
</div>

<style lang="postcss">
	.bg-gradient-radial {
		background: radial-gradient(75% 90% at 75% 10%, var(--tw-gradient-stops));
	}
</style>
