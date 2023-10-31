<script>
  import Symbol from './Symbol.svelte'

  /** @type {null|'InStock'|'FewLeft'|'SoldOut'} */
  export let status = null

  /** @type {Date} */
  export let date

  export let location = null
  export let href = null
  export let name = null
</script>

<article class="ticket" class:disabled={status === 'SoldOut'}>
  <div class="everything u-paddedBox">
    <div class="main">
      <div>
        <strong class="day">
          {date.toLocaleString('sv', { weekday: 'long' })}
        </strong>
        {#if status && status !== 'InStock'}
          <span class="status u-textLabel">
            {status === 'FewLeft' ? 'Fåtal kvar' : 'Slutsåld'}
          </span>
        {/if}
      </div>
      <time datetime={date.toJSON()}>
        <span class="date">{date.getDate()}</span>
        <span class="month u-textLabel">
          {date.toLocaleDateString('sv', { month: 'long' })}
        </span>
      </time>
    </div>
    <div class="details">
      <div>
        {#if name}
          <strong class="detail">
            {name}
          </strong>
        {/if}
        <span class="detail">
          <span class="icon"><Symbol name="clock" /></span>
          {date.toLocaleString('sv', {
            hour: '2-digit',
            minute: '2-digit',
            hourCycle: 'h23'
          })}
        </span>
        {#if location}
          <span class="detail">
            <span class="icon"><Symbol name="location" /></span>
            {location}
          </span>
        {/if}
      </div>
      {#if href && status !== 'SoldOut'}
        <a
          {href}
          on:click
          class="link"
          target="_blank"
          rel="noopener noreferrer">
          <span class="u-hiddenVisually">Boka biljett</span>
        </a>
      {/if}
    </div>
  </div>
</article>

<style>
  .ticket {
    width: 100%;
    position: relative;
  }

  .everything {
    height: 100%;
    position: relative;
    z-index: 1;
    background-color: rgb(var(--theme-color));
    font-size: 1.125rem;
    user-select: none;
    color: rgb(var(--theme-color-is-dark, 0, 0, 0));
    border-radius: var(--border-radius);
    border: 2px solid black;
  }

  .disabled .everything {
    color: rgb(108, 109, 112);
    background: rgb(218, 220, 226);
    box-shadow: none;
  }

  .ticket:not(.disabled) .everything {
    transition: transform 150ms 20ms var(--ease-out);
  }

  .ticket:not(.disabled):hover .everything {
    transform: translateY(-0.8rem);
  }

  .ticket:not(.disabled)::before {
    content: '';
    display: block;
    width: 92%;
    height: 100%;
    position: absolute;
    left: 4%;
    bottom: 0;
    z-index: -1;
    background: black;
    border-radius: var(--border-radius);
  }

  .main {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 2rem;

    font-weight: 600;
    text-align: right;
    font-family: var(--heading-font-family);
    line-height: var(--heading-line-height);
  }

  .day {
    display: block;
    margin-bottom: 0.4em;
    text-align: left;
    text-transform: capitalize;
  }

  .status {
    display: inline-block;
    padding: 0.5em 0.7em;
    color: #fff;
    background-color: #000;
    border-radius: var(--border-radius);
  }

  .disabled .status {
    opacity: 0.5;
  }

  .icon {
    font-size: 0.8em;
    position: relative;
    top: -0.1em;
    left: -0.2em;
  }

  .date {
    display: inline-block;
    margin-bottom: 0.25em;
    margin-right: -0.05em;
    font-size: 3.75rem;
    line-height: 0.7;
  }

  .details {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: flex-end;
  }

  .detail {
    display: flex;
    flex-wrap: nowrap;
    align-items: baseline;
  }

  strong.detail {
    font-weight: 600;
    font-family: var(--heading-font-family);
    line-height: var(--heading-line-height);
    margin-bottom: 0.25em;
  }

  .link {
    display: inline-block;
    margin-top: 0.45rem;
    margin-bottom: -0.35em;
    font-size: 1.5rem;
  }

  .link::before {
    content: '';
    position: absolute;
    inset: 0;
  }
</style>
