import neko from 'eslint-config-neko';

const conf = [
  ...neko.configs.recommended,
  { ignores: ['**/**/*.mdx?', 'lib', 'docs', 'coverage', 'prism.js'] },
];

export default conf;
