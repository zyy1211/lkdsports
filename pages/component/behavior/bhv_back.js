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
      console.log(rout)
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
        // console.log(top)
        let isop = Math.abs((top / 1000).toFixed(1));
        // console.log(top)
        // console.log((Math.abs(top)));

        if (Math.abs(top) > 180) {
          // console.log(opacity)
          // console.log(isop)
          if (opacity != 1 && opacity != isop) {
            // console.log('我是1')
            self.setData({
              opacity: 1
            })
          }
          return
        }
        if (Math.abs(top) < 100 && opacity != 0 && opacity != isop) {
          // console.log('我是0')
          self.setData({
            opacity: 0
          })
          return
        }
        if (opacity != isop) {
          // console.log('变')
          // console.log(opacity)
          // console.log(isop)
          self.setData({
            opacity: isop
          })
        }

        //   console.log(top)
        //   // let {padtop} = self.data;
        //   let {opacity,height} = self.data;
        //   // console.log(top)
        //   if((top < height/3*2 ) && opacity != 1){
        //     // let {height} = self.data;
        //     // self.setData({padtop:height})
        //     // console.log('fsfsfs')
        //     self.setData({opacity:1,padtop:height})
        //     return
        //   }
        //   if(top >50 && opacity != 0){
        //     // self.setData({padtop:0})
        //     self.setData({opacity:0,padtop:0})
        //   }
      }).exec()
    },
  },

})