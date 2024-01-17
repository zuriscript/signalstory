// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'signalstory | Empower Your Angular State Management',
  tagline:
    'Signal-based state management for Angular that grows with your project. Explore a versatile toolbox with enriching plugins for developers at all levels.',
  favicon: 'img/favicon.ico',
  url: 'https://zuriscript.github.io/',
  baseUrl: '/signalstory/',
  organizationName: 'zuriscript',
  projectName: 'signalstory',
  deploymentBranch: 'gh-pages',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  trailingSlash: false,
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          sidebarCollapsed: false,
          editUrl:
            'https://github.com/zuriscript/signalstory/tree/master/docs/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/social-card.png',
      hideOnScroll: 'false',
      metadata: [
        {
          name: 'google-site-verification',
          content: 'fcVH_TULsxQvp2rtZCKZBxXtJJsTx1nUEd_Vn6iGCZQ',
        },
        { name: 'twitter:card', content: 'summary_large_image' },
        { property: 'twitter:domain', content: 'zuriscript.github.io' },
        {
          property: 'twitter:url',
          content: 'https://zuriscript.github.io/signalstory/',
        },
        {
          name: 'twitter:title',
          content: 'Signalstory 🏰: State Management with Angular Signals',
        },
        {
          name: 'twitter:description',
          content:
            'Signal-based state management for Angular that grows with your project. Explore a versatile toolbox with enriching plugins for developers at all levels.',
        },
        {
          name: 'twitter:image',
          content:
            'https://zuriscript.github.io/signalstory/img/social-card.png',
        },
        {
          property: 'og:url',
          content: 'https://zuriscript.github.io/signalstory/',
        },
        { property: 'og:type', content: 'website' },
        {
          property: 'og:title',
          content: 'Signalstory 🏰: State Management with Angular Signals',
        },
        {
          property: 'og:description',
          content:
            'Signal-based state management for Angular that grows with your project. Explore a versatile toolbox with enriching plugins for developers at all levels.',
        },
        {
          property: 'og:image',
          content:
            'https://zuriscript.github.io/signalstory/img/social-card.png',
        },
      ],
      algolia: {
        appId: 'PMI5BJD9PV',
        apiKey: '197c8a48b1dd0bac861c7ff2170b3fba',
        indexName: 'signalstory',
      },
      navbar: {
        title: 'signalstory',
        logo: {
          alt: 'signalstory',
          src: 'img/signalstory_small.png',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Docs',
          },
          {
            href: 'https://github.com/zuriscript/signalstory',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      announcementBar: {
        id: '17.2.0',
        content:
          '<b>signalstory 17.2.0</b> is out! ✨ We are still in rapid development mode. Submit feature requests <a href="https://github.com/zuriscript/signalstory/discussions/categories/ideas" target="_blank">here</a>; yours might get considered! 🏆',
        backgroundColor: '#e35e75',
        textColor: '#091E42',
        isCloseable: true,
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Store',
                to: '/docs/store',
              },
              {
                label: 'Immutable Store',
                to: '/docs/immutable-store',
              },
              {
                label: 'Query',
                to: '/docs/building-blocks/query',
              },
              {
                label: 'Command',
                to: '/docs/building-blocks/command',
              },
              {
                label: 'Effect',
                to: '/docs/building-blocks/effect',
              },
              {
                label: 'Event',
                to: '/docs/building-blocks/event',
              },
              {
                label: 'Plugins',
                to: '/docs/category/plugins',
              },
              {
                label: 'Testing',
                to: '/docs/testing',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/zuriscript/signalstory',
              },
            ],
          },
          {
            title: 'Credits',
            items: [
              {
                label: 'Docs powered by Docusaurus',
                href: 'https://docusaurus.io/',
              },
              {
                label: 'Search powered by Algolia',
                href: 'https://docsearch.algolia.com/',
              },
              {
                label: 'Wizard by Freepik - Flaticon',
                href: 'https://www.flaticon.com/free-icons/wizard',
              },
              {
                label: 'Carriage by Freepik - Flaticon',
                href: 'https://www.flaticon.com/free-icons/carriage',
              },
              {
                label: 'Cultures by Freepik - Flaticon',
                href: 'https://www.flaticon.com/free-icons/cultures',
              },
              {
                label: 'Fairy by Freepik - Flaticon',
                href: 'https://www.flaticon.com/free-icons/fairy',
              },
              {
                label: 'Spellbook by Freepik - Flaticon',
                href: 'https://www.flaticon.com/free-icons/spellbook',
              },
              {
                label: 'Scroll by Freepik - Flaticon',
                href: 'https://www.flaticon.com/free-icons/scroll',
              },
              {
                label: 'Excalibur by Freepik - Flaticon',
                href: 'https://www.flaticon.com/free-icons/excalibur',
              },
              {
                label: 'Hourglass by Freepik - Flaticon',
                href: 'https://www.flaticon.com/free-icons/time-and-date',
              },
              {
                label: 'Snow by Freepik - Flaticon',
                href: 'https://www.flaticon.com/free-icons/snow',
              },
              {
                label: 'Trees by Freepik - Flaticon',
                href: 'https://www.flaticon.com/free-icons/trees',
              },
              {
                label: 'Game Charatcers by max.icons - Flaticon',
                href: 'https://www.flaticon.com/free-icons/warrior',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} zuriscript`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['typescript'],
      },
    }),
};

module.exports = config;
