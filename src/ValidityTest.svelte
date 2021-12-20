<script>
	import {
		emailValidator,
		requiredValidator,
	} from "./functions/validators.js";
	import { createFieldValidator } from "./functions/validation.js";

	const [validity, validate] = createFieldValidator(
		requiredValidator(),
		emailValidator()
	);

	let email = null;
</script>

<input
	class="input"
	type="text"
	bind:value={email}
	placeholder="Your Email"
	class:field-danger={!$validity.valid}
	class:field-success={$validity.valid}
	use:validate={email}
/>
{#if $validity.dirty && !$validity.valid}
	<span class="validation-hint">
		INVALID - {$validity.message}
		{$validity.dirty}
	</span>
{/if}

<button disabled={!$validity.valid}>Ok, I'm ready!</button>

<style>
	:global(body) {
		display: flex;
		flex-direction: column;
	}

	input {
		outline: none;
		border-width: 2px;
	}

	.validation-hint {
		color: red;
		padding: 6px 0;
	}

	.field-danger {
		border-color: red;
	}

	.field-success {
		border-color: green;
	}
</style>
