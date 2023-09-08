const { getDefaultConfig } = require("expo/metro-config");
const blacklist = require("metro-config/src/defaults/exclusionList");

// const config = getDefaultConfig(__dirname, {
//   isCSSEnabled: true,
// });

module.exports = {
  //   ...config,
  resolver: {
    blacklistRE: blacklist([/#current-cloud-backend\/.*/]),
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
