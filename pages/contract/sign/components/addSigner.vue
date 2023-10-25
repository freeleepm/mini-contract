<template>
  <uni-popup ref="popupRef" type="bottom" class="color-base" :safe-area="false">
    <view class="add-signer padding-safe">
      <view class="title bold text-32">添加签署方</view>
      <view class="form-box" :style="{ 'padding-bottom': KeyboardHeight + 'px' }">
        <view class="form-item flex-sb">
          <!-- v-if="!currentUserInfo.companyCheck" -->
          <text class="text-28 color-base text-required">签署方类型</text>
          <view class="flex-ct switch-box">
            <view class="switch" :class="{ active: signer.type === 0 }" @click="signer.type = 0">
              个人
            </view>
            <view class="switch" :class="{ active: signer.type === 1 }" @click="signer.type = 1">
              企业
            </view>
            <view class="bar" :style="{ left: signer.type === 1 ? '50%' : '0' }"></view>
          </view>
        </view>
        <template v-if="signer.type === 0">
          <view class="form-item flex-sb">
            <text class="text-28 color-base text-required">姓名</text>
            <input
              v-if="currentUserInfo.personCheck"
              :adjust-position="false"
              :disabled="true"
              type="text"
              @blur="KeyboardHeight = 0"
              @click="jumpSearchPerson"
              v-model="signer.person.name"
              placeholder-class="place"
              placeholder="请选择"
            />
            <input
             v-else
              type="text"
              @blur="KeyboardHeight = 0"
              @input="onInput($event, 1)"
              v-model="signer.person.name"
              placeholder-class="place"
              placeholder="请输入"
            />
          </view>
          <view class="form-item flex-sb">
            <text class="text-28 color-base text-required">手机号</text>
            <input
              :adjust-position="false"
              type="number"
              :maxlength="11"
              @blur="KeyboardHeight = 0"
              v-model="signer.person.mobile"
              placeholder-class="place"
              placeholder="请输入"
            />
          </view>
        </template>
        <template v-if="signer.type === 1">
          <view class="form-item flex-sb">
            <text class="text-28 color-base text-required">企业名称</text>
            <input
              v-if="currentUserInfo.companyCheck"
              :adjust-position="false"
              :disabled="true"
              type="text"
              @blur="KeyboardHeight = 0"
              @click="jumpSearchCompany"
              v-model="signer.company.name"
              :maxlength="50"
              placeholder-class="place"
              placeholder="请选择"
            />
            <input
              v-else
              :adjust-position="false"
              type="text"
              @blur="KeyboardHeight = 0"
              v-model="signer.company.name"
              :maxlength="50"
              placeholder-class="place"
              placeholder="请输入"
            />
          </view>

          <view class="form-item flex-sb">
            <text class="text-28 color-base text-required">经办人姓名</text>
            <input
              :adjust-position="false"
              type="text"
              @blur="KeyboardHeight = 0"
              @input="onInput($event, 2)"
              v-model="signer.company.agentName"
              placeholder-class="place"
              placeholder="请输入"
            />
          </view>
          <view class="form-item flex-sb">
            <text class="text-28 color-base text-required">经办人手机</text>
            <input
              :adjust-position="false"
              type="number"
              @blur="KeyboardHeight = 0"
              :maxlength="11"
              v-model="signer.company.agentMobile"
              placeholder-class="place"
              placeholder="请输入"
            />
          </view>


        </template>
        <view class="form-item flex-sb quick-add">
            <text class="text-28 color-base">快捷添加</text>
        </view>
        <template v-if="signerRecordList && signerRecordList.length">
          <view class="form-item flex-sb record-list">
            <view class="record-item" v-for="(signer,sIndex) in signerRecordList" :key="sIndex">
               <view class="info-box" @click="addSigner(signer)">
                <view class="name">{{ signer.name }}</view>
                <view class="mobile">{{ signer.mobile }}</view>
               </view>
               <view class="close" @click="delRecord(signer)">
                <uni-icons type="trash" size="20" color="#B3B3B3"></uni-icons>
              </view>
            </view>
          </view>
        </template>
        <template v-else>
          <view class="form-item flex-sb record-list">
            <view class="record-item">
               暂无记录
            </view>
          </view>
        </template>
        <view class="btn-primary" @click="onSubmit">确定</view>
      </view>
    </view>

  </uni-popup>
</template>

