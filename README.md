# Volplane-DragResize
> A Vue component for resizing and dragging elements in relative space.

## Table of Contents
- [Description](#description)
- [Features](#features)
- [Install and basic usage](#install-and-basic-usage)
  - [Props](#props)
  - [Events](#events)
- [Contributing](#contributing)
- [License](#license)

## Description
This is a Vue component written with [Vue-CLI 3](https://cli.vuejs.org/) for resizing and dragging elements in relative space. All position and size properties are handled and calculated in percentage values, relative to the parent element. This library is inspired by [vue-drag-resize](https://github.com/kirillmurashov/vue-drag-resize) by [kirillmurashov](https://github.com/kirillmurashov), just with less features and more constraints. It is primarily built for the use in [Volplane's Controller Editor](https://github.com/JulianSchoenbaechler/Volplane-ControllerEditor) (v1.1), and therefore limited to only the features that are actually needed in this environment. However, you are free to advance this project und file up a pull request for additional functionality.

[The Volplane Project](https://volplane.julian-s.ch/)


## Features
- Lightweight
- All props are reactive
- All calculations are in relative space
- Use draggable, resizable or both
- Define sticks for resizing
- Restrict drag to vertical or horizontal axis

## Install and basic usage
```bash
npm i -s volplane-drag-resize
```

**Register the component:**
```js
import Vue from 'vue';
import DragResize from 'volplane-drag-resize';

// Optional: import standard style sheet
import 'volplane-drag-resize/lib/volplane-drag-resize.css';

Vue.component('drag-resize', DragResize);
```

**Use the component:**
```vue
<template>
  <div id="app">
    <drag-resize
      :isActive="true"
      :w="10"
      :h="50"
      @resize="print"
      @drag="print"
    >
      <h3>Hello World!</h3>
      <p>{{ top }} х {{ left }} </p>
      <p>{{ width }} х {{ height }}</p>
    </drag-resize>
  </div>
</template>

<script>
  import DragResize from 'volplane-drag-resize';
  import 'volplane-drag-resize/lib/volplane-drag-resize.css';

  export default {
    name: 'app',

    components: {
      DragResize,
    },

    data() {
      return {
        width: 0,
        height: 0,
        top: 0,
        left: 0,
      }
    },

    methods: {
      print(rect) {
        this.width = rect.width;
        this.height = rect.height;
        this.top = rect.top;
        this.left = rect.left;
      },
    },
  };
</script>
```

### Props

#### isActive
Type: `Boolean`<br>
Required: `false`<br>
Default: `false`

Determines whether the component should be active.

```html
<vue-drag-resize :isActive="true">
```

#### preventActiveBehavior
Type: `Boolean`<br>
Required: `false`<br>
Default: `false`

Disable behavior of the component by clicking on it and clicking outside the component's area.
If the prop is enabled, the component is oriented only to the currently specified.

```html
<vue-drag-resize :preventActiveBehavior="true">
```

#### isDraggable
Type: `Boolean`<br>
Required: `false`<br>
Default: `true`

Determines if the component should be draggable.

```html
<vue-drag-resize :isDraggable="false">
```

#### isResizable
Type: `Boolean`<br>
Required: `false`<br>
Default: `true`

Determines if the component should be resizable.

```html
<vue-drag-resize :isResizable="false">
```

#### parentPixelW
Type: `Number`<br>
Required: `false`<br>
Default: `0`

Defines the initial pixel width of the parent element. If this property is not specified, the parent width will be calculated automatically on initialization.
This property can modify the calculation in real-time.

```html
<vue-drag-resize :parentPixelW="640">
```

#### parentPixelH
Type: `Number`<br>
Required: `false`<br>
Default: `0`

Defines the initial pixel height of the parent element. If this property is not specified, the parent height will be calculated automatically on initialization.
This property can modify the calculation in real-time.

```html
<vue-drag-resize :parentPixelH="360">
```

#### w
Type: `Number`<br>
Required: `false`<br>
Default: `10`

Defines the initial width of the component in percent (0 - 100).

```html
<vue-drag-resize :w="20">
```

#### h
Type: `Number`<br>
Required: `false`<br>
Default: `10`

Defines the initial height of the component in percent (0 - 100).

```html
<vue-drag-resize :h="40">
```

#### minW
Type: `Number`<br>
Required: `false`<br>
Default: `5`

Defines the minimal width of the component in percent (0 - 100).

```html
<vue-drag-resize :minW="10">
```

#### minH
Type: `Number`<br>
Required: `false`<br>
Default: `5`

Defines the minimal height of the component in percent (0 - 100).

```html
<vue-drag-resize :minH="10">
```

#### x
Type: `Number`<br>
Required: `false`<br>
Default: `0`

Define the initial x position of the component in percent (0 - 100).

```html
<vue-drag-resize :x="25">
```

#### y
Type: `Number`<br>
Required: `false`<br>
Default: `0`

Define the initial y position of the component in percent (0 - 100).

```html
<vue-drag-resize :y="15">
```

#### z
Type: `Number|String`<br>
Required: `false`<br>
Default: `auto`

Define the z-index of the component in percent (0 - 100).

```html
<vue-drag-resize :z="23">
```

#### snapToGrid
Type: `Boolean`<br>
Required: `false`<br>
Default: `false`

Determines whether the component should move and resize in predefined steps.

```html
<vue-drag-resize :snapToGrid="true">
```

#### gridX
Type: `Number`<br>
Required: `false`<br>
Default: `5`

Define the grid step size for the horizontal axis in percent (0 - 100). Both sides of the component (left and right) will snap to this step.

```html
<vue-drag-resize :snapToGrid="true" :gridX="20">
```

#### gridY
Type: `Number`<br>
Required: `false`<br>
Default: `5`

Define the grid step size for the vertical axis in percent (0 - 100). Both sides of the component (top and bottom) will snap to this step.

```html
<vue-drag-resize :snapToGrid="true" :gridY="20">
```

#### sticks
Type: `Array`<br>
Required: `false`<br>
Default: `['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml']`

Defines the handles to restrict the element resizing:
- `tl` - Top left
- `tm` - Top middle
- `tr` - Top right
- `mr` - Middle right
- `br` - Bottom right
- `bm` - Bottom middle
- `bl` - Bottom left
- `ml` - Middle left

```html
<vue-drag-resize :sticks="['tm','bm','ml','mr']">
```

#### axis
Type: `String`<br>
Required: `false`<br>
Default: `both`

Defines the axis on which the element is draggable. Available values are `x`, `y` or `both`.

```html
<vue-drag-resize axis="x">
```

### Events

#### drag
Parameters: `Object`

```javascript
{
  left: Number,   // The left (x) position value of this component
  top: Number,    // The top (y) position value of this component
  right: Number,  // The right position value of this component
  bottom: Number, // The bottom position value of this component
  width: Number,  // The width of this component
  height: Number, // The height of this component
  x: Number,      // The left (x) position value of this component
  y: Number,      // The top (y) position value of this component
}
```

Called whenever the component gets dragged.

```html
<vue-drag-resize @drag="onDrag">
```

#### stopDrag
Parameters: `Object`

```javascript
{
  left: Number,   // The left (x) position value of this component
  top: Number,    // The top (y) position value of this component
  right: Number,  // The right position value of this component
  bottom: Number, // The bottom position value of this component
  width: Number,  // The width of this component
  height: Number, // The height of this component
  x: Number,      // The left (x) position value of this component
  y: Number,      // The top (y) position value of this component
}
```

Called whenever the component is released after dragging.

```html
<vue-drag-resize @stopDrag="onStopDrag">
```

#### resize
Parameters: `Object`

```javascript
{
  left: Number,   // The left (x) position value of this component
  top: Number,    // The top (y) position value of this component
  right: Number,  // The right position value of this component
  bottom: Number, // The bottom position value of this component
  width: Number,  // The width of this component
  height: Number, // The height of this component
  x: Number,      // The left (x) position value of this component
  y: Number,      // The top (y) position value of this component
}
```

Called whenever the component gets resized.

```html
<vue-drag-resize @resize="onResize">
```

#### stopResize
Parameters: `Object`

```javascript
{
  left: Number,   // The left (x) position value of this component
  top: Number,    // The top (y) position value of this component
  right: Number,  // The right position value of this component
  bottom: Number, // The bottom position value of this component
  width: Number,  // The width of this component
  height: Number, // The height of this component
  x: Number,      // The left (x) position value of this component
  y: Number,      // The top (y) position value of this component
}
```

Called whenever the component is released after resizing.

```html
<vue-drag-resize @stopResize="onStopResize">
```

#### select
Parameters: `-`

Called whenever the component gets selected.

```html
<vue-drag-resize @select="onSelect">
```

#### deselect
Parameters: `-`

Called whenever the component gets deselected.

```html
<vue-drag-resize @deselect="onDeselect">
```

## Contributing
Contributions of any kind are welcome. Open up a [pull request](pulls) or [file a ticket](issues).

**Compiles and hot-reloads for development:**
```bash
npm run serve
```

**Compiles and minifies for production:**
```bash
npm run build
```

**Lints and fixes files:**
```bash
npm run lint
```

## License
[MIT license](LICENSE)

---
&copy; [Julian Schönbächler](https://julian-s.ch/), 2018
