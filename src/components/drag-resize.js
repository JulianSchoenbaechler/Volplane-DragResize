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
      default: 50,
      validator(val) {
        return val > 0;
      },
    },
    gridY: {
      type: Number,
      default: 50,
      validator(val) {
        return val > 0;
      },
    },
    parentW: {
      type: Number,
      default: 0,
      validator(val) {
        return val >= 0;
      },
    },
    parentH: {
      type: Number,
      default: 0,
      validator(val) {
        return val >= 0;
      },
    },
    w: {
      type: Number,
      default: 100,
      validator(val) {
        return val > 0;
      },
    },
    h: {
      type: Number,
      default: 100,
      validator(val) {
        return val > 0;
      },
    },
    minW: {
      type: Number,
      default: 50,
      validator(val) {
        return val > 0;
      },
    },
    minH: {
      type: Number,
      default: 50,
      validator(val) {
        return val > 0;
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
        top: `${this.top}px`,
        left: `${this.left}px`,
        width: `${this.right - this.left}px`,
        height: `${this.bottom - this.top}px`,
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
        top: Math.round(this.top),
        right: Math.round(this.parentWidth - this.right),
        bottom: Math.round(this.parentHeight - this.bottom),
        left: Math.round(this.left),
        width: Math.round(this.width),
        height: Math.round(this.height),
        x: Math.round(this.left),
        y: Math.round(this.top),
      };
    },

    normalizedRect() {
      return {
        top: this.top / this.parentHeight,
        right: (this.parentWidth - this.right) / this.parentWidth,
        bottom: (this.parentHeight - this.bottom) / this.parentHeight,
        left: this.left / this.parentWidth,
        width: 1,
        height: 1,
        x: this.left / this.parentWidth,
        y: this.top / this.parentHeight,
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

    bodyDown(event) {
      if (!this.preventActiveBehavior) {
        this.active = true;
      }

      if (event.button && event.button !== 0) {
        return;
      }

      this.$emit('onClicked', event);

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
        maxLeft: this.parentWidth - this.width,
        minRight: this.width,
        maxRight: this.parentWidth,
        minTop: 0,
        maxTop: this.parentHeight - this.height,
        minBottom: this.height,
        maxBottom: this.parentHeight,
      };
    },

    bodyMove(event) {
      const delta = {
        x: this.axis !== 'y' ? this.stickStartPos.mouseX - event.pageX : 0,
        y: this.axis !== 'x' ? this.stickStartPos.mouseY - event.pageY : 0,
      };

      // let newTop = stickStartPos.top - delta.y;
      // let newBottom = stickStartPos.bottom + delta.y;
      // let newLeft = stickStartPos.left - delta.x;
      // let newRight = stickStartPos.right + delta.x;

      /* if (this.snapToGrid) {
        let alignTop = true;
        let alignLeft = true;

        let diffT = newTop - Math.floor(newTop / gridY) * gridY;
        let diffB = (parentHeight - newBottom) - Math.floor((parentHeight - newBottom) / gridY)
         * gridY;
        let diffL = newLeft - Math.floor(newLeft / gridX) * gridX;
        let diffR = (parentWidth - newRight) - Math.floor((parentWidth - newRight) / gridX) * gridX;

        if (diffT > (gridY / 2)) { diffT -= gridY; }
        if (diffB > (gridY / 2)) { diffB -= gridY; }
        if (diffL > (gridX / 2)) { diffL -= gridX; }
        if (diffR > (gridX / 2)) { diffR -= gridX; }

        if (Math.abs(diffB) < Math.abs(diffT)) { alignTop = false; }
        if (Math.abs(diffR) < Math.abs(diffL)) { alignLeft = false; }

        newTop -= (alignTop ? diffT : diffB);
        newBottom = parentHeight - height - newTop;
        newLeft -= (alignLeft ? diffL : diffR);
        newRight = parentWidth - width - newLeft;
      } */

      this.rawTop = this.stickStartPos.t - delta.y;
      this.rawBottom = this.stickStartPos.b - delta.y;
      this.rawLeft = this.stickStartPos.l - delta.x;
      this.rawRight = this.stickStartPos.r - delta.x;
      this.$emit('onDrag', this.rect);
    },

    bodyUp() {
      this.bodyDrag = false;
      this.$emit('onDrag', this.rect);
      this.$emit('onStopDragging', this.rect);

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
        maxLeft: this.parentWidth,
        minRight: 0,
        maxRight: this.parentWidth,
        minTop: 0,
        maxTop: this.parentHeight,
        minBottom: 0,
        maxBottom: this.parentHeight,
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
        maxRight: this.parentWidth,
        minTop: 0,
        maxTop: (this.top + this.height) - this.minH,
        minBottom: this.top + this.minH,
        maxBottom: this.parentHeight,
      };
    },

    stickMove(event) {
      const delta = {
        x: this.stickStartPos.mouseX - event.pageX,
        y: this.stickStartPos.mouseY - event.pageY,
      };

      const newTop = this.stickStartPos.t - delta.y;
      const newBottom = this.stickStartPos.b - delta.y;
      const newRight = this.stickStartPos.r - delta.x;
      const newLeft = this.stickStartPos.l - delta.x;

      if (this.resizeEdges.t) {
        this.rawTop = newTop;
      }

      if (this.resizeEdges.b) {
        this.rawBottom = newBottom;
      }

      if (this.resizeEdges.r) {
        this.rawRight = newRight;
      }

      if (this.resizeEdges.l) {
        this.rawLeft = newLeft;
      }

      this.$emit('onResize', this.rect);
    },

    stickUp() {
      this.stickDrag = false;
      this.$emit('onResize', this.rect);
      this.$emit('onStopResizing', this.rect);

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
        maxLeft: this.parentWidth,
        minRight: 0,
        maxRight: this.parentWidth,
        minTop: 0,
        maxTop: this.parentHeight,
        minBottom: 0,
        maxBottom: this.parentHeight,
      };
    },
  },

  created() {
    this.stickDrag = false;
    this.bodyDrag = false;

    this.limits = {
      minLeft: 0,
      maxLeft: this.parentWidth,
      minRight: 0,
      maxRight: this.parentWidth,
      minTop: 0,
      maxTop: this.parentHeight,
      minBottom: 0,
      maxBottom: this.parentHeight,
    };

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
    this.parentWidth = this.parentW ? this.parentW : this.parentElement.clientWidth;
    this.parentHeight = this.parentH ? this.parentH : this.parentElement.clientHeight;

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
