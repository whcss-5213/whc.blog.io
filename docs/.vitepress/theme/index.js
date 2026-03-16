import DefaultTheme from 'vitepress/theme';
import { useRoute } from 'vitepress';
import { setup } from '@css-render/vue3-ssr';
import { NConfigProvider, NMessageProvider } from 'naive-ui';
import { defineComponent, h, inject } from 'vue';
import './style/custom.css';
import './style/home.css';
import './style/code.css';
import './style/page.css';
const components = import.meta.glob('../components/**/*.vue');

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
export default {
  extends: DefaultTheme,
  Layout: NaiveUIProvider,
  enhanceApp: ({ app }) => {
    for (const path in components) {
      const name = path
        .match(/\.\/components\/(.*)\.vue/)?.[1]
        ?.replace(/\//g, '-');
      if (name) {
        components[path]().then(mod => {
          app.component(name, mod.default);
        });
      }
    }
    if (import.meta.env.SSR) {
      const { collect } = setup(app);
      app.provide('css-render-collect', collect);
    }
  },
};
