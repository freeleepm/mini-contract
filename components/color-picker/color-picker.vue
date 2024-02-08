<template>
  <uni-popup ref="popupRef" type="bottom" class="color-base" :safe-area="false">
    <div class="color-picker">
      <div
        ref="slider"
        class="sv-picker"
        @touchstart="setSlider($event, 'sv')"
        @touchmove="moveSlide($event, 'sv')"
      >
        <div class="sv-picker-background" :style="{ backgroundColor: svBackgroundColor }"></div>
        <div
          class="sv-picker-background"
          :style="{ background: 'linear-gradient(to right, white, #ffffff00)' }"
        ></div>
        <div
          class="sv-picker-background"
          :style="{ background: 'linear-gradient(to top, black, #ffffff00)' }"
        ></div>
        <view
          class="sv-slider"
          :style="svSliderStyle"
          @touchstart="touchSlider($event, 'sv')"
          @touchmove="moveSlide($event, 'sv')"
        ></view>
      </div>
      <div class="result">
        <div class="result-color alpha-background-image">
          <div class="alpha-background" :style="{ background: pickedColor.rgb }"></div>
        </div>
        <div class="result-text">
          <p>{{ pickedColor.rgb }}</p>
          <p>{{ pickedColor.hex }}</p>
        </div>
      </div>
      <div
        class="hue-slider"
        @touchstart="setSlider($event, 'hue')"
        @touchmove="moveSlide($event, 'hue')"
      >
        <view
          class="slider"
          :style="hueSliderStyle"
          @touchstart="touchSlider($event, 'hue')"
          @touchmove="moveSlide($event, 'hue')"
        ></view>
      </div>
      <div
        class="alpha-slider alpha-background-image"
        @touchstart="setSlider($event, 'alpha')"
        @touchmove="moveSlide($event, 'alpha')"
      >
        <div class="alpha-background" :style="{ background: alphaBackground }"></div>
        <view
          class="slider"
          :style="alphaSliderStyle"
          @touchstart="touchSlider($event, 'alpha')"
          @touchmove="moveSlide($event, 'alpha')"
        ></view>
      </div>
    </div>
  </uni-popup>
</template>

