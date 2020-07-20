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
    activeNames: ["1"],
    latitude: '',
    longitude: '',
    showSignList: false
  },
  behaviors: [bhv_back, bhv_refresh, bhv_location],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
    app.isLogin(function () {

      self.setData({
        activityId: options.id
      })
      self.initData();
    })
  },
  onShow: function () {
    let {
      activityId,
    } = this.data;
    if (activityId) {
      this.initData();
    }

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
      headImage = headImage?.slice(0,6)

      activities.detailsText = activities?.detailsText?.split('&hc').join('\n');

      activities['tagArr'] = self.string_to_arr(activities.tag);
      let isApplySign = self.bolapplySign(activities.uptoTime, activities.participantsNum, activities.appliedNum, activities.status);

      let skuLock11 = skuLock?.map((list, index) => {
        let total = 0;
        let money = 0;
        list.applySkuLocks.forEach((item) => {
          total += item.num;
          money += (item.num) * item.price
        })
        let obj = {};
        obj['total'] = total;
        obj['money'] = money / 100;
        obj['list'] = list.applySkuLocks;
        obj['info'] = list.activitiesApply;
        obj['index'] = index;

        return obj;
      })

      this.setData({
        activities,
        activitiesSkuList,
        headImage,
        activityHeadImage,
        activityDetailImage,
        cUserDTO,
        flag,
        skuLock: skuLock11,
        isApplySign
      })

    })
  },
  bolapplySign(uptoTime, participantsNum, appliedNum, status) {
    if (status == 100 || status == 101) {
      return '0'
    }
    let date = new Date();
    let strap = new Date(uptoTime.replace((/-/g), '/'));
    let timer = strap - date;
    if (timer > 0) {
      this.getTimer(timer);
      if (participantsNum != appliedNum) {
        // console.log(true)
        return '2'
      } else {
        // console.log('空')
        return '1'
      }
    }
    return '0'

  },
  getTimer(time_diff) {
    let diff = '';
    // 计算相差天数  
    let days = Math.floor(time_diff / (24 * 3600 * 1000));
    if (days > 0) {
      diff += days + '天';
    }
    // 计算相差小时数  
    let leave1 = time_diff % (24 * 3600 * 1000);
    let hours = Math.floor(leave1 / (3600 * 1000));
    if (hours > 0) {
      diff += hours + '小时';
    }
    // 计算相差分钟数  
    let leave2 = leave1 % (3600 * 1000);
    let minutes = Math.floor(leave2 / (60 * 1000));
    if (minutes > 0) {
      diff += minutes + '分';
    } else {
      if (diff !== '') {
        diff += minutes + '分';
      }
    }
    this.setData({diff})
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
  closeSheet() {
    this.setData({
      showSignList: false
    })
  },
  sureSheet() {
    let {
      activities,
      radio
    } = this.data;
    console.log(this.data.radio)
    if(app.isNull(radio) && radio !== 0){
      wx.showToast({title: '请选择要修改的报名列表',icon:'none',duration:3000});
      return;
    }
    wx.navigateTo({
      url: '/activityPages/signup/signup?id=' + activities.id + '&edit=' + radio,
    })
    this.closeSheet();
  },

  tosignlist() {
    let {
      activityId
    } = this.data;
    wx.navigateTo({
      url: '/activityPages/signlist/signlist?activityId=' + activityId,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let api = Api.API_HOST
    let {
      activities,
      activityId
    } = this.data;
    return {
      title: activities.title,
      path: '/activityPages/activityDetail/activityDetail?id=' + activityId,
      imageUrl: api + '/user/actSharePic/' + activityId
    }
  }
})