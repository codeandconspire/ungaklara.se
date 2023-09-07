<script>
  import { createEventDispatcher } from 'svelte'

  import Button from './Button.svelte'

  const dispatch = createEventDispatcher()
  const onchange = (event) =>
    dispatch('select', { [event.target.name]: event.target.value })

  const years = []
  const decade = String(new Date().getFullYear()).replace(/\d$/, '0')
  for (let year = +decade; +year >= 1970; year -= 10) {
    years.push(String(year))
  }

  export let tags = []

  /** @type {string?} */
  export let tag = null

  /** @type {string?} */
  export let period = null
</script>

<form class="filter" method="GET">
  <fieldset class="tags">
    <span class="label">Visa:</span>
    <label class="u-inlineBlock">
      <input
        class="toggle"
        type="radio"
        name="tag"
        value=""
        checked={!tag}
        on:change={onchange} />
      <span class="label interactive">Alla</span>
    </label>
    {#each tags as _tag}
      <label class="u-inlineBlock">
        <input
          class="toggle"
          type="radio"
          name="tag"
          value={_tag}
          checked={_tag === tag}
          on:change={onchange} />
        <span class="label interactive">{_tag}</span>
      </label>
    {/each}
  </fieldset>
  <label class="decade">
    <span class="label">Tidsperiod:</span>
    <select name="period" class="select" on:change={onchange}>
      <option value="" selected={!years.includes(period)}>Allt</option>
      {#each years as year}
        <option value={year} selected={year === period}>
          {year}-tal
        </option>
      {/each}
    </select>
  </label>
  <Button type="submit" class="u-js-hiddenVisually u-nudgeMd">Visa</Button>
</form>

<style>
  .filter {
    display: flex;
    flex-wrap: wrap-reverse;
    align-items: baseline;
    justify-content: space-between;
    margin: -0.75em 0 0.75em;
    user-select: none;
  }

  @media (min-width: 800px) {
    .filter {
      font-size: 1.125rem;
    }
  }

  .tags {
    flex: 1 0 auto;
    display: inline-block;
    padding: 0;
    border: 0;
    margin: 0.35em 0.5em 0.75em 0;
  }

  @media (max-width: 599px) {
    .tags {
      flex: 1 1 100%;
    }
  }

  .toggle {
    font-size: 0;
    opacity: 0;
    position: absolute;
  }

  .label {
    display: inline-block;
    margin-right: 0.6em;
    text-underline-offset: 0.25em;
    text-decoration-thickness: var(--border-width);
    font-weight: 600;
    font-family: var(--heading-font-family);
    line-height: var(--heading-line-height);
    letter-spacing: var(--heading-letter-spacing);
    word-spacing: var(--heading-word-spacing);
  }

  .interactive:hover,
  .toggle:checked + .label {
    text-decoration: underline;
  }

  .interactive {
    cursor: pointer;
  }

  .decade {
    display: flex;
    align-items: center;
    margin: 0.75em 0;
  }

  @media (max-width: 599px) {
    .decade {
      flex: 1 1 100%;
    }
  }

  .select {
    padding: 0.5em 3em 0.5em 1em;
    border: 0;
    margin-left: 0.3em;
    font-weight: 600;
    font-family: var(--heading-font-family);
    line-height: var(--heading-line-height);
    letter-spacing: var(--heading-letter-spacing);
    word-spacing: var(--heading-word-spacing);
    background-color: #fff;
    background-image: url('/arrow.svg');
    background-position: calc(100% - 1em) 50%;
    background-size: 0.7em 0.45em;
    background-repeat: no-repeat;
    border-radius: 0;
    -webkit-appearance: none;
    appearance: none;
    border-radius: var(--border-radius);
  }

  @media (min-width: 800px) {
    .select {
      width: 12em;
    }
  }
</style>
