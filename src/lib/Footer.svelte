<script>
  import resolve from './utils/resolve.js'
  import Symbol from '$lib/Symbol.svelte'
  import { onMount } from 'svelte'

  export let settings = {}

  function addLineBreak(text) {
    return text
      .split('\n')
      .reduce(function (rows, row, index, list) {
        rows.push(row, index < list.length - 1 ? '<br />' : null)
        return rows
      }, [])
      .join('')
  }

  settings.menu.unshift({
    primary: { link_text: 'På scen', link: '/scen' },
    items: [
      { link_text: 'Aktuellt', link: '/scen' },
      { link_text: 'Kalendarium', link: '/scen/kalendarium' },
      { link_text: 'Arkiv', link: '/scen/arkiv' }
    ]
  })

  let form
  let input
  let button
  let retries = 0
  let hasForm = false
  onMount(function onmount() {
    if ('mhForm' in window) {
      window.mhForm
        // @ts-ignore
        ?.create({
          formId: '65041cc40c42572840cfc93c',
          target: form,
          insert: 'prepend'
        })
        .then(function () {
          const email = form.querySelector('.mhForm__control--email')
          const firstName = form.querySelector(
            '.mhForm__input[name="contact:firstName"]'
          )
          const lastName = form.querySelector(
            '.mhForm__input[name="contact:lastName"]'
          )
          const _button = form.querySelector('.mhForm__button')

          if (!firstName || !lastName || !_button) {
            throw new Error('Missing fields')
          }

          _button.className = button.className
          _button.innerHTML = button.innerHTML
          _button.onclick = function (event) {
            if (!this.form.checkValidity()) {
              this.form.reportValidity()
              event.preventDefault()
            }
          }

          const name = input.cloneNode()
          name.required = true
          name.type = 'text'
          name.name = 'contact:name'
          name.placeholder = 'Ditt namn'
          name.oninput = function () {
            const names = this.value.split(' ')
            if (names.length > 1) {
              lastName.value = names.pop()
            }
            firstName.value = names.join(' ')
          }

          const emailInput = email.querySelector('input')
          emailInput.required = true

          email.after(name)
          hasForm = true
        })
        .catch(function (err) {
          console.error(err)
          form.classList.add('fallback')
        })
    } else if (retries++ < 4) {
      setTimeout(onmount, 1000)
    }
  })
</script>

<svelte:head>
  <script async src="https://forms.markethype.io/client/script.v2.js"></script>
</svelte:head>

