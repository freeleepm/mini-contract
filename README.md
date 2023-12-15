  Mini-Contract(免费开源电子合同)
  ===============


当前最新版本：v1.5.5 (发布时间：2023-12-14)



[![输入图片说明](https://img.shields.io/static/v1?label=licents&message=Apache%20License%202.0&color=green)](https://gitee.com/leepm/mini-contract/blob/master/LICENSE)
[![输入图片说明](https://img.shields.io/static/v1?label=Author&message=重庆弈联数聚科技有限公司&color=blue)](https://wwww.yi-types.com)
[![输入图片说明](https://img.shields.io/static/v1?label=version&message=1.5.5&color=green)](https://wwww.yi-types.com)

#### 介绍



<h3 align="center">Mini-Contract</h3>

🔥🔥🔥  Mini-Contract是一款由重庆弈联数聚科技有限公司自主研发、拥有自主知识产权的免费开源电子合同产品，提供一站式的合同签署解决方案。我们的产品创新地采用了“证据链”与“非证据链”两种签署模式，支持在线电子签名、电子合同、电子签章、电子合同SDK、电子合同API、多方合同发起、骑缝章等多种功能。

在数据安全方面，Mini-Contract严格遵循合规要求，独立运营和管理合同，确保您的合同信息得到最佳保护。我们提供Web端管理、H5、微信小程序平台，以及深度个性化的定制综合解决方案，满足您不同场景的管理需求，作为一款平台型产品，在安全性方面我们的底层基于蚂蚁司法链，已获得国家认证，确保安全可靠，支持数据和项目私有化本地，降低数据泄露风险，同时确保合同的合法性和安全性。





### 为什么选择Mini-Contract ?

我们汇集了市场上各类电子合同解决方案提供商，为您提供一站式便捷服务。您无需逐一对接各个电子合同厂商，避免了费时费力的过程。我们已经完成了这项繁琐的工作，您只需一个接口就能轻松使用我们所有的服务商。同时，您还可以享受我们提供的接口渠道价格优势，让您的成本更加可控。

Mini-Contract 是基于企业实际项目经验精心打造的成果，采用简洁的代码和最新的技术栈，非常适合各种需求的前端研发人员。同时，能够帮助您解决前端项目中80%以上的重复工作，提高开发效率。

如果您愿意使用我们提供的界面风格，您可以直接采用，无需担心版权问题，从而快速实现项目落地。让我们的解决方案助您轻松应对电子合同需求，提高工作效率，让您的项目更加顺利地推进。



### 商业授权

商业版本与开源版本代码一致，没有区分；

商业授权模式为永久授权，支持永久升级；

商业使用需要授权，授权方式可选择联系下方技术同学。



### 开源须知

1.仅允许用于个人学习研究使用；

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



#### 用户端（移动端）
> 首页能快速的发起合同的签署，签署人或者公司支持多选择（就是支持多人或者多公司同时签署），同时还能设置本次签署合同的有效果期，从而避免地一些法律风险

![](https://leepm.oss-cn-beijing.aliyuncs.com/public-images/yihetong_03.png)



> 作为企业需要在签署之前完成“企业认证”、“法人实名认证”；同时在使用过程中如果额度用完，可自行购买额度

![](https://leepm.oss-cn-beijing.aliyuncs.com/public-images/yihetong_04.png)



> 登录应用之后能查看到相应的功能，企业管理，印章管理，签署的文件管理，签署额度购买等等 

![](https://leepm.oss-cn-beijing.aliyuncs.com/public-images/yihetong_05.png)



> 签署前如果是个人需要做“实名认证”、“人证比对”、“人脸识别”等，从而来确保信息的真实性

![](https://leepm.oss-cn-beijing.aliyuncs.com/public-images/yihetong_06.png)



> 在签署详情里面能查看到合同签署人和各方签署的状态信息，同时签署方还可以点击进行签署，签署方式有“手写签名、盖章”等 

![](https://leepm.oss-cn-beijing.aliyuncs.com/public-images/yihetong_07.png)



> 参与签署的人可以收到签署的短信信息提醒，在有效期内点击链接可以到H5或者小程序里面进行签署，所有签署人都签署完成之后有短信通知提示

![](https://leepm.oss-cn-beijing.aliyuncs.com/public-images/yihetong_08.png)


#### 用户端（Web端）

> Web 的用户端，可以在后台对自己的合同进行相应的签署和查看

![](https://leepm.oss-cn-beijing.aliyuncs.com/public-images/yihetong_pc_01.png)

#### 平台端

***数据概况***

> 了解合同平台下所有使用者的基本信息，并对相应的数据进行综合概览汇总

![](https://leepm.oss-cn-beijing.aliyuncs.com/public-images/yihetong_admin_01.png)

***个人认证***

> 平台可查看到脱敏后的所有个人认证的基本信息

![](https://leepm.oss-cn-beijing.aliyuncs.com/public-images/yihetong_admin_02.png)

***企业认证***

> 平台可查看到脱敏后的所有企业认证的基本信息

![](https://leepm.oss-cn-beijing.aliyuncs.com/public-images/yihetong_admin_03.png)

***销售订单***

> 平台可查看所有合同销售情况

![](https://leepm.oss-cn-beijing.aliyuncs.com/public-images/yihetong_admin_04.png)

***消耗服务***

> 平台可查看到所有合同的使用和消费情况

![](https://leepm.oss-cn-beijing.aliyuncs.com/public-images/yihetong_admin_05.png)

***价格设置***

> 平台可根据自己合同运营情况设置相应的价格

![](https://leepm.oss-cn-beijing.aliyuncs.com/public-images/yihetong_admin_06.png)

***账号管理***

> 平台根据不同角色进行相应的用户权限设置，不同的用户有不同的管理权限

![](https://leepm.oss-cn-beijing.aliyuncs.com/public-images/yihetong_admin_07.png)

### 最近更新

##### V1.5.5 更新日志

- [x] 【新增】支持实名认证环节加入“人证对比”
- [x] 【新增】签署完成后短信通知参与签署方
- [x] 【新增】支持签署方可以不是发起方（可代发起合同）
- [x] 【优化】企业与个人身份证切换体验

- [x] 【优化】用户体验
- [x] 【修复】已知bug



##### V1.5.0 更新日志
- [x] 【新增】非证据链合同签署（可用于企业内部日常审批使用）
- [x] 【优化】印章管理
- [x] 【优化】企业实名认证逻辑
- [x] 【优化】证据链多渠道签署逻辑
- [x] 【升级】第三方插件版本
- [x] 【优化】隐私保护协义内容
- [x] 【优化】用户体验
- [x] 【修复】已知bug




##### V1.1.2 更新日志

- [x] 【新增】支持后台管理可查看企业合同情况
- [x] 【优化】用户体验
- [x] 【修复】已知bug



##### V1.1.1 更新日志

- [x] 【优化】企业和个人电子合同套餐份数
- [x] 【优化】用户体验
- [x] 【修复】已知bug



##### V1.1.0 更新日志

- [x] 【新增】丰富多样的合同模板
- [x] 【新增】应用内合同签署，提升用户体验
- [x] 【新增】签署方短信通知，避免消息不及时
- [x] 【优化】用户体验
- [x] 【修复】已知bug




### 技术文档

* 在线演示：

![](https://leepm.oss-cn-beijing.aliyuncs.com/public-images/yihetong_qrcode.png)



### 交流合作

如果你想加入我们的开源交流群，请扫码添加 Mini-Contract 项目团队，加入群聊：
![输入图片说明](https://leepm.oss-cn-beijing.aliyuncs.com/public-images/shawn_company_qrcode.png)



如果你有任何对 Mini-Contract 产品上的想法、意见或建议，或商务上的合作需求，请扫码添加 Mini-Contract 项目团队进一步沟通：
![输入图片说明](https://leepm.oss-cn-beijing.aliyuncs.com/public-images/shawn_huangxing_qrcode.png)

## 捐赠

如果觉得还不错，请 Watching，Starred，Fork 吧 ☺
