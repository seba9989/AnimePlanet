<script lang="ts">
	import { urlToHosting } from '$lib/utils/urlToHosting';
	import { ArrowUpRight } from 'lucide-svelte';

	let { episode } = $props();

	let player = $state(episode.videos[0].url ?? '');

	let isFilemoon = $derived(/https:\/\/(\w+)/.exec(player)?.at(1) == 'filemoon');
</script>

<div class="flex flex-wrap justify-center gap-4">
	<div class="w-full max-w-[640px]">
		{#if isFilemoon}
			<iframe
				title="player"
				src={player}
				class="aspect-video w-full"
				style="border:none;"
				frameBorder="0"
				scrolling="no"
				allowfullscreen
				name="v2"
				allow="encrypted-media"
			></iframe>
		{:else}
			<iframe
				title="player"
				src={player}
				class="aspect-video w-full"
				style="border:none;"
				frameBorder="0"
				scrolling="no"
				allowfullscreen
				name="v2"
				allow="encrypted-media"
				sandbox="allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation"
			></iframe>
		{/if}
	</div>
	<div class="flex w-full flex-col gap-4 xl:w-fit">
		<select bind:value={player} class="select">
			{#each episode.videos as video}
				<option value={video.url}>{urlToHosting(video.url)}</option>
			{/each}
		</select>
		{#if episode.downloads[0]}
			<div class="table-wrap">
				<table class="table caption-bottom">
					<thead>
						<tr>
							<th>Name</th>
							<th class="hidden md:block">URL</th>
						</tr>
					</thead>
					<tbody class="hover:[&>tr]:preset-tonal-primary">
						{#each episode.downloads as download}
							<tr>
								<td>{urlToHosting(download.url)}</td>
								<td class="hidden md:block">{download.url}</td>
								<td class="text-right">
									<a href={download.url} class="btn preset-outlined">
										<ArrowUpRight />
										Download
									</a>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>
