# 实名认证守卫使用指南

## 📚 概述

本系统提供了统一的实名认证检查和提示功能，包括：
- **KycModal组件**：统一的实名认证提示弹窗
- **kyc-check工具**：实名认证状态检查和验证工具
- **kycGuardMixin**：可复用的Mixin，包含完整的认证守卫逻辑

## 🎯 核心文件

- `components/KycModal.uvue` - 实名认证弹窗组件
- `utils/kyc-check.uts` - 实名认证工具函数和Mixin

## 📖 使用方式

### 方式一：使用 Mixin（推荐）

**适用场景**：需要在页面中多次检查认证状态，或有多个需要认证的操作

**步骤：**

1. 在页面中引入 Mixin 和组件：

```vue
<script lang="uts">
import { kycGuardMixin } from '../../utils/kyc-check';
import KycModal from '../../components/KycModal.uvue';

export default {
  // 引入 Mixin
  mixins: [kycGuardMixin],
  
  // 注册组件
  components: {
    KycModal
  },
  
  onLoad() {
    // 在页面加载时检查认证状态
    this.checkKycStatus();
  },
  
  methods: {
    // 需要认证的操作
    handleCreateContract() {
      // 先检查是否可以执行（自动显示弹窗）
      if (!this.checkCanProceed()) {
        return;
      }
      
      // 已认证，执行业务逻辑
      this.doCreateContract();
    }
  }
}
</script>

<template>
  <view class="page">
    <!-- 页面内容 -->
    <button @click="handleCreateContract">创建合同</button>
    
    <!-- 实名认证弹窗 -->
    <kyc-modal 
      :visible="showKycModal"
      description="此功能需要完成实名认证"
      @close="closeKycModal"
      @confirm="goToKyc"
    />
  </view>
</template>
```

**Mixin 提供的属性和方法：**

```typescript
// 数据属性
this.verifyStatus    // 当前认证状态 (0:未认证, 1:审核中, 2:已认证, 3:失败)
this.showKycModal    // 是否显示认证弹窗

// 方法
this.checkKycStatus()      // 检查认证状态（异步）
this.checkCanProceed()     // 检查是否可以执行操作，未认证会自动显示弹窗
this.closeKycModal()       // 关闭认证弹窗
this.goToKyc()             // 前往实名认证页面
```

### 方式二：直接使用组件

**适用场景**：只需要在特定情况下显示认证提示

**步骤：**

```vue
<script>
import KycModal from '../../components/KycModal.uvue';

export default {
  components: {
    KycModal
  },
  
  data() {
    return {
      showKycModal: false,
      userVerified: false
    }
  },
  
  methods: {
    handleAction() {
      if (!this.userVerified) {
        // 手动显示弹窗
        this.showKycModal = true;
        return;
      }
      
      // 执行操作
    },
    
    handleKycConfirm() {
      this.showKycModal = false;
      uni.navigateTo({
        url: '/pages/kyc/personal/index'
      });
    }
  }
}
</script>

<template>
  <view>
    <kyc-modal 
      :visible="showKycModal"
      title="需要实名认证"
      description="此功能需要完成实名认证"
      cancel-text="稍后"
      confirm-text="去认证"
      @close="showKycModal = false"
      @confirm="handleKycConfirm"
    />
  </view>
</template>
```

### 方式三：使用工具函数

**适用场景**：简单的认证状态检查，不需要UI

**示例：**

```typescript
import { 
  getKycStatus, 
  isKycVerified, 
  checkKycWithPrompt,
  KycStatus 
} from '@/utils/kyc-check';

// 1. 获取认证状态
async function checkStatus() {
  const status = await getKycStatus();
  console.log('认证状态:', status);
  // 0: 未认证, 1: 审核中, 2: 已认证, 3: 失败
}

// 2. 检查是否已认证
async function checkVerified() {
  const verified = await isKycVerified();
  if (verified) {
    // 已认证，执行操作
  } else {
    // 未认证，显示提示
  }
}

// 3. 检查并自动提示（使用系统弹窗）
async function checkAndPrompt() {
  const verified = await checkKycWithPrompt(true);
  if (verified) {
    // 已认证，执行操作
  }
  // 未认证会自动显示系统弹窗
}
```

