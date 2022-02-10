module.exports = {
  // 站点配置
  lang: "zh-CN",
  title: "Learning Blog",
  description: "这是我的第一个 VuePress 站点",
  head: [["link", { rel: "icon", href: "/images/logo.png" }]],
  // 主题和它的配置
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
  },
};
