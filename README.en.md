Mini-Contract(免费开源电子合同)
===============

当前最新版本：v1.0.0 (发布时间：2022-11-25)

[![输入图片说明](https://img.shields.io/static/v1?label=licents&message=Apache License 2.0&color=green)](https://gitee.com/leepm/mini-contract/blob/master/LICENSE)
[![输入图片说明](https://img.shields.io/static/v1?label=Author&message=上海旭冉信息科技有限公司&color=blue)](https://wwww.yi-types.com)
[![输入图片说明](https://img.shields.io/static/v1?label=version&message=1.0.0&color=green)](https://wwww.yi-types.com)

#### 介绍



<h3 align="center">Mini-Contract</h3>

⭐️⭐️⭐️  Mini-Contract是由”上海旭冉信息科技有限公司“从公司商业化产品“一合通“剥离出来的一款开源产品，该工具针对行业特点和业务场景深度定制综合解决方案，实现合同便捷在线签署，安全合规可靠。为中小微企业及用户构建省时省力的闭环式服务体系，打造安全无忧的司法保障体系，电子合同底层基于”e签宝“及其它”合同厂商“，获得国家认证，安全可靠。



### 为什么选择Mini-Contract ?

聚合市场上各类电子合同解决方案商，你无需一个一个的对接电子合同厂商，费时，因为这个工作我们已经做了适配，你只需要一个接口就能使用我们的所有服务商，同时你还可以享受我们的接口渠道价格，Mini-Contract是我们企业真实项目的实战经验结晶，简洁的代码，最新的技术栈，全方位适合不同需求的前端研发同学，同时更是中小微企业开发需求的不二选择，可以帮助解决前端项目的80%以上的重复工作，同时如果不介意界面风格的同学，可以直接使用我们的风格，无需担心版权，能快速落地项目。



### 商业授权

商业版本与开源版本代码一致，没有区分。

商业授权模式为永久授权，支持永久升级。

商业使用需要授权，授权方式可选择联系下方技术同学。



### 开源须知

1.仅允许用于个人学习研究使用。

2.禁止将本开源的代码和资源进行任何形式任何名义的出售。



目录结构
-----------------------------------

```
├─api（接口文件）
├─common（公共文件：基础域名配置、公共正则、公共样式、缓存设置等）
├─components（公共组件）
│  ├─backTop（回到顶部组件）
│  ├─BaseEmpty（页面无数据时基础展示组件）
│  ├─baseline（上拉分页时无更多数据展示组件）
│  ├─loading（页面跳转时加载展示组件）
│  ├─loadMore（列表下拉刷新加载展示组件)
│  ├─mp-html（小程序html节点插入组件）
│  │  └─node
│  └─v-tabs（tab栏切换组件）
├─filters（全局过滤器）
├─pages（页面文件）
│  ├─combo
│  ├─company
│  ├─index（引导页）
│  ├─login（登录页）
│  ├─sign（注册页）
│  ├─switchIdentity
│  ├─tabbar（tabbar页）
│  └─user（用户页）
├─static（静态资源文件）
│  └─tabbar
├─uni_modules（uniapp组件）
│   ├─uni-datetime-picker（时间选择器）
│   │  └─components
│   │      └─uni-datetime-picker
│   │          └─i18n
│   ├─uni-icons（icon图标展示）
│   │  └─components
│   │      └─uni-icons
│   ├─uni-load-more（加载更多）
│   │  └─components
│   │      └─uni-load-more
│   │          └─i18n
│   ├─uni-popup（弹窗）
│   │  └─components
│   │      ├─uni-popup
│   │      │  └─i18n
│   │      ├─uni-popup-dialog
│   │      ├─uni-popup-message
│   │      └─uni-popup-share
│   ├─uni-scss（uni公共样式）
│   │  └─styles
│   │      ├─setting
│   │      └─tools
│   └─uni-transition（动画过渡）
│       └─components
│           └─uni-transition
├─.prettierrc.js(格式化规范文件)
├─App.vue
├─index.html(html主文件)
├─jsconfig.json(vscode配置文件)
├─main.js(vue入口文件)
├─manifest.json(uniapp编译配置文件)
├─pages.json(页面配置文件)
├─uni.scss(基础配色scss变量文件)
└─vue.config.js(vue中webpack配置文件)
```



技术架构
-----------------------------------

#### 开发环境

- 语言：Vue2.0

- IDE(前端)： Vscode、HBuilder

- 依赖管理：npm



#### 移动端框架

| 说明       | 框架       | 说明       | 框架      |
| ---------- | ---------- | ---------- | --------- |
| 基础框架   | uni-app    | JS版本     | ES6       |
| 基础JS框架 | Vue.js     | 视频播放器 | 原生video |
| 路由管理   | Vue Router | 状态管理   | Vuex      |
| 网络请求   | axios      | css预处理  | scss      |
| 地图引擎   | map        |            |           |



### 功能模块

```
业务功能
├─登录注册
│  ├─账号方式
│  └─微信授权
├─首页
│  ├─快捷合同处理
│  │  ├─待我处理
│  │  ├─待他人处理
│  └─最近合同
├─合同
│  ├─待我处理
│  ├─待他人处理
│  ├─已完成
│  ├─已拒签
│  ├─已撤销
│  ├─已逾期
├─发起新签署合同
└─个人中心
   ├─我的企业
   ├─企业印章
	 ├─文件管理
   ├─套餐管理
	 ├─隐私政策
   ├─修改密码
   └─个人中心
      ├─企业套餐
      └─个人套餐
```







项目效果
----

![](https://leepm.oss-cn-beijing.aliyuncs.com/public-images/yihetong_01.png)
![](https://leepm.oss-cn-beijing.aliyuncs.com/public-images/yihetong_02.png) 
![](https://leepm.oss-cn-beijing.aliyuncs.com/public-images/yihetong_03.png)
![](https://leepm.oss-cn-beijing.aliyuncs.com/public-images/yihetong_04.png)
![](https://leepm.oss-cn-beijing.aliyuncs.com/public-images/yihetong_05.png)
![](https://leepm.oss-cn-beijing.aliyuncs.com/public-images/yihetong_06.png)




### 技术文档

* 在线演示：

![](https://leepm.oss-cn-beijing.aliyuncs.com/public-images/yihetong_qrcode.png)



### 交流合作

如果你想加入我们的开源交流群，请扫码添加 Mini-Contract 项目团队，加入群聊：
![输入图片说明](https://leepm.oss-cn-beijing.aliyuncs.com/public-images/shawn_company_qrcode.png)



如果你有任何对 Mini-Contract 产品上的想法、意见或建议，或商务上的合作需求，请扫码添加 Mini-Contract 项目团队进一步沟通：
![输入图片说明](https://leepm.oss-cn-beijing.aliyuncs.com/public-images/shawn_huangxing_qrcode.png)

## 捐赠 

如果觉得还不错，请作者喝杯咖啡吧 ☺

