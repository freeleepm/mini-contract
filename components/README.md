# H5 加载与错误处理组件

本目录包含用于 H5 页面加载和错误处理的可复用组件。

## 组件列表

### 1. H5LoadingContainer.uvue
通用的加载指示器组件，用于显示 H5 页面加载状态。

#### Props
- `loadingText` (String): 加载文本，默认："正在加载..."
- `hintText` (String): 可选的提示文本，默认：空

#### 使用示例
```vue
<template>
  <H5LoadingContainer 
    loadingText="正在检测签署服务..."
    hintText="首次加载可能需要较长时间"
  />
</template>

<script>
import H5LoadingContainer from '../../components/H5LoadingContainer.uvue';

export default {
  components: {
    H5LoadingContainer
  }
}
</script>
```

---

### 2. H5ErrorContainer.uvue
通用的错误提示组件，提供友好的错误信息展示和操作选项。

#### Props
- `title` (String): 错误标题，默认："无法加载页面"
- `errorMessage` (String): 错误信息，**必填**
- `showTips` (Boolean): 是否显示提示信息，默认：true
- `tips` (Array): 提示信息数组，默认：通用提示
- `showBackButton` (Boolean): 是否显示返回按钮，默认：true
- `backButtonText` (String): 返回按钮文本，默认："返回"
- `showRetryButton` (Boolean): 是否显示重试按钮，默认：true
- `retryButtonText` (String): 重试按钮文本，默认："重试"
- `showContactSupport` (Boolean): 是否显示联系客服，默认：true
- `contactSupportText` (String): 联系客服文本，默认："联系客服"

#### Events
- `@back`: 点击返回按钮时触发
- `@retry`: 点击重试按钮时触发
- `@contact-support`: 点击联系客服时触发

#### 使用示例
```vue
<template>
  <H5ErrorContainer
    title="签署服务不可用"
    :errorMessage="errorMessage"
    :tips="customTips"
    @back="handleBack"
    @retry="handleRetry"
    @contact-support="handleContactSupport"
  />
</template>

<script>
import H5ErrorContainer from '../../components/H5ErrorContainer.uvue';

export default {
  components: {
    H5ErrorContainer
  },
  data() {
    return {
      errorMessage: '网络连接失败\n请检查网络设置后重试',
      customTips: [
        '• 请确保设备已连接到互联网',
        '• 尝试切换到其他网络',
        '• 如问题持续，请联系技术支持'
      ]
    }
  },
  methods: {
    handleBack() {
      uni.navigateBack();
    },
    handleRetry() {
      // 重试逻辑
    },
    handleContactSupport() {
      // 联系客服逻辑
    }
  }
}
</script>
```

---

## 完整使用示例

### 结合网络检查工具使用

```vue
<template>
  <view class="container">
    <!-- 加载状态 -->
    <H5LoadingContainer 
      v-if="loading && !errorMessage"
      loadingText="正在加载..."
    />

    <!-- 错误提示 -->
    <H5ErrorContainer
      v-if="errorMessage && !loading"
      :errorMessage="errorMessage"
      @back="goBack"
      @retry="retry"
      @contact-support="contactSupport"
    />

    <!-- H5 WebView -->
    <web-view
      v-if="h5Url && !errorMessage && !loading"
      :src="h5Url"
      @load="handleLoad"
      @error="handleError"
      class="webview"
    />
  </view>
</template>

<script>
import { 
  checkNetworkStatus,
  testH5ServiceAvailability,
  analyzeWebViewError,
  getErrorMessage,
  setupNetworkListener,
  ErrorType
} from '../../utils/network';
import H5LoadingContainer from '../../components/H5LoadingContainer.uvue';
import H5ErrorContainer from '../../components/H5ErrorContainer.uvue';

export default {
  components: {
    H5LoadingContainer,
    H5ErrorContainer
  },
  
  data() {
    return {
      h5Url: '',
      loading: true,
      errorMessage: '',
      errorType: '',
      cancelNetworkListener: null
    }
  },
  
  onLoad() {
    this.setupNetworkListener();
    this.checkAndLoad();
  },
  
  onUnload() {
    if (this.cancelNetworkListener) {
      this.cancelNetworkListener();
    }
  },
  
  methods: {
    setupNetworkListener() {
      this.cancelNetworkListener = setupNetworkListener((isConnected) => {
        if (isConnected && this.errorType === ErrorType.NETWORK) {
          uni.showModal({
            title: '网络已恢复',
            content: '是否重新加载？',
            success: (res) => {
              if (res.confirm) {
                this.retry();
              }
            }
          });
        }
      });
    },
    
    async checkAndLoad() {
      // 1. 检查网络
      const networkResult = await checkNetworkStatus();
      if (!networkResult.success) {
        this.loading = false;
        this.errorType = networkResult.errorType;
        this.errorMessage = networkResult.errorMessage;
        return;
      }
      
      // 2. 构建URL
      this.h5Url = 'https://your-h5-service.com/page';
      
      // 3. 测试H5服务
      const serviceResult = await testH5ServiceAvailability(this.h5Url);
      if (!serviceResult.available) {
        this.loading = false;
        this.errorType = serviceResult.errorType;
        this.errorMessage = serviceResult.errorMessage;
      }
    },
    
    handleLoad() {
      this.loading = false;
    },
    
    handleError(e) {
      this.loading = false;
      this.errorType = analyzeWebViewError(e);
      this.errorMessage = getErrorMessage(this.errorType);
    },
    
    retry() {
      this.errorMessage = '';
      this.errorType = '';
      this.loading = true;
      this.checkAndLoad();
    },
    
    goBack() {
      uni.navigateBack();
    },
    
    contactSupport() {
      uni.showModal({
        title: '联系客服',
        content: '客服电话：400-xxx-xxxx',
        showCancel: false
      });
    }
  }
}
</script>

<style>
.container {
  flex: 1;
  width: 100%;
  height: 100%;
}

.webview {
  width: 100%;
  height: 100%;
}
</style>
```

---

## 自定义样式

两个组件都支持通过全局样式或内联样式进行自定义。

### 修改加载动画颜色
```css
/* 在全局样式或组件的 style 中覆盖 */
.loading-spinner {
  border-top-color: #1890FF; /* 自定义颜色 */
}
```

### 修改错误图标样式
```css
.error-icon {
  color: #FF4D4F; /* 自定义颜色 */
  font-size: 100rpx; /* 自定义大小 */
}
```

---

## 注意事项

1. **组件依赖**
   - H5ErrorContainer 依赖 Font Awesome 6 Free 字体
   - 确保项目中已正确引入 Font Awesome

2. **网络工具依赖**
   - 使用这些组件时，建议配合 `utils/network.uts` 工具使用
   - 工具提供了完整的网络检查和错误分析功能

3. **事件处理**
   - 所有事件处理器都需要在父组件中实现
   - 建议提供友好的用户反馈

4. **错误信息**
   - errorMessage 支持换行符 `\n`
   - 建议保持错误信息简洁明了

---

## 最佳实践

1. **提前检查**：在加载 WebView 前先检查网络和服务状态
2. **用户控制**：避免自动重试，让用户决定何时重试
3. **友好提示**：提供清晰的错误信息和操作指引
4. **网络监听**：监听网络状态变化，提示用户网络恢复
5. **返回路径**：始终提供返回上一页的选项

