# @fn/theme

Uno CSS 的主题变量，基于Figma。

## 安装

在项目根目录下添加 `.npmrc` 文件，写入以下注册表指向：

```bash
@fn:registry=http://verdaccio.teiron-inc.cn:4873/
```

即可安装本包。

```bash
pnpm add @fn/theme
```

为了正常使用，通常需要一起安装 Uno CSS ，并遵循 Uno 的配置说明启用它（ e.g. [Vite Plugin](https://unocss.dev/integrations/vite) ）.

```bash
pnpm add -D unocss
```

## 用法

基于 Uno CSS 的项目，两步轻松使用。

### 添加 Uno 配置

```ts
// uno.config.ts
import { defineConfig } from 'unocss'
import { theme } from '@fn/theme'

export default defineConfig({
  theme,
})
```

### 引入变量资源

```ts
// main.tsx
import '@fn/theme/light-variables.css'
import '@fn/theme/dark-variables.css'
```
