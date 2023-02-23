### LoadMore 加载更多来源于 官方组件 做了降低开销处理 仅供大家自定义参考使用

用于列表中，做滚动加载使用，展示 loading 的各种状态，组件名：``uLi-load-more``

**使用方式：**

在 ``script`` 中引用组件 

```javascript
import uLiLoadMore from "@/components/uLi-load-more/uLi-load-more.vue"
export default {
    components: {uLiLoadMore}
}
```

在 ``template`` 中使用组件

```html
<uLi-load-more status="loading"></uLi-load-more>
```

**属性说明：**

|属性名		|类型|默认值	|说明|
|---|----|---|---|
|status	|String	|more|loading 的状态，可选值：more（loading前）、loading（loading中）、noMore（没有更多了）|
|show-icon	|Boolean	|true|是否显示 loading 图标|
|color	|String	|#777777|图标和文字颜色	|
|content-text	|Object	|```{contentdown: "上拉显示更多",contentrefresh: "正在加载...",contentnomore: "没有更多数据了"}```|各状态文字说明|

