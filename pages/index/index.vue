<!--
 * @Author: wudi
 * @Date: 2023-09-13 09:52:14
 * @LastEditors: wudi
 * @LastEditTime: 2023-10-19 11:33:29
 * @Description:
-->
<template>
  <view class="content">
    <!-- 欢迎页 -->
	<wxPrivacy ref="wxPrivacy" @agree="unit(param)"></wxPrivacy>
  </view>
</template>

<script>
import wxPrivacy from '@/components/wxPrivacy/index.vue'
import {
	wxToPromise,
	requirePrivacyAuthorize
} from '@/wxToPromise'
export default {
	components: {
		wxPrivacy
	},
  data() {
    return {
		param: {}
	};
  },
  onLoad(e) {
	this.param = e
	let that = this;
  if(wx.getPrivacySetting) {
    wx.getPrivacySetting({
	  	success: async (res) => {
	  		console.log(res)
	  		if (res.needAuthorization) {
	  			const requireVal = await requirePrivacyAuthorize()
	  			console.log('requireVal')
	  			console.log(requireVal)
	  			if (!requireVal) {
	  				that.$refs.wxPrivacy.showModal()
	  			} else {
            that.unit(that.param)
          }
	  		} else {
				that.unit(that.param)
			}
	  	}
	})
  } else {
    that.unit(that.param)
  }
  },
  methods: {
	  unit(e) {
		  console.log(e);
		  console.log('this.userInfo :', this.userInfo)
		  if(e.id) {
		      uni.redirectTo({
		         url: '/pages/login/login?id='+e.id + '&loginType=first',
		      });
		      return;
		  }
		  this.$store
		    .dispatch('login')
		    .then(res => {
		      if (e.id) {
		        // 有合同 && 当前用户是签署方
		        uni.redirectTo({
		          url: '/pages/contract/detail/index?id=' + e.id,
		        });
		      } else {
		        uni.reLaunch({
		          url: '/pages/home/index',
		        });
		      }
		    })
		    .finally(() => {
		      if (!e.id) {
		        uni.reLaunch({
		          url: '/pages/home/index',
		        });
		      }
		    });
	  }
  }
};
</script>
