export const transition = (
  el: HTMLElement,
  obj: Record<string, any>,
  duration: number,
  animate = true,
  easing = 'ease-in-out'
) => {
  return new Promise<void>((resolve) => {
    const keys = Object.keys(obj)

    if (animate) {
      el.style.transitionProperty = keys.join()
      el.style.transitionDuration = `${duration}s`
      el.style.transitionTimingFunction = easing
      // eslint-disable-next-line no-unused-expressions
      el.offsetLeft // hack

      el.addEventListener('transitionend', function te() {
        el.style.transitionProperty = ''
        el.style.transitionTimingFunction = ''
        el.style.transitionDuration = ''
        resolve()
        el.removeEventListener('transitionend', te)
      })
    } else {
      resolve()
    }

    keys.forEach((key) => {
      el.style.setProperty(key, obj[key])
    })
  })
}
