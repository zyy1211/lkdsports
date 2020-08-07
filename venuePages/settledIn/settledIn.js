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
    currentDate: '',
    showstart: false,
    showend: false,
    startTime: '',
    endTime: '',
    phone: '',
    apiimg: API.API_IMG,
    stv: 60,
    timer: '',
    option1: [{
      text: '男',
      value: 0
    }, {
      text: '女',
      value: 1
    }],
    gender: 0
  },

  chargeChange(e) {
    let value = e.detail;
    this.setData({
      gender: value
    })
  },
  onClose() {
    this.setData({
      showstart: false,
      showend: false
    })
  },
  choiseStart() {
    let {
      dataStatus
    } = this.data;
    if (dataStatus == 1 || dataStatus == 3) {
      return
    }
    this.setData({
      showstart: true
    })
  },
  choiseEnd() {
    let {
      dataStatus
    } = this.data;
    if (dataStatus == 1 || dataStatus == 3) {
      return
    }
    this.setData({
      showend: true
    })
  },

  confirmStart(event) {
    console.log(event)
    this.setData({
      showstart: false,
      startTime: this.formatDate(event.detail),
    });
  },
  confirmEnd(event) {
    this.setData({
      showend: false,
      endTime: this.formatDate(event.detail),
    });
  },
  formatDate(date) {
    date = new Date(date);
    return `${date.getFullYear()}-${(date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)}-${(date.getDate()) > 9 ? date.getDate() : '0'+ date.getDate()}`;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
    self.setData({
      currentDate: new Date().getTime()
    })
    self.show();
    app.isLogin(function () {
      self.getDetail();
    })
  },
  getDetail() {
    let self = this;
    http.get('/authentication/getAuthentication').then((res) => {
      // console.log(res)
      self.hide()
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

      if (dataStatus == 1) {
        // '审核中'
        wx.redirectTo({
          url: '/venuePages/setCheck/setCheck',
        })
        return;
      } else if (dataStatus == 2) {
        //'审核不通过'
      } else if (dataStatus == 3) {
        //'审核通过'
        wx.redirectTo({
          url: '/venuePages/setSuccess/setSuccess',
        })
        return;
      } else if (dataStatus == 0) {
        //'待入驻'
        return;
      }



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
      // console.log(businessLicense)

      // if (dataStatus != 0) {
      //   wx.showToast({
      //     title: statusText,
      //     icon: 'none',
      //     duration: 3000
      //   });
      // }

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
      [key]: value
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
      startTime:'营业执照开始时间'+text,
    }
    if (app.isNull(value)) {
      // console.log(key)
      let title = msgdata[key];
      // console.log(title)
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
    // console.log(this.data)

    if (!self.valEmpty('address', address)) {
      return
    }
    if (!self.valEmpty('businessLicense', businessLicense)) {
      return
    }
    if (!self.valEmpty('businessLicenseNumber', businessLicenseNumber)) {
      return
    }
    if (!self.valEmpty('code', code)) {
      return
    }
    if (!self.valEmpty('enterpriseName', enterpriseName)) {
      return
    }
    if (!self.valEmpty('fullFacePhoto', fullFacePhoto)) {
      return
    }
    if (!self.valEmpty('legalPersonCardid', legalPersonCardid)) {
      return
    }
    if (!self.valEmpty('legalPersonName', legalPersonName)) {
      return
    }
    if (!self.valEmpty('legalPersonPhone', legalPersonPhone)) {
      return
    }
    if (!self.valEmpty('name', name)) {
      return
    }
    if (!self.valEmpty('phone', phone)) {
      return
    }
    if (!self.valEmpty('reversePhoto', reversePhoto)) {
      return
    }
    if (!self.valEmpty('venueAddress', venueAddress)) {
      return
    }
    if (!self.valEmpty('venueName', venueName)) {
      return
    }
    if (!self.valEmpty('wechat', wechat)) {
      return
    }
    if (!self.valEmpty('startTime', startTime)) {
      return
    }
    

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
    // console.log(params)
    http.post('/authentication/settlement', params, 1).then((res) => {
      // console.log(res)
      if (res.code != 200) {
        return
      }
      wx.navigateTo({
        url: '/venuePages/setSuc/setSuc',
      })
    })
  },
  getcode() {
    let self = this;
    let {
      phone
    } = this.data;
    if (app.isNull(phone)) {
      wx.showToast({
        title: '联系电话不能为空',
        icon: 'none',
        duration: 3000
      })
      return
    }
    let checkPhone = self.checkPhone(phone);
    if (!checkPhone) {
      wx.showToast({
        title: '联系电话有误，请输入正确号码',
        icon: 'none',
        duration: 3000
      })
      return
    }

    http.get('/authentication/sendCode/' + phone).then((res) => {
      // console.log(res)
      if (res.code != 200) {
        return
      }
      let stv = self.data.stv;
      self.data.timer = setInterval(() => {
        stv--;
        if (stv < 1) {
          stv = 60;
          clearInterval(self.data.timer);
        }
        self.setData({
          stv
        })
      }, 1000);
      wx.showToast({
        title: '验证码发送成功',
        icon: 'none',
        duration: 3000
      })
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
                      self.choiseImg(e)
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

  },
  show() {
    this.setData({
      isAlert: true
    })
  },
  hide() {
    setTimeout(() => {
      this.setData({
        isAlert: false
      })
    }, 300);

  },
  checkPhone(phone) {
    if (!(/^1[3456789]\d{9}$/.test(phone))) {
      return false;
    }
    return true
  }

})