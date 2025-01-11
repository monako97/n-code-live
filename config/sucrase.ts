import { type ConfigType, resolveProgram } from '@moneko/core';

const conf: Partial<ConfigType> = {
  devtool: false,
  htmlPluginOption: false,
  entry: resolveProgram('components/sucrase/index.ts'),
  output: {
    library: {
      name: 'sucrase',
    },
    path: resolveProgram('sucrase'),
    filename: 'index.js',
  },
  splitChunk: false,
  runtimeChunk: false,
};

export default conf;
