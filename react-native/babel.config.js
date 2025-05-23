module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@': './src',
            '@components': './src/components',
            '@hooks': './src/hooks',
            '@list-tests': './src/list-tests',
            '@providers': './src/providers',
            '@services': './src/services',
            '@typedefs': './src/types',
            '@utils': './src/utils',
            '@assets': './assets',
            '@constants': './constants',
            '@docs': './docs',
          },
        },
      ],
    ],
  };
};
