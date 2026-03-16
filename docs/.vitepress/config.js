import { defineConfig } from 'vitepress';
import nav from './nav.js';
import sidebar from './sidebar-auto.js';
import { SearchPlugin } from 'vitepress-plugin-search';
// import { postcssIsolateStyles } from 'vitepress';
const fileAndStyles = {};
// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/blog/',
  title: 'Note',
  description: 'Study Node',
  lang: 'zh-CH',
  head: [['link', { rel: 'icon', href: '/blog/logo.svg' }]],
  cleanUrls: true,
  markdown: {
    lineNumbers: true,
    image: {
      lazyLoading: true,
    },
  },
  rewrites: {
    'tools/:tool/:page': ':tool/:page',
    'JS/:js/:page': ':js/:page',
    'node/:node/:page': ':node/:page',
  },
  vite: {
    plugins: [
      SearchPlugin({
        // 搜索框提示文字
        placeholder: '搜索文档',
        // 最大显示结果数
        maxResults: 10,
        // 是否区分大小写
        ignoreCase: true,
        // 中文搜索必须开启！
        encode: false,
        // 同时搜索标题 + 内容
        previewLength: 80,
      }),
    ],
    logLevel: 'error',
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('vue')) {
                return 'vue-vendor';
              }
              if (id.includes('vitepress')) {
                return 'vitepress';
              }
              return 'vendor';
            }
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },
    ssr: {
      noExternal: ['naive-ui', 'date-fns', 'vueuc'],
    },
  },
  themeConfig: {
    logo: '/logo.svg',
    search: false,
    // search: {
    //   provider: 'local',
    //   options: {
    //     locales: {
    //       root: {
    //         translations: {
    //           button: {
    //             buttonText: '搜索文档',
    //             buttonAriaLabel: '搜索文档',
    //           },
    //           modal: {
    //             noResultsText: '无法找到相关结果',
    //             resetButtonTitle: '清除查询条件',
    //             displayDetails: '显示详细信息',
    //             footer: {
    //               selectText: '选择',
    //               navigateText: '切换',
    //               closeText: '关闭',
    //             },
    //           },
    //         },
    //       },
    //     },
    //   },
    // },
    outline: {
      level: 'deep',
      label: '页面导航',
    },
    nav,
    sidebar,
    socialLinks: [
      // { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    ],
    markdown: {
      // 代码块风格
      // theme: 'material-theme-palenight',
      theme: 'github-dark',
      // 代码块显示行数
      lineNumbers: true,
      image: {
        lazyLoading: true,
      },
    },
    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },
    footer: {
      message:
        '<a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank">皖ICP备20002163号-1</a>',
      copyright: 'Copyright © 2024-WHC',
    },
  },
  // plugins: [postcssIsolateStyles()],
  postRender(context) {
    const styleRegex = /<css-render-style>((.|\s)+)<\/css-render-style>/;
    const vitepressPathRegex = /<vitepress-path>(.+)<\/vitepress-path>/;
    const style = styleRegex.exec(context.content)?.[1];
    const vitepressPath = vitepressPathRegex.exec(context.content)?.[1];
    if (vitepressPath && style) {
      fileAndStyles[vitepressPath] = style;
    }
    context.content = context.content.replace(styleRegex, '');
    context.content = context.content.replace(vitepressPathRegex, '');
  },
  transformHtml(code, id) {
    const html = id.split('/').pop();
    if (!html) return;
    const style = fileAndStyles[`/${html}`];
    if (style) {
      return code.replace(/<\/head>/, `${style}</head>`);
    }
  },
});
