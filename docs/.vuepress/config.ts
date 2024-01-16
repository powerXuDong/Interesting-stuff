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
            text: "竞态请求",
            link: "/library/workGrowUp/abort"
          },
          {
            text: "动效词云图",
            link: "/library/workGrowUp/wordCloud"
          },
          {
            text: "scp 的使用",
            link: "/library/workGrowUp/scp"
          },
          {
            text: "ssh Key的管理",
            link: "/library/workGrowUp/sshKey"
          },
          {
            text: "crypto可逆加密",
            link: "/library/workGrowUp/crypto"
          },
          {
            text: "RequestIdleCallback",
            link: "/library/workGrowUp/requestIdleCallback"
          },
          {
            text: "箭头函数在vue、react中的区别",
            link: "/library/workGrowUp/arrowFunction"
          },
        ],
      },
      {
        text: 'canvas',
        link: '/library/canvas/clarity',
        children: [
          {
            text: "清晰度的问题",
            link: "/library/canvas/clarity"
          },
          {
            text: "深入理解路径",
            link: "/library/canvas/path"
          },
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
