// pages/mine/mine.js
let app = getApp();
let http = require('../../utils/request')
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onShow: function () {

  },

})