<template>
	<view class="page-base">
		<view class="card width-full">
			<view class="row">
				<view class="title">
					成员：{{name}}
				</view>
				<view class="role-list">
					<view class="role-item" v-for="(item, i) in sealList" :key="i">
						<view class="iconBox">
							<image :src="item.sealImageDownloadUrl" alt="" srcset="">
						</view>
						<view class="flex-1">
							<view class="text-28 color-base" color="#999999">
								{{ item.sealName }}
							</view>
							<view class="text-24 color-grey-minor">
								<uni-tag v-if="!item.applyFlag" text="未授权" type="default" size="mini"></uni-tag>
								<uni-tag :text="sarText[item.state]" :type="sarColor[item.state]" size="mini"></uni-tag>
							</view>
						</view>
						<view class="butBox">
              <button v-if="item.state === 1" @click="jumpAuthSeal(item)" size="mini" style="background: #007aff;" type="primary" >继续授权</button>
							<button v-if="!item.applyFlag || item.state == 3" @click="showPop(item)" style="background: #007aff;" size="mini" type="primary">授权</button>
							<template v-else-if="item.state == 2">
								<button @click="showPop(item)" style="background: #007aff; margin-right: 10rpx;" size="mini" type="primary">续期</button>
								<button @click="unSealAuth(item)" size="mini" type="warn">解除</button>
							</template>
						</view>
					</view>
				</view>
				<loadMore v-if="loading"></loadMore>
			</view>
		</view>
		<uni-popup ref="popupRef" type="center" class="color-base" :safe-area="false">
			<view class="popBody">
				<view class="popContent">
					<view class="label">
						到期时间:
					</view>
					<picker v-if="!item.applyFlag || item.state == 3" :start="start" :end="end" mode="date" @change="timeChange">
						<view class="value1" v-if="endDate">
							{{endDate}}
						</view>
						<view class="value" v-else>
							请选择到期时间
						</view>
					</picker>
				</view>
				<view class="pop-btn">
					<view @click="clickmask">
						取消
					</view>
					<view @click="empower">
						确定
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import reg from '@/utils/reg.js';
	import {
		getSealList,
		unSealAuth,
		sealAuth
	} from '@/api/company.js';
  import {
		getSealAuthUrl
	} from '@/api/seal.js';

	let today = new Date()
	let year = today.getFullYear();
	let month = today.getMonth() + 1;
	let day = today.getDate();
	export default {
		data() {
			return {
				sarColor: {
					1: 'warning',
					2: 'success',
					3: 'error',
					4: 'royal'
				},
				sarText: {
					1: '审核中',
					2: '生效中',
					3: '已失效',
					4: '解除中'
				},
				id: '',
				name: '',
				sealList: [],
				checkItem: {},
				endDate: '',
				start: year + '-' + month + '-' + day,
				end:  year + 3 + '-' + month + '-' + day,
				fastClick: true,
				loading: true
			};
		},
		computed: {},
		onLoad(e) {
			if (e.id) {
				this.id = e.id;
				this.name = e.name || '';
				this.loading = true
				this.getSealList();
			}
		},
		methods: {
			getSealList() {
				getSealList(this.id).then(res => {
					console.log(res)
					this.sealList = res || []
					console.log(this.sealList)
					this.loading = false
				});
			},
			timeChange(e) {
				this.endDate = e.detail.value
			},
			showPop(item) {
				this.endDate = ''
				this.$refs.popupRef.open()
				this.checkItem = item
			},
			clickmask() {
				this.$refs.popupRef.close()
			},
			empower() {
				if (this.fastClick) {
					if (!this.endDate) {
						uni.showToast({
							title: '请选择到期时间！',
							icon: 'none',
						});
					} else {
						this.fastClick = false
						sealAuth({
							id: this.id,
							sealId: this.checkItem.sealId,
							sealBizType: this.checkItem.sealBizTypeDescription,
							endDate: this.endDate,
						}).then((res) => {
							uni.showToast({
								title: '提交成功！',
								icon: 'none',
							});
							this.getSealList()
							this.clickmask()
							this.fastClick = true

							console.log(res)
							uni.reLaunch({
							    url: '/pages/user/company/authorize?path=' + encodeURIComponent(res),
							});
						}).catch(() => {
							this.fastClick = true
						});
					}
				}
			},
			unSealAuth(item) {
				let that = this
				uni.showModal({
					title: '提示',
					content: '确定对' + (this.name || '该成员') +'解除' + item.sealName +'授权？',
					confirmColor: '#dd524d',
					confirmText: '确定',
					cancelText: '取消',
					cancelColor: '#999999',
					success: function(res) {
						if (res.confirm) {
							unSealAuth({
								id: that.id,
								sealId: item.sealId,
							}).then(() => {
								uni.showToast({
									title: '提交成功！',
									icon: 'none',
								});
								that.getSealList()
							});
						}
					},
				});
			},
      jumpAuthSeal(seal){
        // 审核中
          getSealAuthUrl({sealId:seal.sealId, id:this.id}).then(res=> {
            if(res) {
              uni.reLaunch({
						    url: '/pages/user/company/authorize?path=' + encodeURIComponent(res),
						});
           }
         })
      },
		},
	};
</script>

<style lang="scss" scoped>
	.page-base {
		padding: 32rpx;
		padding-bottom: calc(32rpx + env(safe-area-inset-bottom)) !important;

		.card {
			background: #ffffff;
			border-radius: 12rpx;

			.row {
				padding: 32rpx 0;
				border-bottom: 1px solid $uni-border-color;

				&:last-child {
					border: none;
				}
				.title{
					padding: 0 32rpx;
					font-size: 28rpx;
				}

				.role-list {
					padding-top: 16rpx;
					display: flex;
					flex-flow:row wrap;
					.role-item {
						width: 50%;
						padding: 28rpx 0;
						text-align: center;
						.iconBox{
							width: 280rpx;
							height: 280rpx;
							margin: 0 auto;
							image{
								width: 100%;
								height: 100%;
							}
						}
						.text-28 {
							padding: 16rpx 0;
						}
						.butBox{
							margin-top: 10rpx;
						}
					}
				}
			}
		}
	}
	.popBody{
		width: 600rpx;
		background: #ffffff;
		border-radius: 10rpx;
		.popContent{
			display: flex;
			font-size: 28rpx;
			padding: 60rpx 32rpx;
			justify-content: center;
			.label{
				color: #333;
				margin-right: 20rpx;
			}
			.value{
				color: #999;
			}
			.value1{
				color: #333;
			}
		}
	}
	// 按钮
	.pop-btn{
		display: flex;
		border-top: 1rpx solid #eee;
		view{
			width: 100%;
			font-size: 28rpx;
			line-height: 86rpx;
			color: #666;
			text-align: center;
			letter-spacing: 0.05em;
			overflow: hidden;
			&:hover{
				background: #3277ff;
				color: white !important;
			}
		}
	}
	.pop-btn view:nth-child(2){
		color: #3277ff;
		border-left: 1rpx solid #eee;
	}
</style>
