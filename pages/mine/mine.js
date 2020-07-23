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

  },
  initData(){
    let self = this;
    app.isLogin(function () {
      let info = app.getInfo()
      // console.log(info)
      let headImage = info.headImage || info.avatarUrl;
      self.setData({
        info,headImage
      })
    })
  },
  onShow: function () {
    this.initData();
  },
  
  toBlockList(e) {
    let url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: url,
    })
  },
  tosettledIn() {
    wx.navigateTo({
      url: '/venuePages/settledIn/settledIn',
    })
  }

})