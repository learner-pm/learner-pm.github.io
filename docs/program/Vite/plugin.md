# Plugin

编写插件

使用命令行创建项目，按提示完成项目的创建

```bash
pnpm create vite
```

在项目更目录下创建`plugin`目录，然后创建名为`test`的js文件

在文件内默认导出一个js函数，该函数将作为插件函数使用

```js
export default function myPlugin(options = {}) {}
```

在vite的配置文件中使用

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import test from './plugins/test.js'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), test()]
})
```

现在来在插件函数中编写具体的代码。该函数的返回值会作为具体的插件配置交给vite，有以下几个常见的属性

```js
export default function myPlugin(options = {}) {
  return {
    name: 'my-plugin', // 插件名称

    // 在 Vite 构建开始时调用
    buildStart() {},

    // 在每个模块被加载时调用
    transform(code, id) {},

    // 在 Vite 开发服务器启动时调用
    configureServer(server) {}
  }
}
```

下面增加一个功能，将js文件中的`console.log`修改为`console.debug`，这主要在transform中进行操作

```js
    transform(code, id) {
      if (id.endsWith(".js")) {
        return {
          code: code.replace("console.log", "console.debug"),
          map: null,
        };
      }
    },
```

随便编写一个测试js文件

```js
const testA = () => {
  console.log(11)
}

export { testA }
```

在组件中使用中引入

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { testA } from '../c.js'

defineProps<{ msg: string }>()

const count = ref(0)
</script>

<button
  type="button"
  @click="
    () => {
      testA()
      count++
    }
  "
>count is {{ count }}</button>
```

重新构建后再页面上点击按钮，在控制台中会看到该函数的输出，这样就完成了一次插件的开发。
