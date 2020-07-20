// activityPages/activityDetail/activityDetail.js

let bhv_back = require('../../pages/component/behavior/bhv_back.js');
let bhv_refresh = require('../../pages/component/behavior/bhv_refresh.js');
let bhv_location = require('../../pages/component/behavior/bhv_location')
let http = require('../../utils/request')
let bhv_week = require('../../pages/component/behavior/bhv_week')
let app = getApp();

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
    num: 0
  },
  behaviors: [bhv_week, bhv_back, bhv_refresh, bhv_location],

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
      self.getweek()
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
      weekNo
    } = this.data;
    http.get('/venue/field', {
      detailId,
      matchId,
      weekNo
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
  tosum() {
    let self = this;
    let {
      choiseList,
      detailId,
      main,
      num
    } = this.data;
    let params = {
      timesList: choiseList,
      detailId
    }
    http.post('/venueReserved/detail', params, 1).then((res) => {
      // console.log(res)
      if (res.code == 200) {
        let order = res.response[0];
        let {
          bussId,
          oid
        } = order;
        // wx.setStorageSync('order',JSON.stringify({bussId,oid,isOnce:1}))
        // wx.setStorageSync('orderphone',JSON.stringify({
        //   contactNumber:main.contactNumber,
        //   locationAddress:main.locationAddress,
        //   name:main.name
        // }))
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
    this.setData({
      weekNo: item.weekNo,
      weekTime: item,
      choiseList: []
    })
    this.getTabel();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let stap = new Date();

    return {
      title: '自定义标题',
      path: '/activityPages/activityDetail/activityDetail',
      imageUrl: 'http://192.168.0.200:8091/user/actSharePic/35?'+ stap
    }
  }
})