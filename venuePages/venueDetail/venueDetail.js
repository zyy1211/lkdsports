// activityPages/activityDetail/activityDetail.js

let bhv_back = require('../../pages/component/behavior/bhv_back.js');
let bhv_refresh = require('../../pages/component/behavior/bhv_refresh.js');
let bhv_location = require('../../pages/component/behavior/bhv_location')
let http = require('../../utils/request')
let app = getApp();
let bhv_week = require('../../pages/component/behavior/bhv_week')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    main:{},
    matchId: 0,
    businessHours: '',
    tableData: '',
    detailId:14,
    tb_time:[],
    latitude:'',
    longitude:'',
    choiseList:[]
  },
  behaviors: [bhv_week,bhv_back,bhv_refresh,bhv_location],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
    // this.setData({detailId:options.id})
    app.isLogin(function () {
      self.initData();
      self.getweek()
  })

  },
  initData(){
    // this.getAuthorLocation()
    let self = this;
    this.selectComponent("#authorize").getAuthorizeLocation((loca) =>{
      let longitude = loca.longitude;
      let latitude = loca.latitude;
      self.setData({
        latitude,
        longitude
      })
      self.getDetail()
    })
  },
  getDetail(){
    let self = this;
    let {detailId,latitude,longitude}  = self.data;
    http.get('/venue/detail',{detailId,latitude,longitude}).then((res) =>{
      if(res.code != 200){
        return;
      }
      let main = res.response[0];
      // console.log(main)
      let matchId = main.matchVoList[0].id;
      let businessHours = main.matchVoList[0].businessHours;
      self.setData({main,matchId,businessHours})
      self.getTabel();
    })
  },
  getTabel() {
    let self = this;
    let {detailId,matchId,weekNo} = this.data;
    http.get('/venue/field',{detailId,matchId,weekNo}).then((res)=>{
      if(res.code != 200){
        return;
      }
      let tablemain = res.response[0];
      self.formatData(tablemain)

      // console.log(JSON.stringify(tablemain))
    })
  },
  // 切换
  tabVenuesList: function (e) {
    let matchId = e.currentTarget.dataset.id;
    let key = e.currentTarget.dataset.key;
    this.setData({
      [key]: matchId
    })
    let businessHours = e.currentTarget.dataset.businessHours;
    if(!app.isNull(businessHours)){
      this.setData({businessHours})
    }
    console.log('fs')
    this.getTabel();
  },
  choiseBlock(e){
    console.log(e.currentTarget.dataset)
    let item = e.currentTarget.dataset.itm;
    let name = e.currentTarget.dataset.name;
    let end = (item.dataCode.split('-')[1])*1 ;
    let start =  (item.dataCode.split('-')[1])*1 -1;
    if(!app.isNull(item.merge)){
      let mg = (item.merge.split('-')[2])*1;
      end = start + mg;
    }
    console.log(start +':00'+ '-' + end +':00')
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return{
      title:'自定义标题',
      path: '/activityPages/activityDetail/activityDetail',
      imageUrl:'http://192.168.0.200:8091/user/actSharePic/1'
    }
  }
})