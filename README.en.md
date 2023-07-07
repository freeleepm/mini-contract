<!--
 * @Description:
 * @LastEditTime: 2023-07-07 19:11:02
 * @LastEditors: 何俊峰
 * @Author: 何俊峰
 * @Date: 2023-02-23 10:11:20
-->
Mini-Contract(免费开源电子合同)
===============

当前最新版本：v1.1.2 (发布时间：2023-7-7)

[![输入图片说明](https://img.shields.io/static/v1?label=licents&message=Apache%20License %202.0&color=green)](https://gitee.com/leepm/mini-contract/blob/master/LICENSE)
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
├─App.vue                           // 应用配置，用来配置APP全局样式以及监听
├─index.html                        // 给网页开发提供的功能，提供模板
├─jsconfig.json                     // 规范配置等
├─main.js                           // 入口文件
├─manifest.json                     // 配置应用名称、appid、logo、版本等打包信息
├─pages.json                        // 配置页面路由、导航条、选项卡等页面类信息
├─README.md                         // 帮助文档
├─uni.scss                          // scss变量预置, 为了方便整体控制应用的风格
├─vue.config.js                     // 开发设置
├─api                               // 接口管理，按照功能分类
├─components                        // 公共组件库
│  ├─backTop                        // 返回顶部
│  ├─BaseEmpty                      // 缺省页
│  ├─baseline                       // 没有更多数据
│  ├─btn-fixed                      // 固定在页面底部组件（插槽）
│  ├─checkUser                      // 切换身份
│  ├─contractState                  // 合同状态
│  ├─FileItem                       // 文件信息
│  ├─loading                        // 页面加载
│  ├─loadMore                       // 加载数据
│  ├─SwitchEnvironment              // 切换环境
│  ├─tag-auth                       // 用户身份
│  ├─userInfo                       // 用户信息
│  └─v-tabs                         // tab切换
├─config                            // 配置
│  ├─config.js                      // 系统配置（域名等）
│  ├─net.config.js                  // 域名配置
│  └─setting.js                     // 其他全局配置（如：页面分享文案）
├─filters                           // 过滤器
├─mixins                            // 混入
│  └─share.js                       // 页面分享
├─pages                             // 页面文件夹
│  ├─contract                       // 合同相关页面
│  │  ├─index.vue                   // 合同首页
│  │  │    └─index.vue              // 合同详情
│  │  ├─sign                        // 发起签署
│  │  └─revoke                      // 撤销合同
│  ├─home                           // 首页
│  │  └─contractTemplate            // 合同模板
│  ├─index                          // 启动页
│  ├─login                          // 登录注册
│  └─user                           // 我的
│     ├─company                     // 企业相关
│     │    ├─addCompany.vue         // 添加企业
│     │    ├─addSeal.vue            // 添加印章
│     │    ├─authorize.vue          // web-view页面
│     │    ├─Certification.vue      // 企业认证
│     │    ├─companySeal.vue        // 企业印章管理
│     │    ├─create.vue             // 创建企业（已废弃）
│     │    ├─myCompany.vue          // 我的企业
│     │    └─removeComfirm.vue      // 移除企业
│     ├─companyMembers              // 成员
│     │    ├─createMember.vue       // 添加成员
│     │    └─index.vue              // 企业成员
│     ├─createUser                  // 签署
│     │    ├─addPerson.vue          // 添加最近签署人（已废弃）
│     │    └─index.vue              // 最近签署人
│     ├─file                        // 文件管理
│     ├─package                     // 套餐
│     │    ├─buy.vue                // 购买套餐
│     │    └─comboDetails.vue       // 我的套餐
│     ├─personal                    // 个人
│     │    └─Certification.vue      // 个人认证
│     └─setting                     // 设置
│          ├─changeIdentity.vue     // 切换身份（已废弃）
│          ├─password.vue           // 修改密码（已废弃）
│          └─Privacy.vue            // 隐私申明
├─static                            // 存放静态资源，如图片、视频
│  └─tabbar                         // tabbar图标
├─store                             // 状态管理库
├─style                             // 公共样式库
├─uni_modules                       // 项目组件、页面、公共模块等
├─unpackage                         // 打包目录
└─utils                             // 工具
   ├─cache.js                       // 设置缓存
   ├─common.js                      // 公共方法
   ├─compress.js                    // 图片压缩
   ├─reg.js                         // 通用正则表达式
   └─request.js                     // 网络请求设置
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
│  │  └─待他人处理
│  └─最近合同
├─合同
│  ├─待我处理
│  ├─待他人处理
│  ├─已完成
│  ├─已拒签
│  ├─已撤销
│  └─已逾期
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

