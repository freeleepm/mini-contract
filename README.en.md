<!--
 * @Description:
 * @LastEditTime: 2023-10-25 14:10:17
 * @LastEditors: 何俊峰
 * @Author: 何俊峰
 * @Date: 2023-02-23 10:11:20
-->
Mini-Contract(Free and Open Source Electronic Contracts)
===============

Current Latest Version: v1.5.0 (Release Date: 2023-10-25)

[![输入图片说明](https://img.shields.io/static/v1?label=licents&message=Apache%20License%202.0&color=green)](https://gitee.com/leepm/mini-contract/blob/master/LICENSE)
[![输入图片说明](https://img.shields.io/static/v1?label=Author&message=重庆弈联数聚科技有限公司&color=blue)](https://wwww.yi-types.com)
[![输入图片说明](https://img.shields.io/static/v1?label=version&message=1.5.0&color=green)](https://wwww.yi-types.com)


#### 介绍



<h3 align="center">Mini-Contract</h3>

⭐️⭐️⭐️   Mini-Contract is an open-source product that has been separated from the commercial product "YiHetong" by "Chongqing Yeeco Technology Co., Ltd." This tool provides a comprehensive solution customized for industry-specific needs and business scenarios. It enables convenient online contract signing, ensuring security, compliance, and reliability. It builds a time-saving and efficient closed-loop service system for small and medium-sized enterprises and users, creating a worry-free legal protection system. The underlying electronic contract technology is based on "eSign" and other "contract vendors," which are nationally certified and secure.



### 为什么选择Mini-Contract ?

Mini-Contract aggregates various electronic contract solution providers in the market, so you don't need to integrate with each contract vendor one by one, saving you time and effort. We have already handled this integration for you, and you only need a single interface to access all our service providers. Additionally, you can enjoy our interface channel prices. Mini-Contract is the result of our real-world project experience, offering concise code, the latest technology stack, and is suitable for front-end developers with various needs. It is also the preferred choice for small and medium-sized enterprises, as it can help reduce over 80% of the repetitive work in front-end projects. If you don't mind using our user interface style, you can quickly launch your project without worrying about copyright issues.



### 商业授权

The commercial version of the code is identical to the open-source version.

Commercial licensing is perpetual and supports lifelong upgrades.

For commercial use, please contact the technical team below for licensing details.




### 开源须知

1. Only allowed for personal study and research use.
2. Prohibited from selling the code and resources in any form or under any name.




目录结构
-----------------------------------

```
├─App.vue                           // Application configuration, used for configuring global styles and event listeners
├─index.html                        // Provides functionality for web page development and serves as a template
├─jsconfig.json                     // Configuration for code linting, etc.
├─main.js                           // Entry file
├─manifest.json                     //  Configuration for application name, appid, logo, version, etc.
├─pages.json                        // Configuration for page routes, navigation bars, tabs, and other page-related information
├─README.md                         // Help documentation
├─uni.scss                          // Pre-set SCSS variables for easy control of the application's style
├─vue.config.js                     // Development settings
├─api                               // Interface management, categorized by functionality
├─components                        // Public component library
│  ├─backTop                        // Back to top button
│  ├─BaseEmpty                      //  Empty page
│  ├─baseline                       // No more data
│  ├─btn-fixed                      // Fixed bottom component (slot)
│  ├─checkUser                      // Switch identity
│  ├─contractState                  // Contract status
│  ├─FileItem                       // File information
│  ├─loading                        // Page loading
│  ├─loadMore                       // Load more data
│  ├─SwitchEnvironment              // Switch environment
│  ├─tag-auth                       // User identity
│  ├─userInfo                       // User information
│  └─v-tabs                         // Tab switch
├─config                            //  Configuration
│  ├─config.js                      // System configuration (domain, etc.)
│  ├─net.config.js                  // Domain configuration
│  └─setting.js                     // Other global configurations (e.g., page sharing messages)
├─filters                           // Filters
├─mixins                            // Mixins
│  └─share.js                       // Page sharing
├─pages                             // Page folders
│  ├─contract                       // Contract-related pages
│  │  ├─index.vue                   // Contract home
│  │  │    └─index.vue              // Contract details
│  │  ├─sign                        // Initiate signing
│  │  └─revoke                      // Revoke contract
│  ├─home                           // Home
│  │  └─contractTemplate            // Contract templates
│  ├─index                          // Start page
│  ├─login                          // Login and registration
│  └─user                           // My account
│     ├─company                     // Company-related
│     │    ├─addCompany.vue         // Add company
│     │    ├─addSeal.vue            // Add seal
│     │    ├─authorize.vue          // Web-view page
│     │    ├─Certification.vue      // Company certification
│     │    ├─companySeal.vue        // Company seal management
│     │    ├─create.vue             // Create company (deprecated)
│     │    ├─myCompany.vue          // My company
│     │    └─removeComfirm.vue      // Remove company
│     ├─companyMembers              // Members
│     │    ├─createMember.vue       // Add member
│     │    └─index.vue              // Company members
│     ├─createUser                  // Signers
│     │    ├─addPerson.vue          // Add recent signers (deprecated)
│     │    └─index.vue              // Recent signers
│     ├─file                        // File management
│     ├─package                     // Packages
│     │    ├─buy.vue                // Purchase packages
│     │    └─comboDetails.vue       // My packages
│     ├─personal                    // Personal
│     │    └─Certification.vue      // Personal certification
│     └─setting                     // Settings
│          ├─changeIdentity.vue     // Switch identity (deprecated)
│          ├─password.vue           // Change password (deprecated)
│          └─Privacy.vue            // Privacy statement
├─static                            // Static resources storage, such as images, videos
│  └─tabbar                         // Tabbar icons
├─store                             // State management library
├─style                             // Public style library
├─uni_modules                       // Project components, pages, common modules, etc.
├─unpackage                         // Build directory
└─utils                             // Utilities
   ├─cache.js                       // Cache management
   ├─common.js                      // Common functions
   ├─compress.js                    // Image compression
   ├─reg.js                         // Common regular expressions
   └─request.js                     // Network request settings
```



Technical Architecture
-----------------------------------

#### Development Environment

- Language: Vue 2.0

- IDE (Front-end): VSCode, HBuilder

- Dependency Management: npm



#### Mobile Framework

| Description       | Framework       | Description       | Framework       |
| ------------------ | --------------- | ------------------ | --------------- |
| Basic Framework    | uni-app         | JavaScript Version | ES6             |
| Basic JS Framework | Vue.js          | Video Player      | Native video    |
| Routing Management | Vue Router      | State Management  | Vuex            |
| Network Requests  | axios           | CSS Pre-processing | SCSS            |
| Map Engine        | map             |                  |                 |



### Function Modules

```
Business Functions
├─Login and Registration
│  ├─Account Method
│  └─WeChat Authorization
├─Home
│  ├─Quick Contract Handling
│  │  ├─To Be Processed by Me
│  │  └─To Be Processed by Others
│  └─Recent Contracts
├─Contracts
│  ├─To Be Processed by Me
│  ├─To Be Processed by Others
│  ├─Completed
│  ├─Rejected
│  ├─Revoked
│  └─Overdue
├─Initiate New Signing Contracts
└─My Account
   ├─My Company
   ├─Company Seals
   ├─File Management
   ├─Package Management
   ├─Privacy Policy
   ├─Change Password
   └─Personal Center
      ├─Company Packages
      └─Personal Packages
```




Project Screenshots
----



![](https://leepm.oss-cn-beijing.aliyuncs.com/public-images/yihetong_01.png)
![](https://leepm.oss-cn-beijing.aliyuncs.com/public-images/yihetong_02.png)



#### User Interface (Mobile)

![](https://leepm.oss-cn-beijing.aliyuncs.com/public-images/yihetong_03.png)
![](https://leepm.oss-cn-beijing.aliyuncs.com/public-images/yihetong_04.png)
![](https://leepm.oss-cn-beijing.aliyuncs.com/public-images/yihetong_05.png)
![](https://leepm.oss-cn-beijing.aliyuncs.com/public-images/yihetong_06.png)
![](https://leepm.oss-cn-beijing.aliyuncs.com/public-images/yihetong_07.png)
![](https://leepm.oss-cn-beijing.aliyuncs.com/public-images/yihetong_08.png)


#### User Interface (Web)

> The web-based user interface allows users to sign and view their contracts in the backend.

![](https://leepm.oss-cn-beijing.aliyuncs.com/public-images/yihetong_pc_01.png)

#### Platform Interface

***Data Overview***

> Gain insights into basic information about all users on the contract platform and aggregate and summarize data.

![](https://leepm.oss-cn-beijing.aliyuncs.com/public-images/yihetong_admin_01.png)

***Personal Certification***

> The platform can view desensitized basic information for all personal certifications.

![](https://leepm.oss-cn-beijing.aliyuncs.com/public-images/yihetong_admin_02.png)

***Company Certification***

> The platform can view desensitized basic information for all company certifications.

![](https://leepm.oss-cn-beijing.aliyuncs.com/public-images/yihetong_admin_03.png)

***Sales Orders***

> The platform can view all contract sales information.

![](https://leepm.oss-cn-beijing.aliyuncs.com/public-images/yihetong_admin_04.png)

***Service Usage***

> The platform can view all contract usage and consumption information.

![](https://leepm.oss-cn-beijing.aliyuncs.com/public-images/yihetong_admin_05.png)

***Pricing Settings***

> The platform can set prices based on contract operational needs.

![](https://leepm.oss-cn-beijing.aliyuncs.com/public-images/yihetong_admin_06.png)

***Account Management***

> The platform can configure user permissions based on different roles.

![](https://leepm.oss-cn-beijing.aliyuncs.com/public-images/yihetong_admin_07.png)

### Latest Updates



#####  Version 1.5.0 Release Notes
- [x] Added support for non-evidence chain contract signing (suitable for daily internal approvals within companies).
- [x] Optimized seal management.
- [x] Enhanced company real-name certification logic.
- [x] Improved logic for multi-channel signing in evidence chains.
- [x] Upgraded third-party plugin versions.
- [x] Enhanced privacy protection agreement content.
- [x] Improved user experience.
- [x] Fixed known bugs.


##### Version 1.1.2 Release Notes

- [x] Added support for backend management to view company contract status.
- [x] Improved user experience.
- [x] Fixed known bugs.


##### Version 1.1.1 Release Notes

- [x] Optimized the number of electronic contract copies for companies and individuals.
- [x] Improved user experience.
- [x] Fixed known bugs.



##### Version 1.1.0 Release Notes

- [x] Added a variety of contract templates.
- [x] Added in-app contract signing for an enhanced user experience.
- [x] Added SMS notifications to signing parties to ensure timely communication.
- [x] Improved user experience.
- [x] Fixed known bugs.




### Technical Documentation

* Online Demo：

![](https://leepm.oss-cn-beijing.aliyuncs.com/public-images/yihetong_qrcode.png)



### Contact and Collaboration

If you would like to join our open-source discussion group, please scan the QR code to add the Mini-Contract project team and join the group chat:
：
![输入图片说明](https://leepm.oss-cn-beijing.aliyuncs.com/public-images/shawn_company_qrcode.png)



If you have any ideas, suggestions, or business collaboration needs regarding the Mini-Contract product, please scan the QR code to add the Mini-Contract project team for further communication:
：
![输入图片说明](https://leepm.oss-cn-beijing.aliyuncs.com/public-images/shawn_huangxing_qrcode.png)

## Donations

If you find it useful, please consider Watching, Starred, and Forked ☺

