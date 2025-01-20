<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<h1 class="h1">Jesteś adminem</h1>
<a class="anchor" href="/admin/groups">Zarządzaj grupami</a>
<a class="anchor" href="/admin/anime">Zarządzaj anime</a>
<a class="anchor" href="/admin/discord">Zarządzaj discord</a>
