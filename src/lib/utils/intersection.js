/**
 * @param {HTMLElement} node
 * @param {{ onintersect: function(IntersectionObserverEntry): void, once?: boolean, threshold?: number|number[] }|function(IntersectionObserverEntry): void} options
 * @returns {{ update: function(function(IntersectionObserverEntry): void|{ onintersect: function(IntersectionObserverEntry): void }): void, destroy: function(): void }}
 */
export function intersection(node, options) {
  let { onintersect, once = false } =
    typeof options === 'function'
      ? { onintersect: options, once: true }
      : options

  const observer = new IntersectionObserver(
    function ([entry]) {
      onintersect(entry)
      if (once && entry.isIntersecting) observer.disconnect()
    },
    // @ts-ignore
    {
      threshold: once
        ? undefined
        : Array(100)
            .fill(0)
            .map((_, i) => i * 0.01)
            .concat(1)
    }
  )

  observer.observe(node)

  return {
    /** @type {function({ onintersect: function(IntersectionObserverEntry): void }|function(IntersectionObserverEntry): void): void}} */
    update(options) {
      onintersect =
        typeof options === 'function' ? options : options.onintersect
    },
    destroy() {
      observer.disconnect()
    }
  }
}
