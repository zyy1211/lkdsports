let Api = require('../../utils/config')
let http = require('../../utils/request')
let bhv_refresh = require('../../pages/component/behavior/bhv_refresh')
let bhv_bottom = require('../../pages/component/behavior/bhv_bottom')
let bhv_search = require('../../pages/component/behavior/bhv_search')
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    condition:'',
    noteShow:false,
    pageSize: 10,
    pageNum: 1,
    status: 20,
    tablist: [{
        name: '进行中',
        value: 20
      },
      {
        name: '已退款',
        value: 40
      }, {
        name: '已结束',
        value: 30
      }
    ],
    apiimg: Api.API_IMG,
    dataList: []
  },
  behaviors: [bhv_refresh, bhv_bottom,bhv_search],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
    app.isLogin(function () {
      self.initData();
    })
  },
  initData() {
    this.getData(0);
  },
  getData(concat) {

    let self = this;
    let {
      status,
      pageSize,
      pageNum,
      condition
    } = this.data;
    self.show();
    http.get('/activities/getActivitiesBySelfJoin', {
      status,
      pageSize,
      pageNum,condition
    }).then((res) => {
      // console.log(res)
      self.hide();
      if (res.code != 200) {
        return
      }
      let main = res.response[0].records;
      let total = res.response[0].total;
      // main = main.map((item) => {
      //   let isApplySign = self.bolapplySign(item.uptoTime,item.participantsNum,item.appliedNum);
      //   item['isApplySign'] = isApplySign;
      //   return item;
      // })
      if (concat == 0) {
        self.setData({
          dataList: main,
          total
        })
        return;
      }
      let dataList = self.data.dataList;
      dataList = dataList.concat(main)
      self.setData({
        dataList,
        total
      })
    })
  },
  tabChange(e) {
    let status = e.currentTarget.dataset.key;
    this.setData({
      status
    });
    this.setData({
      pageNum: 1
    })
    this.initData(0)
  },
  // bolapplySign(uptoTime,participantsNum,appliedNum){
  //   let date  = new Date();
  //   let strap = new Date(uptoTime.replace(/-/g,'/'));
  //   let timer = strap - date;
  //   if(timer > 0){
  //     if(participantsNum != appliedNum){
  //       // console.log(true)
  //       return '2'
  //     }else{
  //       // console.log('空')
  //       return '1'
  //     }
  //   }
  //   // console.log(false)
  //   return '0'

  // },
  toissue_a(e){
    let key = e.currentTarget.dataset.key;
    wx.navigateTo({
      url: '/activityPages/issue_a/issue_a?id='+key,
    })
  },
  bindCancel(e){
    let key = e.currentTarget.dataset.key;
    this.setData({
      ActivityId:key,
      noteShow:true
    })
  },
  noteConfirm(){
    let {ActivityId} = this.data;
    http.post('/activities/cancel',{ActivityId}).then((res) =>{
      console.log(res)
      if(res.data !=200){return};
      
    })
  }

})