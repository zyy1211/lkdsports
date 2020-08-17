let http = require('../../utils/request')
let Api = require('../../utils/config.js');
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {  
    activeNames: [0,1,2],
    activeNamesItem:[11],
    phoneshow:false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
      if(res.code != 200){
        return
      }
      let main = res.response;
      let group = main.filter((item) =>{
        return item.ruleType == 20;
        // return (item.type > 16 && item.type < 41 && item.type != 35 )
      })
      let single = main.filter((item) =>{
        self.data.activeNamesItem.push(item.id);
        if(item.type < 16 || item.type ==35){
          item.key = 1;
        }else if(item.type == 60){
          item.key = 3;
        }else{
          item.key = 2;
        }
        return item.ruleType == 10;
        // return (item.type < 16 || item.type ==35 )
      })


      let dataList = [
        {list:single,activity:false,key:2,name:'单项赛'},
        {list:group,activity:false,key:1,name:'团体赛'}
      ]
      // console.log(dataList)
      self.setData({dataList})
    })
  },
  onChange(event) {
    console.log(event.detail)
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
    console.log(event.currentTarget.dataset)
    let key = event.currentTarget.dataset.key;
    let type = event.currentTarget.dataset.type;
    let num = event.currentTarget.dataset.num;
    let item = event.currentTarget.dataset.item;
    app.setGameItem(item);
    this.setData({ 
      radio: key,
      type,num
    });

  },
  togroup(){
    let {radio:proGroupId,radio,type,gamesId,num} = this.data;
    // console.log(proGroupId)
    let pat = {radio,type,gamesId,num}
    wx.navigateTo({
      url: '/gamePages/grouplist/grouplist?proGroupId=' + proGroupId + '&pat=' + JSON.stringify(pat),
    })
  },
  toSignup(e){ 
    let {radio,type,gamesId,num} = this.data;
    if(num != 3){
     return wx.navigateTo({ 
        url: '/gamePages/gameSign/gameSign?id=' + gamesId + '&type=' + type +'&proGroupId=' + radio + '&num=' + num,
      })
    }
    this.setData({phoneshow:true})
  },
  bindDate(e) {
    let key = e.currentTarget.dataset.key;
    let value = e.detail;
    if(key == 'phone'){
      value = app.validateNumber(value)
    }
    this.setData({
      [key]: value
    })
  },

  cancelPhone(){
    this.setData({phoneshow:false})
  },
  confirmPhone(){
    let {phone,name,title} = this.data;
    if(app.isNull(phone)){
      return wx.showToast({title: '请输入手机号！',icon:'none',duration:3000});
    }
    if(app.isNull(name)){
      return wx.showToast({title: '请输入创建者姓名！',icon:'none',duration:3000});
    }
    if(app.isNull(title)){
      return wx.showToast({title: '请输入队伍名称！',icon:'none',duration:3000});
    }
    this.cancelPhone();
    this.cteam();
  },
  cteam(){
    let {  gamesId,phone,name,title,radio:proGroupId  } = this.data;
    http.post('/games/cteam',{ gamesId,phone,name,title,proGroupId },1).then((res) =>{
      console.log(res)
      let { proGroupId} = res.response[0];
      let {radio,type,gamesId,num} = this.data;
      let pat = {radio,type,gamesId,num}
      wx.navigateTo({
        url: '/gamePages/grouplist/grouplist?proGroupId=' + proGroupId + '&pat=' + JSON.stringify(pat),
      })
    })
  }
})