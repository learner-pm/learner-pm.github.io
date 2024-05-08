<script setup>
import { onMounted } from 'vue'
const footer = document.getElementsByClassName('VPFooter')
//const home = document.getElementsByClassName("Layout");
const url = () => {
  const a = document.createElement('A')
  a.href = 'https://beian.miit.gov.cn/#/Integrated/index'
  a.textContent = ' 蜀ICP备20004855号-1'
  a.target = '_black'

  footer[0].appendChild(a)
}
const setText = () => {
  const p = document.body.createElement('P')
  p.textContent = '山不在高，有仙则灵    水不在深，有龙则灵'
  p.setAttribute('class', 'home-add-text')
  footer[0].insertBefore(p, footer[0].getElementsByClassName('container')[0])
}

const setFooter = () => {
  footer[0].style = 'border-top:0px;padding-top:0px;'
}
onMounted(() => {
  const footer = document.getElementsByClassName('home-add-text')
  if (footer.length > 0) {
    return
  }
  setFooter()
  // 部署在GitHub上后无备案号
  // url()
  setText()
})
</script>

<style>
.home-add-text {
  text-align: center;
  font-size: 18px;
  padding: 20px 0px;
  margin-bottom: 32px;
  border-top: 1px solid var(--vp-c-gutter);
  border-bottom: 1px solid var(--vp-c-gutter);
}
</style>
