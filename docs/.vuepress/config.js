const { path } = require("@vuepress/utils");

module.exports = {
  host: "localhost",
  port: "8080",
  title: "Learning Blog",
  base: "/",
  description: "PM的个人学习博客",
  lang: "zh-CN",
  head: [
    ["link", { rel: "icon", href: "/images/logo.png" }],
    ["link", { rel: "icon", href: "/images/favicon.ico" }],
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
            children: [
              {
                text: "面试",
                link: "/frontEnd/frame/",
              },
            ],
          },
        ],
      },
      {
        text: "数据结构和算法",
        link: "/dataStructure/algorithm/",
      },
      {
        text: "项目",
        link: "/project/",
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
          text: "Frame",
          link: "/frontEnd/frame/",
          children: [
            "/frontEnd/frame/vueReact/",
            "/frontEnd/frame/vueReact/one",
          ],
        },
        {
          text: "Mvvm",
          children: ["/frontEnd/frame/mvvm/"],
        },
      ],
      "/dataStructure/algorithm/": [
        {
          text: "算法",
          children: [
            "/dataStructure/algorithm/",
            "/dataStructure/algorithm/commonType.md",
          ],
        },
      ],
      "/project/": [
        {
          text: "项目",
          children: ["/project/", "/project/one.md"],
        },
      ],
    },
  },
  plugins: [
    [
      "@vuepress/register-components",
      {
        componentsDir: path.resolve(__dirname, "./components"),
      },
    ],
  ],
};
