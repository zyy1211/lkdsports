let app = getApp();
let http = require('../../utils/request')
let API = require('../../utils/config.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailsImageArr: [],
    detailsText: '',
    apiimg: API.API_IMG
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let issueDetail = JSON.parse(wx.getStorageSync('issueDetail'));
    // console.log(issueDetail)
    let {
      detailsImageArr,
      detailsText
    } = issueDetail;
    delete detailsImageArr.activityId;
    delete detailsImageArr.createTime;
    delete detailsImageArr.id;
    delete detailsImageArr.type;
    delete detailsImageArr.updateTime;
    // console.log(detailsText)
    console.log(detailsImageArr)
    this.setData({
      detailsImageArr,
      detailsText
    })
  },
  bindData(e) {
    // console.log(e)
    let detailsText = e.detail.value;
    this.setData({
      detailsText
    })
  },
  afterRead(event) {
    let self = this;
    let {
      detailsImageArr
    } = self.data;
    let token = wx.getStorageSync('token');
    const {
      file
    } = event.detail;
    console.log(file.path)
    wx.showLoading({
      title: '图片上传中...'
    })
    wx.uploadFile({
      url: API.API_HOST + '/activities/upload',
      header: {
        'token': token,
      },
      filePath: file.path,
      name: 'file',
      success(res) {
        console.log(res);
        let datas = JSON.parse(res.data)
        if (datas.code != 200) {
          if (datas.code == 401) {
            wx.clearStorageSync();
            app.isSession(function () {
              self.afterRead(event)
            });
            return
          } else {
            return wx.showToast({
              title: datas.message,
              icon: 'none',
              duration: 3000
            });
          }
          return
        }
        let urlfile = datas.response[0].url;
        let {
          apiimg
        } = self.data;
        detailsImageArr.push({
          url: apiimg + urlfile,
          deletable: true,
          path: urlfile
        });
        // console.log(detailsImageArr)
        self.setData({
          detailsImageArr
        });
        // console.log(self.data)
      },
      complete: function () {
        wx.hideLoading();
      }
    })
  },
  delectimg(event) {
    let detailsImageArr = this.data.detailsImageArr;
    detailsImageArr.splice(event.detail.index, 1)
    this.setData({
      detailsImageArr
    })
    // console.log(event)

  },
  sure() {
    let {
      detailsText,
      detailsImageArr
    } = this.data;
    // let detailsText = detailsText.split('\n').join('&hc');
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      detailsText,
      detailsImageArr
    })
    this.cancel();
    // console.log(detailsText)
    // console.log(detailsText)
    console.log(detailsImageArr)
  },
  cancel() {
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})