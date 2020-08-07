let bhv_location = require('../../pages/component/behavior/bhv_location')
let http = require('../../utils/request')
let bhv_pay = require('../../pages/component/behavior/bhv_pay')
let bhv_dialog = require('../../pages/component/behavior/bhv_dialog')
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dialogAgree: true,
    agree: false,
    disabel: false,
    is_user_self: 1,
    maxPs: 1,
    trueName: '',
    disabled:false,
  },
  behaviors: [bhv_location, bhv_pay,bhv_dialog],

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
        currentList.applySkuLocks.forEach((item) => {
          objMap.set(item.skuId, item.num)
          applyId = item.applyId;
          // objMap.set(item.skuId + 't', item.applyId)
          objMap.set(item.skuId + 'o', item.id)
        })
        currentUserTrueName = currentList.activitiesApply.trueName;
        currentUserPhone = currentList.activitiesApply.phone;
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
          [item.id, item.skuId] = [item.skuId, item.id]
        }
        if (activities.withPeople == 0) {
          // 不能带人
          item.max = 1, maxPs = 1
        } 
        else {
          // maxPs = item.max;
          maxPs = 6;

        }
        // 修改
        if (!app.isNull(edit)) {
          let count = objMap.get(item.skuId);
          item.max = (item.max < count ? item.max : count);
          item.num = count;

        }
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
  submit() {
    let self = this;

    if (!self.data.agree) {
      return wx.showToast({
        title: '请阅读本平台协议，勾选同意后方可发布活动',
        icon: 'none',
      })
    }

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
      trueName,
      lineUpStatus:0,
    }
    if (app.isNull(phone)) {
      return this.lkdToast('电话号码不能为空')
    }
    let url = '/activities/apply';
    if (edit) {
      console.log()
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
    } else {
      let isnum = applySku.every((item) => {
        return item.num == 0
      })
      if (isnum) {
        return this.lkdToast('报名人数不能为0')
      }
      // 排队
      let {isLineUp,participantsNum,appliedNum} = this.data.activities;
      if(isLineUp == 1 && participantsNum == appliedNum ){
        url = '/activities/lineUp';
        params.lineUpStatus = 1;
        let totNum = 0;
        applySku.forEach((item) =>{
          totNum += item.num;
        })
        // console.log(totNum)
        if(totNum >1){
          return this.lkdToast('排队人数不能超过一人')
        }

      }
    }
    let {disabled} = self.data;
    if(disabled){return}
    self.setData({disabled:true})
    self.islineSubmit(url,params,edit,totalNum,is_user_self)
  },
  islineSubmit(url,params,edit,totalNum,is_user_self){
    let self = this;
    self.show();
    http.post(url, params, 1).then((res) => {
      // console.log(res)
      if (res.code != 200) {
        self.setData({disabled:false})
        self.hide();
        return
      }
      let main = res.response[0];
      if(main?.oid == 0){
        params.lineUpStatus = 0;
        self.islineSubmit('/activities/apply',params,edit,totalNum,is_user_self);
        return;
      }
      // console.log(edit)
      if (app.isNull(edit)) {
        totalNum = is_user_self == 1 ? 0 : totalNum;
        let {
          bussId,
          oid
        } = main;
        self.ordersubmit({
          bussid: bussId,
          oid,
          payprice: totalNum
        }, 'signup');
      } else {
        self.subscribeMsg(() => {
          wx.navigateBack({
            detail: 1
          })
        });
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