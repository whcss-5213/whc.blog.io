import DefaultTheme from 'vitepress/theme';
import { h } from 'vue';
import { NMessageProvider } from 'naive-ui';
import './custom.css';

export default {
  ...DefaultTheme,
  Layout() {
    return h(
      NMessageProvider,
      { duration: 2000 },
      {
        default: () => h(DefaultTheme.Layout),
      }
    );
  },
  enhanceApp({ app }) {},
};