<script>
export default {
  props: {
    color: {
      value: String,
      default: '',
    },
  },
  data() {
    return {
      hueSlider: 0,
      alphaSlider: uni.upx2px(750),
      saturationSlider: uni.upx2px(750),
      valueSlider: 0,
      pickerWidth: uni.upx2px(750),
      pickerOffsetX: 0,
      halfSilder: (uni.getSystemInfoSync().windowWidth / 750) * 15,
    };
  },
  watch: {
    color: {
      handler() {
        if (this.color && this.color !== this.pickedColor.hex) {
          this.$nextTick(() => {
            const { r, g, b, a } = hexToRgba(this.color);
            const { h, s, v } = rgbToHsv(r, g, b);
            this.hueSlider = h * this.pickerWidth;
            this.alphaSlider = a * this.pickerWidth;
            this.saturationSlider = s * this.pickerWidth;
            this.valueSlider = this.pickerWidth - v * this.pickerWidth;
          });
        }
      },
      immediate: true,
    },
  },
  computed: {
    pickedHueColor() {
      const hue = this.hueSlider / this.pickerWidth;
      return hsvToRgb(hue, 1, 1);
    },
    pickedColor() {
      if (!this.pickerWidth) {
        return { r: 0, g: 0, b: 0, a: 0 };
      }
      const hue = this.hueSlider / this.pickerWidth;
      const saturation = this.saturationSlider / this.pickerWidth;
      const value = (this.pickerWidth - this.valueSlider) / this.pickerWidth;
      const alpha = this.alphaSlider / this.pickerWidth;

      const rgb = hsvToRgb(hue, saturation, value);
      let color;
      if (alpha === 1) {
        color = {
          ...rgb,
          a: alpha,
          rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
          hex: rgbaToHex(rgb.r, rgb.g, rgb.b, 255),
        };
      } else {
        color = {
          ...rgb,
          a: alpha,
          rgb: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${Math.round(alpha * 100) / 100})`,
          hex: rgbaToHex(rgb.r, rgb.g, rgb.b, Math.round(alpha * 255)),
        };
      }

      return color;
    },
    svBackgroundColor() {
      return `rgb(${this.pickedHueColor.r}, ${this.pickedHueColor.g}, ${this.pickedHueColor.b})`;
    },
    alphaBackground() {
      return `linear-gradient(to right,
      rgba(${this.pickedHueColor.r}, ${this.pickedHueColor.g}, ${this.pickedHueColor.b}, 0),
      rgba(${this.pickedHueColor.r}, ${this.pickedHueColor.g}, ${this.pickedHueColor.b}, 1))`;
    },
    hueSliderStyle() {
      return { transform: `translate(${this.hueSlider - this.halfSilder}px, -50%)` };
    },
    alphaSliderStyle() {
      return { transform: `translate(${this.alphaSlider - this.halfSilder}px, -50%)` };
    },
    svSliderStyle() {
      return {
        transform: `translate(${this.saturationSlider - this.halfSilder}px, ${
          this.valueSlider - this.halfSilder
        }px)`,
      };
    },
  },
  methods: {
    show() {
      this.$refs.popupRef.open();
    },
    touchSlider(e, component) {
      if (component === 'sv') {
        this.startLeft = this.saturationSlider;
        this.startPageX = e.touches[0].pageX;
        this.startTop = this.valueSlider;
        this.startPageY = e.touches[0].pageY;
      } else {
        this.startLeft = this[component + 'Slider'];
        this.startPageX = e.touches[0].pageX;
      }
    },
    moveSlide(e, component) {
      if (component === 'sv') {
        this.setSliderValue('saturation', this.startLeft + e.touches[0].pageX - this.startPageX);
        this.setSliderValue('value', this.startTop + e.touches[0].pageY - this.startPageY);
      } else {
        this.setSliderValue(component, this.startLeft + e.touches[0].pageX - this.startPageX);
      }

      this.emitPickedColor();
    },
    setSlider(e, component) {
      if (component === 'sv') {
        this.setSliderValue('saturation', e.touches[0].pageX - this.pickerOffsetX);
        this.setSliderValue('value', e.touches[0].pageY - this.pickerOffsetY);
      } else {
        this.setSliderValue(component, e.touches[0].pageX - this.pickerOffsetX);
      }
      this.touchSlider(e, component);

      this.emitPickedColor();
    },
    setSliderValue(component, value) {
      this[component + 'Slider'] = Math.min(Math.max(value, 0), this.pickerWidth);
    },
    emitPickedColor() {
      clearTimeout(this.emitTimer);
      this.emitTimer = setTimeout(() => {
        this.$emit('pickerColor', { rgb: this.pickedColor.rgb, hex: this.pickedColor.hex });
      }, 100);
    },
  },
};

function hsvToRgb(h, s, v) {
  var r, g, b, i, f, p, q, t;
  if (arguments.length === 1) {
    (s = h.s), (v = h.v), (h = h.h);
  }
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0:
      (r = v), (g = t), (b = p);
      break;
    case 1:
      (r = q), (g = v), (b = p);
      break;
    case 2:
      (r = p), (g = v), (b = t);
      break;
    case 3:
      (r = p), (g = q), (b = v);
      break;
    case 4:
      (r = t), (g = p), (b = v);
      break;
    case 5:
      (r = v), (g = p), (b = q);
      break;
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

function rgbToHsv(r, g, b) {
  if (arguments.length === 1) {
    (g = r.g), (b = r.b), (r = r.r);
  }
  var max = Math.max(r, g, b),
    min = Math.min(r, g, b),
    d = max - min,
    h,
    s = max === 0 ? 0 : d / max,
    v = max / 255;
  switch (max) {
    case min:
      h = 0;
      break;
    case r:
      h = g - b + d * (g < b ? 6 : 0);
      h /= 6 * d;
      break;
    case g:
      h = b - r + d * 2;
      h /= 6 * d;
      break;
    case b:
      h = r - g + d * 4;
      h /= 6 * d;
      break;
  }
  return { h, s, v };
}

function rgbaToHex(r, g, b, a) {
  let hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  if (a !== 255) {
    hex += ((1 << 8) + a).toString(16).slice(1);
  }
  return hex;
}

function hexToRgba(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: result[4] ? parseInt(result[4], 16) / 255 : 1,
      }
    : null;
}
</script>

<style lang="scss" scoped>
.color-picker {
  position: relative;
  width: 100%;
}
.sv-picker {
  position: relative;
  width: 100%;
  padding-top: 100%;
  .sv-slider {
    position: absolute;
    top: 0;
    left: 0;
    width: 30rpx;
    height: 30rpx;
    border: 1px solid #fff;
    background-color: rgba(73, 73, 73, 0.5);
    border-radius: 50rpx;
  }

  .sv-picker-background {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
}

.hue-slider,
.alpha-slider {
  margin-top: 20rpx;
  position: relative;
  width: 100%;
  height: 35rpx;
}
.hue-slider {
  background: linear-gradient(90deg, red 0, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, red);
}
.alpha-background-image {
  background-size: 35rpx;
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAWElEQVRIiWM8fubkfwYygKWJOSM5+mCAhRLNoxaPWjxq8ajFoxbTyeL/DAfJ0Xjs3Cl7Siwmu4Yht1aDgZEYx6MWj1o8avGoxaMWD3qLya5X//4nqx6HAQC7RBGFzolqTAAAAABJRU5ErkJggg==');
}

.slider {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 50rpx;
  width: 30rpx;
  border: 1px solid #fff;
  box-sizing: border-box;
  background-color: rgba(199, 199, 199, 0.7);
}
.alpha-background {
  width: 100%;
  height: 100%;
}

.result {
  margin-top: 20rpx;
  display: flex;
  align-items: center;

  .result-color {
    width: 100rpx;
    height: 100rpx;
    border-radius: 100rpx;
    overflow: hidden;
  }
  .result-text {
    margin-left: 20rpx;
    flex: 1;
    padding: 10rpx 20rpx;
    border: 1px solid #ccc;
    border-radius: 10rpx;
    color: #333;
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    p {
      width: 100%;
    }
  }
}
</style>
