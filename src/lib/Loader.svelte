<script>
  export let length = 3

  $: content = '⏳'
    .repeat(length)
    .split('')
    .reduce(function (str, char) {
      if (Math.random() > 0.7) char += ' '
      return str + char
    }, '')
</script>

<span class="u-loading">${content}</span>
`
