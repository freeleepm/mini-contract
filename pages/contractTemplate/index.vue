<template>
  <view class="page flex-fs">
    <loading ref='loading'/>
    <view class="tab-list flex-col" v-if="list.length">
      <view class="tab-item" v-for="(item,i) in list" :key="i" :class="{
        active: i === current,
        prev: i === current - 1,
        next: i === current + 1
      }" @click="tabChange(item,i)">
        {{ item.flowTemplateName }}
      </view>
      <view class="tab-item flex-1" :class="{next: list.length === current + 1}"></view>
    </view>
    <view class="flex-1" style="height: 100%;" v-if="list.length">
      <view class="list" v-if="list[current].docTemplates && list[current].docTemplates.length">
        <view class="item" v-for="(item,i) in list[current].docTemplates" :key="i" @click="download(item)">
          {{ item.docTemplateName | fileName }}
        </view>
      </view>
      <BaseEmpty v-if="!loading && !list[current].docTemplates.length" style='margin-top: 200rpx;' massage='没有找到相关范本'/>
      <baseline v-if="list[current].docTemplates.length.length > 9"/>
    </view>
    <view class="flex-1" v-if="!loading && !list.length">
      <BaseEmpty massage='没有找到相关范本'/>
    </view>
  </view>
</template>

<script>
  import {
    templateDetail,
    templateList
  } from '@/api/file.js';
  export default {
    data() {
      return {
        list: [],
        current: 0
      };
    },
    filters:{
      fileName(txt){
        return txt.slice(0,txt.lastIndexOf('.'))
      }
    },
    onLoad() {
      this.getList()
    },
    methods:{
      tabChange(item,i){
        this.current = i
      },
      getList(){
        templateList().then( res=> {
          this.list = res || []
        }).finally(()=>{
          uni.stopPullDownRefresh();
          this.$refs.loading.hide()
        })
      },
      download(item){
        if(!uni.getStorageSync('userInfo').token){
          uni.showModal({
            title: '温馨提示',
            content: '请先登录/注册，方可进行下一步操作',
            confirmText: '去登录',
            cancelText: '取消',
            confirmColor: '#3277FF',
            cancelColor: '#999999',
            success: res => {
              if (res.confirm) {
                this.common.navigateTo('/pages/login/login?logout=1');
              }
            },
          });
          return
        }
        templateDetail(item.docTemplateId).then(ress=>{
          uni.showLoading({ title: '正在下载' })
          uni.downloadFile({
          	url: ress.downloadUrl,
          	success: (res) => {
              var filePath = res.tempFilePath;
          		uni.openDocument({
          		      filePath: filePath,
          		      showMenu: true,
          		      success: function (res) {
          		        console.log('打开文档成功');
          		      }
          		    });
          	},
          	complete(msg) {
          		uni.hideLoading()
          	}
          })
        })
      },
    },
    onPullDownRefresh() {
      this.getList()
    }
  }
</script>

<style lang="scss" scoped>
.page{
  height: 100vh;
  .tab-list{
    height: 100%;
    width: 180rpx;
    .tab-item{
      box-sizing: border-box;
      width: 100%;
      padding: 28rpx 16rpx;
      text-align: center;
      font-size: 28rpx;
      color: #666;
      background-color: #F5F5F5;
      &.active{
        background-color: #fff;
        color: $uni-color-primary;
      }
      &.prev{
        border-bottom-right-radius: 12rpx;
      }
      &.next{
        border-top-right-radius: 12rpx;
      }
    }
  }
  .list{
    padding: 0 32rpx;
    box-sizing: border-box;
    .item{
      border-bottom: 1px solid #F5F5F5;
      color: #333;
      font-size: 28rpx;
      padding: 40rpx 0;
    }
  }
}
</style>
