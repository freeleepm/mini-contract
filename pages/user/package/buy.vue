<template>
  <view class="page-base">
    <view class="title flex-fs text-30 bold color-base width-full">
      <view class="decorate flex-sb">
        <view class="decorate-small"></view>
        <view class="decorate-big"></view>
      </view>
      <view class="color-primary">{{ setting.appName }}</view>
      服务
      <view class="decorate flex-sb">
        <view class="decorate-big"></view>
        <view class="decorate-small"></view>
      </view>
    </view>

    <view class="container-card" style="padding-bottom: 0">
      <view class="row-type">
        <view
          v-for="(item, i) in mealList"
          :key="i"
          class="card-type flex-fs color-base"
          @click="tab(item)"
        >
          <image v-if="item.type === 1" src="/static/IconCon2.png" class="icon"></image>
          <image v-else src="/static/IconCon.png" class="icon"></image>
          <view class="name bold">{{ item.name }}</view>
          <view class="date" :class="{ company: item.type === 1 }">有效期1年</view>
        </view>
      </view>
      <view v-if="form.type == 1" class="flex-fs row">
        <view class="key text-26 color-base-minor">购买企业</view>
        <navigator
          url="/pages/user/company/Certification"
          hover-class="none"
          class="text-26 color-base"
        >
          {{ userInfo.companyName || '请添加企业' }}
        </navigator>
      </view>
      <view class="flex-fs row">
        <view class="key text-26 color-base-minor">购买份数</view>
        <view class="number-box flex-fs">
          <view class="number-box__subtract flex-ct color-base" @click="change(subtract)"></view>
          <input
            :value="form.share"
            @input="change(modify, $event)"
            class="number-box-input text-28 color-base bold"
            type="number"
            maxlength="4"
          />
          <view class="number-box__add flex-ct color-white" @click="change(add)"></view>
        </view>
      </view>
    </view>

    <view class="container-card text-26 color-base-minor">
      <view class="text-28 color-base bold">购买须知</view>
      <view class="box-infomation">
        1.套餐购买完成后立即生效，且不可退款。
        <br />
        <br />
        2.购买完成的套餐仅限本人使用，不支持转让、赠送或其他交易。
        <br />
        <br />
        3.套餐应在有效期内使用，到期自动失效，不退不补，请尽早使用。
        <br />
        <br />
        4.发起者是个人购买个体套餐，发起者是企业购买企业套餐。
        <br />
        <br />
        5.发起签署合同即会消耗套餐份数。
      </view>
    </view>

    <btn-fixed>
      <view class="flex-sb">
        <view class="flex-fs pay-money">
          <view class="text-24" style="margin-right: 12rpx; color: #666666">支付金额</view>
          <view class="text-30 bold" style="color: #ff0000">
            <text class="text-24">￥</text>
            {{ (form.price * form.share) | money }}
          </view>
        </view>
        <view class="btn-primary text-32" :class="{ disabled: !form.share }" @click="submit">
          立即购买
        </view>
      </view>
    </btn-fixed>
  </view>
</template>

