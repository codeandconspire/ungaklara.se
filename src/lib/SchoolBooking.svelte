<script>
  import Button from '$lib/Button.svelte'

  export let school = {}
  export let teacher = {}
  export let booking = {}

  /** @type {{ success: boolean }?}*/
  export let result = null
</script>

<div class="school-booking">
  <div class="body">
    <slot />
  </div>

  <div class="form">
    <fieldset class="group">
      <legend class="heading">Om skolan</legend>
      <div class="grid" style:--cols="4">
        <label class="item" style:--span="2">
          <input
            type="text"
            class="field"
            name="Skolan:Namn"
            required
            bind:value={school.name} />
          <span class="label">Skolans namn</span>
        </label>
        <label class="item" style:--span="2">
          <input
            type="text"
            class="field"
            name="Skolan:Organisationsnummer"
            required
            bind:value={school.orgnumber} />
          <span class="label">Organisationsnummer</span>
        </label>
        <label class="item" style:--span="2">
          <input
            type="text"
            class="field"
            name="Skolan:Postadress"
            required
            bind:value={school.address} />
          <span class="label">Postadress</span>
        </label>
        <label class="item" style:--span="1">
          <input
            type="text"
            class="field"
            name="Skolan:Postnummer"
            required
            bind:value={school.postcode} />
          <span class="label">Postnummer</span>
        </label>
        <label class="item" style:--span="1">
          <input
            type="text"
            class="field"
            name="Skolan:Ort"
            required
            bind:value={school.city} />
          <span class="label">Ort</span>
        </label>
      </div>
    </fieldset>
    <fieldset class="group">
      <legend class="heading">Vem är läraren?</legend>
      <div class="grid" style:--cols="2">
        <label class="item" style:--span="2">
          <input
            type="text"
            class="field"
            name="Läraren:Namn"
            required
            bind:value={teacher.name} />
          <span class="label">Namn</span>
        </label>
        <label class="item">
          <input
            type="email"
            class="field"
            name="Läraren:E-postadress"
            required
            bind:value={teacher.email} />
          <span class="label">E-postadress</span>
        </label>
        <label class="item">
          <input
            type="tel"
            class="field"
            name="Läraren:Telefonnummer"
            required
            bind:value={teacher.tel} />
          <span class="label">Telefonnummer</span>
        </label>
      </div>
    </fieldset>
    <fieldset class="group">
      <legend class="heading">Bokning</legend>
      <div class="grid" style:--cols="2">
        <label class="item" style:--span="2">
          <input
            type="text"
            class="field"
            name="Bokning:Föreställning"
            required
            bind:value={booking.show} />
          <span class="label">Föreställning</span>
        </label>
        <label class="item">
          <input
            type="date"
            class="field"
            name="Bokning:Datum"
            required
            bind:value={booking.date} />
          <span class="label">Önskat Datum</span>
        </label>
        <label class="item">
          <input
            type="text"
            class="field"
            name="Bokning:Antal"
            required
            bind:value={booking.students} />
          <span class="label">Antal elever</span>
        </label>
        <label class="item">
          <select
            class="field"
            name="Bokning:Skolstadie"
            required
            bind:value={booking.level}>
            <option disabled selected={booking.level == null}>Välj en</option>
            <option>Förskola</option>
            <option>Lågstadie</option>
            <option>Mellanstadie</option>
            <option>Högstadie</option>
            <option>Gymnasium</option>
            <option>Folkhögskola</option>
            <option>Universitet/högskola</option>
          </select>
          <span class="label">Skolstadie</span>
        </label>
        <label class="item">
          <input
            type="text"
            class="field"
            name="Bokning:Årskurs"
            required
            bind:value={booking.grade} />
          <span class="label">Årskurs</span>
        </label>
        <label class="item" style:--span="2">
          <textarea
            rows="5"
            class="field"
            name="Bokning:Övrigt"
            bind:value={booking.other} />
          <span class="label">
            Övrig information
            <br />
            <small>Önskemål, allergier, etc.</small>
          </span>
        </label>
      </div>
    </fieldset>

    {#if result}
      <p
        class="result"
        class:success={result.success}
        class:fail={!result.success}>
        {#if result.success}
          Tack för att du kontaktar oss! Vi återkommer så snart vi kan.
        {:else}
          Något gick visst fel. Försök gärna igen lite senare.
        {/if}
      </p>
    {/if}

    <div class="submit">
      <Button primary type="submit">Skicka</Button>
    </div>
  </div>
</div>

<style>
  .school-booking {
    display: flex;
    flex-wrap: wrap;
    gap: 3.5rem;
  }

  .body {
    flex: 1 0 26rem;
  }

  .body:empty {
    display: none;
  }

  .form {
    flex: 1 1 35rem;
  }

  .grid {
    --cols: 1;

    display: grid;
    gap: 1.5rem;
    grid-template-columns: repeat(var(--cols), minmax(0, 1fr));
  }

  .item {
    grid-column: span var(--span, 1);
    display: flex;
    flex-direction: column-reverse;
  }

  .group {
    padding: 0;
    border: 0;
    margin-top: 3rem;
  }

  .group:first-child {
    margin-top: 0;
  }

  .heading {
    display: block;
    width: 100%;
    margin-bottom: 1rem;
    font-weight: 600;
    font-family: var(--heading-font-family);
    letter-spacing: var(--heading-letter-spacing);
    word-spacing: var(--heading-word-spacing);
    line-height: var(--heading-line-height);
    font-size: 1.5rem;
  }

  .label {
    margin-bottom: 0.25rem;
  }

  .label small {
    font-weight: normal;
  }

  .field[required] + .label::after {
    content: '*';
  }

  .field {
    padding: 0.75em 1em;
    font-size: 1rem;
    line-height: 1;
    border: var(--border-width) solid currentcolor;
    border-radius: var(--border-radius);
    resize: none;
    appearance: none;
  }

  select.field {
    padding-right: 1.5rem;
    background-image: url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20height%3D%2224%22%20viewBox%3D%220%20-960%20960%20960%22%20width%3D%2224%22%3E%3Cpath%20d%3D%22M480-358.463%20253.847-584.615%20296-626.768l184%20184%20184-184%2042.153%2042.153L480-358.463Z%22%2F%3E%3C%2Fsvg%3E');
    background-position: calc(100% - 0.5rem) calc(50% + 0.08rem);
    background-repeat: no-repeat;
  }

  .submit {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin-top: 2rem;
  }

  .result {
    padding: 1rem;
    margin: 1.5rem 0;
    border-radius: var(--border-radius);
    border: var(--border-width) solid currentcolor;
  }

  .success {
    background-color: rgb(var(--color-green));
  }

  .fail {
    background-color: rgb(var(--color-pink));
  }
</style>
