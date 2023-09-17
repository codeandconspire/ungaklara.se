export function intersection(node, onintersect) {
  const observer = new IntersectionObserver(function ([entry]) {
    if (entry.isIntersecting) {
      observer.disconnect()
      onintersect()
    }
  })

  observer.observe(node)

  return {
    update(next) {
      onintersect = next
    },
    destroy() {
      observer.disconnect()
    }
  }
}
