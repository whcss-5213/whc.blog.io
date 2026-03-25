# Web Components

## 一、核心概念
Web Components 是一套**原生Web技术规范**，用于创建**可复用、封装性强、跨框架兼容**的自定义HTML组件，无需依赖React、Vue等框架，直接在浏览器中运行，实现组件化开发的原生解决方案。

### 核心三大技术
1. **Custom Elements（自定义元素）**：定义自定义HTML标签的行为，注册专属组件，浏览器可识别并渲染。
2. **Shadow DOM（影子DOM）**：实现组件内部**DOM结构、样式、事件的完全隔离**，避免全局样式污染、DOM冲突，是组件封装的核心。
3. **HTML Templates（HTML模板）**：通过<slot>`标签定义组件结构模板，内容不直接渲染，<slot>`实现内容插槽分发。



## 二、核心技术详解

### 1. Custom Elements（自定义元素）
分为**自主自定义元素**（继承`HTMLElement`）和**自定义内置元素**（继承现有元素如`HTMLButtonElement`），日常开发以自主自定义元素为主。

#### 核心生命周期钩子
- `constructor()`：组件创建时调用，初始化状态、挂载Shadow DOM，必须先调用`super()`
- `connectedCallback()`：组件插入DOM时调用，可执行渲染、事件绑定
- `disconnectedCallback()`：组件从DOM移除时调用，用于清理事件、定时器
- `attributeChangedCallback()`：组件属性变化时调用，需先在`static get observedAttributes()`声明监听属性
- `adoptedCallback()`：组件被移动到新文档时调用，极少使用

#### 基础语法
```javascript
// 定义组件类
class MyComponent extends HTMLElement {
  // 声明监听的属性
  static get observedAttributes() {
    return ['title', 'count']
  }

  constructor() {
    super()
    // 通常在此处挂载Shadow DOM
  }
}
// 注册自定义元素（标签名必须含短横线，避免与原生标签冲突）
customElements.define('my-custom-component', MyComponent)
```

### 2. Shadow DOM（影子DOM）
#### 核心作用
- **样式隔离**：组件内部CSS只作用于自身，外部样式无法穿透，内部样式也不会污染全局
- **DOM隔离**：内部DOM节点不会被全局`document.querySelector`获取，避免DOM冲突
- **封装性**：组件内部结构私有化，对外只暴露属性和事件

#### 关键API
- `element.attachShadow({ mode: 'open' | 'closed' })`：创建Shadow Root
  - `open`：可通过`element.shadowRoot`访问内部DOM
  - `closed`：无法外部访问，安全性更高
- **样式相关伪类**：
  - `:host`：选中组件自身（自定义元素标签）
  - `:host(.className)`：选中带指定类名的组件
  - `::slotted(selector)`：选中外部插入的插槽内容

### 3. HTML Templates<template>`：

定义组件模板，内容不会直接渲染，通过JS克隆后使用
-<slot>`：插槽，允许外部传入内容到组件指定位置，支持**具名插槽**和**默认插槽**

## 三、完整实战示例
### 1. 基础可复用组件（含三大核心技术）
```html
<!-- 定义模板 -->
<template id="card-template<style>
    /* 组件内部样式，完全隔离 */
    .card {
      border: 1px solid #eee;
      border-radius: 8px;
      padding: 16px;
      width: 300px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .card-title {
      font-size: 18px;
      color: #333;
      margin: 0 0 12px;
    }
    .card-content {
      font-size: 14px;
      color: #666;
    }
    /* 选中组件自身 */
    :host {
      display: inline-block;
      margin: 8px;
    }
  <div class="card">
   <h3 class="card</h3>
<p class="card<!-- 具名插槽 -->
      <slot name="content"></slot>
    <!-- 默认插槽 -->
    <slot></div</template>

<script>
  // 获取模板
  const cardTemplate = document.getElementById('card-template')

  // 定义组件类
  class CustomCard extends HTMLElement {
    static get observedAttributes() {
      // 监听title属性
      return ['title']
    }

    constructor() {
      super()
      // 挂载Shadow DOM
      this.attachShadow({ mode: 'open' })
      // 克隆模板内容并插入Shadow DOM
      this.shadowRoot.appendChild(cardTemplate.content.cloneNode(true))
      // 获取内部DOM节点
      this.titleEl = this.shadowRoot.querySelector('.card-title')
    }

    // 属性变化时更新
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'title' && this.titleEl) {
        this.titleEl.textContent = newValue
      }
    }
  }

  // 注册组件
  customElements.define('custom-card', CustomCard)<!--<custom-card title="我的自定义卡片<div slot="content">这是通过</div<p>这是默认插槽内容</custom-card>
