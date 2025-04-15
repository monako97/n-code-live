import type { ConfigType } from '@moneko/core';

const conf: Partial<ConfigType> = {
  htmlPluginOption: {
    favicon: './site/assets/images/favicon.ico',
  },
  output: {
    globalObject: 'this',
  },
  splitChunk: false,
  fallbackCompPath: '@/components/fallback',
};

export default conf;
