<template>
  <p class="visit">Visit: {{ v || '-' }}</p>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const v = ref(0);

const fetchVisit = async () => {
  try {
    const res = await fetch('http://122.51.156.141:3000/api/visit-count');
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    v.value = data.visitCount;
  } catch (error) {
    console.error('请求失败:', error);
  }
};

onMounted(() => {
  fetchVisit();
});
</script>



<style scoped>
.visit{
  text-align: center;
  font-size: 20px;
  margin-top: 20px;
  color:#4cb2fb;
}
</style>