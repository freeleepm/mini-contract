<!--
 * @Description:
 * @LastEditTime: 2022-09-15 15:56:22
 * @LastEditors: 刘仁秀
 * @Author: 刘仁秀
 * @Date: 2022-09-02 15:21:16
-->
<template>
  <view class="page-base">
    <view style="height: 76rpx;">
      <view class="v-tabs-box flex-ct">
        <v-tabs style='width: 80%;'
          :tabs="tabs"
          height="76rpx"
          paddingItem="0 50rpx"
          :value="current"
          @change="change"
          :scroll="false"
          field="label"
        ></v-tabs>
      </view>
    </view>
    <view class="count-box flex-ct" v-if="showMealCount">
      <view class="count-list flex-sa">
        <view class="count-item">
          <view class="count"><text>{{ showMealCount.shareCount || 0 }}</text>份</view>
          <view>总量</view>
          <!-- <view>{{ current==0?'个人套餐总量':'企业套餐总量' }}</view> -->
        </view>
        <view class="line"></view>
        <view class="count-item">
          <view class="count"><text>{{ showMealCount.surplusShareCount || 0 }}</text>份</view>
          <view>剩余量</view>
        </view>
      </view>
    </view>
    
    <view class="list" v-if="list.length">
      <view class="item" v-for="(item, i) in list" :key="i">
        <view class="title flex-sb">
          <view class="text-elps name flex-1 text-28 bold">
            {{ item.name || '' }}
          </view>
          <view class="tag-status text-26 flex-ct color-primary" style="background: #ccddff">
            {{ item.source == 0 ? '系统赠送' : '个人购买' }}
          </view>
        </view>
        <view class="date-box">
          <view class="text-26 flex">
            <view class="key">支付时间</view>
            <view class="val">{{ item.createTime || '' }}</view>
          </view>
          <view class="text-26 flex">
            <view class="key">到期时间</view>
            <view class="val">{{ item.expireTime || '' }}</view>
          </view>
          <view class="text-26 flex text-elps">
            <view class="key">{{ item.source == 0 ? '赠送份数' : '购买份数' }}</view>
            <view class="val">{{ item.share || 0 }}（份）</view>
          </view>
          <view class="bar-money flex-fs text-26">
            <view class="color-base">已支付：</view>
            <view class="text-30 color-error bold">
              ￥{{ (item.money / 100).toFixed(2) || '0.00' }}
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="nodata" v-if="!list.length">
      <BaseEmpty massage="暂无数据~"></BaseEmpty>
    </view>

    <!-- <view class="list">
      <view class="item" v-for="(item, i) in list" :key="i">
        <view class="flex-sb title-box">
          <view class="title bold">
            {{ item.name }}
            <text v-if="item.source == 0">(系统赠送)</text>
          </view>
          <text class="text-primary">{{ item.share || 0 }}份文件</text>
        </view>

        <view class="flex-sb">
          <view class="date-box">
            <view class="date">支付时间：{{ item.createTime }}</view>
            <view class="date">到期时间：{{ item.expireTime }}</view>
          </view>
          <text>
            已支付：
            <text class="price">{{ item.money | money }}</text>
          </text>
        </view>
      </view>
      <loadMore v-if="loading"></loadMore>
      <baseline v-if="list.length > 10"></baseline>
      <empty v-if="noData" msg="啊哦 ~ ,这里空空如也"></empty>
    </view> -->

    <view class="padding-safe" style="height: 188rpx;"></view>
    <view class="bar-bottom flex-ct padding-safe">
      <view class="btn-primary text-32" @click="toCreate">购买套餐</view>
    </view>
  </view>
</template>