<script>
var that, fastClick;
import { pay, meallist } from '@/api/seal.js';
import { appletsLogin } from '@/api/login.js';
import { mapState } from 'vuex';
import setting from '@/static/config/setting.js';
export default {
  data() {
    return {
      setting,
      form: {
        id: '', // 套餐id
        type: 0, // 套餐类型 0个人套餐,1企业套餐
        price: 0, // 单价
        share: 1, // 购买份数
      },
      mealList: [],
    };
  },
  computed: {
    ...mapState(['userInfo']),
  },
  onLoad(e) {
    that = this;
    fastClick = true;
    meallist().then(response => {
      let res = response || [];
      const type = parseInt(e.type) || 0;
      res = res.filter(i => i.type === type);
      this.mealList = res;
      if (res.length) {
        this.form.id = res[0].id;
        this.form.price = res[0].price;
        this.form.type = res[0].type;
        this.form.share = type === 0 ? 1 : 10;
      }
    });
  },
  methods: {
    tab(item) {
      // if (item.type == 0) this.form.share = 1;
      // if (item.type == 1) this.form.share = 10;
      // this.form.id = item.id;
      // this.form.type = item.type;
      // this.form.price = item.price;
    },
    change(arithmetic, e) {
      switch (this.form.type) {
        case 0: {
          this.form.share = arithmetic(this.form.share, 1, e);
          break;
        }
        case 1: {
          this.form.share = arithmetic(this.form.share, 10, e);
          break;
        }
      }
    },
    modify(origin, _, e) {
      return Number(e.detail.value || 0);
    },
    add(origin, number) {
      if (origin + number > 9999) {
        return origin;
      }
      return (origin += number);
    },
    subtract(origin, number) {
      if (origin - number < 0) {
        return origin;
      }
      return (origin -= number);
    },
    submit() {
      if (this.form.type == 1 && !this.userInfo.companyId) {
        uni.showModal({
          content: '企业认证后才可购买企业套餐！',
          confirmText: '去认证',
          confirmColor: '#3277FF',
          success: function (res) {
            if (res.confirm) {
              uni.navigateTo({
                url: '/pages/user/company/Certification',
              });
            }
          },
        });
        return;
      }
      if (!fastClick) return;
      fastClick = false;
      // #ifndef MP
      uni.showToast({
        title: '终端不支持支付',
        icon: 'none',
      });
      return;
      // #endif
      pay({
        id: this.form.id,
        share: this.form.share,
      })
        .then(res => {
          console.log(res);
          // #ifdef MP
          uni.getProvider({
            service: 'oauth',
            success: function (resp) {
              if (resp.provider) {
                wx.requestPayment({
                  provider: resp.provider[0],
                  appId: res.result.appId,
                  timeStamp: res.result.timeStamp,
                  nonceStr: res.result.nonceStr,
                  package: res.result.packageValue,
                  signType: res.result.signType,
                  paySign: res.result.paySign,
                  success: function (resj) {
                    // uni.redirectTo({
                    //   url: '/pages/user/package/comboDetails',
                    // });
                    uni.navigateBack();
                  },
                  fail: function (err) {
                    fastClick = true;
                    console.log('fail:' + JSON.stringify(err));
                  },
                });
              } else {
                fastClick = true;
              }
            },
            fail() {
              fastClick = true;
            },
          });
          // #endif
        })
        .catch(() => {
          fastClick = true;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.container-card {
  margin-top: 32rpx;
  box-sizing: border-box;
  padding: 32rpx;
  width: 686rpx;
  background: #ffffff;
  border-radius: 12rpx;
}

.box-infomation {
  margin-top: 20rpx;

  br {
    margin: 20rpx 0;
  }
}

.title {
  margin: 32rpx 32rpx 0 32rpx;
}

.row-type {
  margin-top: -32rpx;
  .card-type {
    box-sizing: border-box;
    position: relative;
    width: 100%;
    height: 120rpx;
    border-bottom: 1px solid #f2f2f2;
    .icon {
      width: 48rpx;
      height: 48rpx;
      margin-right: 16rpx;
    }
    .name {
      font-size: 40rpx;
      margin-right: 16rpx;
    }
    .date {
      color: $uni-color-primary;
      background: #ebf1ff;
      line-height: 48rpx;
      padding: 0 12rpx;
      font-size: 28rpx;
      &.company {
        color: #7a4100;
        background: #fff8eb;
      }
    }
  }
}

.row {
  height: 120rpx;
  border-bottom: 1px solid #f2f2f2;
  .number-box {
    box-sizing: border-box;
    overflow: hidden;
    height: 60rpx;
    border: 1px solid $uni-color-primary;
    border-radius: 12rpx;
    .number-box-input {
      height: 100%;
      width: 100rpx;
      border-left: 1px solid $uni-color-primary;
      border-right: 1px solid $uni-color-primary;
      text-align: center;
    }
    .number-box__subtract,
    .number-box__add {
      position: relative;
      width: 60rpx;
      height: 100%;
    }
    .number-box__add::after {
      content: '';
      width: 15rpx;
      height: 1px;
      background-color: $uni-color-primary;
    }
    .number-box__add::before {
      position: absolute;
      content: '';
      width: 1px;
      height: 15rpx;
      background-color: $uni-color-primary;
    }
    .number-box__subtract::after {
      content: '';
      width: 15rpx;
      height: 1px;
      background-color: $uni-color-primary;
    }
    .number-box-input,
    .number-box__subtract {
      background: #fff;
    }
  }

  .key {
    margin-right: 24rpx;
  }

  &:last-child {
    border-bottom: none;
  }
}

.btn-primary {
  width: 324rpx;
  height: 88rpx;
  border-radius: 8rpx;
}
.decorate {
  margin: 0 24rpx;
  width: 38rpx;

  &-big {
    width: 14rpx;
    height: 26rpx;
    background: linear-gradient(180deg, #ffffff 0%, $uni-color-primary 100%);
    border-radius: 26rpx;
    transform: rotate(38deg);
  }

  &-small {
    width: 10rpx;
    height: 19rpx;
    background: linear-gradient(180deg, $uni-color-primary 0%, #ffffff 100%);
    border-radius: 19rpx;
    transform: rotate(38deg);
  }
}
</style>
