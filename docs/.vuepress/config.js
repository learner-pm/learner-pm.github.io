const { path } = require("@vuepress/utils");

module.exports = {
  host: "localhost",
  port: "8888",
  title: "Blog",
  base: "/",
  description: "PengM的个人学习博客",
  lang: "zh-CN",
  head: [
    ["link", { rel: "icon", href: "/images/logo.png" }],
    ["link", { rel: "icon", href: "/images/favicon.ico" }],
    ["link", { rel: "stylesheet", href: "/css/index.css" }],
  ],
  theme: "@vuepress/theme-default",
  themeConfig: {
    navbar: [
      {
        text: "前端",
        children: [
          {
            text: "基础",
            link: "/frontEnd/basic/",
          },
          {
            text: "进阶",
            link: "/frontEnd/frame/",
          },
        ],
      },
      {
        text: "编程",
        link: "/program/",
      },
      {
        text: "项目",
        link: "/project/",
      },
      {
        text: "CICD",
        link: "/cicd/",
      },
      {
        text: "记录",
        link: "/learn/",
      },
      { text: "GitHub", link: "https://github.com/learner-pm" },
    ],
    sidebar: {
      "/frontEnd/basic/": [
        {
          text: "ECMAScript",
          children: [
            "/frontEnd/basic/ecmaScript/type",
            "/frontEnd/basic/ecmaScript/function",
            "/frontEnd/basic/ecmaScript/proto",
            "/frontEnd/basic/ecmaScript/this",
            "/frontEnd/basic/ecmaScript/async",
            "/frontEnd/basic/ecmaScript/module",
          ],
        },
        {
          text: "浏览器",
          children: [
            "/frontEnd/basic/borwser/draw",
            "/frontEnd/basic/borwser/storage",
            "/frontEnd/basic/borwser/network",
            "/frontEnd/basic/borwser/across",
            "/frontEnd/basic/borwser/security",
            "/frontEnd/basic/borwser/performance",
          ],
        },
      ],
      "/frontEnd/frame/": [
        {
          text: "React",
          children: [
            "/frontEnd/frame/React/",
          ],
        },
        {
          text: "Vue",
          children: [
            "/frontEnd/frame/Vue/"
          ],
        },
        {
          text: "Webpack",
          children: [
            '/frontEnd/frame/Webpack/'
          ]
        },
        {
          text: "其他",
          children: [
            "/frontEnd/frame/Other/form.md"
          ],
        },
      ],
      // "/learn/": [
      //   {
      //     children: ["/learn/result.md"],
      //   },
      // ],
      "/program/": [
        {
          text:'Python',
          children: [
            '/program/python/'
          ]
        },
        {
          text: "数据结构",
          children: [
            "/program/dataStructure/",
            "/program/dataStructure/tree.md",
          ],
        },
        {
          text: "算法",
          children: [
            "/program/algorithm/",
            "/program/algorithm/sort.md",
          ],
        },
        {
          text: "设计模式",
          children: [
            "/program/designPatterns/",
          ],
        },
        // {
        //   text: "设计模式",
        //   children: [
        //     "/dataStructure/algorithm/designPatterns/factory.md",
        //     "/dataStructure/algorithm/designPatterns/singleton.md",
        //     "/dataStructure/algorithm/designPatterns/observer.md",
        //     "/dataStructure/algorithm/designPatterns/strategy.md",
        //     "/dataStructure/algorithm/designPatterns/decorate.md",
        //     "/dataStructure/algorithm/designPatterns/proxy.md",
        //     "/dataStructure/algorithm/designPatterns/adaptation.md",
        //   ],
        // },
      ],
      "/project/": [
        {
          text: "项目",
          children: [
            "/project/",
            "/project/one.md",
            "/project/thesis.md",
            "/project/vaios.md",
          ],
        },
      ],
      "/cicd/": [
        {
          text: "自动构建",
          children: [
            "/cicd/"
          ]
        }
      ],
      "/learn":[
        {
          text: "学习",
          children: [
            "/learn/",
            "/learn/result.md",
            "/learn/notes.md",
          ],
        }
      ]
    },
  },
  plugins: [
    [
      "@vuepress/register-components",
      {
        componentsDir: path.resolve(__dirname, "./components"),
      },
    ],
    [
      "@vuepress/docsearch",
      {
        appId: "UWD3TP0HJ3",
        apiKey: "648fdc4c61e72866f6f638b7dacfd0bf",
        indexName: "pmthank",
        locales: {
          "/": {
            placeholder: "Search",
            translations: {
              button: {
                buttonText: "Search",
              },
            },
          },
        },
      },
    ],
  ],
};
