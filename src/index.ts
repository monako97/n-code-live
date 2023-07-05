import { transform } from "sucrase";
import type { MDXComponents, TransformOption } from "../index";
import type { Component } from "solid-js";

function isFunction(
  target: any
): target is VoidFunction & ((...v: any[]) => any) {
  return [
    "[object Function]",
    "[object AsyncFunction]",
    "[object GeneratorFunction]",
    "[object Proxy]",
  ].includes(Object.prototype.toString.call(target));
}
class CodeLive extends HTMLElement {
  timer?: NodeJS.Timeout;
  _source?: string;
  _error?: Error;
  _scope?: MDXComponents = {};
  _transform?: TransformOption = {};
  _renderJsx = function (
    dom: Component,
    root = this.shadowRoot
  ): VoidFunction | void {
    return isFunction(dom) ? dom() : (dom as unknown as VoidFunction);
  };
  scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/;
  box: HTMLDivElement;
  cleanup?: VoidFunction | void;
  static get observedAttributes() {
    return ["jsx", "scope", "source", "transform", "renderJsx"];
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.box = document.createElement("div");
    this.box.setAttribute("part", "root");
  }

  compilerScript(code: string, scope = {}) {
    return new Function(...Object.keys(scope), code)(...Object.values(scope));
  }
  compiler(code?: string, scope?: MDXComponents) {
    if (!code) return null;

    const scopes = { ...scope };
    const codeTrimmed = code
      .trim()
      .replace(/;$/, "")
      .replace(/export /g, "");
    const _source = (
      codeTrimmed.includes("render(") ? `() => {${codeTrimmed}}` : codeTrimmed
    ).replace("render(", "return (");

    return new Function(
      ...Object.keys(scopes),
      transform(`return (${_source})`, {
        transforms: ["jsx", "typescript", "imports"],
        jsxPragma: "jsx",
        jsxFragmentPragma: "Fragment",
        jsxImportSource: "solid-js/h",
        production: true,
        ...this.transform,
      }).code
    )(...Object.values(scopes));
  }
  get renderJsx() {
    return this._renderJsx;
  }
  set renderJsx(next) {
    this._renderJsx = next;
    this.mount();
  }
  get error(): string {
    if (!this._error) return null;
    let msg = "";
    const msgs = this._error.stack?.split("\n");

    for (let i = 0, len = msgs.length - 1; i < len; i++) {
      msg += `<div>${msgs[i]}</div>`;
    }
    return `<details style="color: red;" part="error">
    <summary>
      ${this._error.name}: ${this._error.message}
    </summary>
    ${msg}
  </details>`;
  }

  set error(next: Error) {
    this._error = next;

    this.box.innerHTML = this.error;
    this.shadowRoot.replaceChildren(this.box);
  }
  get transform() {
    return this._transform;
  }
  set transform(next: TransformOption) {
    this._transform = next;
    this.mount();
  }
  get scope() {
    return this._scope;
  }
  set scope(next: MDXComponents) {
    this._scope = next;
    this.mount();
  }
  get source(): string {
    return this._source;
  }
  set source(next: string) {
    this._source = next;
    this.mount();
  }
  get jsx(): boolean {
    return this.getAttribute("jsx") === "true";
  }
  set jsx(next: string) {
    this.setAttribute("jsx", next);
    this.mount();
  }

  mount() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      clearTimeout(this.timer);
      if (isFunction(this.cleanup)) {
        this.cleanup();
        this.cleanup = null;
      }
      try {
        this.error = null;
        if (this.jsx) {
          this.box.replaceChildren();
          const comp = this.compiler(this.source, this.scope);

          this.cleanup = this.renderJsx(comp, this.shadowRoot);
          return;
        }

        this.box.innerHTML = this.source?.replace(this.scriptRegex, "");
        this.shadowRoot.replaceChildren(this.box);

        const match = this.source?.match(this.scriptRegex);
        if (match) {
          this.compilerScript(match[1], { container: this.shadowRoot });
        }
      } catch (error) {
        this.error = error;
      }
    }, 8);
  }
  attributeChangedCallback(name: "jsx", old: string, next: string) {
    if (old !== next && name === "jsx") {
      this.jsx = next;
    }
  }

  connectedCallback() {
    this.mount();
  }
}

if (!customElements.get("n-code-live")) {
  customElements.define("n-code-live", CodeLive);
}

export default CodeLive;
