<!--
 * @Description:
 * @LastEditTime: 2022-09-16 16:46:36
 * @LastEditors: 刘仁秀
 * @Author: 刘仁秀
 * @Date: 2022-09-02 15:21:16
-->
<template>
  <view class="page-base">
    <view class="container-card" style="padding-bottom: 0">
      <view class="title flex-ct text-30 bold color-base">
        <view class="decorate flex-sb">
          <view class="decorate-small"></view>
          <view class="decorate-big"></view>
        </view>
        <view class="color-primary">一合通</view>
        服务
        <view class="decorate flex-sb">
          <view class="decorate-big"></view>
          <view class="decorate-small"></view>
        </view>
      </view>
      <view class="row-type flex-sb">
        <view
          class="card-type flex-fs color-base"
          :class="{ 'card-type-active': form.type == 0 }"
          @click="tab(0)"
        >
          <view>
            <view class="text-30 bold">个人套餐</view>
            <view class="text-24 color-base-minor">有效期1年</view>
          </view>
          <image class="img-back-person" src="@/static/ImgBackPerson.png"></image>
          <uni-icons
            class="icon-checkbox flex-ct"
            type="checkbox-filled"
            size="18"
            color="#3277FF"
          ></uni-icons>
        </view>
        <!-- :class="companyName ? 'flex-sb' : 'flex-ct'"
          v-if="companyName" -->
        <view
         
          class="card-type flex-fs color-base"
          :class="{ 
            'card-type-active': form.type == 1,
            'card-type-disabled': !companyName
            }"
          @click="tab(1)"
        >
          <view>
            <view class="text-30 bold">企业套餐</view>
            <view class="text-24 color-base-minor">有效期1年</view>
          </view>
          <image class="img-back-enterprise" src="@/static/ImgBackEnterprise2.png"></image>
          <uni-icons
            class="icon-checkbox flex-ct"
            type="checkbox-filled"
            size="18"
            color="#3277FF"
          ></uni-icons>
        </view>
      </view>
      <view v-if="form.type == 1" class="flex-fs row">
        <view class="key text-26 color-base-minor">购买企业</view>
        <view class="text-26 color-base">{{ companyName || '请添加企业' }}</view>
      </view>
      <view class="flex-fs row">
        <view class="key text-26 color-base-minor">购买份数</view>
        <!-- <uni-number-box
          v-if="form.type == 0"
          :min="1"
          :value="form.share"
          @change="change"
        ></uni-number-box> -->
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
      <view class="flex-fs row">
        <view class="key text-26 color-base-minor">支付金额</view>
        <view class="text-30 color-error bold">￥{{ form.total | money }}</view>
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
      </view>
    </view>

    <view class="btn-box flex-sb">
      <navigator open-type="navigateBack" hover-class="none" class="btn-vice text-32">
        取消
      </navigator>
      <view class="btn-primary text-32" :class="{ disabled: !form.share }" @click="submit">
        立即购买
      </view>
    </view>
  </view>
</template>

<script>
var that, fastClick;
import { pay } from '@/api/seal.js';
import { appletsLogin } from '@/api/login.js';

