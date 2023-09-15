<script>
	import Html from '$lib/Html.svelte'
	import Button from '$lib/Button.svelte'
	let current = 1
	let finish = false
	let price = 50

	function go (step) {
		current = step
	}

	function change (event) {
		price = event.currentTarget.value
	}

	function submit (event) {
		finish = true
		event.preventDefault()
	}
</script>

<section class="signup">
  <div class="main">
    <slot name="primary" />
  </div>
  <div class="form {finish ? 'finish' : ''}">
		<form class="progress" on:submit={submit}>
			<h4 class="header">Bli medlem i Unga Klaras Vänner</h4>
			<div class="section {current === 1 ? 'current' : ''}">
				<button type="button" class="header" on:click={() => go(1)}>
					<h4>1. Din ålder</h4>
				</button>
				<div class="content">
					<div class="radios">
						<label class="radio">
							<input type="radio" name="age" value="50" checked on:change={change} />
							<span>25 eller yngre (50kr)</span>
						</label>
						<label class="radio">
							<input type="radio" name="age" value="150" on:change={change} />
							<span>Över 25 (150kr)</span>
						</label>
					</div>
					<Button primary type="button" on:click={() => go(2)}>Nästa</Button>
				</div>
			</div>
			<div class="section {current === 2 ? 'current' : ''}">
				<button type="button" class="header" on:click={() => go(2)}>
					<h4>2. Swisha medlemsavgift</h4>
				</button>
				<div class="content">
					<div class="swish">
						<Html>
							<h3>Swisha {price} kr till: 123-330 61 72</h3>
							<p><a href="https://app.swish.nu/1/p/sw/?sw=1233306172&amt={price}&cur=SEK&msg=&src=qr">Starta Swish på denna enhet</a></p>
						</Html>
					</div>
					<Button primary type="button" on:click={() => go(3)} >Klart! Nästa</Button>
				</div>
			</div>
			<div class="section {current === 3 ? 'current' : ''}">
				<button type="button" class="header" on:click={() => go(3)}>
					<h4>3. Dina uppgifter</h4>
				</button>
				<div class="content">
					<div class="fields">
						<div>
							<label for="email">Din e-mailadress</label>
							<input class="field" id="email" type="email" required>
						</div>
						<div>
							<label for="name">Ditt namn</label>
							<input class="field" id="name" type="text" required>
						</div>
					</div>
					<Button primary type="submit">Skicka in</Button>
				</div>
			</div>
		</form>
    <div class="success">
      <slot name="success" />
    </div>
  </div>
</section>

<style>
  .signup {
		display: grid;
    gap: 2rem;
  }

	@media (min-width: 1000px) {
		.signup {
			grid-template-columns: 1fr 1fr;
			place-items: center;
			gap: 3rem;
		}

		.main {
			margin-top: -2rem;
		}
	}

	.form {
		position: relative;
		border-radius: 0.25rem;
		border: var(--border-width) solid;
		background: rgb(var(--color-yellow));
		width: 100%;
    max-width: 40rem;
	}

  .form::before {
    content: '';
    display: block;
    width: 94%;
    height: 100%;
    position: absolute;
    left: 3%;
    bottom: -0.75rem;
    z-index: -1;
    background: black;
    border-radius: var(--border-radius);
  }

	.content {
		padding: 0.25rem 1.5rem 1.5rem;
	}

	.section .content {
		display: none;
	}

	.current .content {
		display: block;
	}

	.section {
		border-top: var(--border-width) solid;
	}

	.success {
		display: none;
		padding: 2.5rem 2.5rem 3rem;
		max-width: 34rem;
	}

	.finish .success {
		display: block;
	}

	.finish .progress {
		display: none;
	}

	.header {
		position: relative;
		padding: 0.8rem 1.5rem 1.1rem;
		font-weight: 600;
		font-family: var(--heading-font-family);
		line-height: var(--heading-line-height);
		letter-spacing: -0.025em;
		font-size: 1.25rem;
		width: 100%;
		text-align: left;
	}

	.fields {
		display: grid;
		gap: 1rem;
		padding-bottom: 1.25rem;
	}

	@media (min-width: 500px) {
		.fields {
			grid-template-columns: 1fr 1fr;
		}
	}

	.fields label {
		display: block;
		margin: 0 0 0.25rem;
	}

	.field {
		width: 100%;
		border: var(--border-width) solid;
		padding: 0.76rem;
		font-size: inherit;
		border-radius: var(--border-radius);
	}

	.field::placeholder {
		color: inherit;
		opacity: 1;
	}

	.field:focus {
		outline: 0 !important;
	}

	@media (min-width: 500px) {
		.field {
			padding: 1rem;
		}
	}

	.radios {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem 2rem;
		margin-bottom: 1.25rem;
	}

	.radio {
		display: flex;
		flex: 0 0 0px;
		gap: 0.5rem;
		white-space: nowrap;
		flex-wrap: nowrap;
		cursor: pointer;
		width: 100%;
	}

	.radio input {
		width: 1px;
		height: 1px;
		opacity: 0;
		position: absolute;
	}

	.radio span::before {
		content: "";
		display: inline-flex;
		width: 1.25rem;
		height: 1.25rem;
		border-radius: 50%;
		background: #fff;
		border: 0.25rem solid #fff;
		box-shadow: 0 0 0 var(--border-width) #000;
		margin-right: 0.5rem;
	}

	.radio input:checked + span::before {
		background: black;
	}

	.swish {
		padding-bottom: 1.25rem;
	}
</style>
