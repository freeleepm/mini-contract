import config from './config.js';

function navigateTo(url) {
	uni.navigateTo({
		url: url
	})
}

function showToast(txt){
	uni.showToast({
		title: txt,
		icon: 'none'
	})
}

export default {
	navigateTo,
	showToast
}