```

### 2. 带交互和属性的组件
```javascript
class CounterComponent extends HTMLElement {
  static get observedAttributes() {
    return ['init-count']
  }

  constructor() {
    super()
    this.count = 0
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = `
<style>
        .counter { padding: 12px; border: 1px solid #ccc; border-radius: 4px; }
        button { margin: 0 4px; padding: 4px 8px; cursor: pointer; }
</style>
     <div class="counter"><p>计数<span class="count-num">0</span><button class="add-btn">+</button>
       <button class="minus-btn</button>
</div>
    `
    this.countEl = this.shadowRoot.querySelector('.count-num')
    this.addBtn = this.shadowRoot.querySelector('.add-btn')
    this.minusBtn = this.shadowRoot.querySelector('.minus-btn')
  }

  connectedCallback() {
    // 绑定事件
    this.addBtn.addEventListener('click', () => this.updateCount(1))
    this.minusBtn.addEventListener('click', () => this.updateCount(-1))
    // 初始化计数
    this.count = Number(this.getAttribute('init-count')) || 0
    this.renderCount()
  }

  updateCount(num) {
    this.count += num
    this.renderCount()
    // 触发自定义事件，向外通信
    this.dispatchEvent(new CustomEvent('count-change', {
      detail: this.count,
      bubbles: true,
      composed: true // 允许事件穿透Shadow DOM
    }))
  }

  renderCount() {
    this.countEl.textContent = this.count
  }

  disconnectedCallback() {
    // 清理事件，避免内存泄漏
    this.addBtn.removeEventListener('click', () => this.updateCount(1))
    this.minusBtn.removeEventListener('click', () => this.updateCount(-1))
  }
}

customElements.define('counter-component', CounterComponent)
```

**使用+监听事件**
```html<counter-component init-count</counter-component<script>
  document.querySelector('counter-component').addEventListener('count-change', (e) => {
    console.log('计数变化：', e.detail)
</script>
```

## 四、组件通信方式
1. **属性传值**：通过HTML属性传递数据，配合`observedAttributes`监听变化
2. **插槽传内容**：使用<slot>`传入DOM结构，支持具名、默认、作用域插槽
3. **自定义事件**：通过`dispatchEvent`触发`CustomEvent`，父组件监听事件接收数据，需设置`composed: true`穿透Shadow DOM
4. **属性/方法调用**：获取组件DOM实例，直接调用组件内部方法或修改属性（仅`open`模式Shadow DOM）

## 五、兼容性
- **现代浏览器**：Chrome、Firefox、Edge、Safari 10.1+ 完全支持
- **IE浏览器**：完全不支持，可通过**polyfill**兼容（@webcomponents/webcomponentsjs）
- **兼容处理**：
<!-- 引入polyfill -->
<script src="https://unpkg.com/@webcomponents/webcomponentsjs@2.8.0/webcomponents</script>
  ```

## 六、Web Components 与框架结合
### 1. 与Vue结合
Vue组件可直接使用Web Components，需在`vite.config.js`或`vue.config.js`中声明自定义元素，避免Vue将其当作未知组件：
```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue({
    template: {
      compilerOptions: {
        // 声明自定义元素
        isCustomElement: (tag) => tag.includes('-')
      }
    }
  })]
})
```

### 2. 与React结合
直接在React中引入并使用，和原生HTML标签用法一致，注意事件监听需通过`ref`获取组件实例。

## 七、常见问题与注意事项
1. **自定义标签命名**：必须包含**短横线（-）**，如`my-component`，禁止使用`mycomponent`、`div`等原生标签名
2. **Shadow DOM样式隔离**：外部样式无法穿透，如需修改内部样式，可通过`CSS变量`、`::part()`属性暴露内部节点
3. **事件穿透**：自定义事件需设置`composed: true`，才能让事件从Shadow DOM冒泡到外部文档
4. **性能优化**：避免频繁创建/销毁Shadow DOM，合理清理事件和定时器，减少重渲染
5. **与框架组件区别**：Web Components是原生组件，无虚拟DOM，适合跨框架通用组件；框架组件有自身生态和优化，适合项目内业务组件

