import { defineUserConfig } from 'vuepress';
import { defaultTheme } from 'vuepress';

export default defineUserConfig({
  lang: 'zh-CN',
  title: '东东的驿站',
  description: '欢迎来到我的奇幻之地',
  theme: defaultTheme({
    navbar: [
      {
        text: '首页',
        link: '/',
      },
      {
        text: '随记博客',
        link: '/library/work',
      },
    ],

    sidebar: [
      {
        text: '成长',
        link: '/library/work',
        children: [
          {
            text: "工作文档",
            link: "/library/work"
          },
          {
            text: "个人文档",
            link: "/library/mine"
          }
        ],
      }
    ]
  }),
})
