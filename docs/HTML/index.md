# HTML

## img

浏览器原生懒加载
```html
<img src="pic.jpg" loading="lazy" alt="" width="400" height="300">
```
## script

### 一、核心基础属性
| 属性 | 说明 | 示例 |
|------|------|------|
| `src` | 外部脚本的 URL，引入外部 JS 文件 | `<script src="app.js"></script>` |
| `type` | 指定脚本 MIME 类型，默认是 `text/javascript` | `<script type="module" src="module.js"></script>` |
| `async` | 异步加载脚本，加载完成后立即执行（不保证执行顺序） | `<script src="analytics.js" async></script>` |
| `defer` | 脚本延迟到 HTML 解析完成后执行（按引入顺序执行） | `<script src="utils.js" defer></script>` |
| `integrity` | 子资源完整性校验（SRI），验证脚本未被篡改 | `<script src="app.js" integrity="sha384-xxx" crossorigin="anonymous"></script>` |
| `crossorigin` | 跨域脚本请求配置，用于 CORS 和 SRI 校验 | `<script src="https://cdn.com/app.js" crossorigin="anonymous"></script>` |

---

### 二、加载与执行控制属性（async vs defer）
这两个属性是前端性能优化的关键，区别如下：

| 特性 | `async` | `defer` |
|------|---------|---------|
| 加载方式 | 异步下载，不阻塞 HTML 解析 | 异步下载，不阻塞 HTML 解析 |
| 执行时机 | 下载完成后立即执行（可能阻塞解析） | HTML 解析完成后、`DOMContentLoaded` 前执行 |
| 执行顺序 | 谁先下载完谁先执行，顺序不可控 | 按脚本引入顺序执行 |
| 适用场景 | 独立脚本（如统计、广告、第三方 SDK） | 依赖 DOM 的脚本（如页面初始化逻辑） |

示例：
```html
<!-- 第三方独立脚本，用 async 不影响页面加载 -->
<script src="https://www.google-analytics.com/analytics.js" async></script>

<!-- 依赖 DOM 的脚本，用 defer 确保 DOM 已解析 -->
<script src="init-page.js" defer></script>
```

---

### 三、现代模块相关属性
| 属性 | 说明 | 示例 |
|------|------|------|
| `type="module"` | 将脚本声明为 ES Module，默认开启 `defer` 行为 | `<script type="module" src="main.js"></script>` |
| `nomodule` | 为不支持 ES Module 的旧浏览器提供降级脚本 | `<script nomodule src="legacy.js"></script>` |

典型用法（现代+兼容方案）：
```html
<!-- 现代浏览器加载 ES Module -->
<script type="module" src="modern-app.js"></script>
<!-- 旧浏览器加载降级脚本 -->
<script nomodule src="legacy-app.js"></script>
```

---

### 四、安全与其他常用属性
| 属性 | 说明 | 示例 |
|------|------|------|
| `id` | 给脚本设置唯一 ID，用于后续操作 | `<script id="main-script" src="app.js"></script>` |
| `charset` | 指定脚本文件的字符编码（HTML5 已不推荐，一般无需设置） | `<script src="app.js" charset="UTF-8"></script>` |
| `referrerpolicy` | 控制请求时的 Referer 头信息 | `<script src="app.js" referrerpolicy="no-referrer"></script>` |
| `onerror` | 脚本加载失败时的回调函数 | `<script src="app.js" onerror="handleScriptError()"></script>` |
| `onload` | 脚本加载成功时的回调函数 | `<script src="app.js" onload="console.log('loaded')"></script>` |

---

### 五、属性组合与最佳实践
1.  **`async` 与 `defer` 不能同时使用**：两者互斥，同时设置时浏览器会忽略 `defer`。
2.  **`type="module"` 与 `async`/`defer` 的关系**：
    - 默认 `type="module"` 自带 `defer` 效果，无需额外设置；
    - 若给模块脚本加 `async`，则会变成“下载完成后立即执行”的异步模式。
3.  **SRI 必须配合 `crossorigin`**：跨域脚本使用 `integrity` 时，必须设置 `crossorigin="anonymous"`，否则校验失败。


