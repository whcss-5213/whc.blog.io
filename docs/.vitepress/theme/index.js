// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import './custom.css'
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";


export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(ElementPlus);
  }
}