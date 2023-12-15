import { transition } from '../utils/transition'
import { KnowcessStack } from './KnowcessStack'

export interface KnowcessOptions {
  root: string
  code: string
  direction?: 'vertical' | 'horizontal'
  linePosition?: number
  // playInterval?: number
}

const defaultKnowcessOptions: Partial<KnowcessOptions> = {
  direction: 'vertical',
  linePosition: 3,
  // playInterval: 100,
}

export class Knowcess {
  options: KnowcessOptions

  private rootElement: HTMLElement
  private codeElement: HTMLElement
  private backElement: HTMLElement
  private forwardElement: HTMLElement
  private lineElement: HTMLElement
  private lineElementHeight: number
  private commentaryElement: HTMLElement

  private queue: Promise<any> = Promise.resolve()
  private steps: Function[][] = []
  private currentStep = 0

  public stacks: KnowcessStack[] = []

  constructor(options: KnowcessOptions) {
    this.options = Object.assign(defaultKnowcessOptions, options)

    this.rootElement = document.querySelector(this.options.root)!
    this.rootElement.innerHTML = template(this.options)

    this.codeElement = this.rootElement.querySelector('.knowcess-code')!
    this.codeElement.innerHTML = this.options.code

    this.backElement = this.rootElement.querySelector('.knowcess-action-back')!
    this.backElement.addEventListener('click', (event) => {
      event.preventDefault()
      this.back()
    })

    this.forwardElement = this.rootElement.querySelector('.knowcess-action-forward')!
    this.forwardElement.addEventListener('click', (event) => {
      event.preventDefault()
      this.forward()
    })

    this.lineElement = this.rootElement.querySelector('.knowcess-line')!
    this.lineElementHeight = this.lineElement.getBoundingClientRect().height
    this.lineElement.style.top = `${(this.options.linePosition! - 1) * this.lineElementHeight}px`

    this.commentaryElement = this.rootElement.querySelector('.knowcess-commentary')!
  }

  /**
   * Reset state
   */
  reset() {
    this.currentStep = 0
    this.codeElement.style.transform = ''
    this.lineElement.style.opacity = ''
    this.commentaryElement.style.opacity = ''
    this.stacks.forEach((stack) => {
      stack.reset()
    })
  }

  /**
   * Define stack
   * @param name
   */
  createStack(name: string) {
    const stack = new KnowcessStack(name, this, this.rootElement)
    this.stacks.push(stack)
    return stack
  }

  /**
   * Define step
   * @param fn
   */
  step(fn: Function) {
    this.steps.push([])
    fn()
    return this
  }

  /**
   * Skip [num] step
   */
  skip(num: number) {
    this.currentStep += num
  }

  /**
   * Add action in current step
   * @param fn
   */
  action(fn: (animate: boolean) => any) {
    this.steps[this.steps.length - 1].push(fn)
    return this
  }

  /**
   * To [pos] step
   * @param pos
   */
  go(pos: number) {
    this.queue = this.queue.then(() => {
      this.reset()
      while (pos--) {
        this.forward(false)
      }
    })
  }

  /**
   * Back one step
   */
  back() {
    this.queue = this.queue.then(() => {
      if (this.currentStep === 0) {
        this.go(this.steps.length)
      } else {
        this.go(this.currentStep - 1)
      }
    })
  }

  /**
   * Forward one step
   * @param animate
   */
  forward(animate = true) {
    this.queue = this.queue.then(() => {
      const step = this.steps[this.currentStep]
      if (step) {
        this.currentStep++
        return Promise.all(step.map((fn) => fn(animate)))
      } else {
        this.go(0)
      }
    })
  }

  /**
   * Show line mask
   */
  showLine() {
    return this.action((animate) => {
      return transition(this.lineElement, { opacity: 1 }, 0.2, animate)
    })
  }

  /**
   * Hide line mask
   */
  hideLine() {
    return this.action((animate) => {
      return transition(this.lineElement, { opacity: 0 }, 0.2, animate)
    })
  }

  /**
   * Move to [num] line code
   * @param num
   */
  moveLine(num: number, tag?: string) {
    return this.action((animate) => {
      const y = (num - this.options.linePosition!) * -this.lineElementHeight
      return transition(this.codeElement, { transform: `translateY(${y}px)` }, 0.3, animate)
    })
  }

  /**
   * Show commentary mask
   * @param text
   */
  showCommentary(text: string) {
    return this.action((animate) => {
      this.commentaryElement.textContent = text
      return transition(this.commentaryElement, { opacity: 1 }, 0.2, animate)
    })
  }

  /**
   * Hide commentary mask
   */
  hideCommentary() {
    return this.action((animate) => {
      this.commentaryElement.textContent = ''
      return transition(this.commentaryElement, { opacity: 0 }, 0.2, animate)
    })
  }

  /**
   * Update commentary mask
   */
  updateCommentary(text: string) {
    return this.action((animate) => {
      this.commentaryElement.textContent = text
    })
  }
}

function template(options: KnowcessOptions) {
  return `
<div class="knowcess knowcess-${options.direction}">
  <div class="knowcess-source">
    <div class="knowcess-line"></div>
    <div class="knowcess-code">
      <!-- code slot  -->
    </div>
  </div>
  <div class="knowcess-interactive">
    <div class="knowcess-stacks">
      <!-- stacks slot  -->
    </div>
    <div class="knowcess-action">
      <div>
        <!-- <span title="Play" class="knowcess-action-play">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="m9.5 16.5l7-4.5l-7-4.5v9ZM12 22q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Z"
            />
          </svg>
        </span>
        <span title="Pause" class="knowcess-action-pause">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M9 16h2V8H9v8Zm4 0h2V8h-2v8Zm-1 6q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Z"
            />
          </svg>
        </span> -->
      </div>
      <div>
        <span title="Back" class="knowcess-action-back">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="m12 16l1.4-1.4l-1.6-1.6H16v-2h-4.2l1.6-1.6L12 8l-4 4l4 4Zm0 6q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Z"
            />
          </svg>
        </span>
        <span title="Forward" class="knowcess-action-forward">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="m12 16l4-4l-4-4l-1.4 1.4l1.6 1.6H8v2h4.2l-1.6 1.6L12 16Zm0 6q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Z"
            />
          </svg>
        </span>
      </div>
    </div>
  </div>
  <div class="knowcess-commentary">
    <!-- commentary slot  -->
  </div>
</div>
`
}
