import solid from '@moneko/core/eslint/solid';

const conf = [
  ...solid,
  { ignores: ['**/**/*.mdx?', 'lib', 'docs', 'coverage', 'prism.js'] },
];

export default conf;
