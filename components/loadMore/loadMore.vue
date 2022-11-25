<template>
	<view class="loding flex-ct">
		<view class="preloader_1">
			<text></text>
			<text></text>
			<text></text>
			<text></text>
			<text></text>
		</view>
	</view>
</template>

<script>
	export default {
		name:"loadMore",
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss" scoped>
	.loding{
		height: 180rpx;
		.preloader_1{
		    position:relative;
			width: 110rpx;
		}
		.preloader_1 text{
		    display:block;
		    bottom: 0;
		    width: 16rpx;
		    height: 10rpx;
		    position:absolute;
		    animation: preloader_1 1.5s  infinite ease-in-out;
		}  
		.preloader_1 text:nth-child(2){
		    left: 22rpx;
		    animation-delay: .2s;  
		}
		.preloader_1 text:nth-child(3){
		    left: 44rpx;
		    animation-delay: .4s;
		}
		.preloader_1 text:nth-child(4){
		    left: 66rpx;
		    animation-delay: .6s;
		}
		.preloader_1 text:nth-child(5){
		    left: 88rpx;
		    animation-delay: .8s;
		}
		@keyframes preloader_1 {
		    0% {height: 10rpx;transform:translateY(0px);background: $uni-color-primary;}
		    25% {height: 60rpx;transform:translateY(15px);background: $uni-color-primary;}
		    50% {height: 10rpx;transform:translateY(0px);background: $uni-color-primary;opacity: 0.5;}
		    100% {height: 10rpx;transform:translateY(0px);background: $uni-color-primary;opacity: 0.4;}
		}
	}
</style>
