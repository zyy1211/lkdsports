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
    // apiimg:Api.img_host,
    apiimg:'https://image.likedong.top',
    active:0
  },
  behaviors: [bhv_back, bhv_refresh, bhv_location],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.isLogin(() =>{
      this.setData({id:options.id});
      this.getDetail();
    })
  },
  getDetail(){
    let self = this;
    let {id } = this.data;
    http.get('/games/detail/' + id).then((res) =>{
      console.log(res);
      if(res.code != 200){
        return
      }
      let main = res.response[0];
      self.setData({main})
    });
    // type   20: 详情图 30：名单公示 40：抽签公示 50：举报图片
    http.post('/games/images',{gamesId:id,type:20},1).then((res) =>{
      // console.log(res)
      if(res.code != 200){
        return
      }
      self.setData({imgList:res.response})
    })

  },
  togameTypeList() {
    let {id} = this.data;
    wx.navigateTo({
      url: '/gamePages/gameTypeList/gameTypeList?id=' + id,
    })
  },
})