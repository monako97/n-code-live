import type { ConfigType } from '@moneko/core';

const CDNHOST = 'https://cdn.statically.io';
const conf: Partial<ConfigType> = {
  htmlPluginOption: {
    favicon: './site/assets/images/favicon.ico',
    meta: {
      CSP: {
        'http-equiv': 'Content-Security-Policy',
        content: `script-src 'self' ${CDNHOST} 'unsafe-eval' 'unsafe-inline' blob:;`,
      },
    },
  },
  output: {
    globalObject: 'this',
  },
  splitChunk: false,
  fallbackCompPath: '@/components/fallback',
};

export default conf;
