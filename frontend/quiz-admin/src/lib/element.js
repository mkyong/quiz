// src/lib/element.js
import { mount } from "./index.js";

export function defineQuizElement(tagName = "quiz-app") {
    if (customElements.get(tagName)) return; // no-op if already defined

    class QuizAppElement extends HTMLElement {
        connectedCallback() {
            if (this._mounted) return;
            const props = {
                apiBase: this.getAttribute("api-base") || undefined,
            };
            // Mount directly into the element (no Shadow DOM so Tailwind styles apply)
            this._instance = mount(this, props);
            this._mounted = true;
        }
        disconnectedCallback() {
            this._instance?.unmount?.();
            this._mounted = false;
        }
    }

    customElements.define(tagName, QuizAppElement);
}