<script>
import reg from '@/utils/reg.js';
import userInfo from '@/api/api.js';
export default {
  props:["signerRecordList", "currentUserInfo", 'companyName', 'name', 'mobile'],
  data() {
    return {
      signer: '',
      KeyboardHeight: 0,
      currentList:[]
    };
  },
  created() {
    // companyCheck
    // if(this.currentUserInfo.companyCheck) {
    //   this.signer = {
    //     type: 0, // 类型(0:个人;1:公司;)
    //     person: {
    //       name: '', // 用户名
    //       mobile: '', // 手机号
    //     },
    //     company: {
    //       name: '', // 公司名
    //       agentName: '', // 经办人姓名
    //       agentMobile: '', // 经办人手机
    //     },
    //   };
    // }
    // uni.onKeyboardHeightChange(res => {
    //   this.KeyboardHeight = res.height;
    // });
  },
  beforeDestroy() {
    // uni.offKeyboardHeightChange();
  },
  methods: {
    open(type) {
      this.signer = {
        type: this.signer.type || type || 0, // 类型(0:个人;1:公司;)
        person: {
          name: '', // 用户名
          mobile: '', // 手机号
        },
        company: {
          name: '', // 公司名
          agentName: '', // 经办人姓名
          agentMobile: '', // 经办人手机
        },
      };
      this.$refs.popupRef.open();
    },
    onInput(e, t) {
      setTimeout(() => {
        if (t === 1) {
          this.signer.person.name = this.signer.person.name.slice(0, 5);
        } else if (t === 2) {
          this.signer.company.agentName = this.signer.company.agentName.slice(0, 5);
        }
      }, 50);
    },
    onSubmit() {
      if (this.signer.type === 0) {
        if (!this.signer.person.name) {
          uni.showToast({
            title: '请输入签署方姓名',
            icon: 'none',
          });
          return;
        }
        if (!this.signer.person.mobile) {
          uni.showToast({
            title: '请输入签署方手机号',
            icon: 'none',
          });
          return;
        }
        if (!reg.phone.test(this.signer.person.mobile)) {
          uni.showToast({
            title: '签署方手机号有误',
            icon: 'none',
          });
          return;
        }
      }
      if (this.signer.type === 1) {
        if (!this.signer.company.agentName) {
          uni.showToast({
            title: '请输入经办人姓名',
            icon: 'none',
          });
          return;
        }
        if (!this.signer.company.agentMobile) {
          uni.showToast({
            title: '请输入经办人手机',
            icon: 'none',
          });
          return;
        }
        if (!reg.phone.test(this.signer.company.agentMobile)) {
          uni.showToast({
            title: '经办人手机号有误',
            icon: 'none',
          });
          return;
        }
        if (!this.signer.company.name) {
          uni.showToast({
            title: '请输入公司名',
            icon: 'none',
          });
          return;
        }
      }
      this.$emit('change', JSON.parse(JSON.stringify(this.signer)));
      this.$refs.popupRef.close();
    },
    addSigner(item) {
      if(Number(item.userType) === 0) {
        this.signer.person.name = item.name;
        this.signer.person.mobile = item.mobile;
      } else {
        this.signer.company.name = item.name;
        this.signer.company.agentMobile = item.mobile;
        this.signer.company.agentName = item.agentName;
      }
    },
    delRecord(item) {
      let that = this;
      uni.showModal({
        title: '删除提醒',
        content: '删除后记录不可恢复，是否继续？',
        confirmText: '删除',
        cancelText: '取消',
        confirmColor: '#e63c3c',
        cancelColor: '#999999',
        success: function (res) {
          if (res.confirm) {
            userInfo.delSignerRecord(item).then(r=> {
                uni.showToast({
                  title: '删除成功',
                  icon: 'none',
                });
                that.getSignerRecordList()
            })
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        },
      });
    },
    getSignerRecordList () {
      userInfo.signerRecordList({userType:this.signer.type}).then(res => {
         this.$emit('currentList', res)
      });
    },
    jumpSearchCompany () {
      uni.navigateTo({
        url:  "/pages/user/company/searchCompany"
      })
    },
    jumpSearchPerson () {
      uni.navigateTo({
        url:  "/pages/user/personal/searchPerson"
      })
    },
  },
  watch:{
    'signer.type': {
      handler(newVal, oldVal) {
        this.signer = {
          type: newVal || 0, // 类型(0:个人;1:公司;)
          person: {
            name: '', // 用户名
            mobile: '', // 手机号
          },
          company: {
            name: '', // 公司名
            agentName: '', // 经办人姓名
            agentMobile: '', // 经办人手机
          },
        };
        this.$emit('currentType', newVal)
        this.getSignerRecordList()
      }
    },
    companyName (val) {
      if(val) {
        this.signer.company.name = val
      }
    },
    name (val) {
      if(val) {
        this.signer.person.name = val
      }
    },
    mobile (val) {
      if(val) {
        this.signer.person.mobile = val
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.add-signer {
  background-color: #ffffff;
  .title {
    text-align: center;
    padding-top: 34rpx;
  }
  .form-box {
    padding-bottom: 32rpx;
    .form-item {
      padding: 32rpx;
      border-bottom: 1px solid $uni-border-color;
      input {
        flex: 1;
        text-align: right;
        font-size: 28rpx;
        padding-left: 30rpx;
      }
      .switch-box {
        height: 66rpx;
        border-radius: 34rpx;
        background: #f6f6f6;
        position: relative;
        .bar {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 50%;
          border-radius: 34rpx;
          background: $uni-color-primary;
          transition: all 0.15s;
        }
        .switch {
          font-size: 28rpx;
          width: 100rpx;
          text-align: center;
          position: relative;
          z-index: 1;
          &.active {
            color: white;
          }
        }
      }
    }
    .btn-primary {
      margin: 32rpx 32rpx 0;
      line-height: 88rpx;
    }
  }
  .quick-add {
    border: none !important;
    padding: 32rpx 32rpx 0 32rpx !important;
  }
  .record-list{
    height: 500rpx;
    align-items: unset;
    flex-direction: column;
    justify-content: flex-start;
    overflow: scroll;
    .record-item{
      font-size: 28rpx;
      width: 100%;
      padding: 20rpx 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      &:first-of-type{
        padding-top: 0;
      }
      .info-box{
        display:flex;
        .name{
          font-weight: bold;
        }
        .mobile {
          margin-left: 20rpx;
        }
      }
    }
  }
}
</style>
