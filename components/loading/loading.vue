<template>
	<view class="loading flex-ct" v-if="showLoading">
		<image src="/static/loading.gif" mode="widthFix"></image>
	</view>
</template>

<script>
	export default {
		name:"loading",
		data() {
			return {
				showLoading: true
			};
		},
		methods:{
			show(){
				this.showLoading = true
			},
			hide(){
				this.showLoading = false
			},
		}
	}
</script>

<style lang="scss" scoped>
.loading{
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #FFFFFF;
	z-index: 333;
	image{
		width: 500rpx;
		height: 500rpx;
	}
}
</style>
