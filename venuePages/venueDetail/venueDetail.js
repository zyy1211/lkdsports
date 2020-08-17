// activityPages/activityDetail/activityDetail.js

let bhv_back = require('../../pages/component/behavior/bhv_back.js');
let bhv_refresh = require('../../pages/component/behavior/bhv_refresh.js');
let bhv_location = require('../../pages/component/behavior/bhv_location');
let http = require('../../utils/request');
let bhv_week = require('../../pages/component/behavior/bhv_week');
let app = getApp();
let API = require('../../utils/config');
const Rx = require('../../utils/rxjs'); 
const {
    throttleTime
} = Rx.operators;

var myObservable = new Rx.Subject();

Page({ 

  /**
   * 页面的初始数据
   */
  data: {

    main: {},
    matchId: 0,
    businessHours: '',
    detailId: 38,
    tb_time: [],
    latitude: '',
    longitude: '',
    choiseList: [],
    show: false,
    num: 0,
    apiimg:API.API_IMG,
    phoneshow:false,
  },
  behaviors: [bhv_location,bhv_week, bhv_back, bhv_refresh],

  /**
   * 生命周期函数--监听页面加载
   */
  onwishSuccess(e) {
    // console.log(e)
    this.setData({
      num: e.detail
    })
  },
  onLoad: function (options) {
    // this.animate(selector, keyframes, duration, ScrollTimeline)
    let self = this;
    myObservable.pipe(throttleTime(500)).subscribe(value => {
      self.choiseBlock(value)
    });
    this.setData({detailId:options.id})
    app.isLogin(function () {
      self.initData();
      self.getweek();
    })

  },
  initData() {
    let self = this;
    self.show();
    this.selectComponent("#authorize").getAuthorizeLocation((loca) => {
      let longitude = loca.longitude;
      let latitude = loca.latitude;
      self.setData({
        latitude,
        longitude,
        choiseList: []
      })
      self.getDetail()
    })
  },
  getDetail() {
    let self = this;
    let {
      detailId,
      latitude,
      longitude
    } = self.data;
    http.get('/venue/detail', {
      detailId,
      latitude,
      longitude
    }).then((res) => {
      if (res.code != 200) {
        self.hide();
        return;
      }
      let main = res.response[0];
      // console.log(main)
      // console.log(self)
      // return;
      let loctn = self.bMapTransqqMap(main.locationLongitude,main.locationLatitude);
      main.locationLongitude = loctn.longitude;
      main.locationLatitude = loctn.latitude;
      // console.log(loctn)
      let matchId = main.matchVoList[0].id;
      let businessHours = main.matchVoList[0].businessHours;
      // console.log(businessHours)
      self.setData({
        main,
        matchId,
        businessHours
      })
      self.getTabel(); 

    })
  },
  getTabel() {
    let self = this; 
    self.show();
    let {
      detailId,
      matchId,
      weekNo,
      weekTime:{day:date},
    } = this.data;
    http.get('/venue/field', {
      detailId,
      matchId,
      weekNo,
      date
    }).then((res) => {
      self.hide();
      if (res.code != 200) {
        return;
      }
      let tablemain = res.response[0];
      // console.log(tablemain)
      if (tablemain.length == 0) { 
        self.setData({
          tablemain,
          tb_time: tablemain
        })
        return;
      }
      self.formatData(tablemain)
      // self.formatData([tablemain[0]])
    })
  },
  bindchoiseBlock(e){
    myObservable.next(e);
  },
  choiseBlock(e) {
    let {
      weekTime,
      choiseList,
    } = this.data;

    let {
      item,
      name,
      index,
      idx,
      fieldid,
      type,
      id
    } = e.currentTarget.dataset;

    if (type == 1 && item.status != 0 && item.status != 999) {
      return
    }
    if (type == 0 && item.status != 0) {
      return
    }
    if (!app.isNull(choiseList[0]) && type != choiseList[0].type) {
      this.setData({
        show: true
      })
      return;
    }
    let choose = item.choose;
    let endTime = (item.dataCode.split('-')[1]) * 1;
    let startTime = (item.dataCode.split('-')[1]) * 1 - 1;
    if (!app.isNull(item.merge)) {
      let mg = (item.merge.split('-')[2]) * 1;
      endTime = startTime + mg;
    }

    let isprice = app.isNull(item.merge) ? item.basePrice : item.price;
    if (!choose) {
      let obj = {
        startTime,
        endTime,
        fieldid,
        choiseName: name,
        day: weekTime.day,
        merge: item.merge,
        type,
        count: 1,
        isprice: isprice,
        id: id
      }
      choiseList.push(obj)
    } else {
      choiseList = choiseList.filter(it => it.id != item.id)
    }
    let iscu = 'tablemain[' + index + '].new_table[' + idx + '].choose';
    this.setData({
      choiseList,
      [iscu]: !choose,
    })
    // console.log(choiseList)
  },
  stepChange(e) {
    let index = e.currentTarget.dataset.index;
    let key = 'choiseList[' + index + '].count';
    this.setData({
      [key]: e.detail
    })
  },

  showPhoneDialog(){
    let userinfo = app.getInfo();
    let phone = userinfo.phone;
    this.setData({phone})
    this.setData({phoneshow:true})
  },


  bindDate(e) {
    let key = e.currentTarget.dataset.key;
    let value = e.detail;
    value = app.validateNumber(value)
    this.setData({
      [key]: value
    })
  },
  cancelPhone(){
    this.setData({phoneshow:false})
  },
  confirmPhone(){
    let {phone} = this.data;
    // console.log(phone)
    // console.log(app.isNull(phone))
    if(app.isNull(phone)){
      return wx.showToast({title: '请输入手机号！',icon:'none',duration:3000});
    }
    this.cancelPhone();
    this.tosum();
    
  },
  tosum() {
    let self = this;
    let {
      choiseList,
      detailId,
      main,
      num,
      phone
    } = this.data;

    let params = {
      timesList: choiseList,
      detailId,phone
    }
    
    http.post('/venueReserved/detail', params, 1).then((res) => {
      // console.log(res)
      if (res.code == 200) {
        let order = res.response[0];
        let {
          bussId,
          oid
        } = order;

        wx.navigateTo({
          url: '/myList/orderpay/orderpay?isOnce=1&bussId=' + bussId + '&oid=' + oid
        })
      }
    })
  },

  // 切换
  tabVenuesList: function (e) {
    let matchId = e.currentTarget.dataset.id;
    let businessHours = e.currentTarget.dataset.businesshours;
    // console.log(businessHours)
    this.setData({
      matchId,
      businessHours,
      choiseList: []
    })
    this.getTabel();
  },
  tabWeek(e) {
    let item = e.currentTarget.dataset.item;
    console.log(item)
    this.setData({
      weekNo: item.weekNo,
      weekTime: item,
      choiseList: []
    })
    this.getTabel();
  },
  bMapTransqqMap(lng, lat) {
    let x_pi = (3.14159265358979324 * 3000.0) / 180.0;
    let x = lng - 0.0065;
    let y = lat - 0.006;
    let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
    let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
    let lngs = z * Math.cos(theta);
    let lats = z * Math.sin(theta);
    return {
      longitude: lngs,
      latitude: lats
    };
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () { 
    let {main:{name},detailId} = this.data;

    return {
      title: name,
      path: '/venuePages/venueDetail/venueDetail?id='+ detailId
    }
  }
})