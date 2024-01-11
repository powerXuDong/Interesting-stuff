// import { defaultTheme } from 'vuepress'

// export default {
//   title: '东东的驿站',
//   // base: '/tech/',
//   description: '东东发现的有趣的东西',
//   theme: defaultTheme({
    
//   }),
//   locales: {
//     '/': {
//       lang: 'zh-CN'
//     }
//   },
//   themeConfig: {
//     subSidebar: 'auto',
//     nav: [
//       {
//         text: '首页',
//         link: '/'
//       },
//       // { 
//       //   text: '旭东的 JavaScript 博客', 
//       //   items: [
//       //     {
//       //       text: 'Github',
//       //       link: 'https://github.com/mqyqingfeng'
//       //     },
//       //     {
//       //       text: '掘金',
//       //       link: 'https://juejin.cn/user/712139234359182/posts'
//       //     }
//       //   ]
//       // }
//     ],
//     sidebar: [
//       {
//         title: '欢迎学习',
//         path: '/',
//         collapsable: false, // 不折叠
//         children: [
//           {
//             title: "学前必读",
//             path: "/"
//           }
//         ]
//       },
//       {
//         title: '基础学习',
//         path: '/handbook/ConditionalTypes',
//         collapsable: false, // 不折叠
//         children: [
//           {
//             title: "条件类型",
//             path: "/handbook/ConditionalTypes"
//           },
//           {
//             title: "泛型",
//             path: "/handbook/Generics"
//           }
//         ],
//       }
//     ]
//   }
// }

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