<script>
var that;
import { list, count } from '@/api/meal.js';
import { info } from '@/api/login.js';
export default {
  data() {
    return {
      tabs:[
        // { label: '全部', state: '' },
        { label: '个人套餐', state: 0 },
        { label: '企业套餐', state: 1 }
      ],
      current: 0,
      loading: true,
      list: [],
      authentication: false,
      MealCount: ''
    };
  },
  onLoad(options) {
    that = this;
    if(options.type || options.type == 0){
      this.current = this.tabs.findIndex(i => i.state == options.type);
    }
    that.init();
  },
  onShareAppMessage() {
    return this.setting.share;
  },
  onShareTimeline() {
    return this.setting.share;
  },
  computed: {
    noData() {
      return !this.loading && !this.list.length;
    },
    showBaseline() {
      return !this.noMore && !this.loading && this.list.length > 5;
    },
    showMealCount(){
      return this.MealCount?this.MealCount.find(i=> i.type === this.current):''
    }
  },
  methods: {
    getUinfo() {
      info().then(data => {
        that.authentication = data.authentication;
      });
    },
    getMealCount(){
      count({
        state: 1
      }).then(res=>{
        this.MealCount = res
      })
    },
    async init() {
      await that.getMealCount();
      await that.getUinfo();
      await that.getList();
    },
    getList() {
      list({
        type: this.tabs[this.current].state, // 个人0,企业1  this.current == 0 ? '' : this.current - 1
      })
        .then(data => {
          this.loading = false;
          this.list = data || [];
          uni.stopPullDownRefresh();
        })
        .catch(() => {
          this.loading = false;
          uni.stopPullDownRefresh();
        });
    },
    toCreate() {
      if (!that.authentication) {
        uni.showModal({
          content: '认证后才可购买套餐！',
          confirmText: '去认证',
          confirmColor: '#3277FF',
          success: function (res) {
            if (res.confirm) {
              uni.navigateTo({
                url: '/pages/user/Certification',
              });
            }
          },
        });
      } else {
        that.common.navigateTo('/pages/combo/buy');
      }
    },
    change(e) {
      this.current = e;
      this.list = [];
      this.loading = true;
      this.getList();
    },
  },
  onPullDownRefresh() {
    this.list = [];
    this.loading = true;
    this.getList();
  },
};
</script>

<style lang="scss" scoped>
.v-tabs-box {
  z-index: 33;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: white;
  border-bottom: 1px solid #F5F5F5;
}

.nodata {
  margin-top: 300rpx;
  width: 100%;
}
.count-box{
   background: linear-gradient(to bottom, #ffffff, #f5f5f5);
       width: 100%;
       text-align: center;
       font-size: 28rpx;
       padding: 32rpx;
       box-sizing: border-box;
       color: #666;
       .count-list{
         border-radius: 12rpx;
         background-color: #ffffff;
         height: 100%;
         width: 100%;
         height: 134rpx;
         .count-item{
           flex: 1;
           .count{
             font-size: 24rpx;
             text{
               font-size: 36rpx;
               font-weight: bold;
               color: #333333;
               padding-right: 4rpx;
             }
           }
         }
         .line{
           background-color: #f5f5f5;
           width: 1px;
           height: 52rpx;
         }
       }
}

.list {
  margin-top: 20rpx;
  width: 686rpx;
  .item {
    overflow: hidden;
    background-color: #ffffff;
    position: relative;
    margin-bottom: 40rpx;
    border-radius: 12rpx;
    .title {
      padding: 0 28rpx;
      height: 86rpx;
      position: relative;
      background-color: #f7f9ff;
      border-bottom: 1px solid #e6e6e6;
      overflow: hidden;
    }

    .tag-status {
      padding: 0 20rpx;
      height: 40rpx;
      border-radius: 22rpx;
      align-self: center;
    }

    .date-box {
      padding: 0 24rpx;
      padding-bottom: 24rpx;
      background-color: white;
      border-radius: 0 0 30rpx 30rpx;

      .text-26 {
        margin-top: 24rpx;
      }

      .key {
        flex-shrink: 0;
        width: 152rpx;
        color: #999999;
      }

      .val {
        color: #333333;
      }

      .bar-money {
        padding-top: 24rpx;
        border-top: 1px solid $uni-border-color;
      }
    }
  }
}

.bar-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 750rpx;
  height: 188rpx;
  background: #ffffff;
  box-shadow: 0rpx -1px 20rpx 1px rgba(0, 0, 0, 0.1);

  .btn-primary {
    width: 598rpx;
    height: 88rpx;
    border-radius: 8rpx;
  }
}
</style>
