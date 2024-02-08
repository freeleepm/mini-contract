# 图片拖拽排序插件
<font color='red'>1. H5 和微信小程序已测试通过</font>

<font color='red'>2. App 和其他平台小程序未测试，大概率支持</font>

<font color='red'>3. 非uni_modules版本未更新</font>

## shmily-drag-image

> 点击预览、长按拖拽排序、自定义添加图片、删除确认、支持对象数组

## 预览
您可以通过微信扫码，查看最佳的演示效果。

![wp](https://web.shmily.ren/shmily-drag-image/static/wp.jpg)

## 基本使用：

```
<shmily-drag-image v-model="list"></shmily-drag-image>


export default {
  data() {
    return {
      list: [
        'http://static-11ea0c21-6b8f-47f7-b77f-cb0c7ea3f355.bspapp.com/shmily-drag-image/static/1.jpg',
        'http://static-11ea0c21-6b8f-47f7-b77f-cb0c7ea3f355.bspapp.com/shmily-drag-image/static/2.jpg',
        'http://static-11ea0c21-6b8f-47f7-b77f-cb0c7ea3f355.bspapp.com/shmily-drag-image/static/3.jpg',
      ]
    }
  }
}
```

## 自定义添加、删除确认：
```
<shmily-drag-image v-model="list" :addImage="addImage" :delImage="delImage"></shmily-drag-image>


export default {
  data() {
    return {
      list: [
        'http://static-11ea0c21-6b8f-47f7-b77f-cb0c7ea3f355.bspapp.com/shmily-drag-image/static/1.jpg',
        'http://static-11ea0c21-6b8f-47f7-b77f-cb0c7ea3f355.bspapp.com/shmily-drag-image/static/2.jpg',
        'http://static-11ea0c21-6b8f-47f7-b77f-cb0c7ea3f355.bspapp.com/shmily-drag-image/static/3.jpg',
      ]
    }
  },
  methods:{
    addImage() {
      // 将图片地址添加到图片数组
      this.list.push('http://static-11ea0c21-6b8f-47f7-b77f-cb0c7ea3f355.bspapp.com/shmily-drag-image/static/4.jpg')
    },
    delImage(done) {
      uni.showModal({
        content: '是否删除?',
        success: (res) => {
          if(res.confirm) {
            // 执行 done() 删除
            done()
          }
        }
      })
    }
  }
}
```

## 支持对象数组：
```
<shmily-drag-image v-model="list" keyName="src"></shmily-drag-image>


export default {
  data() {
    return {
      list: [
        {
          src: 'http://static-11ea0c21-6b8f-47f7-b77f-cb0c7ea3f355.bspapp.com/shmily-drag-image/static/1.jpg',
        },
        {
          src: 'http://static-11ea0c21-6b8f-47f7-b77f-cb0c7ea3f355.bspapp.com/shmily-drag-image/static/2.jpg',
        },
        {
          src: 'http://static-11ea0c21-6b8f-47f7-b77f-cb0c7ea3f355.bspapp.com/shmily-drag-image/static/3.jpg',
        }
      ]
    }
  }
}
```

---

## 属性说明

属性名 | 类型 | 默认值 | 说明
:-:|:-:|:-:|---
v-model | Array | [ ] | 图片数组，元素为图片地址字符串或对象，默认为`Array<String>`
keyName | String | null | 从图片数组元素对象中读取的键名
number | Number | 6 | 图片数量限制
imageWidth | Number | 0 | 图片父容器宽度（实际显示的图片宽度为 imageWidth / 1.1 ），单位 rpx。imageWidth > 0 则 cols 无效
cols | Number | 3 | 图片列数（cols > 0 则 imageWidth 无效）
borderRadius | Number | 0 | 图片圆角，单位 rpx
padding | Number | 10 | 图片周围空白填充，单位 rpx
scale | Number | 1.1 | 拖动图片时放大倍数 [0, ∞)
opacity | Number | 0.7 | 拖动图片时不透明度
addImage | Function | null | 自定义添加，见上方示例
delImage | Function | null | 删除确认，见上方示例

