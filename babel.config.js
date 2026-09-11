const isProduction =
  (process.env.BABEL_ENV || process.env.NODE_ENV) === 'production';

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // supprime les console.* du bundle de release (on garde error/warn)
    ...(isProduction
      ? [['transform-remove-console', {exclude: ['error', 'warn']}]]
      : []),
    // reanimated doit rester le dernier plugin de la liste
    'react-native-reanimated/plugin',
  ],
};
