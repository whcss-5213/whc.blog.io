# vite


```js
// plugins/global-components.ts
export const setupGlobalComponents = (app) => {
  const modules = import.meta.glob('../components/**/*.vue', { eager: true })
  Object.entries(modules).forEach(([key, comp]) => {
    const name = key.split('/').pop()?.replace('.vue', '')
    if (name) app.component(name, comp.default)
  })
}

// main.ts
import { setupGlobalComponents } from './plugins/global-components'
setupGlobalComponents(app)


```
