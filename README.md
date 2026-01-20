  Mini Contract.Pro(免费开源电子合同)
  ===============


当前最新版本：v3.2.0 (发布时间：2026-01-20)

[![输入图片说明](https://img.shields.io/static/v1?label=licents&message=Apache%20License%202.0&color=green)](https://gitee.com/leepm/mini-contract/blob/master/LICENSE)[![输入图片说明](https://img.shields.io/static/v1?label=Author&message=shawn&color=blue)](https://gitee.com/leepm/mini-contract)[![输入图片说明](https://img.shields.io/static/v1?label=version&message=3.2.0&color=green)](https://gitee.com/leepm/mini-contract)[![star](https://gitee.com/leepm/mini-contract/badge/star.svg?theme=dark)](https://gitee.com/leepm/mini-contract)[![fork](https://gitee.com/leepm/mini-contract/badge/fork.svg?theme=dark)](https://gitee.com/leepm/mini-contract)[![GitHub stars](https://img.shields.io/github/stars/freeleepm/mini-contract.svg?style=social&label=Stars)](https://github.freeleepm/mini-contract)[![GitHub forks](https://img.shields.io/github/forks/freeleepm/mini-contract.svg?style=social&label=Fork)](https://github.freeleepm/mini-contract)







<h3 align="center">Mini Contract.Pro</h3>



🔥🔥🔥作为一款拥有自主知识产权的免费开源产品，Mini Contract.Pro始终坚持“让数字签约开发更简单”，同时Mini Contract.Pro也是一款专为开发者设计的开源电子签解决方案，创新性地采用「双模式引擎」架构，通过模块化设计满足从司法级签约到轻量级协作的全场景需求。首创支持证据链与非证据链双模式的开源电子签平台，我们已帮助 100+企业客户实现合同签署流程的数字化转型。



####  双模式引擎（灵活应对业务场景）

**司法级证据链模式**

基于蚂蚁司法链构建的区块链存证体系，为每份合同生成包含时间戳、数字指纹的存证报告，确保合同符合《电子签名法》要求。该模式已通过国家工业信息安全发展研究中心认证，特别适用于金融借贷、人力资源合同、知识产权协议等高价值场景，存证查询响应速度达毫秒级。



**轻量级非证据链模式**

采用自研的分布式存储技术，通过智能路由算法降低60%的接口调用成本。开发者无需对接第三方存证机构即可实现合同全生命周期管理，特别适合内部审批、供应商对账、快速签约等高频次场景，单日可承载千万级签署请求。



#### 第三方开发者友好

**即插即用工具集**

* 电子签名/印章云端托管服务

* 多方合同协同编辑（支持50+签署方并行操作）

* 智能骑缝章生成引擎（像素级定位精度）

* 全渠道签署页面（Web/H5/小程序/APP 多端自适应）



**深度开放能力**

* 提供Java/Python/Go多语言SDK

* 开放丰富的API接口



### 为什么选择 Mini Contract Pro？

**一站式集成解决方案**
我们整合了市场上主流的电子合同服务商（包括但不限于法大大、e签宝、君子签等），提供标准化API对接方案。开发者无需逐个对接不同厂商，通过统一接口即可快速接入多家服务，节省90%以上的对接时间。已预置的厂商资质认证体系可帮助您快速通过合规审查。



**成本优化优势**
通过集中采购的规模效应，我们为开发者提供比官方渠道更优惠的接口价格（平均优惠15%-30%）。支持按需选择服务商组合，避免单一厂商绑定风险，真正实现成本可控。



**企业级技术架构**
基于Vue3 + TypeScript + Pinia构建，采用：

- 模块化设计：支持服务商功能按需加载
- 响应式布局：完美适配PC/移动双端
- 配置化开发：90%常见需求可通过配置实现
- 完整类型支持：完善的TS类型定义和接口文档



**快速落地能力（提供开箱即用的解决方案）**

- 标准化UI组件库：含30+经过业务验证的合同模版组件（MIT协议可商用）
- 全链路监控：从合同创建到归档的全过程追踪和存证



### 商业授权

1. 商业版本与开源版本代码一致，没有区分；
2. 商业授权模式为永久授权，支持永久升级；
3. 商业使用需要授权，授权方式可选择联系下方技术同学。



### 开源须知

1. 仅允许用于个人学习研究使用；
2. 禁止将本开源的代码和资源进行任何形式任何名义的出售。



### 业务场景

* **人力资源公司：**频繁签署合同，纸质合同成本高，批量签署合同的业务场景
* **金融公司：**通过线上完成合同签署，留存有及时有效的合同管理合同

* **市场销售签单公司：**对一些网络销售的产品进行销售的时候，需要快速达成合作，立刻签署合同的场景

* **租赁公司：**需要对一些线下租赁公司进行快速合同签署，线上合同管理，查询和合同到期自动提醒的场景



目录结构
-----------------------------------

```json
mini-contract-pro/
├── App.uvue                        // 应用配置，全局样式和生命周期管理
├── main.uts                        // 应用入口文件
├── index.html                      // H5开发模板
├── manifest.json                   // 应用打包配置（应用名称、appid、版本等）
├── pages.json                      // 页面路由配置、导航栏、选项卡等
├── package.json                    // 项目依赖管理
├── uni.scss                        // SCSS全局变量预置，统一应用风格
├── vue.config.js                   // 开发配置
├── README.md                       // 项目文档
│
├── api/                            // 接口管理层，按功能分类
│   ├── index.uts                   // API总入口，导出所有接口
│   ├── auth.uts                    // 认证相关接口
│   ├── config.uts                  // 配置管理
│   ├── auth/
│   │   └── login.uts               // 登录接口
│   ├── ai-draft/
│   │   └── index.uts               // AI起草相关接口
│   ├── contracts/
│   │   └── index.uts               // 合同管理接口
│   ├── drafts/
│   │   └── index.uts               // 草稿管理接口
│   ├── enterprise/
│   │   └── index.uts               // 企业管理接口
│   ├── seals/
│   │   └── index.uts               // 印章管理接口
│   ├── templates/
│   │   └── index.uts               // 模板管理接口
│   ├── mock/                       // 模拟数据
│   │   ├── index.uts
│   │   └── templates.uts
│   └── utils/
│       └── download.uts            // 下载工具函数
│
├── components/                     // 公共组件库
│   ├── README.md                   // 组件使用文档
│   ├── KycModal.uvue               // KYC认证弹窗组件
│   ├── EnterpriseKycModal.uvue     // 企业KYC认证弹窗
│   ├── H5LoadingContainer.uvue     // H5加载容器
│   ├── H5ErrorContainer.uvue       // H5错误容器
│   ├── KYC_GUARD_USAGE.md          // KYC守卫使用指南
│   ├── ENTERPRISE_KYC_MODAL_USAGE.md
│   └── H5_SERVICE_CHECK_GUIDE.md
│
├── pages/                          // 页面文件（按功能模块组织）
│   ├── login/
│   │   └── index.uvue              // 登录页
│   ├── register/
│   │   └── index.uvue              // 注册页
│   ├── index/
│   │   └── index.uvue              // 首页
│   ├── contract-manage/            // 合同管理模块
│   │   ├── index.uvue              // 合同列表
│   │   └── draft.uvue              // 草稿箱
│   ├── contract-create/            // 合同创建模块
│   │   ├── setup.uvue              // 创建设置
│   │   ├── file.uvue               // 文件上传
│   │   ├── image.uvue              // 图片上传
│   │   └── h5-create.uvue          // H5创建页
│   ├── contract-detail/            // 合同详情
│   │   └── index.uvue
│   ├── contract-form/              // 合同表单填写
│   │   └── h5-fill.uvue
│   ├── contract-sign/              // 合同签署模块
│   │   ├── index.uvue              // 签署页
│   │   └── h5-sign.uvue            // H5签署页
│   ├── contract-view/              // 合同查看
│   │   └── h5-view.uvue
│   ├── contract-review/            // 合同审核
│   │   └── index.uvue
│   ├── contract-audit/             // 合同审查（天眼审查）
│   │   ├── intro.uvue              // 审查介绍
│   │   ├── progress.uvue           // 审查进度
│   │   ├── report.uvue             // 审查报告
│   │   ├── risk-detail.uvue        // 风险详情
│   │   └── history.uvue            // 审查历史
│   ├── ai-draft/                   // AI起草模块
│   │   ├── index.uvue              // AI起草首页
│   │   ├── chat.uvue               // AI对话页
│   │   ├── editor.uvue             // 编辑页
│   │   ├── detail.uvue             // 详情页
│   │   ├── preview.uvue            // 预览页
│   │   └── history.uvue            // 历史记录
│   ├── template-market/            // 模板市场
│   │   └── index.uvue
│   ├── template-detail/            // 模板详情
│   │   └── index.uvue
│   ├── template-preview/           // 模板预览
│   │   └── index.uvue
│   ├── enterprise/                 // 企业管理模块
│   │   ├── list.uvue               // 企业列表
│   │   ├── add.uvue                // 添加企业
│   │   ├── detail.uvue             // 企业详情
│   │   ├── members.uvue            // 成员管理
│   │   ├── member-invite.uvue      // 邀请成员
│   │   ├── member-edit.uvue        // 编辑成员
│   │   ├── seals.uvue              // 企业印章管理
│   │   ├── seal-create.uvue        // 创建企业印章
│   │   └── seal-authorize.uvue     // 印章授权
│   ├── profile/                    // 个人中心模块
│   │   ├── index.uvue              // 个人中心首页
│   │   ├── personal-info.uvue      // 个人信息
│   │   ├── seals.uvue              // 个人印章管理
│   │   ├── seal-create.uvue        // 创建个人印章
│   │   ├── settings.uvue           // 设置
│   │   ├── notifications.uvue      // 通知
│   │   ├── packages.uvue           // 套餐管理
│   │   ├── help.uvue               // 帮助中心
│   │   └── about.uvue              // 关于应用
│   ├── kyc/                        // KYC认证模块
│   │   └── index.uvue
│   ├── agreement/                  // 协议页面
│   │   ├── user.uvue               // 用户协议
│   │   └── privacy.uvue            // 隐私政策
│   └── pdf-preview/                // PDF预览
│
├── utils/                          // 工具函数库
│   ├── date.uts                    // 日期处理工具
│   ├── network.uts                 // 网络请求工具
│   └── kyc-check.uts               // KYC检查工具
│
├── static/                         // 静态资源
│   └── [图片、字体等资源文件]
│
├── scripts/                        // 构建脚本
│   └── [构建相关脚本]
│
└── uni_modules/                    // uni-app插件模块
```



技术架构
-----------------------------------

#### 开发环境

- **应用名称**：Mini Contract.Pro

- **框架**：uni-app + Vue 3
- **语言**：UTS (TypeScript)
- **版本**：3.2.0
- **支持平台**：iOS、Android、H5、小程序、APP
- **IDE(前端)**：HBuilder



## 核心功能模块

### 1. 用户系统
- **登录/注册**：用户账号管理
- **实名认证**：个人KYC认证
- **企业认证**：企业级KYC认证

### 2. 合同管理
- **创建合同**：支持文件上传、图片上传、模板创建
- **合同列表**：查看所有合同，支持筛选和搜索
- **草稿管理**：保存未完成的合同草稿
- **合同详情**：查看合同完整信息
- **合同审核**：审核合同内容

### 3. 合同签署
- **签署流程**：支持多方签署
- **签名管理**：创建和管理个人签名
- **印章管理**：创建和管理个人/企业印章
- **签署进度**：实时查看签署状态

### 4. 天眼审查（AI审查）
- **审查介绍**：显示审查功能说明
- **审查进度**：实时显示审查进度
- **审查报告**：生成详细的风险分析报告
- **风险详情**：查看具体风险项
- **审查历史**：查看历史审查记录

### 5. AI起草
- **AI对话**：与AI进行对话式合同起草
- **编辑器**：编辑AI生成的合同
- **预览**：预览合同内容
- **历史记录**：查看历史起草记录

### 6. 模板系统
- **模板市场**：浏览可用的合同模板
- **模板详情**：查看模板详细信息
- **模板预览**：预览模板内容
- **模板使用**：基于模板创建合同

### 7. 企业管理
- **企业列表**：管理多个企业账户
- **企业详情**：查看企业信息
- **成员管理**：添加、编辑、删除企业成员
- **成员邀请**：邀请新成员加入企业
- **企业印章**：创建和管理企业级印章
- **印章授权**：控制成员对印章的使用权限

### 8. 个人中心
- **个人信息**：管理用户基本信息
- **个人印章**：创建和管理个人印章
- **设置**：应用设置和偏好
- **通知**：消息和通知管理
- **套餐管理**：查看和升级用户套餐
- **帮助中心**：常见问题和帮助文档
- **关于应用**：应用信息和版本

## 技术栈

### 前端框架
- **uni-app**：跨平台开发框架，支持iOS、Android、H5、小程序
- **Vue 3**：渐进式JavaScript框架
- **UTS**：TypeScript变种，用于uni-app开发

### 开发工具
- **@dcloudio/uni-ui**：uni-app官方UI组件库
- **@dcloudio/uniapp-cli**：uni-app CLI工具

### 样式系统
- **SCSS**：CSS预处理器，通过uni.scss实现全局变量管理
- **CSS Mask + SVG**：现代简约图标系统

## API接口管理

所有API接口统一管理在`api/`目录下，按功能模块分类：

- **认证接口**：`api/auth.uts`、`api/auth/login.uts`
- **合同接口**：`api/contracts/index.uts`
- **草稿接口**：`api/drafts/index.uts`
- **企业接口**：`api/enterprise/index.uts`
- **印章接口**：`api/seals/index.uts`
- **模板接口**：`api/templates/index.uts`
- **AI起草接口**：`api/ai-draft/index.uts`

### 印章管理API示例

```typescript
// 获取印章列表
getSealList(params: { identityType: number; enterpriseId?: number; })

// 个人印章操作
userSeal.create(data)
userSeal.update(data)
userSeal.delete(id)
userSeal.page(params)

// 企业印章操作
enterpriseSeal.create(data)
enterpriseSeal.update(data)
enterpriseSeal.delete(id)
enterpriseSeal.page(params)

// 企业印章授权
enterpriseSeal.grantCreate(data)
enterpriseSeal.grantDelete(id)
enterpriseSeal.grantList(sealId)
```

## 开发指南

### 环境配置

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build
```

### 页面开发

1. 在`pages/`目录下创建新页面文件（.uvue格式）
2. 在`pages.json`中配置页面路由
3. 使用`uni.navigateTo()`进行页面跳转

### 组件开发

1. 在`components/`目录下创建新组件（.uvue格式）
2. 在需要的页面中导入组件
3. 参考`components/README.md`了解现有组件

### API调用

```typescript
// 导入API
import { userSeal } from '../../api/seals/index';

// 调用API
userSeal.create(sealData)
  .then(res => {
    console.log('成功', res);
  })
  .catch(err => {
    console.error('失败', err);
  });
```

## 重要文档

- **组件文档**：`components/README.md`
- **KYC使用指南**：`components/KYC_GUARD_USAGE.md`
- **企业KYC文档**：`components/ENTERPRISE_KYC_MODAL_USAGE.md`
- **H5服务检查**：`components/H5_SERVICE_CHECK_GUIDE.md`
- **认证API文档**：`API_DOCS_APP_AUTH.md`

## 常见问题

### 如何添加新页面？
1. 在`pages/`目录下创建新文件夹和.uvue文件
2. 在`pages.json`中添加页面配置
3. 使用`uni.navigateTo()`导航到新页面

### 如何调用后端API？
所有API调用通过`api/`目录下的接口函数进行，确保统一的请求管理和错误处理。

### 如何使用KYC认证？
参考`components/KYC_GUARD_USAGE.md`和`components/ENTERPRISE_KYC_MODAL_USAGE.md`文档。

### 如何处理H5兼容性问题？
使用`H5LoadingContainer`和`H5ErrorContainer`组件包装H5页面，参考`components/H5_SERVICE_CHECK_GUIDE.md`。



## 项目效果

#### 用户端（移动端=H5/小程序/APP）

----


![](.images/app/app_01@4x.png)

> 1. 登录方式 
>“手机号一键登录、微信扫一下、验证码 3 秒搞定，不用记密码也能进门。”
> 
> 2. 发起合同
>“PDF、手机相册里的图片，甚至一句话，都能秒变正式合同，30 秒就能发出去。”
> 
> 3. AI 起草 
>“不会写合同？直接告诉 AI 你要‘租房子’‘招兼职’，它 10 秒给你一份专业稿子，改都不用改。”
> 
> 4. 天眼审核
>“合同写好了，点一下‘天眼审核’，风险条款自动标红，哪句可能坑你，一眼看见。”



![](.images/app/app_02@4x.png)

> 1. 模板中心 
> “进来就像逛超市：销售、租赁、劳务……几百份合同模板排排站，看中哪个点哪个，3 秒就能开写。”
>
> 2. 模板详情页 
> “点进去，合同正文瞬间展开，哪条要填、哪条不改，一眼看清；30 秒就能判断这份模板是不是你想要的，零下载、零试错。”



![](.images/app/app_03@4x.png)

> 1. 文件上传创建合同 
> “把现成的合同文件拖进来，想加几个签署人就加几个，人数、顺序全由你说了算，一秒完成设置。”
>
> 2. 图片合并创建合同 
> “手机拍的、扫描的、截屏的……一次性选多张图，系统自动合成一份标准 PDF，再按你的需求随意添加签署人，几张图也能秒变正式合同。”



![](.images/app/app_04@4x.png)
![](.images/app/app_17@4x.png)

> 1. 模板创建 
> “选好模板先‘试看’：快速查看合同内容与合同信息，帮你快速做选择。”
>
> 2. 签名位置预拖 
> “生成前把签名框拖到想落章的地方（甲方、乙方、骑缝章……），谁签、签哪儿一次设好，后面系统会自动把章精准盖到位。”
>
> 3. 模板自带签署人 
> “如果模板里已经写好了‘甲方××公司、乙方××人’，系统会自动把这些人加到签署列表，你无需再敲一遍。”
>
> 4. 签收人记忆 
> “填过的姓名、手机号、企业名，系统悄悄帮你存进通讯录；下次再发合同，输入首字母就能秒带出，告别重复打字。”



![](.images/app/app_05@4x.png)

> 合同管理支持不同状态的合同进行 tab 筛选，同时点击合同也能查看相应的合同明细



![](.images/app/app_06@4x.png)

> 如果合同模版里面设置了在签署之前要填写表单信息，这个时候需要用户先填写完表单之后才能进行合同的签署；



![](.images/app/app_07@4x.png)

> 在签署的时候支持骑缝章和自由印章和个人签署的设置；



![](.images/app/app_08@4x.png)

> 用户的个人中心，支持切换当前企业



![](.images/app/app_09@4x.png)

> 1. 新增企业
> “新绑定公司，完成基本信息的填写之后完成企业认证之后；第一个注册的人自动升级为超级管理员，拥有最高权限。”
>
> 2. 企业专属后台
> “进入企业=进自己办公室：发合同、管合同、加成员、管印章，所有操作只在该企业内生效，数据互不串门。”
>
> 3. 一键实名认证
> “企业还没认证？点‘去认证’，上传营业执照+法人信息，审核通过后秒变‘已认证’，印章、合同立刻拥有法律效力。”



![](.images/app/app_10@4x.png)

> 1. 印章授权
> “管理员一键把公司公章、合同章‘递’给指定员工，谁有权盖章、用哪枚章，5 秒配好。”
>
> 2. 印章停用
> “员工离职或岗位变动，管理员立刻‘一键冻结’印章，秒停秒生效，再也盖不了，零风险。”



![](.images/app/app_11@4x.png)

> 管理人员也能对成员进行管理



![](.images/app/app_12@4x.png)

> 用户可以创建自己的印章，支持上传、手写、模版生成等方式



![](.images/app/app_13@4x.png)

> 企业用户支持上传、模版生成企业印章，同时同一类型的印章也是做了数量限制的； 



![](.images/app/app_14@4x.png)

> 支持对合同进行智能审核，并给出相应的审核报告，同时对风险等级进行智能分析提供用户参考；



![](.images/app/app_15@4x.png)

> 针对一些个性化客户，希望自己起草个性化的合同，目前是支持我们通过 ai 来进行智能起草；



![](.images/app/app_16@4x.png)

> 针对已经起草的合同初稿可以进行在线编辑与调整，使期更加的满足自己的个性化需求；






#### 用户端（PC端）

> Web 用户端，可以在后台对自己的合同进行相应的签署和查看

![](.images/pc/pc_01@4x.png)



![](.images/pc/pc_02@4x.png)

> pc 端同样支持手机号+密码的方式与短信验证码的方式进行登录；



![](.images/pc/pc_03@4x.png)

> 工作台支持查看基本的合同信息



![](.images/pc/pc_04@4x.png)
![](.images/pc/pc_16@4x.png)
![](.images/pc/pc_23@4x.png)
![](.images/pc/pc_24@4x.png)
![](.images/pc/pc_25@4x.png)
![](.images/pc/pc_11@4x.png)
![](.images/pc/pc_12@4x.png)
![](.images/pc/pc_13@4x.png)
![](.images/pc/pc_14@4x.png)


> 查看 所有的合同信息，支持在线签署和查看合同进度情况







![](.images/pc/pc_05@4x.png)
![](.images/pc/pc_06@4x.png)
![](.images/pc/pc_17@4x.png)
![](.images/pc/pc_18@4x.png)
![](.images/pc/pc_19@4x.png)

> 自行创建和管理个人印章和企业印章 






![](.images/pc/pc_07@4x.png)


![](.images/pc/pc_08@4x.png)

 ![](.images/pc/pc_20@4x.png)
 ![](.images/pc/pc_21@4x.png)

> 管理人员支持创建合同模版


![](.images/pc/pc_09@4x.png)
![](.images/pc/pc_21@4x.png)

> 管理人员可以邀请企业员工


![](.images/pc/pc_10@4x.png)

> 查看个人的基本信息



### 最近更新

##### V 3.2.0 

- [x] 【新增】Word转PDF发起合同
- [x] 【新增】支持安全确认签署（意愿签署：短信、邮箱、登录密码）
- [x] 【新增】个人实名认证支持 OCR 识别
- [x] 【新增】支持设置签名位置
- [x] 【优化】优化整体用户体验和移动端相应的提示
- [x] 【修复】其它 issues 提出的 bug 问题；



##### V 3.1.0 

- [x] 【新增】微信授权、公众号授权登录
- [x] 【新增】创建合同时支持提前预设印章落章位置
- [x] 【新增】支持从历史记录里面选择签署人信息
- [x] 【修复】修复小程序端兼容性问题；
- [x] 【修复】pdf 加载慢的性能问题；
- [x] 【修复】其它 issues 提出的 bug 问题；



##### V 3.0 Pro 版本

- [x] 【新增】全新风格的页面设计
- [x] 【新增】全新技术架构
- [x] 【新增】天眼审查（智能合同审核）
- [x] 【新增】AI 起草（AIGC 合同生成）


### 技术文档

* 在线演示： https://m-sign.leepm.com (移动端) ，https://pc-sign.leepm.com (PC 端)



### Star走势

[![Star History Chart](https://api.star-history.com/svg?repos=freeleepm/mini-contract&type=Date)](https://star-history.com/#freeleepm/mini-contract&Date)


### 交流合作

如果你有任何对 Mini Contract Pro 产品上的想法、意见或建议，或商务上的合作需求，请扫码添加 Mini Contract Pro 项目团队进一步沟通：
![输入图片说明](.images/shawn_huangxing_qrcode.png)

## 产品认可

> 从产品对外开源之后，得到了特别多朋友们的关注和认可最终我们也达成了一些深度的合作，目前我们已经合作超过300+以上的合作伙伴，这当中有“企业”的朋友也有一些“个人独立开发者”


![输入图片说明](.images/img/hp_001.png)
![输入图片说明](.images/img/hp_002.png)
![输入图片说明](.images/img/hp_003.png)
![输入图片说明](.images/img/hp_004.png)
![输入图片说明](.images/img/hp_005.png)



## 给个鼓励

如果觉得还不错，请 Watching，Starred，Fork 吧 ☺
