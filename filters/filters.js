import config from '../common/config.js';
export function imgFilter(url) {
	if(url){
		if(url.indexOf('//')> -1) return url
		else return url ? config.imgUrl + url :'/static/fail-img.jpg'
	}
}
export function isCount(num) {
	if(num){
		if(num < 1000) return num
		else if(num > 999) return (num/1000).toFixed(1)+'k'
		else if(num > 9999) return (num/10000).toFixed(1)+'w'
	}else{
		return 0
	}
}
export function imageUrl(url) {
	if(url.indexOf('//')> -1) return url
	else return url ? config.imgUrl + url : config.imgUrl + '4/c37688cc-3157-428f-a35c-318bf40a17c2.jpg'
}
export function size(size) {
	if(size){
		if(size/1024/1024>1) return (size/1024/1024).toFixed(2)+'M'
		return (size/1024).toFixed(2)+'Kb'
	}else{
		return '未知大小'
	}
}
export function money(num) {
	return num?(num/100).toFixed(2):0
}
export function duration(duration) {
	duration = duration || 0
	if(duration < 10) duration = '00:0'+duration
	else if(duration == 60) duration = '01:00'
	else{
		duration = '00:'+duration
	}
	return duration
}
export function richText(html) {
	var capture = html
	if (html) {
		html = capture.replace(/src=\s*['"]([^'"]+)[^>]*>/gi, function(match, capture) {
			if (capture.indexOf('http') > -1) {
				capture = ' src="' + capture +
					'" style="max-width: 100%; height: auto; margin: 0 auto; display: block;"/>';
				return capture
			} else {
				capture = ' src="' + config.imgUrl + capture +
					'" style="max-width: 100%; height: auto; margin: 0 auto; display: block;"/>';
				return capture
			}
		})
		.replace(/<section/g, '<div').replace(/\/section>/g, '/div>')
		.replace(/<pre/g, '<div').replace(/\/pre>/g, '/div>')
		.replace(/<o:p>/g, '').replace(/<\/o:p>/g, '')
		.replace(/<font/g, '<span').replace(/\/font>/g, '/span>')
		.replace(/<table/g, '<table style="max-width:100%;"')
	}
	return html;
}
export function jsGetAge(strBirthday){
	var returnAge;
	var strBirthdayArr=strBirthday.split("-");
	var birthYear = strBirthdayArr[0];
	var birthMonth = strBirthdayArr[1];
	var birthDay = strBirthdayArr[2];
	
	var d = new Date();
	var nowYear = d.getFullYear();
	var nowMonth = d.getMonth() + 1;
	var nowDay = d.getDate();
	
	if(nowYear == birthYear){
	    returnAge = 0;//同年 则为0岁
	}
	else{
	    var ageDiff = nowYear - birthYear ; //年之差
	    if(ageDiff > 0){
	        if(nowMonth == birthMonth) {
	            var dayDiff = nowDay - birthDay;//日之差
	            if(dayDiff < 0)
	            {
	                returnAge = ageDiff - 1;
	            }
	            else
	            {
	                returnAge = ageDiff ;
	            }
	        }
	        else
	        {
	            var monthDiff = nowMonth - birthMonth;//月之差
	            if(monthDiff < 0)
	            {
	                returnAge = ageDiff - 1;
	            }
	            else
	            {
	                returnAge = ageDiff ;
	            }
	        }
	    }
	    else{
	        returnAge = -1;//返回-1 表示出生日期输入错误 晚于今天
	    }    
	}
	return returnAge;//返回周岁年龄
}