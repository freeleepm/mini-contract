<template>
  <div id="container" :style="{backgroundColor: color}">
    <uni-modal>
      <div class="uni-mask"></div>
      <div class="uni-modal" style="padding: 20rpx;">
        <color-picker :show='true' :color="color" @pickerColor="pickerColor"></color-picker>
        <div class="actions">
          <i class="iconfont icon-del"></i>
          <i class="iconfont icon-yes"></i>
        </div>
      </div>
    </uni-modal>
  </div>
</template>
<script>
import colorPicker from "../../components/colorPicker";

export default {
  components: { colorPicker },
  data() {
    return {
      color: '#123456f0'
    };
  },
  methods: {
    pickerColor(color) {
      this.color = color.hex
      console.log(this.color);
    }
  }
};
</script>

<style lang="scss" scoped>
#container {
  width: 100vw;
  height: 100vh;
}
.actions {
  margin-top: 20rpx;
  display: flex;
  justify-content: space-between;
  .iconfont {
    color: #777;
    font-size: 56rpx;
  }
  .icon-yes {
    color: rgb(14, 165, 0)
  }
}

</style>
