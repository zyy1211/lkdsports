// activityPages/issue_a/issue_a.js
let app = getApp();
let http = require('../../utils/request')
let toggle = require('./toggle')
let API = require('../../utils/config.js');
let bhv_location = require('../../pages/component/behavior/bhv_location')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    penalSum: 30,
    apiimg: API.API_IMG,
    skuTypeListArr: [],
    withPeople: 0,
    isOpen: 0,
    isPenal: 0,
    detailsImageArr: [],
    pickkey: '',
    numBol: false,
    sportTypeList: [],
    typeId: '',
    start: 0,
    end: 600,
    moreStart: 0,
    moreEnd: 500,
    isBlock: true,
    isMore: true,
    imagePath: '',
    headImage: '',
    defalutTab: [{
        name: '免费提供热茶水',
        checked: true
      },
      {
        name: '免费停车',
        checked: true
      },
      {
        name: '免费提供球',
        checked: true
      },
      {
        name: '免费提供饮用水',
        checked: true
      },
      {
        name: '免费零食',
        checked: true
      }
    ],
    chargeMode: 10,
    option1: [{
        text: '报名时收费',
        value: 10
      },
      {
        text: '免费',
        value: 0
      },
      {
        text: '线下收费',
        value: 20
      },
      {
        text: 'AA收费',
        value: 30
      },
    ],
    dialogShow: true,
    years: [1, 2, 3, 4, 5, 6, 7, 8]
  },
  behaviors: [toggle, bhv_location],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.pickList)
    let self = this;
    app.isLogin(function () {
      self.getType();
      self.getSku();
      let userinfo = app.getInfo();
      // console.log(userinfo)
      self.setData({
        contactName: userinfo.nickname,
        phoneNum: userinfo.phone
      })
    })
  },

  chooseImage: function (e) {
    let self = this;
    wx.showLoading({
      title: '图片加载中...'
    })
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.navigateTo({
          url: '/activityPages/img-cropper/img-cropper?imgSrc=' + res.tempFilePaths[0]
        })
      },
      fail: function (res) {},
      complete: function () {
        wx.hideLoading();
      }
    })
  },
  switchDate(e) {
    console.log(e)
    let key = e.currentTarget.dataset.key;
    let value = e.detail;
    this.setData({
      [key]: value
    })
  },
  bindDate(e) {
    let key = e.currentTarget.dataset.key;
    let value = e.detail;
    if (key == 'participantsNum' || key == 'phoneNum') {
      value = app.validateNumber(value)
    }
    this.setData({
      [key]: value
    })
  },
  bindDateArr(e) {
    let {
      arr,
      index,
      key
    } = e.currentTarget.dataset;
    let keys = [arr] + '[' + index + '].' + key;
    let value;
    if (key == 'maxNum') {
      value = app.validateNumber(e.detail);
    } else {
      value = app.validateFixed(e.detail);
    }
    this.setData({
      [keys]: value
    })
    // console.log(this.data.skuTypeListArr)
  },

  toIssue_detail() {
    let {detailsImageArr,detailsText} = this.data;
    console.log(detailsImageArr)
    console.log(detailsText)
    wx.setStorageSync('issueDetail', JSON.stringify({detailsImageArr,detailsText}))
    wx.navigateTo({
      url: '/activityPages/issueDetail/issueDetail',
    })
  },

  uploadImg(url, key) {
    let self = this;
    let token = wx.getStorageSync('token');
    console.log(url)
    wx.uploadFile({
      url: API.API_HOST + '/activities/upload',
      header: {
        'token': token,
      },
      filePath: url,
      name: 'file',
      success(res) {
        console.log(res);
        let data = JSON.parse(res.data)
        if (data.code != 200) {
          if (data.code == 401) {
            wx.clearStorageSync();
            app.isSession(function () {
              self.uploadimg(url, key)
            });
            return
          }
          return wx.showToast({
            title: data.message,
            icon: 'none',
            duration: 3000
          });
        }
        let urlfile = data.response[0].url;
        self.setData({
          [key]: urlfile
        })
      }
    })
  },

  getType() {
    let self = this;
    http.get('/activities/getActivitiesType').then((res) => {
      // console.log(res)
      if (res.code != 200) {
        return;
      }
      let sportTypeList = res.response[0];
      let type = sportTypeList.category10[0];
      let typeId = type.id;
      self.setData({
        sportTypeList,
        type,
        typeId
      })
    })
  },
  getSku() {
    let self = this;
    http.get('/activities/getSku').then((res) => {
      // console.log(res)
      if (res.code != 200) {
        return;
      }
      let main = res.response[0];
      let skuTypeListArr = main.map((item, index) => {
        if (index < 2) {
          return {
            ...item,
            checked: true,
            maxNum: '',
            price: ''
          }
        }
        return {
          ...item,
          checked: false,
          maxNum: '',
          price: ''
        }
      })
      self.setData({
        skuTypeListArr
      })
    })
  },
  // 选择
  togg_tag(e) {
    let key = e.currentTarget.dataset.key;
    let index = e.currentTarget.dataset.index;
    let sku = e.currentTarget.dataset.sku;
    let iskey = key + "[" + index + "].checked";
    let value = this.data[key][index].checked;
    if (sku) {
      // console.log(this.data[key])
      let {
        skuTypeListArr
      } = this.data;
      let skuListArr = skuTypeListArr.filter((item) => item.checked == false)
      // console.log(skuListArr)
      if (skuListArr.length > 1 && value == true) {
        return wx.showToast({
          title: 'sku不能全部取消',
          icon: 'none',
          duration: 3000
        });
      }
    }
    this.setData({
      [iskey]: !value
    })
  },
  // 运动类型
  choiseTab(e) {
    let type = e.currentTarget.dataset.key;
    this.setData({
      type,
      typeId: type.id
    })
  },

  // 添加标签
  addtag: function () {
    let self = this;
    self.setData({
      dialogShow: false,
    })
  },

  closeAddModal: function () {
    let self = this;
    self.setData({
      dialogShow: true,
    })
  },
  tapDialogButton(e) {
    let self = this;
    let {
      defalutTab,
      tagName
    } = self.data;
    if (app.isNull(tagName)) {
      return wx.showToast({
        title: '标签内容不能为空',
        icon: 'none'
      })
    }
    defalutTab.push({
      name: self.data.tagName,
      checked: true
    });
    self.setData({
      defalutTab
    })
    self.setData({
      dialogShow: true,
      tagName: ''
    })
  },

  usernameInput(e) {
    let tagName = e.detail.value;
    this.setData({
      tagName
    })
  },
  changeNum() {
    let {
      numBol
    } = this.data;
    this.setData({
      numBol: !numBol
    })
  },
  penalChange(e) {
    // console.log(e);
    this.setData({
      penalSum: e.detail
    })
  },
  showPicker(e) {
    let key = e.currentTarget.dataset.key;
    let value = this.data[key];
    this.setData({
      currentPicker: key
    })
    if (app.isNull(value)) {
      let {
        today
      } = app.globalData;
      // let date = new Date();
      console.log(app.globalData.today)
      this.selectComponent("#lkdpicker").showpicker(today.today, today.toTime);
      return;
    }
    // console.log(value)
    let day = value.substring(3, 13);
    let time = value.substr(-5, 5);
    this.selectComponent("#lkdpicker").showpicker(day, time);
    console.log(day)
    console.log(time)
  },
  choisePicker(item) {
    console.log(item)
    let {
      currentPicker
    } = this.data;
    let {
      day,
      hour,
      minute
    } = item.detail;
    let time = day.week + ' ' + day.time + ' ' + hour + ':' + minute;
    this.setData({
      [currentPicker]: time
    })
  },
  chargeChange(e) {
    console.log(e)
    let value = e.detail;
    this.setData({
      chargeMode: value
    })
  },
  showToasts(test) {
    return wx.showToast({
      title: test + '不能为空',
      icon: 'none'
    })
  },
  submitActive() {
    let self = this;
    let {
      addressLatitude,
      addressLongitude,
      cancelTime,
      chargeMode,
      contactName,
      endTime,
      headImage,
      isOpen,
      isPenal,
      location,
      participantsNum,
      phoneNum,
      skuTypeListArr,
      startTime,
      title,
      typeId,
      uptoTime,
      venueName,
      withPeople,
      detailsImageArr,
      detailsText,
      filedNo,
      penalSum,
      venueId,
      vxNum,
      defalutTab,
      numBol,

    } = this.data;
    // console.log(numBol)
    // console.log(skuTypeListArr)
    if (app.isNull(headImage)) {
      return self.showToasts('活动主图')
    }
    if (app.isNull(typeId)) {
      return self.showToasts('活动类型')
    }
    if (app.isNull(title)) {
      return self.showToasts('活动标题')
    }
    if (app.isNull(venueName)) {
      return self.showToasts('场馆名称')
    }
    if (app.isNull(location)) {
      return self.showToasts('场馆地址')
    }
    if (app.isNull(filedNo)) {
      return self.showToasts('场地号')
    }
    if (!numBol && app.isNull(participantsNum)) {
      return self.showToasts('总人数')
    }
    if (numBol) {
      let isn = skuTypeListArr.some((item) => {
        return (app.isNull(item.maxNum) == true && item.checked == true)
      })
      if (isn) {
        return self.showToasts('人数限制')
      }
      participantsNum = null;
    }
    if (chargeMode == 10) {
      let isn = skuTypeListArr.some((item) => {
        return (app.isNull(item.price) == true && item.checked == true)
      })
      if (isn) {
        return self.showToasts('报名费用金额')
      }
    }

    if (app.isNull(contactName)) {
      return self.showToasts('联系人')
    }
    if (app.isNull(phoneNum)) {
      return self.showToasts('联系电话')
    }
    if (app.isNull(startTime)) {
      return self.showToasts('活动开始时间')
    }
    if (app.isNull(endTime)) {
      return self.showToasts('活动结束时间')
    }
    if (app.isNull(detailsText) && detailsImageArr.length == 0) {
      return self.showToasts('活动详情')
    }

    let tag = '';
    defalutTab.forEach((item) => {
      if (item.checked == true) {
        tag = tag + item.name + ','
      }
    });
    if (app.isNull(uptoTime)) {
      uptoTime = startTime;
    }
    if (app.isNull(cancelTime)) {
      cancelTime = startTime;
    }
    startTime = startTime.substr(3);
    endTime = endTime.substr(3);
    uptoTime = uptoTime.substr(3);
    cancelTime = cancelTime.substr(3);
    let detailsImage = [];
    detailsImageArr.forEach((item) => {
      detailsImage.push(item.path)
    })
    let skuTypeList = skuTypeListArr.filter((item) =>{
      return item.checked == true
    })
    let params = {
      addressLatitude,
      addressLongitude,
      cancelTime,
      chargeMode,
      contactName,
      endTime,
      headImage,
      isOpen,
      isPenal,
      location,
      participantsNum,
      phoneNum,
      skuTypeList,
      startTime,
      title,
      typeId,
      uptoTime,
      venueName,
      withPeople,
      detailsImage,
      detailsText,
      filedNo,
      penalSum,
      venueId,
      vxNum,
      numBol,
      tag
    }
    console.log(params)
    http.post('/activities/release', params, 1).then((res) => {
      console.log(res)
    })
  },
})