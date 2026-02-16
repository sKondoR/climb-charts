const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  output: {
    publicPath: 'auto',
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'climb_charts',
      filename: 'remoteEntry.js',
      exposes: {
        './RouteChart': './src/components/charts/RouteChart.tsx',
        './GradeDistributionChart': './src/components/charts/GradeDistributionChart.tsx',
        './ProgressChart': './src/components/charts/ProgressChart.tsx',
      },
      shared: {
        react: { singleton: true, requiredVersion: false },
        'react-dom': { singleton: true, requiredVersion: false },
        three: { singleton: true, requiredVersion: false },
        '@react-three/fiber': { singleton: true, requiredVersion: false },
        '@react-three/drei': { singleton: true, requiredVersion: false },
      },
    }),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  devServer: {
    port: 3001,
    historyApiFallback: true,
  },
};
