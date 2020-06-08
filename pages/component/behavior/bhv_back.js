let app = getApp();
module.exports = Behavior({
  data: {
    opacity:0,
    barHeight:app.globalData.barHeight,
    height:app.globalData.height,
  },
  methods: {
    backhome(){
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2];
      let rout = '';
      if (!app.isNull(prevPage)){
        rout = prevPage.route;
      }
      console.log(rout)
      if (!app.isNull(rout)){
        wx.navigateBack({
          delta: 1, // 回退前 delta(默认为1) 页面
        })
        return;
      }
      wx.switchTab({
        url: '/pages/home/home',
      })
    },
    onPageScroll(e){
      let opacity = e.scrollTop/100;
      this.setData({opacity})
    },
  },

})