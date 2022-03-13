/* eslint-disable prettier/prettier */
// https://github.com/ioveracker/demo-react-native-emotion/blob/master/metro.config.js

const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const {
    resolver: { sourceExts },
  } = await getDefaultConfig();
  return {
    resolver: {
      // Add cjs extension so stylis will load.
      sourceExts: [...sourceExts, 'cjs'],
    },
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: false,
        },
      }),
    },
  };
})();
