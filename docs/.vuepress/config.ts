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
        link: '/library/workGrowUp/abort',
      },
    ],

    sidebar: [
      {
        text: '工作成长',
        link: '/library/workGrowUp/abort',
        children: [
          {
            text: "性能上报",
            link: "/library/workGrowUp/performanceMonitor"
          },
          {
            text: "动效词云图",
            link: "/library/workGrowUp/wordCloud"
          },
          {
            text: "竞态请求",
            link: "/library/workGrowUp/abort"
          },
          {
            text: "crypto可逆加密",
            link: "/library/workGrowUp/crypto"
          },
          {
            text: "ssh Key 管理",
            link: "/library/workGrowUp/sshKey"
          }
        ],
      },
      {
        text: 'openAi',
        link: '/library/openAi/proxy',
        children: [
          {
            text: "PAC代理",
            link: "/library/openAi/proxy"
          },
        ],
      }
    ]
  }),
})