<footer class="footer u-container">
  <div class="main">
    <div class="newsletter">
      <h2>Håll koll på Unga Klara!</h2>
      <p>
        Va först med att veta om våra nya pjäser, senaste biljettsläppen och vad
        som händer på teatern. {#if !hasForm}<a
            target="_blank"
            rel="noopener noreferrer"
            href="https://forms.markethype.io/share/65041cc40c42572840cfc93c">
            Prenumerera på vårt nyhetsbrev
          </a>
          .{/if}
      </p>
      <div class="form">
        <input type="hidden" bind:this={input} />
        <div class="fields" bind:this={form} />
        <div class="u-hiddenVisually">
          <button type="submit" bind:this={button}>
            <span class="u-hiddenVisually">Spara</span>
            <Symbol name="arrow" />
          </button>
        </div>
      </div>
    </div>
    <div class="section">
      <h3 class="title">Kontakt</h3>
      <p>
        {#if settings.phone}
          <a href="tel:{settings.phone}">
            Telefon: <span class="u-textNowrap">{settings.phone}</span>
          </a>
          <br />
        {/if}
        {#if settings.email}
          <a href="mailto:{settings.email}">
            E-mail: <span class="u-textNowrap">{settings.email}</span>
          </a>
          <br />
        {/if}
        {#if resolve(settings.contact_page)}
          <a class="underline" href={resolve(settings.contact_page)}>
            Vår personal
          </a>
          <br />
        {/if}
      </p>
    </div>
    <div class="section">
      <h3 class="title">Hitta hit</h3>
      <address>{@html addLineBreak(settings.address)}</address>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://goo.gl/maps/j4YBCNCLvmKU69E89">
        Visa på karta
      </a>
    </div>
  </div>
  <nav class="nav" id="menu">
    {#each settings.menu as section}
      <div class="section">
        <h3 class="title">
          <a class="link" href="${resolve(section.primary.link)}">
            {section.primary.link_text}
          </a>
        </h3>
        <ul>
          {#each section.items as item}
            <li class="item">
              <a class="link" href={resolve(item.link)}>
                {item.link_text}
              </a>
            </li>
          {/each}
        </ul>
      </div>
    {/each}
  </nav>
  <aside>
    <ul class="social">
      {#each settings.platforms as item}
        <li class="item">
          <a
            class="link"
            target="_blank"
            rel="noopener noreferrer"
            href={resolve(item.link)}>
            <span class="u-hiddenVisually">{item.platform}</span>
            {#if item.platform.toLowerCase().includes('youtube')}
              <svg x="0" y="0" viewBox="0 0 50 50" fill="currentColor">
                <path
                  d="M 44.898438 14.5 C 44.5 12.300781 42.601563 10.699219 40.398438 10.199219 C 37.101563 9.5 31 9 24.398438 9 C 17.800781 9 11.601563 9.5 8.300781 10.199219 C 6.101563 10.699219 4.199219 12.199219 3.800781 14.5 C 3.398438 17 3 20.5 3 25 C 3 29.5 3.398438 33 3.898438 35.5 C 4.300781 37.699219 6.199219 39.300781 8.398438 39.800781 C 11.898438 40.5 17.898438 41 24.5 41 C 31.101563 41 37.101563 40.5 40.601563 39.800781 C 42.800781 39.300781 44.699219 37.800781 45.101563 35.5 C 45.5 33 46 29.398438 46.101563 25 C 45.898438 20.5 45.398438 17 44.898438 14.5 Z M 19 32 L 19 18 L 31.199219 25 Z" />
              </svg>
            {/if}
            {#if item.platform.toLowerCase().includes('instagram')}
              <svg x="0" y="0" viewBox="0 0 30 30" fill="currentColor">
                <path
                  d="M 9.9980469 3 C 6.1390469 3 3 6.1419531 3 10.001953 L 3 20.001953 C 3 23.860953 6.1419531 27 10.001953 27 L 20.001953 27 C 23.860953 27 27 23.858047 27 19.998047 L 27 9.9980469 C 27 6.1390469 23.858047 3 19.998047 3 L 9.9980469 3 z M 22 7 C 22.552 7 23 7.448 23 8 C 23 8.552 22.552 9 22 9 C 21.448 9 21 8.552 21 8 C 21 7.448 21.448 7 22 7 z M 15 9 C 18.309 9 21 11.691 21 15 C 21 18.309 18.309 21 15 21 C 11.691 21 9 18.309 9 15 C 9 11.691 11.691 9 15 9 z M 15 11 A 4 4 0 0 0 11 15 A 4 4 0 0 0 15 19 A 4 4 0 0 0 19 15 A 4 4 0 0 0 15 11 z" />
              </svg>
            {/if}
            {#if item.platform.toLowerCase().includes('facebook')}
              <svg x="0" y="0" viewBox="0 0 50 50" fill="currentColor">
                <path
                  d="M25,3C12.85,3,3,12.85,3,25c0,11.03,8.125,20.137,18.712,21.728V30.831h-5.443v-5.783h5.443v-3.848 c0-6.371,3.104-9.168,8.399-9.168c2.536,0,3.877,0.188,4.512,0.274v5.048h-3.612c-2.248,0-3.033,2.131-3.033,4.533v3.161h6.588 l-0.894,5.783h-5.694v15.944C38.716,45.318,47,36.137,47,25C47,12.85,37.15,3,25,3z" />
              </svg>
            {/if}
          </a>
        </li>
      {/each}
    </ul>
    <ul class="terms">
      {#each settings.terms as item}
        <li class="item">
          <a class="link" href={resolve(item.link)}>
            {item.link_text}
          </a>
        </li>
      {/each}
    </ul>
  </aside>
</footer>

<style>
  .footer {
    padding: clamp(8rem, 14vw, 14rem) 0 2rem;
  }

  .main {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border-bottom: var(--border-width) solid;
    padding-bottom: 3rem;
    margin-bottom: 1rem;
  }

  @media (min-width: 450px) {
    .main {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (min-width: 1000px) {
    .footer {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: clamp(1rem, 12vw, 3rem) clamp(5rem, 5vw, 6rem);
    }

    .main {
      border: 0;
      padding: 0;
      margin: 0;
    }
  }

  .newsletter {
    grid-column: span 2;
  }

  nav {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem 1rem;
    scroll-margin-top: calc(1rem - 1px);
  }

  @media (min-width: 600px) and (max-width: 899px), (min-width: 1200px) {
    .nav {
      grid-template-columns: 1fr 1fr 1fr;
      gap: 1rem 1.5rem;
    }
  }

  aside {
    grid-column: span 2;
    border-top: var(--border-width) solid;
    padding-top: 0.75rem;
    margin-top: 3rem;
    display: flex;
    justify-content: space-between;
  }

  @media (min-width: 1000px) {
    aside {
      margin-top: 1rem;
    }
  }

  @media (min-width: 400px) {
    .terms {
      display: flex;
      gap: 1.25rem;
    }
  }

  h2 {
    margin: -0.25rem 0 0.75rem;
    font-family: var(--heading-font-family);
    letter-spacing: var(--heading-letter-spacing);
    word-spacing: var(--heading-word-spacing);
    font-size: 1.8rem;
    font-weight: 600;
    line-height: 1.1;
    text-wrap: balance;
  }

  .newsletter p {
    font-size: 1.125rem;
    max-width: 26em;
    text-wrap: balance;
  }

  .newsletter a {
    text-decoration: underline;
  }

  .form {
    display: flex;
    width: auto;
    max-width: 38rem;
    margin: 1rem 0 2rem;
  }

  input {
    width: 100%;
    border: var(--border-width) solid;
    padding: 0.76rem;
    font-size: inherit;
    margin-left: calc(var(--border-width) * -1);
    border-right: 0;
  }

  input:first-child {
    border-radius: var(--border-radius) 0 0 var(--border-radius);
    margin-left: 0;
    border-right-width: var(--border-width);
  }

  input::placeholder {
    color: inherit;
    opacity: 1;
  }

  input:focus {
    outline: 0 !important;
  }

  button {
    display: block;
    background: black;
    color: white;
    border-radius: 0 var(--border-radius) var(--border-radius) 0;
    cursor: pointer;
    padding: 0.7rem 1rem;
  }

  @media (min-width: 500px) {
    input,
    button {
      padding: 1rem;
    }
  }

  @media (min-width: 500px) {
    h2 {
      font-size: 2rem;
    }
  }

  .title {
    margin-bottom: 0.25rem;
    font-family: 'UK';
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .item {
    padding: 0.15rem 0;
  }

  .footer a {
    border-radius: 1px;
  }

  .footer a:hover,
  .footer a:active {
    outline: 0.2rem solid rgb(var(--document-color)) !important;
    background: rgb(var(--document-color));
    color: rgb(255, 255, 255);
    mix-blend-mode: darken;
  }

  .social {
    display: flex;
    gap: 0.75rem;
  }

  .social a {
    display: block;
    width: 1.75rem;
    height: 1.75rem;
  }

  svg {
    display: block;
  }

  :global(.mhForm) {
    display: flex;
  }

  :global(.mhForm .mhForm__control) {
    margin: 0;
  }

  :global(.mhForm__label) {
    border: 0 !important;
    clip: rect(1px, 1px, 1px, 1px) !important;
    height: 1px !important;
    overflow: hidden !important;
    padding: 0 !important;
    position: absolute !important;
    width: 1px !important;
  }

  :global(:is(.mhForm__control--email, .mhForm__control--text)) {
    display: flex;
    width: 100%;
    border: var(--border-width) solid;
    margin-left: calc(var(--border-width) * -1);
    border-right: 0;
  }

  :global(:is(.mhForm__control--email, .mhForm__control--text)):first-child {
    border-radius: var(--border-radius) 0 0 var(--border-radius);
    margin-left: 0;
    border-right-width: var(--border-width);
  }

  .fields:not(.fallback)
    :global(
      .mhForm__control:not(.mhForm__control--email, .mhForm__control--button)
    ) {
    display: none;
  }

  :global(.mhForm .mhForm__input) {
    width: 100%;
    border: 0;
    padding: 0.76rem;
    border-radius: 0;
    font-size: inherit;
    font-family: inherit;
  }

  :global(.mhForm__input)::placeholder {
    color: inherit;
    opacity: 1;
  }

  :global(.mhForm__input):focus {
    outline: 0 !important;
  }

  :global(.mhForm__success ~ *) {
    display: none;
  }

  :global(.mhForm :is(.mhForm__success, .mhForm__error)) {
    font-size: 1.125rem;
    max-width: 26em;
    text-wrap: balance;
    background: transparent;
    color: currentColor;
    padding: 0;
  }

  :global(.mhForm__validationError) {
    display: none;
  }

  @media (min-width: 500px) {
    :global(.mhForm__input) {
      padding: 1rem;
    }
  }
</style>
