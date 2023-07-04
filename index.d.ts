import type { JSXElement } from "solid-js";

type FunctionComponent<Props> = (props: Props) => JSX.Element | null;
type ClassComponent<Props> = new (props: Props) => JSX.ElementClass;
type Component<Props> =
  | FunctionComponent<Props>
  | ClassComponent<Props>
  | keyof JSX.IntrinsicElements;
interface NestedMDXComponents {
  [key: string]: NestedMDXComponents | Component<any>;
}

export type MDXComponents = NestedMDXComponents & {
  [Key in keyof JSX.IntrinsicElements]?: Component<JSX.IntrinsicElements[Key]>;
} & {
  /**
   * If a wrapper component is defined, the MDX content will be wrapped inside of it.
   */
  wrapper?: Component<any>;
};

export interface TransformOption {
  transforms?: Array<
    "jsx" | "typescript" | "flow" | "imports" | "react-hot-loader" | "jest"
  >;
  disableESTransforms?: boolean;
  jsxRuntime?: "classic" | "automatic" | "preserve";
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
  scope?: MDXComponents | Record<string, any>;
  /** 是否为jsx语法 */
  jsx?: boolean;
  /** jsx语法的 render 函数 */
  renderJsx?(dom: () => JSXElement, root: ShadowRoot): VoidFunction;
  transform?: TransformOption;
}

export interface CodeLiveElement extends CodeLiveProps {
  ref?: CodeLiveElement | { current: CodeLiveElement | null };
}

interface CustomElementTags {
  "n-code-live": CodeLiveElement;
}
declare module "solid-js" {
  export namespace JSX {
    export interface IntrinsicElements extends CustomElementTags {}
  }
}
declare global {
  export namespace JSX {
    export interface IntrinsicElements extends CustomElementTags {}
    export interface ElementClass {}
    export interface Element {}
  }
}
