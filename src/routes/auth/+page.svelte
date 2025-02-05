<script lang="ts">
	import { enhance } from '$app/forms';
	import Input from '$components/atoms/Input/Input.svelte';
	import Form from '$components/molecules/Form/Form.svelte';
</script>

<div
	class=" card m-auto grid w-full max-w-2xl divide-y border-[1px] border-surface-200-800 divide-surface-200-800 preset-filled-surface-100-900 *:p-4 sm:grid-cols-2 md:divide-x"
>
	<Form method="post" action="?/login" class="flex flex-col justify-between gap-4">
		<h2 class="h3 text-center">Zaloguj się</h2>
		<div class=" flex flex-col gap-4">
			<Input type="text" name="login" placeholder="Login" />
			<label class="label text-end">
				<Input type="password" name="password" placeholder="Hasło" />
				<span class="label-text"> <button class="anchor"> Nie pamiętam hasła. </button> </span>
			</label>
		</div>

		<button class="btn preset-filled-surface-50-950">Zaloguj się</button>
	</Form>
	<Form method="post" action="?/register" class="flex flex-col justify-between gap-4">
		<h2 class="h3 text-center">Zarejestruj się</h2>
		<div class=" flex flex-col gap-4">
			<Input type="text" name="login" placeholder="Login" />
			<Input type="email" name="email" placeholder="Email" />
			<Input type="password" name="password" placeholder="Hasło" />
			<Input type="password" name="password" placeholder="Powtórz hasło" />
		</div>

		<button class="btn preset-filled-surface-50-950">Zarejestruj się</button>
	</Form>
</div>
