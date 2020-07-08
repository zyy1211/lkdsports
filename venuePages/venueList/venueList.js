// venuePages/venueList/venueList.js
let bhv_refresh = require('../../pages/component/behavior/bhv_refresh')
let bhv_bottom = require('../../pages/component/behavior/bhv_bottom')
let http = require('../../utils/request')
let app =  getApp();
let Api = require('../../utils/config')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    apiimg:Api.API_IMG,
    sportType:'',
    name:'',
    dataList:[],
    optionsDate: [],
    pageSize:10,
    pageNum:1,
  },
  behaviors: [bhv_refresh,bhv_bottom],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
    app.isLogin(() =>{
      self.getSportType();
      self.initData(); 
    })
  },
  getData(concat){
    let self = this;
    self.show();
    let {latitude,longitude,name,sportType,pageSize,pageNum} = this.data;
    http.get('/venue/venueList',{latitude,longitude,name,sportType,pageSize,pageNum}).then((res)=>{
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
  getSportType(){
    let self = this;
    http.get('/venue/sportType').then((res) =>{
      console.log(res)
      if(res.code !=200){return}
      let main = res.response[0];
      let optionsDate = main.map(item =>{
        return {'text':item,'value':item}
      })
      self.setData({optionsDate:[{text:'运动类型',value:''},...optionsDate]})
    })
  },
  changeName(e){
    let key = e.currentTarget.dataset.key;
    this.setData({[key]:e.detail})
    this.setData({pageNum:1})
    this.getData(0)

  },
})