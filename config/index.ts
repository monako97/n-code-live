export default {
  devtool: false,
  compiler: 'swc',
  bundleAnalyzer: false,
  htmlPluginOption: process.env.NODE_ENV !== 'production' ? {} : false,
  externals: [
    /^solid/,
    /ReactHotLoaderTransformer/
  ]
};
