import DefaultTheme from 'vitepress/theme';
import { useRoute } from 'vitepress';
import { setup } from '@css-render/vue3-ssr';
import { NConfigProvider, NMessageProvider } from 'naive-ui';
import { defineComponent, h, inject } from 'vue';
import './style/custom.css';
import './style/home.css';
import './style/code.css';
import './style/page.css';
const components = import.meta.glob('../components/**/*.vue', { eager: true });

const { Layout } = DefaultTheme;

const CssRenderStyle = defineComponent({
  setup() {
    const collect = inject('css-render-collect');
    return {
      style: collect(),
    };
  },
  render() {
    return h('css-render-style', {
      innerHTML: this.style,
    });
  },
});

const VitepressPath = defineComponent({
  setup() {
    const route = useRoute();
    return () => {
      return h('vitepress-path', null, [route.path]);
    };
  },
});

const NaiveUIProvider = defineComponent({
  render() {
    return h(
      NConfigProvider,
      { abstract: true, inlineThemeDisabled: true },
      {
        default: () => [
          h(NMessageProvider, null, {
            default: () => [
              h(Layout, null, { default: this.$slots.default?.() }),
              import.meta.env.SSR
                ? [h(CssRenderStyle), h(VitepressPath)]
                : null,
            ],
          }),
        ],
      }
    );
  },
});
console.log(components);
console.log(1111111111111);
export default {
  extends: DefaultTheme,
  Layout: NaiveUIProvider,
  enhanceApp: ({ app }) => {
    Object.entries(components).forEach(([path, component]) => {
      // 自动提取组件名：把路径变成 大驼峰 组件名
      const componentName = path
        .split('/')
        .pop()
        .replace('.vue', '')
        .replace(/^\w/, c => c.toUpperCase());

      app.component(componentName, component.default);
    });
    if (import.meta.env.SSR) {
      const { collect } = setup(app);
      app.provide('css-render-collect', collect);
    }
  },
};
