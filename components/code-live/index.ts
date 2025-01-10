import type { JSXElement } from 'solid-js';
import { isFunction } from '@moneko/common';

export class CodeLive extends HTMLElement {
  timer?: NodeJS.Timeout;
  connected = false;
  _source?: string;
  _error?: Error;
  _components?: MDXComponents = {};
  _transform?: TransformOption = {};
  _renderJsx = function (
    dom: (...args: Any) => JSX.Element,
    root: ShadowRoot | HTMLElement,
  ): VoidFunction | void {
    return dom(root);
  };
  _worker: Worker | undefined;
  _style: HTMLStyleElement | undefined;
  scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/;
  cleanup?: VoidFunction | void;
  static get observedAttributes() {
    return ['jsx', 'components', 'source', 'transform', 'renderJsx'];
  }
  workerMessage(e: MessageEvent<string>) {
    const code = e.data;

    try {
      const comp = this.compilerScript(code);

      this.dispose();
      this.cleanup = this.renderJsx(comp, this.container);
    } catch (error) {
      this.error = error as Error;
    }
  }
  compilerScript(code: string, component = {}) {
    const components = Object.assign(this.components, component);

    return new Function(...Object.keys(components), code)(...Object.values(components));
  }
  get renderJsx() {
    return this._renderJsx;
  }
  set renderJsx(next) {
    this._renderJsx = next;
    this.mount();
  }
  get error(): string | void {
    if (!this._error) return;
    let msg = '';
    const msgs = this._error.stack?.split('\n') || [];

    for (let i = 0, len = msgs.length - 1; i < len; i++) {
      msg += `<div>${msgs[i]}</div>`;
    }
    return `<details style="color: red;" part="error"><summary>${this._error.name}: ${this._error.message}</summary>${msg}</details>`;
  }

  set error(next: Error | undefined) {
    this._error = next;
    if (next) {
      this.container.innerHTML = this.error as string;
    }
  }
  get transform() {
    return this._transform!;
  }
  set transform(next: TransformOption) {
    this._transform = next;
    this.mount();
  }
  get components() {
    return this._components!;
  }
  set components(next: MDXComponents) {
    this._components = next;
    this.mount();
  }

  get source(): string {
    return this._source || '';
  }
  set source(next: string) {
    this._source = next;
    this.mount();
  }

  setupWorker(enable: boolean) {
    if (enable) {
      if (!this._worker) {
        this._worker = new Worker(new URL('./worker.ts', import.meta.url));
        this._worker.addEventListener('message', this.workerMessage.bind(this));
      }
    } else if (this._worker) {
      this._worker.removeEventListener('message', this.workerMessage.bind(this));
      this._worker.terminate();
      this._worker = void 0;
    }
  }
  get jsx(): boolean {
    return this.getAttribute('jsx') === 'true';
  }
  set jsx(next: boolean) {
    this.setAttribute('jsx', next.toString());
    this.mount();
  }
  get shadow(): boolean {
    return this.getAttribute('shadow') !== 'false';
  }
  set shadow(next: boolean) {
    if (next !== this.shadow) {
      this.setAttribute('shadow', next as unknown as string);
    }
  }
  get container(): ShadowRoot | CodeLive {
    return this.shadow ? this.shadowRoot! : this;
  }
  set container(_next: undefined) {
    void 0;
  }

  mount() {
    if (this.connected) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        clearTimeout(this.timer);
        this.timer = void 0;
        try {
          this.setupWorker(this.jsx);
          this.classList.add('compiling');
          this.appendChild(this._style!);

          if (this.jsx) {
            this._worker?.postMessage({
              code: this.source,
              options: this.transform,
            });
            return;
          }
          this.dispose();
          this.container.innerHTML = this.source.replace(this.scriptRegex, '');

          const match = this.source.match(this.scriptRegex);

          if (match) {
            this.compilerScript(match[1], {
              container: this.container,
            });
          }
        } catch (error) {
          this.error = error as Error;
        }
      }, 0);
    }
  }
  attributeChangedCallback(name: string, old: string, next: string) {
    if (old !== next) {
      if (name === 'jsx') {
        this.jsx = next === 'true';
      } else if (name === 'shadow') {
        this.shadow = next !== 'false';
      }
    }
  }

  connectedCallback() {
    this._style = document.createElement('style');
    this._style.innerText =
      ".compiling{position:relative;display:block;}.compiling::before{content:'Compiling...';color:var(--text-color, #fff);position:absolute;z-index:9999;font-weight:bold;width:100%;height:100%;background-color:rgba(255, 255, 255, 0.2);-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);display:flex;align-items:center;justify-content:center;}";

    if (this.shadow) {
      this.attachShadow({ mode: 'open' });
    }
    this.connected = true;
  }

  dispose() {
    this.classList.remove('compiling');

    if (!this.classList.length) {
      this.removeAttribute('class');
    }
    this.error = void 0;
    if (isFunction(this.cleanup)) {
      this.cleanup();
      this.cleanup = void 0;
    }
    this.replaceChildren();
    this.container.replaceChildren();
  }

  disconnectedCallback() {
    this.connected = false;
    this.dispose();
    this.setupWorker(false);
  }
}

if (!customElements.get('n-code-live')) {
  customElements.define('n-code-live', CodeLive);
}

type FunctionComponent<Props> = (props: Props) => JSX.Element | null;
type ClassComponent<Props> = new (props: Props) => JSX.ElementClass;
type Component<Props> =
  | FunctionComponent<Props>
  | ClassComponent<Props>
  | keyof JSX.IntrinsicElements;
interface NestedMDXComponents {
  [key: string]: NestedMDXComponents | Component<Any>;
}

export type MDXComponents = NestedMDXComponents & {
  [Key in keyof JSX.IntrinsicElements]?: Component<JSX.IntrinsicElements[Key]>;
} & {
  /**
   * If a wrapper component is defined, the MDX content will be wrapped inside of it.
   */
  wrapper?: Component<Any>;
};

export interface TransformOption {
  transforms?: ('jsx' | 'typescript' | 'flow' | 'imports' | 'react-hot-loader' | 'jest')[];
  disableESTransforms?: boolean;
  jsxRuntime?: 'classic' | 'automatic' | 'preserve';
  production?: boolean;
  jsxImportSource?: string;
  jsxPragma?: string;
  jsxFragmentPragma?: string;
  preserveDynamicImport?: boolean;
  injectCreateRequireForImportRequire?: boolean;
  enableLegacyTypeScriptModuleInterop?: boolean;
  enableLegacyBabel5ModuleInterop?: boolean;
  sourceMapOptions?: {
    compiledFilename: string;
  };
  filePath?: string;
}
export interface CodeLiveProps {
  source?: string;
  components?: MDXComponents | Record<string, Any>;
  /** 是否为jsx语法 */
  jsx?: boolean;
  /** jsx语法的 render 函数 */
  renderJsx?(dom: () => JSXElement, root: ShadowRoot): VoidFunction;
  transform?: TransformOption;
  /** 是否使用 shadow dom */
  shadow?: boolean | 'true' | 'false';
}

export interface CodeLiveElement extends CodeLiveProps {
  ref?: CodeLiveElement | { current: CodeLiveElement | null };
}
interface CustomElementTags {
  'n-code-live': CodeLiveElement;
}
declare module 'solid-js' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  export namespace JSX {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    export interface IntrinsicElements extends CustomElementTags {}
  }
}
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  export namespace JSX {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    export interface IntrinsicElements extends CustomElementTags {}
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    export interface ElementClass {}
    export type Element = Any;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

export default CodeLive;
