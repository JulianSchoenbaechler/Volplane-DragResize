<template>
  <div id="app">
    <div class="container">
      <drag-resize :preventActiveBehavior="false" :isActive="false">
        Test
      </drag-resize>
    </div>
  </div>
</template>

<script>
import DragResize from './components/DragResize.vue';

export default {
  name: 'app',
  components: {
    DragResize,
  },
};
</script>

<style>
#app {
  margin: 0;
  padding: 0;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #f8f8ec;
}
.container {
  display: block;
  width: 640px;
  height: 360px;
  margin: 60px auto;
  background-color: #7a2f34;
}
</style>
