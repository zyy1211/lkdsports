const http = require('./utils/request.js');
const API = require('./utils/config');

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
  isCheckImg(url){
    let token = wx.getStorageSync('token');
    return new Promise((resolve,reject) =>{
      wx.showLoading({
        title: '图片加载中...'
      })
      wx.uploadFile({
        url: API.API_HOST + '/wxCheck/imgCheck',
        header: {
          'token': token,
        },
        filePath: url,
        name: 'file',
        success(res){
          let datas = JSON.parse(res.data)
          if((datas.response[0]?.errcode  + '').includes('8701')){
            wx.showToast({title: '请重新上传或更换图片',icon:'none',duration:3000});
            return;
          }
          resolve();
        },
        complete: function () {
          wx.hideLoading();
        }
      })
    })
  },

  // 判断session是否过期
  isSession(callback) {
    let self = this;
    new Promise((resolve, reject) => {
      wx.checkSession({
        success() {
          self.reqToken().then(() => {
            resolve();
          })
        },
        fail() {
          self.reqToken().then(() => {
            resolve();
          })
        }
      })
    }).then(() => {
      callback()
    })
  },


  reqToken() {
    let self = this;
    return new Promise((resolve, reject) => {
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
              resolve();
            })
          }
        }
      })
    })
  },

  isLogin(callback) {
    let self = this;
    this.isSession(() => {
      // console.log(self.getInfo())
      if (self.isNull(self.getInfo())) {
        wx.navigateTo({
          url: '/pages/userInfo/userInfo'
        })
      } else {
        callback();
      }
    })
  },

  saveInfo(userInfo) {
    let self = this;
    http.post('/user/saveInfo', userInfo, 1).then(function (res) {
      self.setInfo(userInfo);
      self.getUserInfo();
      wx.navigateBack({
        delta: 1
      });
    })
  },
      // 用户信息
      getUserInfo() {
        let self = this;
        http.get('/user/getInfo').then((res) => {
          // console.log(res)
          if (res.code != 200) {
            return
          }
          let main = res.response[0];
          self.setInfo(main);
        })
      },

  setGameItem(item){
    wx.setStorageSync("gameItem", JSON.stringify(item));
  },

  getGameItem(){
    return JSON.parse(wx.getStorageSync("gameItem"))
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
    let dayList = [],
      activityTimeList = [],
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


  globalData: {
    userInfo: null,
  }
})