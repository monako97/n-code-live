import { type ConfigType, resolveProgram } from '@moneko/core';

const conf: Partial<ConfigType> = {
  devtool: false,
  htmlPluginOption: false,
  entry: resolveProgram('components/code-live/index.ts'),
  output: {
    path: resolveProgram('umd'),
    filename: 'index.js',
    publicPath: './',
  },
  splitChunk: false,
  runtimeChunk: false,
};

export default conf;
