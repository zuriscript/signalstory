// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'signalstory | Empower Your Angular State Management',
  tagline: 'Efficiency, Flexibility, and Control at Your Stateful Fingertips',
  favicon: 'img/favicon.ico',
  url: 'https://your-docusaurus-test-site.com',  
  baseUrl: '/signalstory',
  organizationName: 'zuriscript',
  projectName: 'signalstory',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
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
          
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
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
      image: 'img/social-card.jpg',
      hideOnScroll: 'false',
      navbar: {
        title: 'signalstory',
        logo: {
          alt: 'signalstory',
          src: 'img/signalstory.png',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Docs',
          },
          {
            href: 'https://github.com/facebook/docusaurus',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Prolog',
                to: '/docs/prolog',
              },
              {
                label: 'Installation',
                to: '/docs/installation',
              },
              {
                label: 'Store',
                to: '/docs/store',
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
              }
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/facebook/docusaurus',
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
                label: 'Wizard icons created by Freepik - Flaticon',
                href: 'https://www.flaticon.com/free-icons/wizard',
              },
              {
                label: 'Carriage icons created by Freepik - Flaticon',
                href: 'https://www.flaticon.com/free-icons/carriage',
              },
              {
                label: 'Cultures icons created by Freepik - Flaticon',
                href: 'https://www.flaticon.com/free-icons/cultures',
              },
              {
                label: 'Fairy icons created by Freepik - Flaticon',
                href: 'https://www.flaticon.com/free-icons/fairy',
              },
              {
                label: 'Spellbook icons created by Freepik - Flaticon',
                href: 'https://www.flaticon.com/free-icons/spellbook',
              },
              {
                label: 'Scroll icons created by Freepik - Flaticon',
                href: 'https://www.flaticon.com/free-icons/scroll',
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
