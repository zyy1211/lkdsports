let app = getApp();
module.exports = Behavior({
  data: {},
  methods: {
    onPullDownRefresh: function () {
      // console.log('fs')
      let self = this;
      setTimeout(() => {
        wx.stopPullDownRefresh();
      }, 300);

      if (!app.isNull(this.data.pageNum)) {
        this.setData({
          pageNum: 1
        })
      }
      // app.isNull(this.pageNum)
      self.initData();
    },
    toDetail(e) {
      let id = e.currentTarget.dataset.id;
      // console.log(id)
      let url = e.currentTarget.dataset.url;
      wx.navigateTo({
        url: url + '?id=' + id,
      })
      // console.log(e)
    },
    show(){
      this.setData({isAlert:true})
    },
    hide(){
      setTimeout(() => {
        this.setData({isAlert:false})
      }, 200);

    }
  },

})