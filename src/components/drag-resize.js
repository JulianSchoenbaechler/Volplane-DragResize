const minSnapDistance = 5;
const stickSize = 8;
const styleMapping = {
  y: {
    t: 'top',
    m: 'marginTop',
    b: 'bottom',
  },
  x: {
    l: 'left',
    m: 'marginLeft',
    r: 'right',
  },
};

export default {
  name: 'DragResize',

  data() {
    return {
      rawTop: this.y,
      rawRight: this.x + this.w,
      rawBottom: this.y + this.h,
      rawLeft: this.x,
      top: this.y,
      right: this.x + this.w,
      bottom: this.y + this.h,
      left: this.x,
      active: this.isActive,
    };
  },

  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
    preventActiveBehavior: {
      type: Boolean,
      default: false,
    },
    isDraggable: {
      type: Boolean,
      default: true,
    },
    isResizable: {
      type: Boolean,
      default: true,
    },
    snapToGrid: {
      type: Boolean,
      default: false,
    },
    gridX: {
      type: Number,
      default: 5,
      validator(val) {
        return (val > 0) && (val <= 100);
      },
    },
    gridY: {
      type: Number,
      default: 5,
      validator(val) {
        return (val > 0) && (val <= 100);
      },
    },
    parentPixelW: {
      type: Number,
      default: 0,
      validator(val) {
        return val >= 0;
      },
    },
    parentPixelH: {
      type: Number,
      default: 0,
      validator(val) {
        return val >= 0;
      },
    },
    w: {
      type: Number,
      default: 10,
      validator(val) {
        return (val > 0) && (val <= 100);
      },
    },
    h: {
      type: Number,
      default: 10,
      validator(val) {
        return (val > 0) && (val <= 100);
      },
    },
    minW: {
      type: Number,
      default: 5,
      validator(val) {
        return (val > 0) && (val <= 100);
      },
    },
    minH: {
      type: Number,
      default: 5,
      validator(val) {
        return (val > 0) && (val <= 100);
      },
    },
    x: {
      type: Number,
      default: 0,
      validator(val) {
        return typeof val === 'number';
      },
    },
    y: {
      type: Number,
      default: 0,
      validator(val) {
        return typeof val === 'number';
      },
    },
    z: {
      type: [String, Number],
      default: 'auto',
      validator(val) {
        return (typeof val === 'string') ? val === 'auto' : val >= 0;
      },
    },
    sticks: {
      type: Array,
      default() {
        return ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml'];
      },
    },
    axis: {
      type: String,
      default: 'both',
      validator(val) {
        return ['x', 'y', 'both'].indexOf(val) !== -1;
      },
    },
  },

  computed: {
    style() {
      return {
        top: `${this.top}%`,
        left: `${this.left}%`,
        width: `${this.right - this.left}%`,
        height: `${this.bottom - this.top}%`,
        zIndex: this.z,
      };
    },

    vdrStick() {
      return (stick) => {
        const stickStyle = {
          width: `${stickSize}px`,
          height: `${stickSize}px`,
        };

        stickStyle[styleMapping.y[stick[0]]] = `${stickSize / -2}px`;
        stickStyle[styleMapping.x[stick[1]]] = `${stickSize / -2}px`;

        return stickStyle;
      };
    },

    width() {
      return this.right - this.left;
    },

    height() {
      return this.bottom - this.top;
    },

    rect() {
      return {
        top: this.top,
        right: 100 - this.right,
        bottom: 100 - this.bottom,
        left: this.left,
        width: this.width,
        height: this.height,
        x: this.left,
        y: this.top,
      };
    },
  },

  watch: {
    rawTop(newTop) {
      let top = newTop;

      if (top < this.limits.minTop) {
        top = this.limits.minTop;
      } else if (top > this.limits.maxTop) {
        top = this.limits.maxTop;
      }

      this.top = top;
    },

    rawRight(newRight) {
      let right = newRight;

      if (right < this.limits.minRight) {
        right = this.limits.minRight;
      } else if (right > this.limits.maxRight) {
        right = this.limits.maxRight;
      }

      this.right = right;
    },

    rawBottom(newBottom) {
      let bottom = newBottom;

      if (bottom < this.limits.minBottom) {
        bottom = this.limits.minBottom;
      } else if (bottom > this.limits.maxBottom) {
        bottom = this.limits.maxBottom;
      }

      this.bottom = bottom;
    },

    rawLeft(newLeft) {
      let left = newLeft;

      if (left < this.limits.minLeft) {
        left = this.limits.minLeft;
      } else if (left > this.limits.maxLeft) {
        left = this.limits.maxLeft;
      }

      this.left = left;
    },

    active(isActive) {
      if (isActive) {
        this.$emit('select');
      } else {
        this.$emit('deselect');
      }
    },

    isActive(val) {
      this.active = val;
    },

    x(val) {
      if (this.stickDrag || this.bodyDrag) {
        return;
      }

      const width = this.right - this.left;
      const delta = 100 - val - width;

      if (delta <= 0) {
        this.rawLeft = 100 - width;
        this.rawRight = 100;
      } else {
        this.rawLeft = val;
        this.rawRight = val + width;
      }
    },

    y(val) {
      if (this.stickDrag || this.bodyDrag) {
        return;
      }

      const height = this.bottom - this.top;
      const delta = 100 - val - height;

      if (delta <= 0) {
        this.rawTop = 100 - height;
        this.rawBottom = 100;
      } else {
        this.rawTop = val;
        this.rawBottom = val + height;
      }
    },

    w(val) {
      if (this.stickDrag || this.bodyDrag) {
        return;
      }

      if ((val > 0) && (val <= 100)) {
        if ((val + this.left) > 100) {
          this.rawLeft = 100 - val;
          this.rawRight = 100;
        } else {
          this.rawRight = this.left + val;
        }
      }
    },

    h(val) {
      if (this.stickDrag || this.bodyDrag) {
        return;
      }

      if ((val > 0) && (val <= 100)) {
        if ((val + this.top) > 100) {
          this.rawTop = 100 - val;
          this.rawBottom = 100;
        } else {
          this.rawBottom = this.top + val;
        }
      }
    },

    parentPixelW(parentW) {
      this.parentWidth = parentW;
    },

    parentPixelH(parentH) {
      this.parentHeight = parentH;
    },
  },

  methods: {
    deselect() {
      if (this.preventActiveBehavior) {
        return;
      }
      this.active = false;
    },

    move(event) {
      if (!this.stickDrag && !this.bodyDrag) {
        return;
      }

      event.stopPropagation();

      if (this.stickDrag) {
        this.stickMove(event);
      } else if (this.bodyDrag) {
        this.bodyMove(event);
      }
    },

    up(event) {
      if (this.stickDrag) {
        this.stickUp(event);
      }
      if (this.bodyDrag) {
        this.bodyUp(event);
      }
    },

    calcSnapping(x, y) {
      const divX = x / this.gridX;
      const divY = y / this.gridY;
      const lowerX = Math.floor(divX) * this.gridX;
      const upperX = Math.ceil(divX) * this.gridX;
      const lowerY = Math.floor(divY) * this.gridY;
      const upperY = Math.ceil(divY) * this.gridY;
      const value = {
        snapX: true,
        snapY: true,
        diffX: 0,
        diffY: 0,
        newX: 0,
        newY: 0,
      };

      if ((x - lowerX) <= (upperX - x)) {
        value.diffX = x - lowerX;
        value.newX = lowerX;
      } else {
        value.diffX = upperX - x;
        value.newX = upperX;
      }

      if ((y - lowerY) <= (upperY - y)) {
        value.diffY = y - lowerY;
        value.newY = lowerY;
      } else {
        value.diffY = upperY - y;
        value.newY = upperY;
      }

      if (value.diffX > minSnapDistance) { value.snapX = false; }
      if (value.diffY > minSnapDistance) { value.snapY = false; }

      return value;
    },

    bodyDown(event) {
      if (!this.preventActiveBehavior) {
        this.active = true;
      }

      if (event.button && event.button !== 0) {
        return;
      }

      if (!this.isDraggable || !this.active) {
        return;
      }

      this.stickStartPos.mouseX = event.pageX;
      this.stickStartPos.mouseY = event.pageY;

      this.stickStartPos.t = this.top;
      this.stickStartPos.b = this.bottom;
      this.stickStartPos.r = this.right;
      this.stickStartPos.l = this.left;

      this.limits = this.calcDragLimitation();

      this.bodyDrag = true;
    },

    calcDragLimitation() {
      return {
        minLeft: 0,
        maxLeft: 100 - this.width,
        minRight: this.width,
        maxRight: 100,
        minTop: 0,
        maxTop: 100 - this.height,
        minBottom: this.height,
        maxBottom: 100,
      };
    },

    bodyMove(event) {
      const delta = {
        x: this.axis !== 'y' ? this.stickStartPos.mouseX - event.pageX : 0,
        y: this.axis !== 'x' ? this.stickStartPos.mouseY - event.pageY : 0,
      };

      const offsetX = (100 / this.parentWidth) * delta.x;
      const offsetY = (100 / this.parentHeight) * delta.y;

      let newTop = this.stickStartPos.t - offsetY;
      let newBottom = this.stickStartPos.b - offsetY;
      let newLeft = this.stickStartPos.l - offsetX;
      let newRight = this.stickStartPos.r - offsetX;

      if (this.snapToGrid) {
        const snapTopLeft = this.calcSnapping(newLeft, newTop);
        const snapBottomRight = this.calcSnapping(newRight, newBottom);

        // Snap x axis
        if (snapTopLeft.snapX || snapBottomRight.snapX) {
          if (snapTopLeft.diffX <= snapBottomRight.diffX) {
            newLeft = snapTopLeft.newX;
            newRight = newLeft + this.width;
          } else {
            newRight = snapBottomRight.newX;
            newLeft = newRight - this.width;
          }
        }

        // Snap y axis
        if (snapTopLeft.snapY || snapBottomRight.snapY) {
          if (snapTopLeft.diffY <= snapBottomRight.diffY) {
            newTop = snapTopLeft.newY;
            newBottom = newTop + this.height;
          } else {
            newBottom = snapBottomRight.newY;
            newTop = newBottom - this.height;
          }
        }
      }

      this.rawTop = newTop;
      this.rawBottom = newBottom;
      this.rawLeft = newLeft;
      this.rawRight = newRight;
      this.$emit('drag', this.rect);
    },

    bodyUp() {
      this.bodyDrag = false;
      this.$emit('drag', this.rect);
      this.$emit('stopDrag', this.rect);

      this.stickStartPos = {
        mouseX: 0,
        mouseY: 0,
        t: 0,
        b: 0,
        r: 0,
        l: 0,
      };

      this.limits = {
        minLeft: 0,
        maxLeft: 100,
        minRight: 0,
        maxRight: 100,
        minTop: 0,
        maxTop: 100,
        minBottom: 0,
        maxBottom: 100,
      };
    },

    stickDown(stick, event) {
      if (!this.isResizable || !this.active) {
        return;
      }

      const currentStick = stick.split('');

      this.stickStartPos.mouseX = event.pageX;
      this.stickStartPos.mouseY = event.pageY;

      this.stickStartPos.t = this.top;
      this.stickStartPos.b = this.bottom;
      this.stickStartPos.r = this.right;
      this.stickStartPos.l = this.left;

      this.resizeEdges.t = currentStick[0] === 't';
      this.resizeEdges.b = currentStick[0] === 'b';
      this.resizeEdges.r = currentStick[1] === 'r';
      this.resizeEdges.l = currentStick[1] === 'l';

      this.stickDrag = true;

      this.limits = this.calcResizeLimitation();
    },

    calcResizeLimitation() {
      return {
        minLeft: 0,
        maxLeft: (this.left + this.width) - this.minW,
        minRight: this.left + this.minW,
        maxRight: 100,
        minTop: 0,
        maxTop: (this.top + this.height) - this.minH,
        minBottom: this.top + this.minH,
        maxBottom: 100,
      };
    },

    stickMove(event) {
      const delta = {
        x: this.stickStartPos.mouseX - event.pageX,
        y: this.stickStartPos.mouseY - event.pageY,
      };

      const offsetX = (100 / this.parentWidth) * delta.x;
      const offsetY = (100 / this.parentHeight) * delta.y;

      let newTop = this.stickStartPos.t - offsetY;
      let newBottom = this.stickStartPos.b - offsetY;
      let newLeft = this.stickStartPos.l - offsetX;
      let newRight = this.stickStartPos.r - offsetX;

      if (this.snapToGrid) {
        const snapTopLeft = this.calcSnapping(newLeft, newTop);
        const snapBottomRight = this.calcSnapping(newRight, newBottom);

        if (snapTopLeft.snapX) { newLeft = snapTopLeft.newX; }
        if (snapTopLeft.snapY) { newTop = snapTopLeft.newY; }
        if (snapBottomRight.snapX) { newRight = snapBottomRight.newX; }
        if (snapBottomRight.snapY) { newBottom = snapBottomRight.newY; }
      }

      if (this.resizeEdges.t) { this.rawTop = newTop; }
      if (this.resizeEdges.b) { this.rawBottom = newBottom; }
      if (this.resizeEdges.r) { this.rawRight = newRight; }
      if (this.resizeEdges.l) { this.rawLeft = newLeft; }

      this.$emit('resize', this.rect);
    },

    stickUp() {
      this.stickDrag = false;
      this.$emit('resize', this.rect);
      this.$emit('stopResize', this.rect);

      this.stickStartPos = {
        mouseX: 0,
        mouseY: 0,
        t: 0,
        b: 0,
        r: 0,
        l: 0,
      };

      this.limits = {
        minLeft: 0,
        maxLeft: 100,
        minRight: 0,
        maxRight: 100,
        minTop: 0,
        maxTop: 100,
        minBottom: 0,
        maxBottom: 100,
      };
    },
  },

  created() {
    this.stickDrag = false;
    this.bodyDrag = false;

    // In percent
    this.limits = {
      minLeft: 0,
      maxLeft: 100,
      minRight: 0,
      maxRight: 100,
      minTop: 0,
      maxTop: 100,
      minBottom: 0,
      maxBottom: 100,
    };

    // In pixels
    this.stickStartPos = {
      mouseX: 0,
      mouseY: 0,
      t: 0,
      b: 0,
      r: 0,
      l: 0,
    };

    this.resizeEdges = {
      t: false,
      b: false,
      r: false,
      l: false,
    };
  },

  mounted() {
    this.parentElement = this.$el.parentNode;
    this.parentWidth = this.parentPixelW || this.parentElement.clientWidth;
    this.parentHeight = this.parentPixelH || this.parentElement.clientHeight;

    document.documentElement.addEventListener('mousemove', this.move);
    document.documentElement.addEventListener('mouseup', this.up);
    document.documentElement.addEventListener('mouseleave', this.up);
    document.documentElement.addEventListener('mousedown', this.deselect);
  },

  beforeDestroy() {
    document.documentElement.removeEventListener('mousemove', this.move);
    document.documentElement.removeEventListener('mouseup', this.up);
    document.documentElement.removeEventListener('mouseleave', this.up);
    document.documentElement.removeEventListener('mousedown', this.deselect);
  },
};
