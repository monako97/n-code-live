import { transform } from 'sucrase';

import type { TransformOption } from '.';

function message(e: MessageEvent<{ code: string; options: TransformOption }>) {
  let codeTrimmed = e.data.code
    .trim()
    .replace(/;$/, '')
    // Remove single-line comments
    .replace(/\/\/.*$/gm, '')
    // Remove import statements
    .replace(/import\s+.*?;?\n/g, '')
    // Remove empty lines
    .replace(/^\s*[\r\n]/gm, '')
    .replace(/export /g, '')
    .replace(/default\s+(\w+);?$/, 'render(<$1 />);');

  codeTrimmed = /^<[\s\S]*>$/.test(codeTrimmed) ? `<>${codeTrimmed}</>` : codeTrimmed;
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
}
self.addEventListener('message', message);
