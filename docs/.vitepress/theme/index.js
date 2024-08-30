import DefaultTheme from 'vitepress/theme'
import Confetti from '../../src/components/Confetti.vue'

export default {
  ...DefaultTheme,
  enhanceApp({ app, router }) {
    app.component('Confetti', Confetti) //注册全局组件
  }
}
