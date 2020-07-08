// pages/personalAuthentication/personalAuthentication.js
let app = getApp();
let util = require('../../utils/util');
let http = require('../../utils/request');
let API = require('../../utils/config.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    apiimg: API.API_IMG,
    option1: [{
      text: '男',
      value: 0
    }, {
      text: '女',
      value: 1
    }],
    gender: 1
  },

  chargeChange(e) {
    let value = e.detail;
    this.setData({
      gender: value
    })
  },

  afterRead(event) {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
    app.isLogin(function () {
      self.getDetail();
    })
  },
  getDetail() {
    let self = this;
    let {
      apiimg
    } = self.data;
    http.get('/authentication/getAuthentication').then((res) => {
      console.log(res)
      if (res.code != 200) {
        return
      }
      let main = res.response[0];
      let {
        authentication,
        authenticationExtd,
        businessLicense,
        dataStatus,
        fullFacePhoto,
        reversePhoto
      } = main;
      let {
        address,
        businessLicenseId,
        endTime,
        enterpriseName,
        gender,
        name,
        phone,
        startTime,
        status,
        venueAddress,
        venueName,
        wechat,
        id
      } = authentication;
      let {
        businessLicenseNumber,
        fullFacePhotoId,
        legalPersonCardid,
        legalPersonName,
        legalPersonPhone,
        reversePhotoId,
        id: extdId
      } = authenticationExtd;
      console.log(businessLicense)

      let statusText = '';
      if (dataStatus == 1) {
        statusText = '审核中'
      } else if (dataStatus == 2) {
        statusText = '审核不通过'
      } else if (dataStatus == 3) {
        statusText = '审核通过'
      } else if (dataStatus == 0) {
        statusText = '待入驻'
      }
      this.setData({
        id,
        extdId,
        address,
        businessLicenseId,
        endTime,
        enterpriseName,
        gender,
        name,
        phone,
        startTime,
        status,
        venueAddress,
        venueName,
        wechat,
        businessLicenseNumber,
        fullFacePhotoId,
        legalPersonCardid,
        legalPersonName,
        legalPersonPhone,
        reversePhotoId,
        businessLicense,
        dataStatus,
        fullFacePhoto,
        reversePhoto
      })
    })
  },
  bindDate(e) {
    let key = e.currentTarget.dataset.key;
    let value = e.detail;
    if (key == 'legalPersonPhone' || key == 'phone' || key == 'startTime' || key == 'endTime') {
      value = app.validateNumber(value)
    }
    this.setData({
      [key]: e.detail
    })
  },
  valEmpty(key, value) {
    let text = '不能为空'
    let msgdata = {
      address: '企业地址' + text,
      businessLicense: '营业执照照片' + text,
      businessLicenseNumber: '统一社会信用代码' + text,
      code: '验证码' + text,
      enterpriseName: '企业全称' + text,
      fullFacePhoto: '法人身份证正面照路径' + text,
      legalPersonCardid: '法人身份证号' + text,
      legalPersonName: '法人姓名' + text,
      legalPersonPhone: '法人联系电话' + text,
      name: '姓名' + text,
      phone: '联系电话' + text,
      reversePhoto: '法人身份证反面照路径' + text,
      venueAddress: '场馆地址' + text,
      venueName: '场馆名称' + text,
      wechat: '微信号' + text,
    }
    if (app.isNull(value)) {
      console.log(key)
      let title = msgdata[key];
      console.log(title)
      wx.showToast({
        title: title,
        icon: 'none',
        duration: 3000
      });
      return false
    }
    return true

  },
  submit() {
    let self = this;
    let {
      dataStatus
    } = self.data;
    if (dataStatus == 1 || dataStatus == 3) {
      return
    }
    let {
      address,
      businessLicense,
      businessLicenseNumber,
      code,
      endTime,
      enterpriseName,
      extdId,
      fullFacePhoto,
      gender,
      id,
      legalPersonCardid,
      legalPersonName,
      legalPersonPhone,
      name,
      phone,
      reversePhoto,
      startTime,
      venueAddress,
      venueName,
      wechat,
    } = this.data;

     if(!self.valEmpty('address', address)){return}
     if(!self.valEmpty('businessLicense', businessLicense)){return}
     if(!self.valEmpty('businessLicenseNumber', businessLicenseNumber)){return}
     if(!self.valEmpty('code', code)){return}
     if(!self.valEmpty('enterpriseName', enterpriseName)){return}
     if(!self.valEmpty('fullFacePhoto', fullFacePhoto)){return}
     if(!self.valEmpty('legalPersonCardid', legalPersonCardid)){return}
     if(!self.valEmpty('legalPersonName', legalPersonName)){return}
     if(!self.valEmpty('legalPersonPhone', legalPersonPhone)){return}
     if(!self.valEmpty('name', name)){return}
     if(!self.valEmpty('phone', phone)){return}
     if(!self.valEmpty('reversePhoto', reversePhoto)){return}
     if(!self.valEmpty('venueAddress', venueAddress)){return}
     if(!self.valEmpty('venueName', venueName)){return}
     if(!self.valEmpty('wechat', wechat)){return}

    let params = {
      address,
      businessLicense,
      businessLicenseNumber,
      code,
      endTime,
      enterpriseName,
      extdId,
      fullFacePhoto,
      gender,
      id,
      legalPersonCardid,
      legalPersonName,
      legalPersonPhone,
      name,
      phone,
      reversePhoto,
      startTime,
      venueAddress,
      venueName,
      wechat
    }
    console.log(params)
    http.post('/authentication/settlement', params, 1).then((res) => {
      console.log(res)
      if (res.code != 200) {
        return
      }
      wx.navigateBack({
        detail: 1
      })
    })
  },
  getcode() {
    let {
      phone
    } = this.data;
    http.get('/authentication/sendCode/' + phone).then((res) => {
      console.log(res)
    })
  },
  choiseImg(e) {

    let self = this;
    let {
      dataStatus
    } = self.data;
    if (dataStatus == 1 || dataStatus == 3) {
      return
    }
    let keys = e.currentTarget.dataset.key;
    let token = wx.getStorageSync('token');
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.compressImage({
          src: res.tempFilePaths[0],
          quality: 80,
          success: function (tpm) {
            // tpm.tempFilePath
            wx.showLoading({
              title: '图片上传中...'
            })
            wx.uploadFile({
              url: API.API_HOST + '/activities/upload',
              header: {
                'token': token,
              },
              filePath: tpm.tempFilePath,
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
                self.setData({
                  [keys]: urlfile
                });
              },
              complete: function () {
                wx.hideLoading();
              }
            })
          }
        })
      },
      fail: function (res) {

      }
    })

  }

})