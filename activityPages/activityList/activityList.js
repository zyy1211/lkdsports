// activityPages/activityList/activityList.js
let http = require('../../utils/request')
let Api = require('../../utils/config.js');
let bhv_refresh = require('../../pages/component/behavior/bhv_refresh')
let bhv_bottom = require('../../pages/component/behavior/bhv_bottom')
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

    apiimg:Api.API_IMG,
    dataList:[],
    pageSize:10,
    pageNum:1,
    date:'',
    distance: '',
    sportTypeId:'',
    optionsDate: [{
      text: '日期',
      value: ''
    }, ],
    addressList: [{
        text: '距离',
        value: ''
      },
      {
        text: '附近',
        value: 3
      },
      {
        text: '10KM',
        value: 10
      },
      {
        text: '20KM',
        value: 20
      },
    ],
    selectType: [{
      text: '活动类型',
      value: ''
    }, ],
  },
  behaviors: [bhv_refresh,bhv_bottom],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
    app.isLogin(function () {
      self.getSelectData();
      self.initData();
    })

  },
  getData(concat){
    let self = this; 
    self.show();
    let {latitude,longitude,sportTypeId,distance,date,pageSize,pageNum} = this.data;
    http.get('/activities/activitiesList',{latitude,longitude,sportTypeId,distance,date,pageSize,pageNum}).then((res)=>{
      // console.log(res)
      self.hide();
      if(res.code !=200){
        return
      }
      let main = res.response[0].records;
      let total = res.response[0].total;
      if(concat == 0){
        self.setData({dataList:main,total})
        return;
      }
      let dataList = self.data.dataList;
      dataList = dataList.concat(main)
      self.setData({dataList,total})
    })
  },
  initData(){
    let self = this;
    this.selectComponent("#authorize").getAuthorizeLocation((location) =>{
      // console.log(location)
      let latitude = location.latitude;
      let longitude = location.longitude;
      this.setData({latitude,longitude})
      self.getData(0);
    });
  },
  getSelectData() {
    let self = this;
    let {
      optionsDate,
      selectType
    } = this.data;
    let activityTimeList = app.globalData.activityTimeList;
    activityTimeList.forEach((item) => {
      item['text'] = item.tmShow;
      item['value'] = item.time;
    })

    optionsDate = optionsDate.concat(activityTimeList);
    self.setData({
      optionsDate: optionsDate
    })
    http.get('/activities/getActivitiesType').then((res) => {
      console.log(res)
      if (res.code != 200) {
        return
      }
      let main = res.response[0];
      let typeList = [
        ...main.category10,
        ...main.category20,
        ...main.category30
      ]
      typeList.forEach((item) => {
        item['text'] = item.title;
        item['value'] = item.id;
      })
      selectType = [...selectType,...typeList]
      self.setData({
        selectType
      })
      // console.log(self.data.selectType)

    })
  },
  tabsChange(e) {
    let key = e.currentTarget.dataset.key;
    this.setData({
      [key]: e.detail
    });
    this.setData({pageNum:1})
    this.getData(0)
  },
  // 防止穿透
  _touchmove: function() {},

})