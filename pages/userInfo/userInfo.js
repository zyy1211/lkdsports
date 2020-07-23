// pages/userInfo/userInfo.js
let app = getApp();
let Api = require('../../utils/config')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    background:Api.cvs_img + '/20200413/d70508be1bc0acbeaf40ff53b658ad00.png'
  },
  getUserInfo: function (e) {
    // console.log(e);
    // console.log(e.detail.userInfo);
    let self = this;
    if (e.detail.userInfo === undefined) {
      return;
    }

    app.saveInfo(e.detail.userInfo); 

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {

  },
})