export default {
  data() {
    let prices = [500, 300]; // 个人、企业价格（单位分）

    return {
      form: {
        type: 0, // 套餐类型 0个人套餐,1企业套餐
        total: prices[0],
        share: 1, // 购买份数
        openId: '',
      },
      price: prices,
    };
  },
  computed: {
    nickname() {
      return uni.getStorageSync('userInfo').nickname || '';
    },
    companyName() {
      return uni.getStorageSync('userInfo').companyName;
    },
  },
  onLoad() {
    that = this;
    fastClick = true;
    let openId = uni.getStorageSync('userInfo') && uni.getStorageSync('userInfo').openId;
    if (openId) this.form.openId = openId;
    else {
      uni.login({
        provider: 'weixin',
        success: function (loginRes) {
          appletsLogin({
            code: loginRes.code,
          }).then(res => {
            that.form.openId = res.openId;
          });
        },
      });
    }
  },
  methods: {
    tab(type) {
      if (type == 0) this.form.share = 1;
      if (type == 1){
        if(!this.companyName){
          uni.showModal({
            content: '企业认证后才可购买套餐！',
            confirmText: '去认证',
            confirmColor: '#3277FF',
            success: function (res) {
              if (res.confirm) {
                uni.navigateTo({
                  url: '/pages/company/Certification',
                });
              }
            },
          });
          return
        }
        this.form.share = 10;
      }
      this.form.type = type;
      this.cal();
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

      this.cal();
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
    cal() {
      this.form.total = this.price[this.form.type] * this.form.share;
    },
    submit() {
      if (!fastClick) return;
      fastClick = false;
      pay(this.form)
        .then(res => {
          console.log(res);
          // #ifdef MP
          uni.getProvider({
            service: 'oauth',
            success: function (resp) {
              if (resp.provider) {
                wx.requestPayment({
                  provider: resp.provider[0],
                  // orderInfo: res.data,
                  appId: res.result.appId,
                  timeStamp: res.result.timeStamp,
                  nonceStr: res.result.nonceStr,
                  package: res.result.packageValue,
                  signType: res.result.signType,
                  paySign: res.result.paySign,
                  success: function (resj) {
                    uni.redirectTo({
                      url: '/pages/user/comboDetails',
                    });
                  },
                  fail: function (err) {
                    // uni.showToast({
                    // 	title: err.errMsg,
                    // 	icon: 'none'
                    // })
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
  onShareAppMessage() {
    return this.setting.share;
  },
  onShareTimeline() {
    return this.setting.share;
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
  margin-top: 8rpx;
  margin-bottom: 40rpx;
}

.row-type {
  margin: 0 auto;
  margin-bottom: 8rpx;
  width: 550rpx;

  .card-type {
    box-sizing: border-box;
    position: relative;
    padding-left: 28rpx;
    width: 260rpx;
    height: 170rpx;
    background: #f5f5f5;
    border-radius: 12rpx;

    &::after {
      content: '';
    }
  }

  .text-30 {
    margin-bottom: 8rpx;
  }

  .card-type-active {
    box-shadow: 0 0 0 1px $uni-color-primary;
    background: #e6eeff;
    color: $uni-color-primary;

    .icon-checkbox {
      display: flex;
    }
  }
  .card-type-disabled{
    opacity: 0.75;
  }
  .icon-checkbox {
    position: absolute;
    right: 20rpx;
    top: 20rpx;
    display: none;
    width: 24rpx;
    height: 24rpx;
  }

  .img-back-person {
    position: absolute;
    right: 20rpx;
    bottom: 20rpx;
    width: 69rpx;
    height: 78rpx;
  }

  .img-back-enterprise {
    position: absolute;
    right: 16rpx;
    bottom: 20rpx;
    width: 82rpx;
    height: 77rpx;
  }
}

.row {
  height: 100rpx;
  border-bottom: 1px solid #e6e6e6;

  .number-box {
    box-sizing: border-box;
    overflow: hidden;
    height: 60rpx;
    border: 1px solid $uni-color-primary;
    border-radius: 12rpx;
    background-color: $uni-color-primary;

    .number-box-input {
      height: 100%;
      width: 100rpx;
      border-color: $uni-color-primary;
      border-style: solid;
      border-left-width: 1px;
      border-right-width: 1px;
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
      background-color: #fff;
    }

    .number-box__add::before {
      position: absolute;
      content: '';
      width: 1px;
      height: 15rpx;
      background-color: #fff;
    }

    .number-box__subtract::after {
      content: '';
      width: 15rpx;
      height: 1px;
      background-color: #333;
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

.btn-box {
  width: 686rpx;
  margin-top: 60rpx;
}

.btn-primary,
.btn-vice {
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
    background: linear-gradient(180deg, #ffffff 0%, #3277ff 100%);
    border-radius: 26rpx;
    transform: rotate(38deg);
  }

  &-small {
    width: 10rpx;
    height: 19rpx;
    background: linear-gradient(180deg, #3277ff 0%, #ffffff 100%);
    border-radius: 19rpx;
    transform: rotate(38deg);
  }
}
</style>
