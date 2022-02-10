const { path } = require("@vuepress/utils");

module.exports = {
  lang: "zh-CN",
  title: "Learning Blog",
  description: "这是我的第一个 VuePress 站点",
  head: [["link", { rel: "icon", href: "/images/logo.png" }]],
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
                text: "框架",
                link: "/frontEnd/frame/",
              },
            ],
          },
        ],
      },
      {
        text: "数据结构和算法",
        link: "/dataStructure/",
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
            "/frontEnd/basic/ecmaScript/",
            "/frontEnd/basic/ecmaScript/one",
          ],
        },
        {
          text: "浏览器",
          link: "/frontEnd/basic/borwser",
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
