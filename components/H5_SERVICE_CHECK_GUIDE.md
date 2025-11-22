# H5 服务可用性检测组件使用指南

## 核心目的

**检测 H5 服务器本身是否可用**，而不仅仅是用户的网络连接。

### 为什么需要这个检测？

在 H5 页面加载前，可能遇到以下情况：
1. ✅ 用户网络连接正常
2. ❌ 但是 H5 服务器挂了、维护中、或者不可访问
3. 结果：WebView 会显示默认错误页（思考泡泡），用户体验很差

### 解决方案

**主动检测 H5 服务可用性** → 如果服务不可用，立即显示友好的错误提示，而不是加载 WebView 后才显示默认错误。

---

## 完整使用示例

### 场景：H5 预览页面

假设我们有一个 H5 预览页面，需要先检测 H5 服务是否可用。

```vue
<template>
	<view class="h5-preview-container">
		<!-- 加载状态 -->
		<H5LoadingContainer 
			v-if="loading && !errorMessage"
			loadingText="正在检测预览服务..."
		/>

		<!-- 错误提示 -->
		<H5ErrorContainer
			v-if="errorMessage && !loading"
			title="无法加载预览"
			:errorMessage="errorMessage"
			:tips="errorTips"
			@back="goBack"
			@retry="retryLoad"
			@contact-support="contactSupport"
		/>

		<!-- H5 WebView -->
		<web-view
			v-if="h5Url && !errorMessage && !loading"
			:src="h5Url"
			@load="handleLoad"
			@error="handleError"
			class="h5-webview"
		/>
	</view>
</template>

<script>
import { getPreviewUrl } from '../../api/preview';
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
			cancelNetworkListener: null,
			errorTips: [
				'• 请确保网络连接正常',
				'• H5 预览服务可能暂时不可用',
				'• 服务器可能正在维护中',
				'• 如问题持续，请联系技术支持'
			]
		}
	},
	
	onLoad(options) {
		console.log('[H5预览] 页面加载');
		
		// 监听网络状态变化
		this.setupNetworkListener();
		
		// 开始检测流程
		this.checkAndLoadH5();
	},
	
	onUnload() {
		if (this.cancelNetworkListener) {
			this.cancelNetworkListener();
		}
	},
	
	methods: {
		/**
		 * 设置网络状态监听
		 */
		setupNetworkListener() {
			this.cancelNetworkListener = setupNetworkListener((isConnected) => {
				console.log('[H5预览] 网络状态变化:', isConnected);
				
				if (isConnected && this.errorType === ErrorType.NETWORK) {
					uni.showModal({
						title: '网络已恢复',
						content: '检测到网络已恢复，是否重新加载？',
						confirmText: '重新加载',
						cancelText: '稍后',
						success: (res) => {
							if (res.confirm) {
								this.retryLoad();
							}
						}
					});
				}
			});
		},
		
		/**
		 * 检测并加载 H5
		 * 这是核心流程：先检测网络和服务可用性，再加载 WebView
		 */
		async checkAndLoadH5() {
			// 步骤 1: 检查用户网络状态
			const networkResult = await checkNetworkStatus();
			if (!networkResult.success) {
				this.loading = false;
				this.errorType = networkResult.errorType;
				this.errorMessage = networkResult.errorMessage;
				return;
			}
			
			// 步骤 2: 构建 H5 URL（从后端获取）
			const urlBuilt = await this.buildH5Url();
			if (!urlBuilt) {
				return;
			}
			
			// 步骤 3: 测试 H5 服务器是否可用（核心检测）
			await this.testH5ServiceAvailability();
		},
		
		/**
		 * 构建 H5 URL
		 */
		async buildH5Url() {
			try {
				uni.showLoading({ title: '正在连接服务...' });
				
				// 从后端获取 H5 URL
				this.h5Url = await getPreviewUrl();
				console.log('[H5预览] URL:', this.h5Url);
				
				return true;
			} catch (error) {
				console.error('[H5预览] 构建URL失败:', error);
				
				this.loading = false;
				uni.hideLoading();
				
				// 判断是网络问题还是后端服务问题
				if (error.message && (error.message.includes('network') || error.message.includes('timeout'))) {
					this.errorType = ErrorType.NETWORK;
					this.errorMessage = '无法连接到后端服务\n请检查网络连接后重试';
				} else {
					this.errorType = ErrorType.SERVER;
					this.errorMessage = '后端服务暂时不可用\n请稍后再试';
				}
				
				return false;
			}
		},
		
		/**
		 * 测试 H5 服务可用性
		 * 这是关键步骤：在加载 WebView 前，先测试 H5 服务器是否响应
		 */
		async testH5ServiceAvailability() {
			console.log('[H5预览] 开始检测 H5 服务可用性:', this.h5Url);
			
			const result = await testH5ServiceAvailability(this.h5Url, 8000); // 8秒超时
			
			if (!result.available) {
				// H5 服务器不可用
				this.loading = false;
				uni.hideLoading();
				this.errorType = result.errorType;
				this.errorMessage = result.errorMessage || 'H5预览服务暂时无法访问\n服务器可能正在维护或升级中';
				
				console.error('[H5预览] H5 服务不可用');
			} else {
				console.log('[H5预览] H5 服务可用，准备加载 WebView');
				// H5 服务器可用，WebView 会自动加载
			}
		},
		
		/**
		 * WebView 加载成功
		 */
		handleLoad() {
			console.log('[H5预览] WebView 加载成功');
			this.loading = false;
			uni.hideLoading();
		},
		
		/**
		 * WebView 加载失败
		 * 即使前面检测通过了，WebView 还是可能加载失败（网络波动、超时等）
		 */
		handleError(e) {
			console.error('[H5预览] WebView 加载失败:', e);
			
			this.loading = false;
			uni.hideLoading();
			
			// 分析错误类型
			this.errorType = analyzeWebViewError(e);
			this.errorMessage = getErrorMessage(this.errorType);
		},
		
		/**
		 * 重试加载
		 */
		retryLoad() {
			console.log('[H5预览] 用户重试');
			this.resetState();
			this.checkAndLoadH5();
		},
		
		/**
		 * 重置状态
		 */
		resetState() {
			this.errorMessage = '';
			this.errorType = '';
			this.loading = true;
			this.h5Url = '';
		},
		
		/**
		 * 返回上一页
		 */
		goBack() {
			uni.navigateBack();
		},
		
		/**
		 * 联系客服
		 */
		contactSupport() {
			uni.showModal({
				title: '联系客服',
				content: '客服电话：400-xxx-xxxx\n或发送邮件至：support@example.com',
				showCancel: false
			});
		}
	}
}
</script>

<style>
.h5-preview-container {
	flex: 1;
	width: 100%;
	height: 100%;
	background-color: #F7F9FC;
}

.h5-webview {
	width: 100%;
	height: 100%;
}
</style>
```

