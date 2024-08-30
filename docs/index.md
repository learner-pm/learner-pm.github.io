---
layout: home

hero:
  name: Blog
  text: 前端、后端、计算机网络等
  tagline: 学习 & 记录
  image:
    src: /logo.jpg
    alt: Blog
  actions:
    - theme: brand
      text: Get Started
      link: /frontEnd/basic/
    - theme: alt
      text: View on GitHub
      link: https://github.com/learner-pm/learner-pm.github.io
features:
  - icon: 🛠️
    title: 基础性内容
    details: 计算机系统的基础性内容，以及前端和浏览器等方面知识。
  - icon: 🛠️
    title: 框架和轮子
    details: 学习框架内核，深入理解其核心。学习现代前端开发工程化过程。
  - icon: 🛠️
    title: 记录和学习
    details: 记录个人学习进度，记录造轮子过程，搜集面试题。
---

<Home />
<Visits />
<Confetti />

<script setup>
import Home from './src/components/Home.vue'
import Visits from './src/components/Visits.vue'
</script>
