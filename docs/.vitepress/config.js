export default {
  title: 'Blog',
  base: '/',
  lang: 'zh-CN',
  description: 'PengM的个人学习博客',
  head: [
    ['link', { rel: 'icon', href: '/logo.png' }],
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'stylesheet', href: '/css/index.css' }]
  ],
  themeConfig: {
    logo: '/favicon.ico',
    lastUpdated: true,
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2021-now • Wrote by PengM'
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/learner-pm' }],
    search: {
      provider: 'algolia',
      options: {
        appId: 'UWD3TP0HJ3',
        apiKey: '648fdc4c61e72866f6f638b7dacfd0bf',
        indexName: 'pmthank'
      }
    },
    nav: [
      {
        text: '前端',
        items: [
          {
            text: '基础',
            link: '/frontEnd/basic/'
          },
          {
            text: '进阶',
            link: '/frontEnd/frame/'
          }
        ]
      },
      {
        text: 'Rust',
        link: '/rust/'
      },
      {
        text: '工具和技术',
        link: '/program/'
      },
      {
        text: '项目',
        link: '/project/'
      },
      {
        text: 'CICD',
        link: '/cicd/'
      },
      {
        text: '记录',
        link: '/learn/'
      }
    ],
    sidebar: {
      '/frontEnd/basic/': [
        {
          text: 'ECMAScript',
          items: [
            { text: '类型', link: '/frontEnd/basic/ecmaScript/type' },
            { text: '函数', link: '/frontEnd/basic/ecmaScript/function' },
            { text: '原型', link: '/frontEnd/basic/ecmaScript/proto' },
            { text: 'This', link: '/frontEnd/basic/ecmaScript/this' },
            { text: '异步', link: '/frontEnd/basic/ecmaScript/async' },
            { text: '模块', link: '/frontEnd/basic/ecmaScript/module' }
          ]
        },
        {
          text: '浏览器',
          items: [
            { text: '渲染', link: '/frontEnd/basic/browser/draw' },

            { text: '储存', link: '/frontEnd/basic/browser/storage' },

            { text: '网络', link: '/frontEnd/basic/browser/network' },

            { text: '跨域', link: '/frontEnd/basic/browser/across' },

            { text: '安全', link: '/frontEnd/basic/browser/security' },

            { text: '性能', link: '/frontEnd/basic/browser/performance' }
          ]
        }
      ],
      '/frontEnd/frame/': [
        {
          text: '进阶内容',
          items: [
            {
              text: '性能优化',
              link: '/frontEnd/frame/Front/performanceOptimization'
            }
          ]
        },
        {
          text: 'React',
          items: [
            { text: 'React', link: '/frontEnd/frame/React/' },
            { text: '深入React', link: '/frontEnd/frame/React/Learn' },
            { text: 'Fiber', link: '/frontEnd/frame/React/Fiber' }
          ]
        },
        {
          text: 'Vue',
          items: [{ text: 'Vue', link: '/frontEnd/frame/Vue/' }]
        },
        {
          text: '其他',
          items: [{ text: '表单', link: '/frontEnd/frame/Other/form' }]
        }
      ],
      '/rust/': [
        {
          text: '所有权',
          link: '/rust/index'
        }
      ],
      '/program/': [
        {
          text: '项目搭建',
          items: [
            { text: '项目搭建', link: '/program/build' },
            { text: '微前端', link: '/program/build/microApp' }
          ]
        },
        {
          text: 'CLI',
          items: [{ text: 'CLI', link: '/program/cli' }]
        },
        {
          text: 'Linux',
          items: [{ text: '服务器', link: '/program/linux/basic' }]
        },
        {
          text: 'Docker',
          items: [{ text: 'Docker', link: '/program/Docker/' }]
        },
        {
          text: 'Kuberentes',
          items: [
            { text: 'Kuberentes', link: '/program/Kuberentes/' },
            { text: '部署前后端', link: '/program/Kuberentes/demoOne' }
          ]
        },
        {
          text: 'Vite',
          items: [{ text: 'Vite', link: '/program/Vite/' }]
        },
        {
          text: 'WebSocket',
          items: [{ text: 'WebSocket', link: '/program/WebSocket/' }]
        },
        {
          text: 'Git',
          items: [{ text: 'Git', link: '/program/Git/' }]
        },
        {
          text: 'Webpack',
          items: [{ text: 'Webpack', link: '/program/Webpack/' }]
        },
        {
          text: '命令行',
          items: [{ text: 'Sh', link: '/program/sh/' }]
        },
        {
          text: '数据结构',
          items: [
            { text: '链表', link: '/program/dataStructure/' },
            { text: '树', link: '/program/dataStructure/tree.md' }
          ]
        },
        {
          text: '算法',
          items: [
            { text: '题目', link: '/program/algorithm/' },
            { text: '排序', link: '/program/algorithm/sort.md' }
          ]
        },
        {
          text: '设计模式',
          items: [{ text: '设计模式', link: '/program/designPatterns/' }]
        }
      ],
      '/project/': [
        {
          text: '项目',
          items: [
            { text: '毕设', link: '/project/one.md' },
            // {text:'',link:  "/project/thesis.md",}
            { text: 'Vaios', link: '/project/vaios.md' }
          ]
        }
      ],
      '/learn': [
        {
          text: '记录',
          items: [
            { text: '总结', link: '/learn/result.md' },
            { text: '杂类', link: '/learn/miscellaneous.md' }
          ]
        }
      ]
    }
  }
}