---

## 核心流程解析

### 1. 为什么要分步检测？

```javascript
async checkAndLoadH5() {
  // 第 1 步：检查用户网络（快速，本地检测）
  const networkOk = await checkNetworkStatus();
  if (!networkOk.success) {
    // 用户没网络，立即提示
    this.showError(networkOk.errorMessage);
    return;
  }
  
  // 第 2 步：获取 H5 URL（需要后端服务）
  const urlBuilt = await this.buildH5Url();
  if (!urlBuilt) {
    // 后端服务有问题，立即提示
    return;
  }
  
  // 第 3 步：测试 H5 服务器（关键！）
  await this.testH5ServiceAvailability();
  // 如果服务器不可用，会显示错误
  // 如果服务器可用，WebView 会自动加载
}
```

### 2. `testH5ServiceAvailability()` 做了什么？

```javascript
// 工具函数的实现逻辑
export function testH5ServiceAvailability(url: string, timeout: number = 5000) {
  return new Promise((resolve) => {
    try {
      const urlObj = new URL(url);
      const baseUrl = `${urlObj.protocol}//${urlObj.host}`;
      
      // 发送 HEAD 请求测试服务器是否响应
      uni.request({
        url: baseUrl,
        method: 'HEAD',  // 只要响应头，不下载内容
        timeout: timeout,
        success: () => {
          // 服务器响应了，说明可用
          resolve({ available: true });
        },
        fail: (err) => {
          // 服务器没响应，说明不可用
          console.error('H5服务器不可用:', err);
          resolve({
            available: false,
            errorType: 'server',
            errorMessage: 'H5服务暂时无法访问\n服务器可能正在维护中'
          });
        }
      });
    } catch (error) {
      // URL 解析失败，继续尝试加载
      resolve({ available: true });
    }
  });
}
```

### 3. 检测的价值

**场景对比：**

❌ **不检测（直接加载 WebView）：**
```
用户点击 → 显示"加载中" → WebView 尝试加载 
→ H5 服务器挂了 → 10秒后超时 
→ 显示默认错误页（思考泡泡）
→ 用户体验：等了很久，看到莫名其妙的错误
```

✅ **先检测再加载：**
```
用户点击 → 显示"正在检测服务" → 发送 HEAD 请求测试服务器 
→ 服务器无响应（2-3秒内返回） 
→ 立即显示友好错误提示："H5服务暂时不可用，服务器可能正在维护"
→ 用户体验：快速反馈，清楚知道问题所在
```

---

## 使用场景

### 适合使用检测的情况：

1. ✅ **H5 预览页面** - 需要确保预览服务可用
2. ✅ **H5 创建页面** - 需要确保创建服务可用
3. ✅ **H5 编辑页面** - 需要确保编辑服务可用
4. ✅ 任何**第一次进入**的 H5 页面

### 可以跳过检测的情况：

1. ⚠️ **H5 签署页面**（如 `h5-sign.uvue`）
   - 原因：前面的合同列表页已经检测过了
   - 如果能进入签署页面，说明服务是可用的

2. ⚠️ **连续的 H5 页面流程**
   - 例如：H5 创建 → H5 编辑 → H5 预览
   - 只需要在第一个页面检测，后续页面可以直接加载

---

## 错误处理最佳实践

### 1. 提供清晰的错误信息

```javascript
const errorTips = [
  '• 请确保网络连接正常',
  '• H5 服务可能暂时不可用',
  '• 服务器可能正在维护或升级中',
  '• 如问题持续，请联系技术支持'
];
```

### 2. 区分错误类型

```javascript
if (errorType === ErrorType.NETWORK) {
  // 用户网络问题
  errorMessage = '网络连接失败\n请检查网络设置';
} else if (errorType === ErrorType.SERVER) {
  // H5 服务器问题
  errorMessage = 'H5服务暂时不可用\n服务器可能正在维护';
} else if (errorType === ErrorType.TIMEOUT) {
  // 超时问题
  errorMessage = '连接超时\n请稍后重试';
}
```

### 3. 监听网络恢复

```javascript
setupNetworkListener((isConnected) => {
  if (isConnected && this.errorType === ErrorType.NETWORK) {
    // 网络恢复了，询问用户是否重新加载
    uni.showModal({
      title: '网络已恢复',
      content: '是否重新加载？',
      success: (res) => {
        if (res.confirm) {
          this.retryLoad();
        }
      }
    });
  }
});
```

---

## 性能考虑

### HEAD 请求的优势

- ✅ **快速**：只获取响应头，不下载内容
- ✅ **轻量**：流量消耗极小
- ✅ **有效**：能准确判断服务器是否响应

### 超时设置

```javascript
// 根据不同场景设置不同超时
await testH5ServiceAvailability(url, 5000);  // 一般场景：5秒
await testH5ServiceAvailability(url, 8000);  // 重要场景：8秒
await testH5ServiceAvailability(url, 3000);  // 快速检测：3秒
```

---

## 总结

1. **核心价值**：检测 H5 服务器本身是否可用，而不只是用户网络
2. **使用时机**：第一次进入 H5 页面时使用，连续页面可跳过
3. **用户体验**：快速反馈，友好提示，避免长时间等待和莫名错误
4. **技术实现**：使用 HEAD 请求测试服务器响应，轻量高效

