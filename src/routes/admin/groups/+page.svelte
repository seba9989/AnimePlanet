<script lang="ts">
	import { Pagination } from '@skeletonlabs/skeleton-svelte';
	// Icons
	import IconArrowLeft from 'lucide-svelte/icons/arrow-left';
	import IconArrowRight from 'lucide-svelte/icons/arrow-right';
	import IconEllipsis from 'lucide-svelte/icons/ellipsis';
	import IconFirst from 'lucide-svelte/icons/chevrons-left';
	import IconLast from 'lucide-svelte/icons/chevron-right';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	console.log(data.groups);
</script>

<!-- <section class="space-y-4">
	<div class="table-wrap">
		<table class="table table-fixed caption-bottom">
			<thead>
				<tr>
					<th>Logo</th>
					<th>Nazwa</th>
					<th>Administracja</th>
					<th>Moderacja</th>
				</tr>
			</thead>
			<tbody class="hover:[&>tr]:preset-tonal-primary">
			</tbody>
		</table>
	</div>
	<footer class="flex justify-between">
		<select name="size" id="size" class="select max-w-[150px]" bind:value={size}>
			{#each [1, 2, 5] as v}
				<option value={v}>Items {v}</option>
			{/each}
			<option value={sourceData.length}>Show All</option>
		</select>
		<Pagination bind:data={sourceData} bind:page bind:pageSize={size} siblingCount={4}>
			{#snippet labelEllipsis()}<IconEllipsis class="size-4" />{/snippet}
			{#snippet labelNext()}<IconArrowRight class="size-4" />{/snippet}
			{#snippet labelPrevious()}<IconArrowLeft class="size-4" />{/snippet}
			{#snippet labelFirst()}<IconFirst class="size-4" />{/snippet}
			{#snippet labelLast()}<IconLast class="size-4" />{/snippet}
		</Pagination>
	</footer>
</section> -->

<!-- {#each slicedSource(sourceData) as row}
					<tr>
						<td>{row.position}</td>
						<td>{row.name}</td>
						<td>{row.weight}</td>
						<td class="text-right">{row.symbol}</td>
					</tr>
				{/each} -->