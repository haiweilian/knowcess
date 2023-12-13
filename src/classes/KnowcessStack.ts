import { transition } from '../utils/transition'
import { Knowcess } from './Knowcess'

export class KnowcessStack {
  private name: string
  private knowcess: Knowcess
  private rootElement: HTMLElement
  private stackElement: HTMLElement
  private stackValueElement: HTMLElement

  constructor(name: string, knowcess: Knowcess, rootElement: HTMLElement) {
    this.name = name
    this.knowcess = knowcess
    this.rootElement = rootElement
    this.stackElement = rootElement.querySelector('.knowcess-stacks')!

    const stackItemElement = document.createElement('div')
    stackItemElement.className = 'knowcess-stacks-item'

    const stackLabelElement = document.createElement('div')
    stackLabelElement.className = 'knowcess-stacks-label'
    stackLabelElement.innerText = name

    const stackValueElement = document.createElement('div')
    stackValueElement.className = 'knowcess-stacks-value'
    this.stackValueElement = stackValueElement

    stackItemElement.appendChild(stackLabelElement)
    stackItemElement.appendChild(stackValueElement)
    this.stackElement.appendChild(stackItemElement)
  }

  /**
   * Reset state
   */
  reset() {
    this.stackValueElement.innerHTML = ''
  }

  /**
   * Add action in current step
   * @param fn
   */
  action(fn: (animate: boolean) => any) {
    this.knowcess.action(fn)
    return this
  }

  /**
   * Activate the current element
   */
  activate() {
    this.action((animate) => {
      const span = this.stackValueElement.lastElementChild! as HTMLSpanElement
      return transition(span, { 'background-color': '#ffdf1e' }, 0.2, animate)
    })
  }

  /**
   * Add element at the end of stack
   * @param text
   */
  push(text: string) {
    this.action((animate) => {
      const span = document.createElement('span')
      span.textContent = text
      this.stackValueElement.appendChild(span)
      return transition(span, { opacity: 1 }, 0.2, animate)
    })
  }

  /**
   * Remove element at the end of stack
   */
  pop() {
    this.action((animate) => {
      const span = this.stackValueElement.lastElementChild! as HTMLSpanElement
      return transition(span, { opacity: 0 }, 0.2, animate).then(() => {
        this.stackValueElement.removeChild(span)
      })
    })
  }

  /**
   * Remove element at the head of stack
   */
  shift() {
    this.action((animate) => {
      const span = this.stackValueElement.firstElementChild! as HTMLSpanElement
      return transition(span, { opacity: 0 }, 0.2, animate).then(() => {
        this.stackValueElement.removeChild(span)
      })
    })
  }
}
