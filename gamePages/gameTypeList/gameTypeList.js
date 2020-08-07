let http = require('../../utils/request')
let Api = require('../../utils/config.js');
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeNames: [1,2],
    activeNamesItem:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    app.isLogin(() =>{
      this.setData({
        gamesId:options.id
      })
      this.getList();
    })
  },

  getList(){
    let self = this;
    let {gamesId} = this.data;
    http.get('/games/pro/group/' +gamesId).then((res) =>{
      // console.log(res)
      if(res.code != 200){
        return
      }
      let main = res.response;
      let single = main.filter((item) =>{
        self.data.activeNamesItem.push(item.id)
        return (item.type < 16 || item.type ==35 )
      })
      let group = main.filter((item) =>{
        return (item.type > 16 && item.type < 41 && item.type != 35 )
      })
      console.log(self.data.activeNamesItem)
      let dataList = [
        {list:single,activity:false,key:1,name:'赛事项目（单打）'},
        {list:group,activity:false,key:2,name:'赛事项目（双打）'}
      ]
      self.setData({dataList})
      // console.log(dataList)

    })
  },
  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },
  onChangeItem(event) {
    this.setData({
      activeNamesItem: event.detail,
    });
  },
  radiochange(event){ 
    let key = event.currentTarget.dataset.key;
    let type = event.currentTarget.dataset.type;
    let num = event.currentTarget.dataset.num;
    let item = event.currentTarget.dataset.item;
    // console.log(item)
    app.setGameItem(item);
    this.setData({ 
      radio: key,
      type,num
    });

  },
  toSignup(e){ 
    let {radio,type,gamesId,num} = this.data;
    // console.log({radio,type,gamesId,num})

    wx.navigateTo({ 
      url: '/gamePages/gameSign/gameSign?id=' + gamesId + '&type=' + type +'&proGroupId=' + radio + '&num=' + num,
    })
  }
})