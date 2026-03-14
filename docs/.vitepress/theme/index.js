import DefaultTheme from 'vitepress/theme';
import { h } from 'vue';
import naive from 'naive-ui';
const { NMessageProvider } = naive;
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
