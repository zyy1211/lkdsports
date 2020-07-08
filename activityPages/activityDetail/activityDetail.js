// activityPages/activityDetail/activityDetail.js

let Api = require('../../utils/config')
let bhv_back = require('../../pages/component/behavior/bhv_back.js');
let bhv_refresh = require('../../pages/component/behavior/bhv_refresh.js');
let bhv_location = require('../../pages/component/behavior/bhv_location')
let http = require('../../utils/request')
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    radio: '',
    flag: false,
    apiimg: Api.API_IMG,
    activeNames: [],
    latitude: '',
    longitude: '',
    activityId: 8,
    showSignList: false
  },
  behaviors: [bhv_back, bhv_refresh, bhv_location],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
    this.setData({
      activityId: options.id
    })
    app.isLogin(function () {
      self.initData();
    })
  },

  initData() {
    let self = this;
    this.selectComponent("#authorize").getAuthorizeLocation((loca) => {
      let longitude = loca.longitude;
      let latitude = loca.latitude;
      self.setData({
        latitude,
        longitude,
      })
      self.getDetail()
    })
  },
  getDetail() {
    let self = this;
    let {
      activityId,
    } = self.data;
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
        headImage,
        activityHeadImage,
        activityDetailImage,
        cUserDTO,
        flag,
        skuLock,
      } = main;
      activities.detailsText = activities.detailsText.split('&hc').join('\n');

      activities['tagArr'] = self.string_to_arr(activities.tag);
      let isApplySign = self.bolapplySign(activities.uptoTime,activities.participantsNum,activities.appliedNum);
      if(app.isNull(skuLock)){
        skuLock = [];
      }
      console.log(skuLock)
      let skuLock11 = skuLock.map((list, index) => {
        let total = 0;
        let money = 0;
        list.forEach((item) => {
          total += item.num;
          money += (item.num) * item.price
        })
        let obj = {};
        obj['total'] = total;
        obj['money'] = money/100;
        obj['list'] = list;
        obj['index'] = index;
        // console.log('ffffffffffffffff')
        // console.log(obj)
        return obj;
      })
      console.log(skuLock11)
      // console.log(isApplySign)
      this.setData({
        activities,
        activitiesSkuList,
        headImage,
        activityHeadImage,
        activityDetailImage,
        cUserDTO,
        flag,
        skuLock:skuLock11,
        isApplySign
      })
      // console.log(activities)
      // console.log(activitiesSkuList)
      // console.log(headImage)
      // console.log(activityHeadImage)
      // console.log(activityDetailImage)
      // console.log(cUserDTO)
    })
  },
  bolapplySign(uptoTime,participantsNum,appliedNum){
    let date  = new Date();
    let strap = new Date(uptoTime.replace((/-/g),'/'));
    let timer = strap - date;
    if(timer > 0){
      if(participantsNum != appliedNum){
        console.log(true)
        return '2'
      }else{
        console.log('空')
        return '1'
      }
    }
    console.log(false)
    return '0'
    //  console.log(date)
    //  console.log(strap)
    //  console.log(strap - date)
    //  console.log(participantsNum)
    //  console.log(appliedNum)

  },
  toSignup() {
    let {
      activities
    } = this.data;
    wx.navigateTo({
      url: '/activityPages/signup/signup?id=' + activities.id,
    })
  },
  updateSign() {
    this.setData({
      showSignList: true
    })
  },
  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },
  radioChange(event) {
    this.setData({
      radio: event.detail,
    });
  },
  closeSheet(){
    this.setData({showSignList:false})
  },
  sureSheet(){
    let {activities,radio} = this.data;
    console.log(this.data.radio)
    wx.navigateTo({
      url: '/activityPages/signup/signup?id=' + activities.id + '&edit=' + radio,
    })
    this.closeSheet();
  },

  tosignlist(){
    let {activityId} = this.data;
    wx.navigateTo({
      url: '/activityPages/signlist/signlist?activityId='+activityId,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let stap = new Date();
    let {activities,activityId} = this.data;
    return {
      title:activities.title ,
      path: '/activityPages/activityDetail/activityDetail',
      imageUrl: 'http://192.168.0.200:8091/user/actSharePic/' + activityId +'?'+ stap
    }
  }
})