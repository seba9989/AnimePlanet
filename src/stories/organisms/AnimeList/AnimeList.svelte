<script lang="ts">
	export let data;
</script>

<h1>{data.anime.title.romaji}</h1>
<img src={data.anime.coverImage.large} alt="Cover Image">
{#if data.anime.bannerImage}
	<img src={data.anime.bannerImage} alt="Banner Image">
{/if}
