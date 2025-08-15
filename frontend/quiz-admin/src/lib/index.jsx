// src/lib/index.js
import React from "react";
import { createRoot } from "react-dom/client";
import WidgetRoot from "./WidgetRoot.jsx";

// Pull in your Tailwind output/classes once for the widget build
import "../styles/index.css";
import "../styles/styles.css";

/**
* Mount the quiz widget into a DOM node or selector.
* Returns an object with an `unmount()` method.
*/
export function mount(target, props = {}) {
    const el = typeof target === "string" ? document.querySelector(target) : target;
    if (!el) throw new Error("mount(): target not found");
    const root = createRoot(el);
    root.render(<WidgetRoot {...props} />);
    return { unmount: () => root.unmount() };
}


export { default as QuizWidget } from "./WidgetRoot.jsx";