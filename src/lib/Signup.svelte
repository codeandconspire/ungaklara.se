<script>
  import { enhance } from '$app/forms'
  import { page } from '$app/stores'

  import Button from '$lib/Button.svelte'
  import Html from '$lib/Html.svelte'

  /** @type {{ success?: boolean, name?: string, email?: string, form: string }?}*/
  export let result = null

  const id = Math.random().toString(36).slice(2)

  $: name = result?.name || ''
  $: email = result?.email || ''
  $: step = +($page.url.searchParams.get('step') || 1)
  $: price = $page.url.searchParams.get('price') === '150' ? 150 : 50

  let loading = false

  const onsubmit = () => {
    loading = true
    return ({ update }) => {
      loading = false
      update()
    }
  }
</script>

<form
  class="signup"
  method="POST"
  data-sveltekit-replacestate
  data-sveltekit-keepfocus
  data-sveltekit-noscroll
  use:enhance={onsubmit}>
  <input type="hidden" name="form" value="signup" />
  {#if $$slots.primary}
    <div class="main">
      <slot name="primary" />
    </div>
  {/if}
  {#if result && 'success' in result && result.form === 'signup'}
    <div class="result">
      {#if result.success}
        <slot name="success">
          <Html>
            <h3>Tack och välkommen.</h3>
            <p>Du kommer höra från oss snart.</p>
          </Html>
        </slot>
      {:else}
        <slot name="error">
          <Html>
            <h3>Fel! Något gick tokigt</h3>
            <p>
              Du får gärna <button
                class="link"
                formmethod="GET"
                name="step"
                value="1">
                försöka igen
              </button>
            </p>
          </Html>
        </slot>
      {/if}
    </div>
  {:else}
    <div class="form">
      <div class="progress">
        <h4 class="header">Bli medlem i Unga Klaras Vänner</h4>
        <div class="section" class:current={step === 1}>
          <button
            class="header"
            name="step"
            value="1"
            formmethod="GET"
            formnovalidate>
            <h4>1. Din ålder</h4>
          </button>
          {#if step === 1}
            <div class="content">
              <div class="radios">
                <label class="radio" for="youth-{id}">
                  <input
                    value="50"
                    type="radio"
                    name="price"
                    id="youth-{id}"
                    checked={price === 50} />
                  <span>25 eller yngre (50kr)</span>
                </label>
                <label class="radio" for="adult-{id}">
                  <input
                    value="150"
                    type="radio"
                    name="price"
                    id="adult-{id}"
                    checked={price === 150} />
                  <span>Över 25 (150kr)</span>
                </label>
              </div>
              <Button primary name="step" value="2" formmethod="GET">
                Nästa
              </Button>
            </div>
          {/if}
        </div>
        <div class="section" class:current={step === 2}>
          <button
            class="header"
            name="step"
            value="2"
            formmethod="GET"
            formnovalidate>
            <h4>2. Swisha medlemsavgift</h4>
          </button>
          {#if step === 2}
            <div class="content">
              <div class="swish">
                <Html>
                  <h3>Swisha {price} kr till: 123-330 61 72</h3>
                  <p>
                    <a
                      href="https://app.swish.nu/1/p/sw/?sw=1233306172&amt={price}&cur=SEK&msg=&src=qr">
                      Starta Swish på denna enhet
                    </a>
                  </p>
                </Html>
              </div>
              <input type="hidden" name="price" value={price} />
              <Button primary name="step" value="3" formmethod="GET">
                Klart! Nästa
              </Button>
            </div>
          {/if}
        </div>
        <div class="section" class:current={step === 3}>
          <button
            class="header"
            name="step"
            value="3"
            formmethod="GET"
            formnovalidate>
            <h4>3. Dina uppgifter</h4>
          </button>
          {#if step === 3}
            <div class="content">
              <div class="fields">
                <label for="name-{id}">
                  <span class="label">Ditt namn</span>
                  <input
                    required
                    name="name"
                    type="text"
                    class="field"
                    id="name-{id}"
                    disabled={loading}
                    value={name} />
                </label>
                <label for="email-{id}">
                  <span class="label">Din e-mailadress</span>
                  <input
                    required
                    type="email"
                    name="email"
                    class="field"
                    id="email-{id}"
                    disabled={loading}
                    value={email} />
                </label>
              </div>
              <input type="hidden" name="price" value={price} />
              <input
                type="hidden"
                name="subscription"
                value="649015a2dfd03234e0cf730e" />
              <Button primary formaction="?/signup" disabled={loading}>
                Skicka in
              </Button>
            </div>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</form>

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

  .section {
    border-top: var(--border-width) solid;
  }

  .result {
    padding: 2.5rem 0 3rem;
    max-width: 34rem;
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

  .label {
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

  .field:disabled {
    opacity: 0.3;
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
    content: '';
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
