let bhv_location = require('../../pages/component/behavior/bhv_location')
let http = require('../../utils/request')
let bhv_pay = require('../../pages/component/behavior/bhv_pay')
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabel: false,
    is_user_self: 1,
    maxPs: 1,
    trueName: ''
  },
  behaviors: [bhv_location, bhv_pay],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    let self = this;
    app.isLogin(function () {
      let userinfo = app.getInfo();
      // console.log(userinfo)
      self.setData({
        activityId: option.id,
        phone: userinfo.phone,
        gender: userinfo.sex,
        userId: userinfo.id,
        edit: option.edit
      })
      self.getDetail();
    })
  },
  getDetail() {
    let self = this;
    let {
      activityId,
      maxPs,
      edit
    } = self.data;
    // console.log(edit)
    self.show();
    http.get('/activities/selectActivity/' + activityId).then((res) => {
      self.hide()
      // console.log(res)
      if (res.code != 200) {
        return;
      }
      let main = res.response[0];
      let {
        activities,
        activitiesSkuList,
        cUserDTO,
        flag,
        skuLock,
        currentUserTrueName,
        currentUserPhone
      } = main;
      let is_user_self = self.data.userId == cUserDTO.id ? 1 : !1;
      let objMap = new Map();
      // console.log(edit)
      if (!app.isNull(edit)) {
        let currentList = skuLock[edit]
        let applyId;
        // console.log(currentList)
        currentList.forEach((item) => {
          objMap.set(item.skuId, item.num)
          applyId = item.applyId;
          // objMap.set(item.skuId + 't', item.applyId)
          objMap.set(item.skuId + 'o', item.id)
        })
        self.setData({
          trueName: currentUserTrueName,
          phone: currentUserPhone,
          disabel: true,
          objMap,
          applyId
        })
      }
      activitiesSkuList.forEach((item) => {
        // console.log(objMap)
        // console.log(item)
        // let applyId = objMap.get(item.id + 't');
        let skuId = objMap.get(item.id + 'o');
        item['max'] = item.maxNum == -1 ? 6 : (item.maxNum < 6 ? item.maxNum : 6);
        item['min'] = 0;
        item['num'] = 0;
        if (!app.isNull(edit)) {
          item['skuId'] = skuId;
          // item['applyId'] = applyId;
          [item.id, item.skuId] = [item.skuId, item.id]
        }
        if (activities.withPeople == 0) {
          // 不能带人
          item.max = 1, maxPs = 1
        } else {
          maxPs = item.max
        }
        // 修改
        if (!app.isNull(edit)) {
          let count = objMap.get(item.skuId);

          item.max = (item.max < count ? item.max : count);
          // console.log(item.max)
          item.num = count;

        }
        console.log(item)
      })
      self.setData({
        activities,
        activitiesSkuList,
        cUserDTO,
        flag,
        is_user_self,
        maxPs
      })
      // console.log(activities)
      // console.log(activitiesSkuList)
      // console.log(headImage)
      // console.log(activityHeadImage)
      // console.log(activityDetailImage)
      // console.log(cUserDTO)
    })
  },
  stepChange(e) {
    let index = e.currentTarget.dataset.key;
    let keys = 'activitiesSkuList[' + index + '].num';
    this.setData({
      [keys]: e.detail
    })
  },
  bindDate(e) {
    let key = e.currentTarget.dataset.key;
    let value = e.detail;
    if (key == 'phone') {
      value = app.validateNumber(value)
    }
    this.setData({
      [key]: value
    })
  },
  onwishSuccess(e) {
    // console.log(e)
    this.setData({
      totalNum: e.detail.money,
      choiseNum: e.detail.count
    })
  },
  subscribeMsg(){
    wx.requestSubscribeMessage({
      tmplIds: ['VyY1O6w7tyrP3CI0s11Xam6W95dxdFzcFwQSHzPCqwk','WHldGPQ6PCcXLfqHvPnV9vV-0RHk4bjRPKeRcI-K7Lg'],
      success (res) {
        console.log('succ')
        console.log(res)
       },
    })
  },
  submit() {
    let self = this;

    self.subscribeMsg();

    let {
      choiseNum,
      maxPs,
      totalNum,
      is_user_self,
      objMap
    } = this.data;
    // console.log(choiseNum)
    // console.log(maxPs)
    if (choiseNum > maxPs) {
      this.lkdToast('报名人数不能超过' + maxPs)
      return;
    }
    let {
      activityId,
      activitiesSkuList: applySku,
      gender,
      phone,
      trueName,
      edit,
      applyId
    } = this.data;
    let countChange = false;
    let params = {
      activityId,
      applySku,
      gender,
      phone,
      trueName
    }
    let url = '/activities/apply';
    if (edit) {
      url = '/activities/refund';
      applySku.forEach((item) => {
        let num = objMap.get(item.id)
        if (num != item.num) {
          countChange = true;
        }
      })
      if (!countChange) {
        return this.lkdToast('报名人数未修改')
      }
      params = {
        activityId,
        applySku,
        gender,
        phone,
        trueName,
        applyId: applyId
      }
    }

    http.post(url, params, 1).then((res) => {
      // console.log(res)
      if (res.code != 200) {
        return
      }
      let main = res.response[0]
      wx.navigateBack({
        delta: 1
      })
      // console.log(edit)
      if (app.isNull(edit)) {
        totalNum = is_user_self == 1 ? 0 : totalNum;
        let {
          bussId,
          oid
        } = main;
        self.ordersubmit({
          bussId,
          oid,
          payprice: totalNum
        },'signup');
      }
    })
  },
  lkdToast(title) {
    return wx.showToast({
      title: title,
      icon: 'none',
      duration: 3000
    });
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