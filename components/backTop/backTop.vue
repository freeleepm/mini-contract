<template>
	<view class="back_top" @click="backTop" v-show="showTop">
		<text class="iconfont icon-top"></text>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				showTop: false
			}
		},
		methods:{
			backTop(){
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 100
				})
			},
			show(){
				this.showTop = true
			},
			hide(){
				this.showTop = false
			}
		}
	}
</script>
<style lang="scss" scoped>
	.back_top{
		width: 80rpx;
		height: 80rpx;
		background-color: rgba(0,0,0,0.33);
		border-radius: 40rpx;
		position: fixed;
		right: 30rpx;
		bottom: 280rpx;
		text-align: center;
		line-height: 80rpx;
		z-index: 33;
		.iconfont{
			font-size: 46rpx;
			display: inline-block;
			// transform: rotate(180deg);
			color: white;
		}
	}
</style>