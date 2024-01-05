<template>
  <uni-popup ref="popupRef" type="bottom" class="color-base" :safe-area="false">
    <view class="identity">
      <!-- padding-safe -->
      <view class="flex-sb text-32">
        <view class="color-base-minor" @click="$refs.popupRef.close()">取消</view>
        <view class="color-base bold">切换身份</view>
        <view class="color-primary" @click="comfirmIdentity">确定</view>
      </view>

      <view class="list">
        <!-- 个人身份 -->
        <view class="item flex" @click="identityCheck(userInfo, -1)">
          <userInfo :info="{ ...userInfo, ...{ companyId: '' } }" />
          <uni-icons
            v-if="contractCheckedIndex === -1"
            class="icon-checkbox"
            type="checkbox-filled"
            size="24"
            color="#3277FF"
          ></uni-icons>
        </view>
        <!-- 企业 -->
        <view
          v-for="(item, index) in contract"
          :key="index"
          class="item flex"
          @click="identityCheck(item, index)"
        >
          <userInfo
            :info="{
              ...userInfo,
              ...{
                companyName: item.alias,
                companyId: item.companyId,
                companyMealCount: item.companyMealCount,
                authentication: item.authentication,
              },
            }"
          />
          <uni-icons
            v-if="contractCheckedIndex === index"
            class="icon-checkbox"
            type="checkbox-filled"
            size="24"
            color="#3277FF"
          ></uni-icons>
        </view>


      </view>
      <view @click="toCreate(`/pages/user/company/Certification?originType=${backType}`, 1)" class="text-26 color-primary add-company">
        <!-- :class="{
        disabled: !userInfo.authentication,
      }" -->
        +创建企业
      </view>
    </view>
  </uni-popup>
</template>

<script>
import { info } from '@/api/login.js';
import userInfoApi from '@/api/api.js';
import { mapState, mapActions } from 'vuex';
export default {
  props: {
    check: {
      type: Boolean,
      default: true,
    },
    backType:{
      type:String,
      default:''
    }
  },
  data() {
    return {
      contract: [],
      contractCheckedIndex: -1,
    };
  },
  computed: {
    ...mapState(['userInfo']),
  },
  methods: {
    ...mapActions(['uinfo']),
    open() {
      this.getContract();
      this.$refs.popupRef.open();
    },
    getContract() {
      userInfoApi
        .enterpriseList({
          pageNum: 1,
          pageSize: 999,
        })
        .then(data => {
          this.contract = data.rows;
          const contractCheckedIndex = this.contract.findIndex(item => {
            return item.companyId === this.userInfo.companyId;
          });
          this.contractCheckedIndex = contractCheckedIndex;
        });
    },
    comfirmIdentity() {
      console.log('this.contract[this.contractCheckedIndex] :', this.contract[this.contractCheckedIndex])
      const companyId =
        this.contractCheckedIndex === -1 ? '' : this.contract[this.contractCheckedIndex].companyId;
      userInfoApi
        .IdentitySwitching({companyId, identityType: companyId ? 1 : 0})
        .then(res => {
          this.uinfo();
          this.$refs.popupRef.close();
        })
        .catch(() => {
          uni.showToast({
            icon: 'none',
            title: '更改失败',
          });
        });
    },
    identityCheck(item, index) {
      if (this.contractCheckedIndex !== index) {
        if (item.authentication == 1 || (item.authentication === true && this.check)) {
          this.contractCheckedIndex = index;
        } else {
          uni.showToast({
            icon: 'none',
            title: '个人或企业实名认证未完成，请先实名认证',
          });
        }
      }
    },
    toCreate(url, checkAuthentication) {
      if (!this.userInfo.authentication && checkAuthentication) {
        this.common.showToast('请先个人认证');
      } else {
        this.$refs.popupRef.close();
        this.common.navigateTo(url);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.identity {
  box-sizing: border-box;
  padding: 44rpx 32rpx 100rpx 32rpx;
  min-height: 520rpx;
  background: #ffffff;
  border-radius: 12rpx 12rpx 0px 0px;
  position: relative;

  .list {
    overflow-y: scroll;
    max-height: 40vh;
    margin-top: 12rpx;
    position: relative;
  }

  .item {
    position: relative;
    padding: 32rpx 0;
    border-bottom: 1px solid #e6e6e6;

    &:last-child {
      border: 0;
    }

    .icon-checkbox {
      position: absolute;
      top: 54rpx;
      right: 0;
    }
  }
  .add-company {
    text-align: center;
    font-size: 32rpx;
    font-weight: bold;
    border-top: 1px dotted;
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 0);
    width: 100%;
    padding: 16rpx 0;
    z-index: 5;
    background: #fff;
    height: 100rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
