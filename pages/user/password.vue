<template>
	<view class="page">
		<image src="../../static/logo.png" mode="widthFix" class="logo"></image>
		<view class="form-box">
			<view class="form-item flex-fs">
				<text class="iconfont icon-shouji"></text>
				<input type="number" v-model="form.phone" placeholder="请输入手机号" placeholder-class="place" class="flex-1"/>
			</view>
			<view class="form-item flex-fs">
				<text class="iconfont icon-mima"></text>
				<input v-if="!passwordVisible" type="password" v-model="form.password" placeholder="8-16位数字和字母组合(区分大小写)" placeholder-class="place" class="flex-1"/>
				<input v-if="passwordVisible" type="text" v-model="form.password" placeholder="8-16位数字和字母组合(区分大小写)" placeholder-class="place" class="flex-1"/>
				<text @click="passwordVisible = !passwordVisible" class="iconfont" :class="passwordVisible?'icon-visible':'icon-unvisible'"></text>
			</view>
			<view class="form-item flex-fs">
				<text class="iconfont icon-mima"></text>
				<input v-if="!rePasswordVisible" type="password" v-model="form.rePassword" placeholder="请再次输入新密码" placeholder-class="place" class="flex-1"/>
				<input v-if="rePasswordVisible" type="text" v-model="form.rePassword" placeholder="请再次输入新密码" placeholder-class="place" class="flex-1"/>
				<text @click="rePasswordVisible = !rePasswordVisible" class="iconfont" :class="rePasswordVisible?'icon-visible':'icon-unvisible'"></text>
			</view>
			<view class="flex-sb">
				<view class="form-item flex-fs flex-1">
					<input type="text" v-model="form.verificationCode" placeholder="请输入验证码" placeholder-class="place" class="flex-1"/>
				</view>
				<button type="primary" :disabled='disabled' @click="getCode">{{ btnText }}</button>
			</view>
			<view class="btn" @click="submit">立即修改</view>
		</view>
	</view>
</template>

<script>
	var that, timer=null, fastClick=true;
	import reg from '@/common/reg.js'
	import { reset, getCode } from '@/api/login.js'
	export default {
		data() {
			return {
				passwordVisible: false,
				rePasswordVisible: false,
				form:{
					password:'',
					rePassword:'',
					phone:'',
					verificationCode:''
				},
				disabled: false,
				btnText:'获取验证码',
				type: 1,
				jumpSeconds: 5
			};
		},
		onLoad() {
			that = this;
		},
    onShareAppMessage() {
      return this.setting.share
    },
    onShareTimeline() {
      return this.setting.share
    },
		methods:{
			getCode(){
				if(!that.form.phone.trim()){
					that.common.showToast('手机号获取失败')
					return
				}
				that.disabled = true
				getCode({
					phone: that.form.phone,
					type: 2
				}).then(res=>{
					let countdown = 60
					that.btnText = '重新获取('+countdown+'s)'
					timer = setInterval(()=>{
						if(countdown > 0){
							countdown --
							countdown = countdown < 10?'0'+countdown:countdown
							that.btnText = '重新获取('+countdown+'s)'
						}else{
							clearInterval(timer)
							that.disabled = false
							that.btnText = '获取验证码'
						}
					},1000)
				}).catch((err) =>{
					that.disabled = false
				})
			},
			submit(){
				
				if(!that.form.phone.trim()){
					that.common.showToast('手机号不能为空')
					return
				}
				if(!reg.phone.test(that.form.phone)){
					that.common.showToast('手机号格式有误')
					return
				}
				
				if(!that.form.password.trim()){
					that.common.showToast('请输入密码')
					return
				}
				if(!that.form.rePassword.trim()){
					that.common.showToast('请确认密码')
					return
				}
				if(that.form.password.length < 8 || that.form.rePassword.length < 8){
					that.common.showToast('密码至少8位')
					return
				}
				if(!reg.password.test(that.form.password) || !reg.password.test(that.form.rePassword)){
					that.common.showToast('8-16位数字、字母或下划线组合')
					return
				}
				if(that.form.password !== that.form.rePassword){
					that.common.showToast('密码输入不一致')
					return
				}
				
				if(!that.form.verificationCode.trim()){
					that.common.showToast('请输入验证码')
					return
				}
				if(!fastClick) return
				fastClick = false
				reset(that.form).then(data=>{
					uni.removeStorageSync('userInfo');
					uni.reLaunch({
						url: '../login/login'
					})
				}).catch((err) =>{
					fastClick = true
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.page{
	padding: $page-spacing-base 50rpx;
	.logo{
		width: 180rpx;
		height: 180rpx;
		margin: 0 auto 60rpx;
		display: block;
	}
	.form-box{
		.place{
			font-size: $uni-font-size-base;
		}
		.form-item{
			border: 1px solid $uni-border-color;
			height: 84rpx;
			padding: 0 20rpx;
			margin: 30rpx 0;
			border-radius: $uni-border-radius-base;
			.iconfont{
				color: $uni-text-color-grey;
				font-size: 36rpx;
			}
			input{
				padding: 0 14rpx;
			}
		}
		button{
			height: 84rpx;
			width: 242rpx;
			margin-left: 30rpx;
			line-height: 84rpx;
			font-size: $uni-font-size-base;
			background-color: $uni-color-primary;
			white-space: nowrap;
		}
		/deep/ {
			uni-button[type=primary],uni-button[disabled][type=primary]{
				background-color: $uni-color-primary
			}
		}
		.btn{
			line-height: 84rpx;
			text-align: center;
			background-color: $uni-color-primary;
			border-radius: $uni-border-radius-base;
			color: white;
			margin: 80rpx 0 20rpx;
		}
	}
	
}
</style>
