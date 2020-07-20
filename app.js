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
        if (self.isNull(self.getToken())) {
          self.reqToken(callback)
          return;
        }
        callback();
      },
      fail() {
        self.reqToken(callback)
      }
    })
  },

  reqToken(callback) {
    let self = this;
    wx.login({
      success(res) {
        if (res.code) {
          http.getT('/login/auth/' + res.code, '').then(function (data) {
            let token = data.header.token;
            self.setToken(token);
            let info = data.data.response[0];
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
      wx.navigateTo({
        url: '/pages/userInfo/userInfo'
      })
    } else {
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
    http.post('/user/saveInfo', userInfo, 1).then(function (res) {
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
    let dayList = [],activityTimeList = [],
      strap = [],
      hourList = [],
      minuteList = [];
    for (let j = 0, len = 365; j < len; j++) {
      let stap = this.getDateStr(j);
      let pipTime = new Date(stap);
      let weekNo = pipTime.getDay();
      let week = "周" + "日一二三四五六日".charAt(weekNo);
      let year = pipTime.getFullYear();
      let month = (pipTime.getMonth() + 1) < 10 ? "0" + (pipTime.getMonth() + 1) : (pipTime.getMonth() + 1);
      let day = pipTime.getDate() < 10 ? "0" + pipTime.getDate() : pipTime.getDate();
      if (j == 0) {
        // console.log(day)
      }
      let time = year + '-' + month + '-' + day;
      let tmShow = month + '月' + day + '日';
      dayList.push({
        week: week,
        tmShow: week + ' ' + tmShow,
        time
      });
      if (j < 7) {
        activityTimeList.push({
          week: week,
          tmShow: week + ' ' + tmShow,
          time
        })
      }
      strap.push(time)
    }
    for (let j = 0, len = 24; j < len; j++) {
      let hour = j < 10 ? ('0' + j) : j;
      hourList.push(hour + '')
    }
    for (let j = 0, len = 60; j < len; j++) {
      let minute = j < 10 ? ('0' + j) : j;
      minuteList.push(minute + '')
    }
    let todaystr = new Date();
    let today = todaystr.getFullYear() + '-' +
      ((todaystr.getMonth() + 1) < 10 ? "0" + (todaystr.getMonth() + 1) : (todaystr.getMonth() + 1)) + '-' +
      (todaystr.getDate() < 10 ? "0" + todaystr.getDate() : todaystr.getDate());
    let toTime = (todaystr.getHours() < 10 ? "0" + todaystr.getHours() : todaystr.getHours()) + ':' +
      (todaystr.getMinutes() < 10 ? "0" + todaystr.getMinutes() : todaystr.getMinutes());
    this.globalData.today = {
      today,
      toTime
    }
    this.globalData.activityTimeList = activityTimeList;
    this.globalData.strap = strap;
    this.globalData.pickList = [{
        values: dayList,
        className: 'column1'
      },
      {
        values: hourList,
        className: 'column2'
      },
      {
        values: minuteList,
        className: 'column3'
      }
    ]

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