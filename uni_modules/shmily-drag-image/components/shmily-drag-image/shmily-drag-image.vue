<template>
  <view class="con" @longpress="onLongPress">
    <!-- <view class="m" v-if="unMove"></view> -->
    <template v-if="viewWidth">
      <movable-area
        class="area"
        :style="{ height: areaHeight }"
        @mouseenter.prevent="mouseenter"
        @mouseleave.prevent="mouseleave"
      >
        <movable-view
          v-for="(item, index) in imageList"
          :key="item.id"
          class="view"
          direction="all"
          :y="item.y"
          :x="item.x"
          :damping="40"
          :disabled="item.disable"
          @change="onChange($event, item)"
          @touchstart.prevent="touchstart(item)"
          @mousedown.prevent="touchstart(item)"
          @touchend.prevent="touchend(item)"
          @click="previewImage(item)"
          @mouseup.prevent="touchend(item)"
          :style="{
            width: viewWidth + 'px',
            height: viewWidth + 'px',
            'z-index': item.zIndex,
            opacity: item.opacity,
          }"
        >
          <view
            class="area-con"
            :style="{
              width: childWidth,
              height: childWidth,
              borderRadius: borderRadius + 'rpx',
              transform: 'scale(' + item.scale + ')',
            }"
          >
            <image class="pre-image" :src="item.src" mode="aspectFill"></image>
            <view
              class="del-con"
              @click="delImages(item, index)"
              @touchstart.stop="delImageMp(item, index)"
              @touchend.stop="nothing()"
              @mousedown.stop="nothing()"
              @mouseup.stop="nothing()"
            >
              <view class="del-wrap">
                <uni-icons type="closeempty" color="white" size="13"></uni-icons>
              </view>
            </view>
          </view>
        </movable-view>
        <view
          class="add"
          v-if="imageList.length < number"
          :style="{ top: add.y, left: add.x, width: viewWidth + 'px', height: viewWidth + 'px' }"
          @click="addImages"
        >
          <view
            class="add-wrap"
            :style="{ width: childWidth, height: childWidth, borderRadius: borderRadius + 'rpx' }"
          >
            <uni-icons type="plusempty" color="#CCCCCC" size="60"></uni-icons>
          </view>
        </view>
      </movable-area>
    </template>
  </view>
</template>

