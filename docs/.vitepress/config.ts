import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'React Form Mozard',
  description: 'Monadic form composition library using JavaScript Generators for React',

  base: "/react-form-mozard",

  locales: {
    root: {
      label: 'English',
      lang: 'en',
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
    },
    kr: {
      label: '한국어',
      lang: 'ko',
      link: '/kr/',
      themeConfig: {
        nav: [
          { text: '가이드', link: '/kr/guide/overview' },
          { text: 'GitHub', link: 'https://github.com/gwyng-dev/react-form-mozard' }
        ],
        sidebar: {
          '/kr/guide/': [
            {
              text: '가이드',
              items: [
                { text: '개요', link: '/kr/guide/overview' },
                { text: '설치', link: '/kr/guide/installation' },
                { text: '사용법', link: '/kr/guide/usage' },
                { text: '예제', link: '/kr/guide/examples' }
              ]
            }
          ]
        },
        socialLinks: [
          { icon: 'github', link: 'https://github.com/gwyng-dev/react-form-mozard' }
        ]
      }
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
