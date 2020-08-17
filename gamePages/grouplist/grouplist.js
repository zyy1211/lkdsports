let http = require('../../utils/request')
let Api = require('../../utils/config.js');
let bhv_pay = require('../../pages/component/behavior/bhv_pay')
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
  },
  behaviors: [bhv_pay],

  /**
   * 生命周期函数--监听页面加载 
   */
  onLoad: function (options) {
    console.log(options)
    let pat = JSON.parse(options.pat)
    this.setData({proGroupId:options.proGroupId,...pat})
    this.initd()
  },
  onShow: function () {
    let {proGroupId} = this.data;
    if(proGroupId){
      this.initd();
    }
  },
  initd(){
    let {proGroupId} = this.data;
    app.isLogin(() =>{
      http.get('/games/myteam/' + proGroupId).then((res) =>{
        let list = res.response[0].numbers;
        let teamsInfo = res.response[0].teamsInfo;
        let teamsConfId = res.response[0].teamsInfo.id;
        this.setData({list,teamsConfId,teamsInfo})
      })
    })
  },
  submit(){
    let self = this;
    let {teamsConfId:teamsId} = this.data;
    console.log(teamsId)
    http.get('/games/team/apply/' + teamsId).then((res) =>{
      let main = res.response[0];
      let {
        bussId,
        oid,payPrice
      } = main;
      self.ordersubmit({
        bussid: bussId,
        oid,
        payPrice
      }, 'signup');
    })
  },
  show() {
    this.setData({
      isAlert: true
    })
  },
  hide() {
    setTimeout(() => {
      this.setData({
        isAlert: false
      })
    }, 300);

  },

  toSignup(){
    let { gamesId,radio,type,num,teamsConfId } = this.data;
    wx.navigateTo({ 
      url: '/gamePages/gameSign/gameSign?id=' + gamesId + '&type=60' +'&proGroupId=' + radio + '&num=' + num +'&teamsConfId=' +teamsConfId,
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