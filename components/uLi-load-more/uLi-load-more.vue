<template>
	<view class="uni-load-more">
		<view class="uni-load-more__img" v-if="status === 'loading' && showIcon"><view class="loadingView" :style="{ color: color }">&#xeacd;</view></view>
		<text class="uni-load-more__text" :style="{ color: color }">
			{{ status === 'more' ? contentText.contentdown : status === 'loading' ? contentText.contentrefresh : contentText.contentnomore }}
		</text>
	</view>
</template>

<script>
export default {
	name: 'uLi-load-more',
	props: {
		status: {
			//上拉的状态：more-loading前；loading-loading中；noMore-没有更多了
			type: String,
			default: 'loading'
		},
		showIcon: {
			type: Boolean,
			default: true
		},
		color: {
			type: String,
			default: '#777777'
		},
		contentText: {
			type: Object,
			default() {
				return {
					contentdown: '上拉显示更多',
					contentrefresh: '正在加载...',
					contentnomore: '没有更多数据了'
				};
			}
		}
	},
	data() {
		return {};
	}
};
</script>

<style lang="scss" scoped>
@font-face {
	font-family: 'iconfont';
	src: url('https://at.alicdn.com/t/font_1288772_8nmx02hevxl.ttf') format('truetype');
}

.loadingView {
	font-family: iconfont;
	line-height: 1;
	font-size: 40upx;
	animation: rotate 3s linear infinite; //linear// 意思就是匀速的运动   infinite// 就是无限滚动的意思
}

@keyframes rotate {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}

.uni-load-more {
	display: flex;
	flex-direction: row;
	height: 80upx;
	align-items: center;
	justify-content: center;

	&__text {
		font-size: 28upx;
		color: $uni-text-color-grey;
	}

	&__img {
		height: 24px;
		width: 24px;
		margin-right: 10px;
		line-height: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}
}
</style>
