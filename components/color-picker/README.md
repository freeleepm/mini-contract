支持初始化颜色、自适应容器大小方便自定义开发、返回hex、rgba/rgb两种颜色格式。

## 属性/事件列表:

| 属性/事件 | 必填 |  默认  |  功能  |
| :-----:  | :-----:  | :-----:  | :-----  |
| color  | 否 |  ''     | 初始化picker的颜色 |
| show  | 否 |   true    | 控制picker显示隐藏 |
| @pickerColor |   否   |   null   | 取色器发生取色动作触发，返回两种颜色格式：`{hex: '#ff0000', rgb: 'rgb(255, 0, 0)'}` |



## Demo：

```

// 这里演示在uni-modal中显示color-picker，color-picker支持自适应容器
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

```

```

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
    }
  }
};

```



