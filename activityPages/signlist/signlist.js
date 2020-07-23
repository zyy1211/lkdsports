
let http = require('../../utils/request')
let Api = require('../../utils/config')
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    self_is_user:false,
    url : '/activities/getApplyInfo',
    status: 20,
    apiimg: Api.API_IMG,
    tablist: [{
        name: '已报名',
        value: 20
      },
      // {
      //   name: '排队中',
      //   value: 30
      // }, 
      {
        name: '已取消',
        value: 40
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    let self = this;

    app.isLogin(function () {
      let userinfo = app.getInfo();
      let userId = userinfo.id;
      self.setData({
        activityId: options.activityId,
        userId
      })
      self.initData();
    })
  },
  tabChange(e){ 
    let status = e.currentTarget.dataset.key;
    this.setData({status});
    // console.log(status)
    let url = '/activities/getApplyInfo'
    if(status == 40){
      url = '/activities/getRefundInfo'
    }
    this.setData({url})
    this.initData()
  },
  initData() {
    let self = this;
    let {
      activityId,url,userId,self_is_user,status
    } = this.data;
    http.get(url, {
      activityId
    }).then((res) => {
      // console.log(res)
      if (res.code != 200) {
        return
      }
      let main = res.response[0];
      let {
        activitiesApplySkuVOS,
        activitiesSkus,
        publisherId
      } = main;
      if(publisherId == userId){
        self_is_user = true
      }else{
        self_is_user = false;
      }
      let total = 0;
      activitiesSkus.forEach((item) => {
        if(status == 40){
          total += item.refundNum
        }else{
          total += item.occupyNum
        }
        
      })
      activitiesApplySkuVOS = activitiesApplySkuVOS.map((item) => {
        let total = 0;
        item.applySkuLocks.forEach((itm) => {
          if(status == 40){
            total += itm.refundNum
          }else{
            total += itm.num
          }

        })
        item['total'] = total;
        return item;
      })
      self.setData({
        activitiesApplySkuVOS,
        activitiesSkus,
        total,self_is_user
      })
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