import { KnowcessStack } from './KnowcessStack';
export interface KnowcessOptions {
    root: string;
    code: string;
    direction?: 'vertical' | 'horizontal';
    linePosition?: number;
}
export declare class Knowcess {
    options: KnowcessOptions;
    private rootElement;
    private codeElement;
    private backElement;
    private forwardElement;
    private lineElement;
    private lineElementHeight;
    private commentaryElement;
    private queue;
    private steps;
    private currentStep;
    stacks: KnowcessStack[];
    constructor(options: KnowcessOptions);
    /**
     * Reset state
     */
    reset(): void;
    /**
     * Define stack
     * @param name
     */
    createStack(name: string): KnowcessStack;
    /**
     * Define step
     * @param fn
     */
    step(fn: Function): this;
    /**
     * Add action in current step
     * @param fn
     */
    action(fn: (animate: boolean) => any): this;
    /**
     * To [pos] step
     * @param pos
     */
    go(pos: number): void;
    /**
     * Back one step
     */
    back(): void;
    /**
     * Forward one step
     * @param animate
     */
    forward(animate?: boolean): void;
    /**
     * Show line mask
     */
    showLine(): this;
    /**
     * Hide line mask
     */
    hideLine(): this;
    /**
     * Move to [num] line code
     * @param num
     */
    moveLine(num: number, tag?: string): this;
    /**
     * Show commentary mask
     * @param text
     */
    showCommentary(text: string): this;
    /**
     * Hide commentary mask
     */
    hideCommentary(): this;
}
