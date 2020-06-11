let http = require('../../utils/request')
let bhv_refresh = require('../../pages/component/behavior/bhv_refresh')
let app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageSize:10,
    pageNo:1
  },
  behaviors: [ bhv_refresh],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.isLogin(() =>{
      this.initData();
    })
  },

  initData() {
    let self = this;
    let {pageSize,pageNo} = this.data;
    http.post('/order/list',{pageSize,pageNo,status:40},1).then((res) =>{
      // console.log(res.response)
      self.setData({mainlist:res.response[0].orders})
    })
  },
  orderDetail(e){
    let bussId =  e.currentTarget.dataset.bussId;
    let oid =  e.currentTarget.dataset.oid;
    wx.navigateTo({
      url: '/venuePages/orderpay/orderpay?isOnce=!1&bussId='+bussId +'&oid='+oid,
    })
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