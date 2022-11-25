<template>
	<view class="baseline">
		----------- {{ txt?txt:'我也是有底线的' }} -----------
	</view>
</template>

<script>
	export default {
		props:['txt'],
		name:"baseline",
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss" scoped>
.baseline{
	text-align: center;
	color: #aaaaaa;
	font-size: $uni-font-size-sm;
	opacity: 0.5;
	padding: 50rpx;
}
</style>