## 🎨 组件属性说明

### KycModal 组件

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| visible | Boolean | false | 是否显示弹窗 |
| title | String | '需要实名认证' | 弹窗标题 |
| description | String | '为保障合同的法律效力...' | 描述文本 |
| cancelText | String | '稍后再说' | 取消按钮文字 |
| confirmText | String | '立即认证' | 确认按钮文字 |
| closeOnClickOverlay | Boolean | true | 点击遮罩层是否关闭 |

### 组件事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| close | - | 关闭弹窗时触发 |
| cancel | - | 点击取消按钮时触发 |
| confirm | - | 点击确认按钮时触发 |

## 🔍 实际案例

### 案例1：合同管理页面

**文件**：`pages/contract-manage/index.uvue`

**需求**：点击"创建合同"按钮时检查实名认证

```vue
<script lang="uts">
import { kycGuardMixin } from '../../utils/kyc-check';
import KycModal from '../../components/KycModal.uvue';

export default {
  mixins: [kycGuardMixin],
  components: { KycModal },
  
  onLoad() {
    // 页面加载时检查认证状态
    this.checkKycStatus();
  },
  
  methods: {
    navigateToCreate() {
      // 检查认证，未认证自动显示弹窗
      if (!this.checkCanProceed()) {
        return;
      }
      
      // 已认证，跳转创建页面
      uni.navigateTo({
        url: '/pages/contract-create/h5-create'
      });
    }
  }
}
</script>

<template>
  <view>
    <button @click="navigateToCreate">创建合同</button>
    
    <kyc-modal 
      :visible="showKycModal"
      description="为保障合同的法律效力，创建合同前需要完成实名认证。"
      @close="closeKycModal"
      @confirm="goToKyc"
    />
  </view>
</template>
```

### 案例2：模板详情页面（使用模板前验证）

在模板详情页面，用户点击"使用此模板"时需要先验证实名认证。

```vue
<script lang="uts">
import { getTemplateDetail } from '../../api/templates/index';
import { kycGuardMixin } from '../../utils/kyc-check';
import KycModal from '../../components/KycModal.uvue';

export default {
  mixins: [kycGuardMixin],
  components: { KycModal },
  
  data() {
    return {
      templateId: '',
      templateDetail: null
    }
  },
  
  methods: {
    // 使用此模板创建合同
    handleUseTemplate(): void {
      if (!this.templateDetail) return;
      
      // 先检查实名认证状态
      if (!this.checkCanProceed()) {
        console.log('[模板详情] 未完成实名认证，显示提示弹窗');
        return;
      }
      
      // 跳转到H5创建合同页面
      uni.navigateTo({
        url: `/pages/contract-create/h5-create?templateId=${this.templateId}`
      });
    }
  }
}
</script>

<template>
  <view class="page">
    <!-- 页面内容 -->
    
    <!-- 底部按钮 -->
    <view class="bottom-bar">
      <view class="bottom-button primary" @click="handleUseTemplate">
        <text class="btn-text">使用此模版</text>
      </view>
    </view>
    
    <!-- 实名认证提示弹窗 -->
    <kyc-modal 
      :visible="showKycModal"
      description="为保障合同的法律效力，使用模板创建合同前需要完成实名认证。"
      @close="closeKycModal"
      @confirm="goToKyc"
    />
  </view>
</template>
```

### 案例3：个人中心页面（替换旧实现）

**原代码**（使用系统弹窗）：

```javascript
promptForVerification() {
  uni.showModal({
    title: '需要认证',
    content: '此功能需要先完成个人实名认证，是否现在就去认证？',
    confirmText: '去认证',
    cancelText: '稍后',
    success: (res) => {
      if (res.confirm) {
        this.goToPersonalVerification();
      }
    }
  });
}
```

**新代码**（使用统一组件）：

