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
  _shadow?: boolean;
  _components?: MDXComponents = {};
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
    return ["jsx", "components", "source", "transform", "renderJsx"];
  }
  constructor() {
    super();
    this._shadow = this.getAttribute("shadow") !== "false";
    this.box = document.createElement("div");
    this.box.setAttribute("part", "root");
  }

  compilerScript(code: string, component = {}) {
    return new Function(...Object.keys(component), code)(...Object.values(component));
  }
  compiler(code?: string, component?: MDXComponents) {
    if (!code) return null;
    const { default: s, ...components } = component;
    const codeTrimmed = code
      .trim()
      .replace(/;$/, "")
      .replace(/export /g, "");
    const _source = (
      codeTrimmed.includes("render(") ? `() => {${codeTrimmed}}` : codeTrimmed
    ).replace("render(", "return (");

    return new Function(
      ...Object.keys(components),
      transform(
        `return (${/^<[\s\S]*>$/.test(_source) ? `<>${_source}</>` : _source})`,
        {
          transforms: ["jsx", "typescript", "imports"],
          jsxPragma: "jsx",
          jsxFragmentPragma: "Fragment",
          jsxImportSource: "solid-js/h",
          production: true,
          ...this.transform,
        }
      ).code
    )(...Object.values(components));
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
    return `<details style="color: red;" part="error"><summary>${this._error.name}: ${this._error.message}</summary>${msg}</details>`;
  }

  set error(next: Error) {
    this._error = next;
    this.box.innerHTML = this.error;
    if (this._shadow) {
      this.shadowRoot.replaceChildren(this.box);
    } else {
      this.replaceChildren(this.box);
    }
  }
  get transform() {
    return this._transform;
  }
  set transform(next: TransformOption) {
    this._transform = next;
    this.mount();
  }
  get components() {
    return this._components;
  }
  set components(next: MDXComponents) {
    this._components = next;
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
          const comp = this.compiler(this.source, this.components);

          this.cleanup = this.renderJsx(comp, this.box);
          return;
        }
        this.box.innerHTML = this.source?.replace(this.scriptRegex, "");

        if (this._shadow) {
          this.shadowRoot.replaceChildren(this.box);
        } else {
          this.replaceChildren(this.box);
        }
        const match = this.source?.match(this.scriptRegex);
        if (match) {
          this.compilerScript(match[1], {
            ...this.components,
            container: this._shadow ? this.shadowRoot : this,
          });
        }
      } catch (error) {
        this.error = error;
      }
    }, 8);
  }
  attributeChangedCallback(name: string, old: string, next: string) {
    if (old !== next && name === "jsx") {
      this.jsx = next;
    } else if (name === "shadow") {
      // 当 shadow 属性变化时更新 _shadow
      this._shadow = next !== "false";
      // 如果需要的话，这里可以重新挂载内容
      this.mount();
    }
  }

  connectedCallback() {
    this._shadow = this.getAttribute("shadow") !== "false";
    // 在这里初始化 shadow
    if (this._shadow) {
      this.attachShadow({ mode: "open" });
    }
    this.mount();
  }
}

if (!customElements.get("n-code-live")) {
  customElements.define("n-code-live", CodeLive);
}

export default CodeLive;
