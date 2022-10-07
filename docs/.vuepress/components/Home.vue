<script setup>
import { onMounted } from 'vue'
const url = () => {
  const footer = document.getElementsByClassName("footer");
  const a = document.createElement("A");
  a.href = "https://beian.miit.gov.cn/#/Integrated/index";
  a.textContent = "蜀ICP备20004855号-1";
  a.target = "_black";
  footer[0].appendChild(a);
}
onMounted(() => {
  url()
})

</script>