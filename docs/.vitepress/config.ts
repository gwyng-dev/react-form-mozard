import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'React Form Mozard',
  description: 'Monadic form composition library using JavaScript Generators for React',

  locales: {
    root: {
      label: 'English',
      lang: 'en'
    }
  },

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/overview' },
      { text: 'GitHub', link: 'https://github.com/gwyng-dev/react-form-mozard' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Overview', link: '/guide/overview' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Usage', link: '/guide/usage' },
            { text: 'Examples', link: '/guide/examples' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/gwyng-dev/react-form-mozard' }
    ]
  }
})
