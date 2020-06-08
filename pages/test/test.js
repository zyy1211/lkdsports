
let http = require('../../utils/request')

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.login({
    //   success(res) {
    //     // console.log(res)
    //     if (res.code) {
    //       http.getT('/login/auth/' + res.code, '').then(function (data) {
    //         // console.log(data)
    //         let token = data.header.token;
    //         self.setToken(token);
    //         let info = data.data.response[0];
    //         // console.log('拿token')
    //         if (self.isNull(info)) {
    //           info = '';
    //         }
    //         self.setInfo(info);
    //         callback()
    //       })
    //     }
    //   }
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  payment() {
    let params;
    http.get('/pay/wxPay/186463086255804416','').then(function (res) {
      console.log(res)
      let {
        timeStamp,
        nonceStr,
        package: package1,
        signType,
        paySign
      } = res.response[0];
      wx.requestPayment({
        timeStamp: timeStamp,
        nonceStr: nonceStr,
        package: package1,
        signType: signType,
        paySign: paySign,
        success(res) {
          console.log(res)
        },
        fail(res) {
          console.log(res)
        },
      })
    })

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