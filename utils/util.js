const formatTime = date => {
  // console.log(date)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  // const second = date.getSeconds()

  return {
    time: [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':'),
    date: [year, month, day].map(formatNumber).join('-')
  }
}
const formatStamp = stp => {
  if (stp != undefined && stp != null && stp != '') {
    return formatTime(new Date(parseFloat(stp)))
  }
}
const timeSlot = (start, end) => {
  let startT = '';
  let endT = '';
  if (start != undefined && start != null && start != '') {
    startT = new Date(parseFloat(start))
  }
  if (end != undefined && end != null && end != '') {
    endT = new Date(parseFloat(end))
  }
  let startyear = startT.getFullYear()
  let startmonth = startT.getMonth() + 1
  let startday = startT.getDate()
  let starthour = startT.getHours()
  let startminute = startT.getMinutes()
  let endyear = endT.getFullYear()
  let endmonth = endT.getMonth() + 1
  let endday = endT.getDate()
  let endhour = endT.getHours()
  let endminute = endT.getMinutes();

  let newEnd = '';

  if (startyear != endyear) {
    newEnd = formatNumber(endyear) + '-' + formatNumber(endmonth) + '-' + formatNumber(endday) + ' '
  } else if (startmonth != endmonth) {
    newEnd = formatNumber(endmonth) + '-' + formatNumber(endday) + ' '
  } else if (startday != endday) {
    newEnd = formatNumber(endday) + ' '
  }
  return [startmonth, startday].map(formatNumber).join('/') + ' ' + [starthour, startminute].map(formatNumber).join(':') + ' — ' + newEnd + '' + formatNumber(endhour) + ':' + formatNumber(endminute);
  // return [startyear, startmonth, startday].map(formatNumber).join('-') + ' ' + [starthour, startminute].map(formatNumber).join(':') + ' -- ' +  newEnd + '' +formatNumber(endhour)  + ':' +formatNumber(endminute) ;

}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function GetDateStr(AddDayCount) {
  let dd = new Date();
  dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期  

  let week = "星期" + "日一二三四五六日".charAt(dd.getDay());

  let y = dd.getFullYear();

  let m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1); //获取当前月份的日期，不足10补0  

  let d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate(); //获取当前几号，不足10补0  

  return JSON.stringify({
    time: m + '-' + d,
    date: y + '-' + m + '-' + d,
    text: m + '-' + d,
    value: y + '-' + m + '-' + d,
    week: week
  })
}

const distance = function (la1, lo1, la2, lo2) {
  var La1 = la1 * Math.PI / 180.0;
  var La2 = la2 * Math.PI / 180.0;
  var La3 = La1 - La2;
  var Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0;
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));
  s = s * 6378.137; //地球半径
  s = Math.round(s * 10000) / 10000;
  return s

};

let totalMoney = function (gender, priceMan, priceWoman, takeMan, takeWoman, isVip, vipPriceMan, vipPriceWoman) {
  var base = gender == 1 ? priceMan : priceWoman;
  var takenM = takeMan ? takeMan : '0';
  var takenWm = takeWoman ? takeWoman : '0';
  var total = 0;
  if (isVip) {
    base = gender == 1 ? vipPriceMan : vipPriceWoman;
    // console.log(base)
  }
  total = parseFloat(base) + (parseFloat(takenM) * parseFloat(priceMan)) + (parseFloat(takenWm) * parseFloat(priceWoman));
  return (total.toFixed(2));

}

//取倒计时（天时分秒）
let getTimeLeft = function (time) {
  let minutes = parseInt(time / 60);
  let seconds = parseInt((time % 60));
  return minutes + "分" + seconds + "秒"
}

let getLastTime = function(time){
  let diff = '';
  let days = Math.floor(time / (24 * 3600));
  if (days > 0) {
    diff += days + '天';
  }
  let leave1 = time % (24 * 3600);
  let hours = Math.floor(leave1 / 3600);
  if (hours > 0) {
    diff += hours + '小时';
  }
  let leave2 = leave1 % 3600;
  let minutes = Math.floor(leave2 / 60);
  diff += minutes + '分';
  return diff;
}


module.exports = {
  formatTime: formatTime,
  GetDateStr: GetDateStr,
  distance: distance,
  totalMoney: totalMoney,
  formatStamp: formatStamp,
  timeSlot: timeSlot,
  getTimeLeft: getTimeLeft,
  getLastTime:getLastTime
}