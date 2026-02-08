import { defineConfig } from 'vitepress';
import nav from './nav.js';
import sidebar from './sidebar.js';

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
    'tools/git/:page': 'git/:page',
    'tools/vim/:page': 'vim/:page',
    'tools/nginx/:page': 'nginx/:page',
    'tools/docker/:page': 'docker/:page',
    'tools/browser/:page': 'browser/:page',
    'JS/js/:page': 'JS/:page',
    'JS/ts/:page': 'TS/:page',
    'JS/vue/:page': 'vue/:page',
    'JS/react/:page': 'react/:page',
    'tools/DB/:page': 'DB/:page',
    'node/node/:page': 'node/:page',
    'node/express/:page': 'express/:page',
    'node/nestjs/:page': 'nestjs/:page',
  },
  vite: {
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
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.svg',
    // lastUpdated: {
    //   text: '最后更新时间',
    //   formatOptions: {
    //     dateStyle: 'short',
    //     timeStyle: 'short',
    //   },
    // },

    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档',
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭',
                },
              },
            },
          },
        },
      },
    },
    outline: {
      level: 'deep',
      label: '页面导航',
    },
    nav,
    sidebar: {
      ...sidebar,
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    ],
    markdown: {
      // 代码块风格
      theme: 'material-theme-palenight',
      // theme:'github-light',
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
});
