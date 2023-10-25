<template>
	<view :class="'pop pop--center ' + ( show ? 'pop--show' : '' )">
		<view :class="'pop__mask'" @tap="handleMaskClick" catchtouchmove='true'></view>
		<view class="pop__container">
			<view class="title">
				个人信息保护提示
			</view>
			<view class="content">
				我们会按照相关法律法规的规定及<text class="link" @tap="openPrivacyContract">《一合通小程序隐私保护指引》</text>，遵守正当、合法、必要原则收集和使用你的个人信息。<br>
				为了向你提供正常的服务，我们可能会申请相机、麦克风、存储照片等权限。相应权限并不会默认开启或强制收集信息。权限开启后，你可以随时通过设置选项关闭权限。你不同意开启权限，将不会影响其他非相关业务功能的正常使用。
			</view>
			<view class="butBox">
				<navigator open-type="exit" target="miniProgram">
					<button
					  id="disagree-btn"
					  type="default"
					>不同意</button>
				</navigator>
				<button
					class="butRed"
					id="agree-btn"
					type="default"
					@agreeprivacyauthorization="agree"
					open-type="agreePrivacyAuthorization"
					>同意</button>
			</view>
		</view>
	</view>
</template>

<script>
	const app = getApp().globalData;
	let that
	export default {
		data() {
			return {
				show: false
			};
		},

		components: {},
		props: {
			// 遮罩层是否会显示
			showOverlay: {
				type: Boolean,
				default: true
			}
		},
		mounted() {
			that = this
		},
		methods: {
			agree(e) {
				console.log(e)
				if (e.detail.errMsg == "agreePrivacyAuthorization:ok") {
					that.show = false
					that.$emit('agree')
				}
			},
			disagree(e) {
				console.log(e)
				that.show = false
			},
			openPrivacyContract() {
				wx.openPrivacyContract({})
			},
			showModal() {
				this.show = true
			},
			handleMaskClick: function() {
				// this.show = false
				this.$emit('clickmask', {});
			}
		}
	};
</script>
<style lang="scss" scoped>
	.pop {
		visibility: hidden
	}
	.title{
		color: #000;
		font-size: 30rpx;
		line-height: 40rpx;
		text-align: center;
	}
	.content{
		color: #666;
		font-size: 26rpx;
		line-height: 36rpx;
		margin-top: 30rpx;
		.link{
			color: #E82E2E;
		}
	}
	.butBox{
		display: flex;
		justify-content: space-between;
		margin-top: 40rpx;
		button{
			width: 240rpx;
			text-align: center;
			font-size: 32rpx;
			border-radius: 46rpx;
			color: #666;
			margin: 0;
		}
		button.butRed{
			color: white;
			background: #E82E2E;
		}
	}

	.pop--show {
		visibility: visible
	}

	.pop__mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 999;
		background: rgba(0, 0, 0, .5);
		display: none
	}

	.pop__mask--hide {
		background: 0 0
	}

	.pop__container {
		position: fixed;
		left: 50%;
		top: 50%;
		-webkit-transform: translate3d(-50%, -50%, 0);
		transform: translate3d(-50%, -50%, 0);
		-webkit-transform-origin: center;
		transform-origin: center;
		-webkit-transition: all .2s ease;
		transition: all .2s ease;
		z-index: 1000;
		opacity: 0;
		background: white;
		border-radius: 20rpx;
		padding: 30rpx;
		width: 600rpx;
	}

	.pop__container_input {
		top: 36%;
	}

	.pop--show .pop__container {
		opacity: 1
	}

	.pop--show .pop__mask {
		display: block
	}
</style>