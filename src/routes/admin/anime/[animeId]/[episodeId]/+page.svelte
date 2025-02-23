<script lang="ts">
	import Form from '$components/molecules/Form/Form.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let { episode, anime } = $derived(data);

	let isSave = $state(true);
	const changeMode = () => {
		isSave = !isSave;
	};

	const prettifyKey = (key: string) => {
		const [firstLiter, ...rest] = key;

		return [firstLiter.toUpperCase(), ...rest].join('');
	};

	$inspect(isSave);
</script>

{#snippet linkTable(key: 'videos' | 'downloads')}
	<div class="table-wrap divide-y border border-surface-200-800 divide-surface-200-800">
		<h3 class="h3 p-2">{prettifyKey(key)}</h3>
		<table class="table caption-top">
			<thead>
				<tr>
					<th>Index</th>
				</tr>
			</thead>
			<tbody class="hover:[&>tr]:backdrop-brightness-75">
				{#each episode[key] as item, index}
					<tr class="">
						<th>{index}</th>
						<th>
							<a href={item.url} class="anchor">
								{item.url}
							</a>
						</th>
						<th class="!text-right">
							<Form action="?/remove" class="[&>input]:hidden">
								<input type="checkbox" defaultChecked name="type" value={key} />
								<input type="checkbox" defaultChecked name="id" value={item.id} />
								<button type="submit" class="btn preset-tonal-error">Remove</button>
							</Form>
						</th>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/snippet}

<div class="grid gap-4">
	<Form onSuccess={changeMode} action="?/updateEpisode" class="flex justify-between">
		<div
			class="grid grid-cols-2 gap-x-4 divide-y border border-surface-200-800 divide-surface-200-800 *:h5 *:col-span-2 *:grid *:grid-cols-subgrid *:items-center *:p-2"
		>
			<h2><span>Seria:</span> {anime.title}</h2>
			<h2>
				<span>Episode:</span>
				<input
					type="text"
					name="episodeNumber"
					defaultValue={episode.episodeNumber}
					disabled={isSave}
					class="input"
				/>
			</h2>
			<h2>
				<span>Episode Title:</span>
				<input
					type="text"
					name="title"
					defaultValue={episode.title}
					disabled={isSave}
					class="input"
				/>
			</h2>
		</div>
		{#if isSave}
			<button onclick={changeMode} type="button" class="btn preset-tonal-primary">Edit</button>
		{:else}
			<button type="submit" class="btn preset-tonal-tertiary">Save</button>
		{/if}
	</Form>
	<div class="flex gap-4">
		{@render linkTable('videos')}

		{@render linkTable('downloads')}
	</div>
</div>
