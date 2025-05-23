<template>
  <div class="app">
    <h1>3D纸币效果</h1>
    <MoneyBill />
  </div>
</template>

<script>
import MoneyBill from '@/components/three.vue';

export default {
  name: 'App',
  components: {
    MoneyBill
  }
};
</script>

<style>
.app {
  text-align: center;
}
</style>