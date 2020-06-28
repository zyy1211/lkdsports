const http = require('./utils/request.js');

App({
  onLaunch: function () {
    let t = wx.getSystemInfoSync().SDKVersion;
    if (t = t.replace(/\./g, ""), parseInt(t) < 164) {
      return wx.showModal({
        title: "提示",
        content: "你的微信版本过低，可能无法使用此小程序的部分功能，请升级到最新微信版本后重试。"
      })
    }
    if (wx.canIUse("getUpdateManager")) {
      wx.clearStorage();
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(function (res) {})
      updateManager.onUpdateReady(function () {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: function (res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate()
            }
          }
        })
      })
    };
    this.getSDKVersion();
    this.getOneDay();
  },
  getSDKVersion() {
    let phoneInfo = wx.getSystemInfoSync();
    let t = phoneInfo.SDKVersion;
    let barHeight = phoneInfo.statusBarHeight * 2;
    let screenWidth = phoneInfo.screenWidth;
    let height = barHeight + screenWidth * 2 * 88 / 750;
    this.globalData.barHeight = barHeight;
    this.globalData.height = height;
  },

  // 判断session是否过期
  isSession(callback) {
    let self = this;
    wx.checkSession({
      success() {
        // console.log(self.getToken())
        if (self.isNull(self.getToken())) {
          // console.log('11过期')
          self.reqToken(callback)
          return;
        }
        // console.log('未过期')
        callback();
      },
      fail() {
        // console.log('过期')
        self.reqToken(callback)
      }
    })
  },

  reqToken(callback) {
    let self = this;
    wx.login({
      success(res) {
        // console.log(res)
        if (res.code) {
          http.getT('/login/auth/' + res.code, '').then(function (data) {
            // console.log('我是token')
            // console.log(data)
            let token = data.header.token;
            self.setToken(token);
            let info = data.data.response[0];
            // console.log('拿token')
            // console.log(info)
            if (self.isNull(info) || self.isNull(info.nickname)) {
              info = '';
            }
            self.setInfo(info);
            callback()
          })
        }
      }
    })
  },
  reqInfo(callback) {
    let self = this;
    if (self.isNull(self.getInfo())) {
      // console.log('无info')
      wx.navigateTo({
        url: '/pages/userInfo/userInfo'
      })
    } else {
      // console.log('有info')
      callback();
    }
  },
  isLogin(callback) {
    let self = this;
    this.isSession(function () {

      self.reqInfo(callback);
    })
  },

  saveInfo(userInfo) {
    let self = this;
    // console.log(userInfo)
    http.post('/user/saveInfo', userInfo, 1).then(function (res) {
      // console.log(res);
      self.setInfo(userInfo);
      wx.navigateBack({
        delta: 1
      });
    })
  },


  setToken(token) {
    wx.setStorageSync("token", token);
  },
  getToken() {
    return wx.getStorageSync("token")
  },
  setInfo(info) {
    wx.setStorageSync("info", JSON.stringify(info));
  },
  getInfo() {
    return JSON.parse(wx.getStorageSync("info"));
  },
  isNull: function (str) {
    if (str == undefined || str == null || str == '' || str == "undefined") {
      return true;
    } else if (Array.prototype.isPrototypeOf(str) && str.length === 0) {
      return true;
    }
    return false;
  },
  getOneDay: function () {
    let dayList = [],strap = [],hourList=[],minuteList=[];
    for (let j = 0, len = 365; j < len; j++) {
      let stap = this.getDateStr(j);
      let pipTime =  new Date(stap);
      let weekNo =pipTime.getDay();
      let week = "周" + "日一二三四五六".charAt(weekNo);
      let year = pipTime.getFullYear();
      let month = (pipTime.getMonth() + 1) < 10 ? "0" + (pipTime.getMonth() + 1) : (pipTime.getMonth() + 1);
      let day = pipTime.getDate() < 10 ? "0" + pipTime.getDate() : pipTime.getDate();
      let time = year + '-'+month + '-' + day;
      let tmShow = month + '月' + day + '日'; 
      dayList.push({week:week + ' ' +tmShow ,tmShow,time});
      strap.push(time)
    }
    for(let j = 0,len = 24;j < len;j++){
      let hour = j < 10 ? ('0'+j) : j;
      hourList.push(hour+'')
    }
    for(let j = 0,len = 60;j < len;j++){
      let minute = j < 10 ? ('0'+j) : j;
      minuteList.push(minute+'')
    }
    let todaystr= new Date();
    let today = todaystr.getFullYear() + '-' + 
    ((todaystr.getMonth() + 1) < 10 ? "0" + (todaystr.getMonth() + 1) : (todaystr.getMonth() + 1)) + '-' +
    (todaystr.getDate() < 10 ? "0" + todaystr.getDate() : todaystr.getDate());
    let toTime = (todaystr.getHours() < 10 ? "0" + todaystr.getHours() : todaystr.getHours()) + ':' +
    (todaystr.getMinutes() < 10 ? "0" + todaystr.getMinutes() : todaystr.getMinutes());
    this.globalData.pickList = {dayList,hourList,minuteList,strap}
    this.globalData.today = {today,toTime}
  },
  getDateStr: function (dayCount) {
    let dd = new Date()
    dd.setDate(dd.getDate() + dayCount)
    let time = dd.getTime()
    return time;
  },

  validateNumber(val) {
    return val.replace(/\D/g, '')
  },
  validateFixed(val) {
    let value;
    value = val.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
    value = value.replace(/^\./g, ""); //验证第一个字符是数字
    value = value.replace(/\.{2,}/g, "."); //只保留第一个, 清除多余的
    value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
    return value;
  },

  globalData: {
    userInfo: null,
  }
})