<template>
  <div id="app">
    <div class="container">
      <drag-resize
        class="demo"
        selection-container="app"
        :x="x"
        :y="y"
        :w="w"
        :h="h"
        :snap-to-grid="grid"
        :grid-x="gridX"
        :grid-y="gridY"
        :z="1"
        @stopResize="test($event)"
        @stopDrag="test($event)"
      >
        Test
      </drag-resize>
      <drag-resize
        class="demo"
        :x="40"
        :y="40"
        :w="10"
        :h="10"
        :snap-to-grid="grid"
        :grid-x="gridX"
        :grid-y="gridY"
        :z="1"
        @stopResize="test($event)"
        @stopDrag="test($event)"
      >
        Test
      </drag-resize>
      <table
        v-if="grid"
        class="grid-table"
      >
        <tr
          v-for="i in Math.ceil(100 / gridY)"
          :key="`row${i}`"
        >
          <td
            v-for="j in Math.ceil(100 / gridX)"
            :key="`column${j}`"
          />
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import DragResize from './components/DragResize.vue';

export default {
  name: 'App',
  components: {
    DragResize,
  },
  data() {
    return {
      x: 0,
      y: 0,
      w: 10,
      h: 20,
      grid: true,
      gridX: 25,
      gridY: 50,
    };
  },
  methods: {
    test(rect) {
      console.log(rect);
    },
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
  position: relative;
  width: 640px;
  height: 360px;
  margin: 60px auto;
  background-color: #7a2f34;
}
.grid-table {
  display: table;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  overflow: hidden;
  z-index: 0;
}
.grid-table,
.grid-table tr,
.grid-table th,
.grid-table td {
  margin: 0;
  padding: 0;
  border-spacing: 0;
  border-collapse: collapse;
  box-sizing: border-box;
}
.grid-table tr,
.grid-table th,
.grid-table td {
  border: 1px solid blue;
}
.demo {
  background-color: #313133;
}
</style>
