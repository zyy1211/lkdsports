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
  },
  getSDKVersion(){
    let phoneInfo = wx.getSystemInfoSync();
    let t = phoneInfo.SDKVersion;
    let barHeight = phoneInfo.statusBarHeight *2;
    let screenWidth = phoneInfo.screenWidth;
    let height = barHeight + screenWidth*2 * 88 / 750;
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
            // console.log(data)
            let token = data.header.token;
            self.setToken(token);
            let info = data.data.response[0];
            // console.log('拿token')
            if (self.isNull(info)) {
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
    }else{
      // console.log('有info')
      callback();
    }
  },
  isLogin(callback){
    let self = this;
    this.isSession(function(){

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
  globalData: {
    userInfo: null,
  }
})