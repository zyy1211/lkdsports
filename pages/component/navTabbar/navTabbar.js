const tabbar_config = require('./tabbarConfig.js')
let App = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    activeIndex: {
      type: Number,
      value: 0, //默认当前选中第一项
    },
  },
  created() {
    wx.hideTabBar({
      aniamtion: false,
      fail() {
        setTimeout(function () {
          wx.hideTabBar({
            aniamtion: false
          })
        }, 500)
      }
    })
  },
  ready() {
    wx.hideTabBar({
      aniamtion: false,
      fail() {
        setTimeout(function () {
          wx.hideTabBar({
            aniamtion: false
          })
        }, 500)
      }
    });
  },


  /**
   * 组件的初始数据
   */
  data: {
    ...tabbar_config,
    showAddModal: !1,
    dataList: [{
      pagePath: "/activityPages/issue_a/issue_a",
      text: "活动发布",
      iconPath: "/static/m_huod.png",
      type: "activity"
    }]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickTag(e) {
      let index = e.currentTarget.dataset.index;
      if (index != 1) {
        this.changeTag(index);
        return;
      }
      this.bindShowAddModal();
    },

    bindShowAddModal: function (e) {
      if (this.data.animation) {
        this.setData({
          showAddModal: !1,
          animation: !1
        })
        return;
      }
      this.setData({
        showAddModal: !0,
        animation: !0
      })
    },
    catchTap: function () {
      return !1;
    },
    // 防止穿透
    _touchmove: function () {},
    navigateToPublish: function (e) {
      let self = this;
      this.bindShowAddModal();
      let url = e.currentTarget.dataset.url;
      App.isLogin(function () {
        wx.navigateTo({
          url: url
        })
      })

    },
    // 特定需求
    clickPlus() {
      this.changeTag(1)
    },
    changeTag(idx) {
      if (idx == this.data.activeIndex)
        return;
      let pageUrl = this.data.tabs[idx].data
      // 特定需求
      if (idx === 1) {
        wx.navigateTo({
          url: pageUrl,
        })
      } else {
        wx.switchTab({
          url: pageUrl,
        })
      }
    }
  }
})