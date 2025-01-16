<script lang="ts">
	import { ArrowUpRight } from 'lucide-svelte';

	let { episode } = $props();

	let player = $state(episode.videos[0].url ?? '');

	const hostingReg = /https:\/\/([\w.]+)\/.*/;
	const urlToHost = (url: string) => hostingReg.exec(url)?.at(1);
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
				<option value={video.url}>{urlToHost(video.url)}</option>
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
						{#each episode.downloads as downloads}
							{@const name = hostingReg.exec(downloads.url)?.at(1)}
							<tr>
								<td>{name}</td>
								<td class="hidden md:block">{downloads.url}</td>
								<td class="text-right">
									<a href={downloads.url} class="btn preset-outlined">
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
