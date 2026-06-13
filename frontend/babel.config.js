/**
 * babel.config.js
 * ---------------
 * Babel transpiler configuration for the Expo project.
 * The 'babel-preset-expo' preset handles:
 *  - TypeScript stripping
 *  - JSX transform
 *  - React Native-specific transforms
 *  - Module resolution for Expo's bundler (Metro)
 *
 * This file is required by Metro — without it the bundler
 * cannot process .tsx/.ts files and Expo Go will time out.
 */

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
