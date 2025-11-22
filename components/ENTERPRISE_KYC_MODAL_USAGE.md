# 企业认证提示弹窗组件使用文档

## 组件概述

`EnterpriseKycModal` 是一个企业认证提示弹窗组件，用于在用户尝试使用企业功能但企业未认证时，提供统一、专业的提示界面。

## 设计理念

- **视觉统一**: 与个人实名认证提示弹窗（`KycModal`）保持一致的视觉风格
- **专业体验**: 使用精心设计的图标、颜色和布局，提升用户体验
- **清晰引导**: 通过友好的文案和明确的操作按钮，引导用户完成企业认证

## 功能特点

1. **统一风格**: 与项目整体设计风格保持一致
2. **灵活配置**: 支持自定义标题、描述、按钮文字等
3. **友好提示**: 提供企业认证后可享有的权益说明
4. **响应式设计**: 适配不同屏幕尺寸

## 组件属性 (Props)

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `visible` | Boolean | `false` | 是否显示弹窗 |
| `title` | String | `'需要企业认证'` | 弹窗标题 |
| `description` | String | `'使用企业功能前需要先完成企业认证，是否现在就去认证？'` | 弹窗描述文字 |
| `confirmText` | String | `'立即认证'` | 确认按钮文字 |
| `cancelText` | String | `'稍后再说'` | 取消按钮文字 |
| `showTips` | Boolean | `true` | 是否显示提示信息 |

## 事件 (Events)

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `close` | - | 关闭弹窗 |
| `confirm` | - | 点击确认按钮 |
| `cancel` | - | 点击取消按钮 |

## 使用示例

### 1. 在个人中心页面使用

```vue
<script>
import EnterpriseKycModal from '../../components/EnterpriseKycModal.uvue';

export default {
  components: {
    EnterpriseKycModal
  },
  data() {
    return {
      showEnterpriseKycModal: false
    }
  },
  methods: {
    // 检查企业认证状态
    checkEnterpriseVerification() {
      if (!this.currentIdentity.verified) {
        this.showEnterpriseKycModal = true;
        return false;
      }
      return true;
    },
    
    // 关闭弹窗
    closeEnterpriseKycModal() {
      this.showEnterpriseKycModal = false;
    },
    
    // 确认前往认证
    confirmEnterpriseKyc() {
      this.showEnterpriseKycModal = false;
      // 跳转到企业认证页面
      uni.navigateTo({
        url: '/pages/kyc/enterprise/index'
      });
    },
    
    // 尝试访问企业功能
    goToEnterpriseFeature() {
      // 先检查认证状态
      if (!this.checkEnterpriseVerification()) {
        return;
      }
      
      // 已认证，继续执行业务逻辑
      // ...
    }
  }
}
</script>

<template>
  <view>
    <!-- 页面内容 -->
    
    <!-- 企业认证提示弹窗 -->
    <enterprise-kyc-modal 
      :visible="showEnterpriseKycModal"
      @close="closeEnterpriseKycModal"
      @confirm="confirmEnterpriseKyc"
      @cancel="closeEnterpriseKycModal"
    />
  </view>
</template>
```

### 2. 自定义文案

```vue
<enterprise-kyc-modal 
  :visible="showEnterpriseKycModal"
  title="完成企业认证"
  description="使用企业印章功能需要先完成企业认证，立即认证享受更多企业服务！"
  confirm-text="去认证"
  cancel-text="暂不认证"
  @close="closeEnterpriseKycModal"
  @confirm="confirmEnterpriseKyc"
/>
```

### 3. 不显示提示信息

```vue
<enterprise-kyc-modal 
  :visible="showEnterpriseKycModal"
  :show-tips="false"
  @close="closeEnterpriseKycModal"
  @confirm="confirmEnterpriseKyc"
/>
```

## 样式说明

### 主色调
- 主题色: `#00C28A` (绿色)
- 图标背景: `rgba(0, 194, 138, 0.1)` (浅绿色)

### 尺寸规范
- 弹窗宽度: 屏幕宽度的 85%
- 弹窗圆角: `16rpx`
- 图标容器: `100rpx × 100rpx`
- 图标大小: `48rpx`
- 按钮高度: `88rpx`
- 按钮圆角: `44rpx` (半圆角)

### 字体规范
- 标题: `34rpx`, 粗体
- 描述: `28rpx`, 行高 `44rpx`
- 提示文字: `26rpx`
- 按钮文字: `30rpx`, 字重 `500`

## 使用场景

1. **企业管理**: 用户尝试访问企业管理页面但企业未认证时
2. **企业印章**: 用户尝试使用企业印章功能但企业未认证时
3. **成员邀请**: 用户尝试邀请成员但企业未认证时
4. **企业套餐**: 用户尝试购买企业套餐但企业未认证时

## 最佳实践

### 1. 统一的认证检查

建议创建一个统一的认证检查方法：

```typescript
checkEnterpriseAuth(): boolean {
  // 检查是否为企业身份
  if (this.currentIdentity.type !== 'enterprise') {
    uni.showToast({
      title: '请先切换到企业身份',
      icon: 'none'
    });
    return false;
  }
  
  // 检查企业是否已认证
  if (!this.currentIdentity.verified) {
    this.showEnterpriseKycModal = true;
    return false;
  }
  
  return true;
}
```

### 2. 优雅的错误处理

```typescript
async goToEnterpriseFeature() {
  try {
    // 检查认证状态
    if (!this.checkEnterpriseAuth()) {
      return;
    }
    
    // 执行业务逻辑
    await this.doSomething();
    
  } catch (error) {
    console.error('操作失败:', error);
    uni.showToast({
      title: '操作失败，请稍后重试',
      icon: 'none'
    });
  }
}
```

### 3. 认证完成后的回调

```typescript
confirmEnterpriseKyc() {
  this.showEnterpriseKycModal = false;
  
  // 记录用户意图，认证完成后自动返回
  uni.setStorageSync('pendingAction', 'goToEnterpriseFeature');
  
  // 跳转到企业认证页面
  uni.navigateTo({
    url: '/pages/kyc/enterprise/index'
  });
}
```

## 与个人实名认证弹窗的区别

| 特性 | 个人实名认证 (`KycModal`) | 企业认证 (`EnterpriseKycModal`) |
|------|-------------------------|-------------------------------|
| 图标 | `fa-id-card` (身份证) | `fa-building` (企业) |
| 主题色 | 蓝色 `#1890FF` | 绿色 `#00C28A` |
| 提示内容 | 个人认证权益 | 企业功能权益 |
| 适用场景 | 个人功能 | 企业功能 |

## 注意事项

1. **图标依赖**: 确保项目中已引入 FontAwesome 字体文件
2. **层级关系**: 弹窗 `z-index` 为 `999`，确保不会被其他元素遮挡
3. **事件处理**: 点击遮罩层会触发 `close` 事件，建议同时监听 `close` 和 `cancel` 事件
4. **状态管理**: 建议在组件外部管理 `visible` 状态，便于控制弹窗显示

## 更新日志

### v1.0.0 (2024-01-XX)
- 初始版本
- 实现基础功能
- 与个人实名认证弹窗保持视觉统一