```vue
<script>
import { kycGuardMixin } from '../../utils/kyc-check';
import KycModal from '../../components/KycModal.uvue';

export default {
  mixins: [kycGuardMixin],
  components: { KycModal },
  
  methods: {
    // 替换原有的 promptForVerification
    goToSignatures() {
      if (!this.checkCanProceed()) {
        return;
      }
      
      uni.navigateTo({
        url: '/pages/profile/signatures'
      });
    }
  }
}
</script>

<template>
  <view>
    <button @click="goToSignatures">签名管理</button>
    
    <kyc-modal 
      :visible="showKycModal"
      @close="closeKycModal"
      @confirm="goToKyc"
    />
  </view>
</template>
```

## 🔄 迁移现有代码

### 查找需要迁移的代码

在项目中搜索以下模式：

```bash
# 搜索使用 verifyStatus === 2 的地方
grep -r "verifyStatus.*===.*2" pages/

# 搜索使用 isVerified 的地方
grep -r "isVerified" pages/

# 搜索使用 promptForVerification 的地方
grep -r "promptForVerification" pages/

# 搜索使用 uni.showModal 的认证提示
grep -r "需要认证\|实名认证" pages/
```

### 迁移清单

**✅ 已完成迁移的页面：**

- [x] `pages/contract-manage/index.uvue` - 创建合同前实名认证检查
- [x] `pages/template-detail/index.uvue` - 使用模板前实名认证检查

**⏳ 待迁移的页面：**

- [ ] `pages/profile/index.uvue` - promptForVerification方法
- [ ] `pages/profile/personal-info.uvue` - 认证状态显示
- [ ] `pages/enterprise/list.uvue` - 创建企业认证检查
- [ ] `pages/enterprise/members.uvue` - 成员管理认证检查
- [ ] `pages/enterprise/seals.uvue` - 印章管理认证检查
- [ ] `pages/profile/seals.uvue` - 个人印章认证检查
- [ ] `pages/profile/signatures.uvue` - 签名管理认证检查

## ✅ 最佳实践

1. **统一使用 Mixin**：在需要多次检查认证的页面，使用 `kycGuardMixin`
2. **自定义描述**：根据具体功能自定义 `description` 属性
3. **页面加载检查**：在 `onLoad` 中调用 `checkKycStatus()` 预先获取状态
4. **避免重复验证**：同一页面多个操作共用一个认证检查
5. **保持一致性**：逐步替换旧的系统弹窗，使用统一的 `KycModal` 组件

## 🐛 常见问题

### Q1: Mixin 中的方法和组件冲突怎么办？

如果页面中已有同名方法（如 `checkKycStatus`），可以只引入组件而不使用 Mixin：

```javascript
export default {
  // 不引入 Mixin
  components: { KycModal },
  
  data() {
    return {
      showKycModal: false,
      verifyStatus: 0
    }
  },
  
  methods: {
    // 自己实现认证检查逻辑
    async checkMyKycStatus() {
      const status = await getKycStatus();
      this.verifyStatus = status;
    }
  }
}
```

### Q2: 如何自定义弹窗样式？

组件样式在 `components/KycModal.uvue` 中定义，可以直接修改该文件。

### Q3: 如何在工具函数中显示自定义弹窗而不是系统弹窗？

工具函数中的 `checkKycWithPrompt` 使用的是系统弹窗作为降级方案。如需自定义弹窗，建议使用 Mixin 方式。

## 📝 注意事项

1. ⚠️ **不要重复定义**：使用 Mixin 后，不要再在 `data()` 中定义 `verifyStatus` 和 `showKycModal`
2. ⚠️ **组件必须注册**：使用 `KycModal` 前必须在 `components` 中注册
3. ⚠️ **导入路径**：注意根据页面层级调整导入路径（`../../utils/` 或 `@/utils/`）
4. ⚠️ **异步方法**：`checkKycStatus()` 是异步方法，需要使用 `await` 或 `.then()`

## 🚀 未来规划

- [ ] 支持企业认证检查
- [ ] 支持自定义认证跳转页面
- [ ] 支持认证成功后的回调
- [ ] 增加认证进度显示
- [ ] 支持多语言（i18n）

## 📞 技术支持

如有问题，请联系开发团队或查看：
- 组件源码：`components/KycModal.uvue`
- 工具源码：`utils/kyc-check.uts`
- 示例页面：`pages/contract-manage/index.uvue`

