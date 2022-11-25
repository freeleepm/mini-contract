<template>
	<view class="page">
		<view class="search-box">
			<view class="search flex-sb">
				<input type="text" placeholder="请输入企业名称" v-model="name"/>
				<text class="iconfont icon-sousuo"></text>
			</view>
		</view>
		<view style="height: 142rpx;"></view>
		<view class="title bold">最近签署企业</view>
		<view class="list">
			<view v-for="(item,index) in 3" :key="index" class="flex-fs item">
				<text class="iconfont icon-gongsi"></text>
				<view class="flex-1">
					<view class="name bold">XXXX公司</view>
					<view>
						<text>企业</text>
						<text>张三</text>
						<text>经办</text>
						<text>13272651430</text>
					</view>
				</view>
				<text class="iconfont icon-unCheck"></text>
				<text class="iconfont icon-checked text-primary"></text>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
    onShareAppMessage() {
      return this.setting.share
    },
    onShareTimeline() {
      return this.setting.share
    }
	}
</script>

<style lang="scss" scoped>
.page{
	padding: $page-spacing-base;
	padding-top: 0;
	.search-box{
		padding: 20rpx 0;
		position: fixed;
		left: 0;
		right: 0;
		background-color: #FFFFFF;
		padding: $page-spacing-base;
		z-index: 2;
		border-bottom: 1px solid $uni-border-color;
		.search{
			background-color: #F8F8F8;
			padding: 0 24rpx;
			border-radius: 68rpx;
			input{
				height: 68rpx;
			}
		}
	}
	.title{
		font-size: $uni-font-size-lg;
		position: relative;
	}
	.title::before{
		width: 8rpx;
		position: absolute;
		border-radius: 0 4rpx 4rpx 0;
		content: '';
		height: 32rpx;
		top: calc(50% - 16rpx);
		left: -$page-spacing-base;
		background-color: $uni-color-primary;
	}
	.list{
		.item{
			border-bottom: 1px solid $uni-border-color;
			padding: 20rpx 0;
			text{
				color: $uni-text-color-grey;
				margin-right: 20rpx;
			}
			.icon-gongsi{
				font-size: 60rpx;
				color: $uni-text-color-grey;
				margin-right: 10rpx;
			}	
			.icon-unCheck,.icon-checked{
				font-size: 36rpx;
			}
		}
	}
}
</style>
