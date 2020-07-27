
let bhv_location = require('../../pages/component/behavior/bhv_location')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    active :3,
    steps: [
      {
        text: '在浏览器输入http://saas.like-sports.cn/index.html进',
        desc: '入栎刻动场馆系统登录页面。',

      },
      {
        text: '输入短信收到的账号密码',
        desc: '  ',

      },
      {
        text: '点击登录，进入栎刻动场馆系统',
        desc: '   ',
      },
    ],
  },
  behaviors: [bhv_location],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})