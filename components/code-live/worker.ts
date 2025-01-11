import sucraseRaw from '../../sucrase/sucrase.js?raw';

import type { TransformOption } from '.';

declare global {
  interface Window {
    sucrase: typeof import('sucrase');
  }
}

let SUCRASE_URL: string | null, WORKER_URL: string | null;

function createSucrase() {
  return URL.createObjectURL(
    new Blob([sucraseRaw], {
      type: 'application/javascript',
    }),
  );
}
function createURL() {
  function worker() {
    self.importScripts('SUCRASE_URL');
    const { transform } = self.sucrase;

    function message(e: MessageEvent<{ code: string; options: TransformOption }>) {
      let codeTrimmed = e.data.code
        .trim()
        .replace(/;$/, '')
        // Remove single-line comments (excluding potential URLs)
        .replace(/\/\/(?!\S*\.\S+).*$/gm, '')
        // Remove import statements
        .replace(/import\s+.*?;?\n/g, '')
        // Remove empty lines
        .replace(/^\s*[\r\n]/gm, '')
        .replace(/export /g, '')
        .replace(/default\s+(\w+);?$/, 'render(<$1 />);');

      codeTrimmed = /^<[\s\S]*>$/.test(codeTrimmed) ? `<>${codeTrimmed}</>` : codeTrimmed;

      try {
        const result = transform(
          codeTrimmed.includes('render(')
            ? codeTrimmed.replace('render(', 'return (')
            : `return (${codeTrimmed})`,
          Object.assign(
            {
              transforms: ['jsx', 'typescript', 'imports'],
              jsxPragma: 'jsx',
              jsxFragmentPragma: 'Fragment',
              jsxImportSource: 'solid-js/h',
              production: true,
            },
            e.data.options,
          ),
        ).code;

        self.postMessage(result);
      } catch (err) {
        self.postMessage(err);
      }
    }
    self.addEventListener('message', message);
  }

  return URL.createObjectURL(
    new Blob([`(${worker.toString().replace('SUCRASE_URL', SUCRASE_URL!)})(self)`], {
      type: 'application/javascript',
    }),
  );
}
let count = 0;

export function create() {
  count++;
  if (!SUCRASE_URL) {
    SUCRASE_URL = createSucrase();
  }
  if (!WORKER_URL) {
    WORKER_URL = createURL();
  }
  return WORKER_URL;
}

export function dispose() {
  count--;
  const empty = count <= 0;

  if (empty) {
    URL.revokeObjectURL(SUCRASE_URL!);
    SUCRASE_URL = null;
    URL.revokeObjectURL(WORKER_URL!);
    WORKER_URL = null;
  }
  return empty;
}
