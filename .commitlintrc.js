// .commitlintrc.js
/** @type {import('cz-git').UserConfig} */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      [
        'core',
        'plugin-deep-freeze',
        'plugin-devtools',
        'plugin-history',
        'plugin-logger',
        'plugin-performance-counter',
        'plugin-persistence',
        'plugin-status',
        'testing',
      ],
    ],
  },
  prompt: {
    useEmoji: true,
    markBreakingChangeMode: true,
  },
};
