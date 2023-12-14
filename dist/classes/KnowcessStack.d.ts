import { Knowcess } from './Knowcess';
export declare class KnowcessStack {
    private name;
    private knowcess;
    private rootElement;
    private stackElement;
    private stackValueElement;
    constructor(name: string, knowcess: Knowcess, rootElement: HTMLElement);
    /**
     * Reset state
     */
    reset(): void;
    /**
     * Add action in current step
     * @param fn
     */
    action(fn: (animate: boolean) => any): this;
    /**
     * Activate the current element
     */
    activate(): void;
    /**
     * Add element at the end of stack
     * @param text
     */
    push(text: string | {
        text: string;
        class?: string;
        style?: Record<string, any>;
    }): void;
    /**
     * Remove element at the end of stack
     */
    pop(): void;
    /**
     * Remove element at the head of stack
     */
    shift(): void;
}
