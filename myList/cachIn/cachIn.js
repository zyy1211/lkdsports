let http = require('../../utils/request');
let API = require('../../utils/config.js');
let util = require('../../utils/util');
let app = getApp();
let bhv_refresh = require('../../pages/component/behavior/bhv_refresh')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    suucess: API.cvs_img + '/20200430/46168b07a26d743f1ce41e4a65133799.png'
  },
  behaviors: [bhv_refresh],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
    // console.log(options.beTotal) 
    app.isLogin(function () {
      self.setData({
        beTotal: options.beTotal
      })
    })

  },
  bindDate: function (e) {
    let key = e.currentTarget.dataset.key;
    let value = e.detail.value;
    // if (key == 'money') {
    //   value = this.validateFixed(value);
    // }
    this.setData({
      [key]: value
    })
  },

  toCachIn: function () {
    let self = this;
    let {
      money,
      name,
      beTotal
    } = this.data;
    if (app.isNull(money) || money < 1) {
      return wx.showToast({
        title: '最小提现金额为1元',
        icon: 'none'
      })
    }
    if (parseFloat(money) > parseFloat(beTotal)) {
      return wx.showToast({
        title: '提现金额不能超过账户金额',
        icon: 'none'
      })
    }
    if (app.isNull(name)) {
      return wx.showToast({
        title: '请输入真实姓名',
        icon: 'none'
      })
    }
    self.show();
    http.post('/pay/withdrawal', {
      money: money * 100,
      name
    }).then(function (res) {
      self.hide();
      // console.log(res);
      if (res.code != 200) {
        return;
      }
      self.setData({
        show: true
      })
    })
  },
  allCach(){
    let {beTotal} = this.data;
    let money = beTotal > 5000 ? 5000 : beTotal;
    this.setData({
      money
    })

  },

  onConfirm: function () {
    console.log('fsfs')
    wx.navigateBack({
      delta: 1, // 回退前 delta(默认为1) 页面
    })
  },


})