let app = getApp();
Page({

  /**
   * 页面的初始数据
   */

  data: {

  },
  navigate: function (e) {
    let isLogin = this.data.isLogin
    if (!isLogin) {
      wx.navigateTo({
        url: '../userInfo/userInfo'
      })
    } else {
      let url = e.currentTarget.dataset.url;
      wx.navigateTo({
        url: url
      })
    }
  },
  onLoad: function () {
    let self = this;
    app.isLogin(function () {
      let info = app.getInfo()
      console.log(info)
      self.setData({info})
    })
  },
  toBlockList(e) {
    let url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: url,
    })
  }

})