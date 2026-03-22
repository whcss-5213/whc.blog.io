## 静态资源管理处理

Vite（或类似现代打包工具）在**构建时**必须静态分析资源路径，才能自动处理图片哈希、拷贝和路径重写。`./assets/${name}.png` 是模板字符串，运行时 `name` 才确定，Vite 无法完整收集所有可能的资源（尤其不在函数里、路径相对位置不对、包含子目录，或用了 alias 如 `@/` 时），导致开发正常但打包后路径错或直接报错。

### `import.meta.glob`

```ts
// utils.ts（或直接写在组件/页面文件中）
// 路径要相对当前 .ts/.js/.vue 文件正确
const imageModules = import.meta.glob('./assets/*.png', {
  eager: true,   // 立即加载（推荐）
})

// 动态获取函数
export const getImageUrl = (name: string): string => {
  const key = `./assets/${name}.png`
  return imageModules[key] ?? ''  // 不存在时返回空，避免报错
}
```


```ts
// Vue 组件示例
const imgSrc = getImageUrl('logo')  // 或 'banner' 等

// 模板里
<img :src="getImageUrl(name)" alt="动态图片" />
```

**进阶**：
- 支持子目录：改成 `./assets/**/*.png`（`**` 通配）
- 支持 jpg/svg 等：`./assets/*.{png,jpg,svg}`

这个方案打包后全部资源都会被正确哈希处理，**推荐首选**。

### 方案2：图片不多时，手动映射（最简单清晰）

```ts
const images = {
  logo: new URL('./assets/logo.png', import.meta.url).href,
  banner: new URL('./assets/banner.png', import.meta.url).href,
  icon: new URL('./assets/icon.svg', import.meta.url).href,
  // ... 继续添加
} as const

const getImageUrl = (name: keyof typeof images) => images[name]
```

### 方案3：官方 new URL 动态写法（简单同级目录可用）

```ts
function getImageUrl(name: string) {
  // 注意：仅支持 assets/ 同一层文件，不支持子目录！
  return new URL(`./assets/${name}.png`, import.meta.url).href
}
```

官方文档明确支持这种模板字符串，但有子目录限制和 SSR 不兼容的问题。

### 方案4：最简单粗暴——放到 `public/` 文件夹（无哈希）

把图片放 `public/assets/` 下：

```ts
const imgSrc = `/assets/${name}.png`   // 直接根路径，开发和生产一致
```

适合不需要 Vite 处理哈希的场景（CDN 或简单项目）。

```ts
// utils/image.ts
const imageModules = import.meta.glob('./assets/**/*.{png,jpg,svg,webp}', {
  eager: true,
  import: 'default',
  base: './assets'
})

const imageMap = Object.fromEntries(
  Object.entries(imageModules).map(([fullPath, url]) => {
    const name = fullPath.replace(/\.(png|jpg|svg|webp)$/i, '')
    return [name, url]
  })
)

export const getImage = (name: string): string => imageMap[name] ?? '/fallback.png'

```


**小贴士**：
- 路径一定要**相对当前文件**正确（建议把 `getImageUrl` 放在 assets 同级或 utils 里）。
- TypeScript 项目记得在 `vite-env.d.ts` 或文件顶部加 `/// <reference types="vite/client" />` 获得类型提示。
- Vue 中记得用 `:src` 绑定，不要直接写在模板字符串里。


