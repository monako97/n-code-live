import { type ConfigType, resolveProgram } from '@moneko/core';

const conf: Partial<ConfigType> = {
  devtool: false,
  htmlPluginOption: false,
  entry: resolveProgram('components/sucrase/index.ts'),
  output: {
    library: {
      name: 'sucrase',
      type: 'umd',
      umdNamedDefine: true,
    },
    path: resolveProgram('sucrase'),
    filename: 'sucrase.js',
  },
  splitChunk: false,
  runtimeChunk: false,
};

export default conf;