<script>
export default {
  emits: ['input', 'update:modelValue'],
  props: {
    // 排序图片
    value: {
      type: Array,
      default: function () {
        return [];
      },
    },
    // 排序图片
    modelValue: {
      type: Array,
      default: function () {
        return [];
      },
    },
    // 从 list 元素对象中读取的键名
    keyName: {
      type: String,
      default: null,
    },
    // 选择图片数量限制
    number: {
      type: Number,
      default: 20,
    },
    // 图片父容器宽度（实际显示的图片宽度为 imageWidth / 1.1 ），单位 rpx
    // imageWidth > 0 则 cols 无效
    imageWidth: {
      type: Number,
      default: 630,
    },
    // 图片列数
    cols: {
      type: Number,
      default: 1,
    },
    // 图片圆角，单位 rpx
    borderRadius: {
      type: Number,
      default: 10,
    },
    // 图片周围空白填充，单位 rpx
    padding: {
      type: Number,
      default: 10,
    },
    // 拖动图片时放大倍数 [0, ∞)
    scale: {
      type: Number,
      default: 1.1,
    },
    // 拖动图片时不透明度
    opacity: {
      type: Number,
      default: 0.7,
    },
    // 自定义添加
    addImage: {
      type: Function,
      default: null,
    },
    // 删除确认
    delImage: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      imageList: [],
      width: 0,
      add: {
        x: 0,
        y: 0,
      },
      colsValue: 0,
      viewWidth: 0,
      tempItem: null,
      timer: null,
      changeStatus: true,
      preStatus: true,
      first: true,
      unMove: true,
    };
  },
  computed: {
    areaHeight() {
      let height = '';
      // return '355px'
      if (this.imageList.length < this.number) {
        height =
          (Math.ceil((this.imageList.length + 1) / this.colsValue) * this.viewWidth).toFixed() +
          'px';
      } else {
        height =
          (Math.ceil(this.imageList.length / this.colsValue) * this.viewWidth).toFixed() + 'px';
      }
      return height;
    },
    childWidth() {
      return this.viewWidth - this.rpx2px(this.padding) * 2 + 'px';
    },
  },
  watch: {
    value: {
      handler(n) {
        if (!this.first && this.changeStatus) {
          console.log('watch', n);
          let flag = false;
          for (let i = 0; i < n.length; i++) {
            if (flag) {
              this.addProperties(this.getSrc(n[i]));
              continue;
            }
            if (this.imageList.length === i || this.imageList[i].src !== this.getSrc(n[i])) {
              flag = true;
              this.imageList.splice(i);
              this.addProperties(this.getSrc(n[i]));
            }
          }
        }
      },
      deep: true,
    },
    modelValue: {
      handler(n) {
        if (!this.first && this.changeStatus) {
          console.log('watch', n);
          let flag = false;
          for (let i = 0; i < n.length; i++) {
            if (flag) {
              this.addProperties(this.getSrc(n[i]));
              continue;
            }
            if (this.imageList.length === i || this.imageList[i].src !== this.getSrc(n[i])) {
              flag = true;
              this.imageList.splice(i);
              this.addProperties(this.getSrc(n[i]));
            }
          }
        }
      },
      deep: true,
    },
  },
  created() {
    this.width = uni.getSystemInfoSync().windowWidth;
  },
  mounted() {
    const query = uni.createSelectorQuery().in(this);
    query.select('.con').boundingClientRect(data => {
      this.colsValue = this.cols;
      this.viewWidth = data.width / this.cols;
      if (this.imageWidth > 0) {
        this.viewWidth = this.rpx2px(this.imageWidth);
        // this.colsValue = Math.floor(data.width / this.viewWidth);
      }
      let list = this.value;
      // #ifdef VUE3
      list = this.modelValue;
      // #endif
      for (let item of list) {
        this.addProperties(this.getSrc(item));
      }
      this.first = false;
    });
    query.exec();
  },
  methods: {
    getSrc(item) {
      if (this.keyName !== null) {
        return item[this.keyName];
      }
      return item;
    },
    onLongPress() {
      this.imageList = this.imageList.map(i => {
        return {
          disable: false,
          ...i,
        };
      });
    },
    onChange(e, item) {
      if (!item) return;
      item.oldX = e.detail.x;
      item.oldY = e.detail.y;
      if (e.detail.source === 'touch') {
        if (item.moveEnd) {
          item.offset = Math.sqrt(
            Math.pow(item.oldX - item.absX * this.viewWidth, 2) +
              Math.pow(item.oldY - item.absY * this.viewWidth, 2)
          );
        }
        let x = Math.floor((e.detail.x + this.viewWidth / 2) / this.viewWidth);
        if (x >= this.colsValue) return;
        let y = Math.floor((e.detail.y + this.viewWidth / 2) / this.viewWidth);
        let index = this.colsValue * y + x;
        if (item.index != index && index < this.imageList.length) {
          this.changeStatus = false;
          for (let obj of this.imageList) {
            if (item.index > index && obj.index >= index && obj.index < item.index) {
              this.change(obj, 1);
            } else if (item.index < index && obj.index <= index && obj.index > item.index) {
              this.change(obj, -1);
            } else if (obj.id != item.id) {
              obj.offset = 0;
              obj.x = obj.oldX;
              obj.y = obj.oldY;
              setTimeout(() => {
                this.$nextTick(() => {
                  obj.x = obj.absX * this.viewWidth;
                  obj.y = obj.absY * this.viewWidth;
                });
              }, 0);
            }
          }
          item.index = index;
          item.absX = x;
          item.absY = y;
          if (!item.moveEnd) {
            setTimeout(() => {
              this.$nextTick(() => {
                item.x = item.absX * this.viewWidth;
                item.y = item.absY * this.viewWidth;
              });
            }, 0);
          }
          // console.log('bbb', JSON.parse(JSON.stringify(item)));
          this.sortList();
        }
      }
    },
    change(obj, i) {
      obj.index += i;
      obj.offset = 0;
      obj.x = obj.oldX;
      obj.y = obj.oldY;
      obj.absX = obj.index % this.colsValue;
      obj.absY = Math.floor(obj.index / this.colsValue);
      setTimeout(() => {
        this.$nextTick(() => {
          obj.x = obj.absX * this.viewWidth;
          obj.y = obj.absY * this.viewWidth;
        });
      }, 0);
    },
    touchstart(item) {
      this.imageList.forEach(v => {
        v.zIndex = v.index + 9;
      });
      item.zIndex = 99;
      item.moveEnd = true;
      this.tempItem = item;
      this.timer = setTimeout(() => {
        // item.scale = this.scale;
        // item.opacity = this.opacity;
        clearTimeout(this.timer);
        this.timer = null;
      }, 200);
    },
    touchend(item) {
      // this.previewImage(item);
      item.scale = 1;
      item.opacity = 1;
      item.x = item.oldX;
      item.y = item.oldY;
      item.offset = 0;
      item.moveEnd = false;
      setTimeout(() => {
        this.$nextTick(() => {
          item.x = item.absX * this.viewWidth;
          item.y = item.absY * this.viewWidth;
          this.tempItem = null;
          this.changeStatus = true;
        });
        // console.log('ccc', JSON.parse(JSON.stringify(item)));
      }, 0);
      // console.log('ddd', JSON.parse(JSON.stringify(item)));
    },
    previewImage(item) {
      if (this.timer && this.preStatus && this.changeStatus && item.offset < 28.28) {
        clearTimeout(this.timer);
        this.timer = null;
        const list = this.value || this.modelValue;
        let srcList = list.map(v => this.getSrc(v));
        uni.previewImage({
          urls: srcList,
          current: item.src,
          success: () => {
            this.preStatus = false;
            setTimeout(() => {
              this.preStatus = true;
            }, 600);
          },
          fail: e => {
            console.log(e);
          },
        });
      } else if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    },
    mouseenter() {
      //#ifdef H5
      this.imageList.forEach(v => {
        v.disable = false;
      });
      //#endif
    },
    mouseleave() {
      //#ifdef H5
      if (this.tempItem) {
        this.imageList.forEach(v => {
          v.disable = true;
          v.zIndex = v.index + 9;
          v.offset = 0;
          v.moveEnd = false;
          if (v.id == this.tempItem.id) {
            if (this.timer) {
              clearTimeout(this.timer);
              this.timer = null;
            }
            v.scale = 1;
            v.opacity = 1;
            v.x = v.oldX;
            v.y = v.oldY;
            this.$nextTick(() => {
              v.x = v.absX * this.viewWidth;
              v.y = v.absY * this.viewWidth;
              this.tempItem = null;
            });
          }
        });
        this.changeStatus = true;
      }
      //#endif
    },
    addImages() {
      this.$emit('add');
      return;
      if (typeof this.addImage === 'function') {
        this.addImage.bind(this.$parent)();
      } else {
        let checkNumber = this.number - this.imageList.length;
        uni.chooseImage({
          count: checkNumber,
          sourceType: ['album', 'camera'],
          success: res => {
            let count =
              checkNumber <= res.tempFilePaths.length ? checkNumber : res.tempFilePaths.length;
            for (let i = 0; i < count; i++) {
              this.addProperties(res.tempFilePaths[i]);
            }
            this.sortList();
          },
        });
      }
    },
    delImages(item, index) {
      if (typeof this.delImage === 'function') {
        this.delImage.bind(this.$parent)(() => {
          this.delImageHandle(item, index);
        });
      } else {
        this.delImageHandle(item, index);
      }
    },
    delImageHandle(item, index) {
      this.imageList.splice(index, 1);
      for (let obj of this.imageList) {
        if (obj.index > item.index) {
          obj.index -= 1;
          obj.x = obj.oldX;
          obj.y = obj.oldY;
          obj.absX = obj.index % this.colsValue;
          obj.absY = Math.floor(obj.index / this.colsValue);
          this.$nextTick(() => {
            obj.x = obj.absX * this.viewWidth;
            obj.y = obj.absY * this.viewWidth;
          });
        }
      }
      this.add.x = (this.imageList.length % this.colsValue) * this.viewWidth + 'px';
      this.add.y = Math.floor(this.imageList.length / this.colsValue) * this.viewWidth + 'px';
      this.sortList();
    },
    delImageMp(item, index) {
      //#ifdef MP
      this.delImages(item, index);
      //#endif
    },
    sortList() {
      const result = [];
      let source = this.value;
      // #ifdef VUE3
      source = this.modelValue;
      // #endif

      let list = this.imageList.slice();
      list.sort((a, b) => {
        return a.index - b.index;
      });
      for (let s of list) {
        let item = source.find(d => this.getSrc(d) == s.src);
        if (item) {
          result.push(item);
        } else {
          if (this.keyName !== null) {
            result.push({
              [this.keyName]: s.src,
            });
          } else {
            result.push(s.src);
          }
        }
      }

      this.$emit('input', result);
      this.$emit('update:modelValue', result);
    },
    addProperties(item) {
      let absX = this.imageList.length % this.colsValue;
      let absY = Math.floor(this.imageList.length / this.colsValue);
      let x = absX * this.viewWidth;
      let y = absY * this.viewWidth;
      this.imageList.push({
        src: item,
        x,
        y,
        oldX: x,
        oldY: y,
        absX,
        absY,
        scale: 1,
        zIndex: 9,
        opacity: 1,
        index: this.imageList.length,
        id: this.guid(16),
        disable: true,
        offset: 0,
        moveEnd: false,
      });
      this.add.x = (this.imageList.length % this.colsValue) * this.viewWidth + 'px';
      this.add.y = Math.floor(this.imageList.length / this.colsValue) * this.viewWidth + 'px';
    },
    nothing() {},
    rpx2px(v) {
      return (this.width * v) / 750;
    },
    guid(len = 32) {
      const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
      const uuid = [];
      const radix = chars.length;
      for (let i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
      uuid.shift();
      return `u${uuid.join('')}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.con {
  // padding: 30rpx;
  position: relative;
  .m {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 1px solid red;
    z-index: 100;
  }
  .area {
    width: 100%;

    .view {
      display: flex;
      justify-content: center;
      align-items: center;

      .area-con {
        position: relative;
        overflow: hidden;

        .pre-image {
          width: 100%;
          height: 100%;
        }

        .del-con {
          position: absolute;
          top: 0rpx;
          right: 0rpx;
          padding: 0 0 20rpx 20rpx;

          .del-wrap {
            width: 36rpx;
            height: 36rpx;
            background-color: #ec5353;
            border-radius: 0 0 0 10rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0.8;
          }
        }
      }
    }

    .add {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;

      .add-wrap {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #eeeeee;
      }
    }
  }
}
</style>
