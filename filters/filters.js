export function isCount(num) {
  if (num) {
    if (num < 1000) return num
    else if (num > 999) return (num / 1000).toFixed(1) + 'k'
    else if (num > 9999) return (num / 10000).toFixed(1) + 'w'
  } else {
    return 0
  }
}

export function size(size) {
  if (size) {
    if (size / 1024 / 1024 > 1) return (size / 1024 / 1024).toFixed(2) + 'M'
    return (size / 1024).toFixed(2) + 'Kb'
  } else {
    return '未知大小'
  }
}
export function money(num) {
  return num ? (num / 100).toFixed(2) : 0
}
export function stateHandle(state) {
  const states = [{
      state: -2,
      text: '待签署'
    },
    {
      state: 0,
      text: '待签署'
    },
    {
      state: 1,
      text: '已完成'
    },
    {
      state: 2,
      text: '已拒签'
    },
    {
      state: 3,
      text: '已撤销'
    },
    {
      state: 4,
      text: '已逾期'
    },
    {
      state: 5,
      text: '流产'
    },
  ]
  return states.find(i => i.state === state)?.text || ''
}
export function duration(duration) {
  duration = duration || 0
  if (duration < 10) duration = '00:0' + duration
  else if (duration == 60) duration = '01:00'
  else {
    duration = '00:' + duration
  }
  return duration
}

export function jsGetAge(strBirthday) {
  var returnAge;
  var strBirthdayArr = strBirthday.split("-");
  var birthYear = strBirthdayArr[0];
  var birthMonth = strBirthdayArr[1];
  var birthDay = strBirthdayArr[2];

  var d = new Date();
  var nowYear = d.getFullYear();
  var nowMonth = d.getMonth() + 1;
  var nowDay = d.getDate();

  if (nowYear == birthYear) {
    returnAge = 0; //同年 则为0岁
  } else {
    var ageDiff = nowYear - birthYear; //年之差
    if (ageDiff > 0) {
      if (nowMonth == birthMonth) {
        var dayDiff = nowDay - birthDay; //日之差
        if (dayDiff < 0) {
          returnAge = ageDiff - 1;
        } else {
          returnAge = ageDiff;
        }
      } else {
        var monthDiff = nowMonth - birthMonth; //月之差
        if (monthDiff < 0) {
          returnAge = ageDiff - 1;
        } else {
          returnAge = ageDiff;
        }
      }
    } else {
      returnAge = -1; //返回-1 表示出生日期输入错误 晚于今天
    }
  }
  return returnAge; //返回周岁年龄
}