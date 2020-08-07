let app = getApp();
module.exports = Behavior({
  data: {
    opacity: 0,
    barHeight: app.globalData.barHeight,
    height: app.globalData.height,
  },
  methods: {
    backhome() {
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2];
      let rout = '';
      if (!app.isNull(prevPage)) {
        rout = prevPage.route;
      }
      // console.log(rout)
      if (!app.isNull(rout)) {
        wx.navigateBack({
          delta: 1, // 回退前 delta(默认为1) 页面
        })
        return;
      }
      wx.switchTab({
        url: '/pages/home/home',
      })
    },
    onPageScroll(e) {
      let self = this;
      wx.createSelectorQuery().select('#lkdnav').boundingClientRect(function (rect) {
        let top = rect.top;
        let {
          opacity
        } = self.data;
        let isop = Math.abs((top / 1000).toFixed(1));
        if (Math.abs(top) > 180) {
          if (opacity != 1 && opacity != isop) {
            self.setData({
              opacity: 1
            })
          }
          return
        }
        if (Math.abs(top) < 100 && opacity != 0 && opacity != isop) {
          self.setData({
            opacity: 0
          })
          return
        }
        if (opacity != isop) {

          self.setData({
            opacity: isop
          })
        }
      }).exec()
    },
  },

})