// activityPages/issue_a/issue_a.js
let app = getApp();
let http = require('../../utils/request')
let toggle = require('./toggle')
let API = require('../../utils/config.js');
let bhv_location = require('../../pages/component/behavior/bhv_location')
let bhv_dialog = require('../../pages/component/behavior/bhv_dialog')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    venuesList:[],
    disabled:false,
    dialogAgree: true,
    agree: false,
    chargeMode: 10,
    disableEdit: false,
    penalSum: 30,
    apiimg: API.API_IMG,
    skuTypeListArr: [],
    withPeople: 1,
    isOpen: 1,
    isLineUp:1,
    isPenal: 0,
    detailsImageArr: [],
    pickkey: '',
    limitType: false,
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
        checked: false
      },
      {
        name: '免费停车',
        checked: false
      },
      {
        name: '免费提供球',
        checked: false
      },
      {
        name: '免费提供饮用水',
        checked: false
      },
      {
        name: '免费零食',
        checked: false
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
  behaviors: [toggle, bhv_location,bhv_dialog],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    let self = this;
    app.isLogin(function () {
      if (options.id) {
        //草稿 options.isdraft == 1
        self.setData({
          activityId: options.id,
          isdraft: options.isdraft,
        })
      }
      self.getType();
      self.getSku(options.id);
      let userinfo = app.getInfo();
      self.setData({
        contactName: userinfo.nickname,
        phoneNum: userinfo.phone
      })
    })
  },

  getDetail() {
    let self = this;
    let {
      activityId,
      defalutTab,
      skuTypeListArr,
      disableEdit,
      isdraft
    } = self.data;
    self.show();
    http.get('/activities/selectActivity/' + activityId).then((res) => {
      self.hide()
      // console.log(res)
      if (res.code != 200) {
        return;
      }

      let main = res.response[0];
      let skuindex = [];
      let {
        activities,
        activitiesSkuList,
        activityHeadImage,
        activityDetailImage: detailsImageArr,
        type
      } = main;
      activities.detailsText = activities?.detailsText?.split('&hc').join('\n');
      let tagArr = self.string_to_arr(activities.tag) || [];
      defalutTab.forEach((item) => {
        item.checked = false
      })
      let defalutTabArr = defalutTab.map((item) => {
        return item.name
      })
      // console.log(defalutTabArr)
      // console.log(tagArr)
      tagArr.forEach((item, index) => {
        let indexof = defalutTabArr.indexOf(item);
        if (indexof == -1) {
          defalutTab.push({
            name: item,
            checked: true
          })

        } else {
          defalutTab[indexof].checked = true;
        }
      })
      let headImage = activityHeadImage[0].path;
      type = {
        title: type
      };
      let typeId = activities.typeId;
      let skuidArr = activitiesSkuList.map((item) => {
        return item.title
      })

      skuTypeListArr = skuTypeListArr.map((item,index) => {

        let indexof = skuidArr.indexOf(item.title);
        if (indexof != -1) {
          // console.log(indexof)
          skuindex.push(index)
          return {
            ...activitiesSkuList[indexof],
            checked: true,
            price: activitiesSkuList[indexof].price / 100,
            minNum: activitiesSkuList[indexof].maxNum
          }
        }
        return {...item, checked: false}
      })
      // console.log(skuTypeListArr)

      let {
        title,
        venueName,
        location,
        addressLongitude,
        addressLatitude,
        filedNo,
        limitType,
        participantsNum,
        chargeMode,
        contactName,
        phoneNum,
        vxNum,
        startTime,
        endTime,
        detailsText,
        uptoTime,
        cancelTime,
        withPeople,
        isOpen,
        isPenal,
        penalSum,
        appliedNum,
        venueId,
        isLineUp
      } = activities;
      startTime = self.formatWeek(startTime);
      endTime = self.formatWeek(endTime);
      uptoTime = self.formatWeek(uptoTime);
      cancelTime = self.formatWeek(cancelTime);
      if(self.data.isdraft==1){
        uptoTime = '';
        cancelTime = '';
      }

      if (limitType != 0) {
        limitType = true;
      }
      if (appliedNum != 0) {
        disableEdit = true;
        // let skuindex = self.data.skuindex;
        // console.log(skuindex)
        skuTypeListArr.forEach((item,index) =>{
          if(skuindex.indexOf(index) != -1){
            item['disableEdit'] = true
          }else{
            item['disableEdit'] = false
          }
        })
      }
      // console.log(limitType)
      // console.log(detailsImageArr)
      detailsImageArr.forEach((item) => {
        // {url:apiimg + urlfile,deletable:true,path:urlfile}
        item['url'] = self.data.apiimg + item.path;
        item['deletable'] = true;
        item['isImage'] = true;
        item['path'] = item.path;
      })

      if (isdraft == 1) {
        disableEdit = false;
        skuTypeListArr.forEach((item,index) =>{
          item['disableEdit'] = false
        })
      }
      self.setData({
        disableEdit,
        defalutTab,
        headImage,
        type,
        typeId,
        title,
        venueName,
        location,
        addressLongitude,
        addressLatitude,
        filedNo,
        participantsNum,
        participantsNum1:participantsNum,
        limitType,
        skuTypeListArr,
        chargeMode,
        contactName,
        phoneNum,
        vxNum,
        startTime,
        endTime,
        detailsText,
        detailsImageArr,
        uptoTime,
        cancelTime,
        withPeople,
        isOpen,
        isPenal,
        penalSum,
        skuindex,
        venueId,
        isLineUp
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
        app.isCheckImg(res.tempFilePaths[0]).then(() =>{
          // console.log(img)
          // if((img.response[0]?.errcode  + '').includes('8701')){
          //   wx.showToast({title: '请重新上传或更换图片',icon:'none',duration:3000});
          //   return;
          // }
          wx.navigateTo({
            url: '/activityPages/img-cropper/img-cropper?imgSrc=' + res.tempFilePaths[0] 
          })
        })

      },
      fail: function (res) {},
      complete: function () {
        wx.hideLoading();
      }
    })
  },
  switchDate(e) {
    let key = e.currentTarget.dataset.key;
    let value = e.detail;
    this.setData({
      [key]: value
    })
  },
  switchDateIsLine(e){
    let {activityId,isdraft} = this.data;
    let key = e.currentTarget.dataset.key;
    let value = e.detail;
    if(activityId && !isdraft){
      if(value == 0 )return
    }
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
    if(key == 'venueName'){
      this.setData({venueId:null})
    }
    this.setData({
      [key]: value
    })
  },
  bindDateArr(e) {
    // let{disableEdit,skuTypeListArr} = this.data;
    let {
      arr,
      index,
      key
    } = e.currentTarget.dataset;
    // console.log(key)
    let keys = [arr] + '[' + index + '].' + key;
    // console.log(keys)
    let value;
    if (key == 'maxNum') {
      value = app.validateNumber(e.detail);
    } else {
      value = app.validateFixed(e.detail);
    }

    this.setData({
      [keys]: value
    })
  },
  bindDateBlue(e) {
  
    // let {
    //   disableEdit,
    //   skuTypeListArr,
    //   skuindex
    // } = this.data;
    // let {
    //   arr,
    //   index,
    //   key
    // } = e.currentTarget.dataset;
    // let keys = [arr] + '[' + index + '].' + key;

    // let value = e.detail.value;
    // let minNum = skuTypeListArr[index].minNum;

    // if (disableEdit && skuindex.indexOf(index) != -1) {

    //   if (value < minNum) {
    //     wx.showToast({
    //       title: '修改人数不能少于原始人数',
    //       icon: 'none',
    //       duration: 3000
    //     });
    //   }
    //   value = value < minNum ? minNum : value;
    // }
    // this.setData({
    //   [keys]: value
    // })
  },
  bindDateAll(e) {
    // let disableEdit = this.data.disableEdit;
    // let participantsNum = this.data.participantsNum1;
    // // console.log(participantsNum)
    // let value = e.detail.value;
    // if (disableEdit) {
    //   if (value < participantsNum) {
    //     wx.showToast({
    //       title: '修改人数不能少于原始人数',
    //       icon: 'none',
    //       duration: 3000
    //     });
    //   }
    //   value = value < participantsNum ? participantsNum : value;
    // }
    // this.setData({
    //   participantsNum: value
    // })
  },

  toIssue_detail() {
    let {
      detailsImageArr,
      detailsText
    } = this.data;
    // console.log(detailsImageArr)
    // console.log(detailsText)
    wx.setStorageSync('issueDetail', JSON.stringify({
      detailsImageArr,
      detailsText
    }))
    wx.navigateTo({
      url: '/activityPages/issueDetail/issueDetail',
    })
  },

  uploadImg(url, key) {
    let self = this;
    let token = wx.getStorageSync('token');
    self.show();
    wx.uploadFile({
      url: API.API_HOST + '/activities/upload',
      header: {
        'token': token,
      },
      filePath: url,
      name: 'file',
      success(res) {
        console.log(res);
        if(res.statusCode != 200){
          if(res.statusCode == 413){
            return wx.showToast({title: '图片过大，请确认图片大小为5M以内！',icon:'none',duration:3000});
          }
          return wx.showToast({title: '图片上传失败！',icon:'none',duration:3000});
        }
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
      },
      complete(){
        self.hide();
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
  getSku(optid) {
    let self = this;
    http.get('/activities/getSku').then((res) => {
      // console.log(res)
      if (res.code != 200) {
        return;
      }
      let main = res.response[0];
      let skuTypeListArr = main.map((item, index) => {
        delete item.id;
        if (index < 2) {
          return {
            ...item,
            checked: true,
            maxNum: '',
            price: '',
            idsp:index
          }
        }
        return {
          ...item,
          checked: false,
          maxNum: '',
          price: '',
          idsp:index
        }
      })
      self.setData({
        skuTypeListArr
      })
      if (optid) {
        self.getDetail();
      }
    })
  },
  // 选择
  togg_tag(e) {
    let type = e.currentTarget.dataset.type;
    let index = e.currentTarget.dataset.index;
    let {
      activityId,isdraft,skuindex
    } = this.data;
    // console.log(skuindex);
    if (activityId && !isdraft && type != 1 ) {
      if(skuindex.indexOf(index) != -1){
        return wx.showToast({
          title: 'sku只能增加，不能取消',
          icon: 'none',
          duration: 3000
        }); 
      }
    }

    let key = e.currentTarget.dataset.key;
    let sku = e.currentTarget.dataset.sku;
    let iskey = key + "[" + index + "].checked";
    let value = this.data[key][index].checked;
    if (sku) {
      let {
        skuTypeListArr
      } = this.data;
      let skuListArr = skuTypeListArr.filter((item) => item.checked == false)
      if (skuListArr.length > (skuTypeListArr.length-2) && value == true) {
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
    let {
      disableEdit
    } = this.data;
    if (disableEdit) {
      return
    }
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
      limitType,
      disableEdit,
      skuTypeListArr
    } = this.data;
    // console.log(disableEdit)
    if (disableEdit) {
      return
    }
    skuTypeListArr.forEach((item) => {
      // console.log(item)
      item.maxNum = item.maxNum == -1 ? '' : item.maxNum
    })
    this.setData({
      limitType: !limitType,
      skuTypeListArr
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
    let {
      disableEdit
    } = this.data;
    if (disableEdit && key != 'uptoTime' && key != 'cancelTime') {
      return;
    }

 
    this.setData({
      currentPicker: key
    })
    if (app.isNull(value)) {
      this.selectComponent("#lkdpicker").showpicker();
      return;
    }
    // console.log(value)
    let day = value.substring(3, 13);
    let time = value.substr(-5, 5);
    // console.log(day);
    // console.log(time)
    this.selectComponent("#lkdpicker").showpicker(day, time);
    // console.log(day)
    // console.log(time)
  },
  choisePicker(item) {
    // console.log(item)
    let {
      currentPicker
    } = this.data;
    let {
      day,
      hour,
      minute
    } = item.detail;
    let time = day.week + ' ' + day.time + ' ' + hour + ':' + minute;
    // console.log(time)
    this.setData({
      [currentPicker]: time
    })
  },
  chargeChange(e) {
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
  subscribeMsg(callback) {
    wx.requestSubscribeMessage({
      tmplIds: ['IiqS5vaBk-c6b2ViA-5Zym8BrmErdVEi3jqfOHeExsA'],
      success(res) {},
      complete() {
        callback();
      }
    })
  },
  venueNameFocus(){
     wx.createSelectorQuery().select('#venue-names').boundingClientRect(function(rect){
      console.log(rect)
      let top = rect.top - 100;
      if(top > 0){
        wx.pageScrollTo({
          scrollTop: rect.top,
          duration: 300
        });
      }
    }).exec()

  },
  venueNameChange(){
    let self = this;
    let {venueName} = this.data;
    if(venueName.trim() ==''){
      self.setData({venuesList:[],location:'',addressLatitude:'',addressLongitude:''})
      return;
    }
    http.get('/venue/venueList',{name:venueName.trim(),pageSize:100,pageNum:1,sportType:'',latitude:0,longitude:0}).then((res)=>{
      // console.log(res)
      if(res.code !=200){
        return
      }
      self.setData({venuesList:res.response[0].records})
      // console.log(self.data.venuesList)
    })
  },
  bindVenue(e){
    let key = e.currentTarget.dataset.key;
    // console.log(key);
    let {name:venueName,locationAddress:location,locationLatitude:addressLatitude,locationLongitude:addressLongitude,id:venueId} = key;
    this.setData({
      venuesList:[],
      venueName,
      location,
      addressLatitude,
      addressLongitude,
      venueId
    })
    // console.log(this.data)
  },
  submitActive() { 
    let self = this;
    if (!self.data.agree) {
      return wx.showToast({
        title: '请阅读本平台协议，勾选同意后方可发布活动',
        icon: 'none',
      })
    }
    for(let i in self.data){
      if(typeof(self.data[i]) == "string"){
        self.data[i] = self.data[i]?.trim();
      } 
    }

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
      isLineUp,
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
      limitType,
      activityId,
      isdraft,

    } = this.data;
    
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
    // if (app.isNull(filedNo)) {
    //   return self.showToasts('场地号')
    // }
    if (!limitType && app.isNull(participantsNum)) {
      return self.showToasts('总人数')
    }
    if (limitType) {
      let isn = skuTypeListArr.some((item) => {
        return ((app.isNull(item.maxNum) == true || item.maxNum == 0) && item.checked == true)
      })
      if (isn) {
        return self.showToasts('人数限制不能为0，')
      }
      participantsNum = null;
    }

    // if (chargeMode == 10) {
    //   let isn = skuTypeListArr.some((item) => {
    //     return ( (app.isNull(item.price) == true || item.price == 0) && item.checked == true )
    //   })
    //   if (isn) {
    //     return self.showToasts('报名费用金额不能为0，')
    //   }
    // }else{
    //   skuTypeListArr.forEach((item) =>{item.price = 0})
    // }

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
    // if (app.isNull(detailsText) && detailsImageArr.length == 0) {
    //   return self.showToasts('活动详情')
    // }

    // console.log(startTime)
    // console.log(endTime)
    // console.log(uptoTime)
    // console.log(cancelTime)
    let istime = self.timeValit(startTime,endTime,uptoTime,cancelTime)
    // console.log(istime)
    if(!istime){
      return;
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
    let skuTypeList11 = JSON.stringify(skuTypeListArr);

    let skuTypeList = JSON.parse(skuTypeList11).filter((item) => {
      return item.checked == true
    })

    skuTypeList.forEach((item) => {
      item.price = (item.price * 100).toFixed(0)
    })
    if (!app.isNull(detailsText)) {
      detailsText = detailsText.split('\n').join('&hc');
    }

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
      limitType,
      tag,
      isLineUp
    }
    let url = '/activities/release';
    // activityId,
    // isdraft
    if (activityId && isdraft != 1) {
      params = {
        ...params,
        activityId
      }
      url = '/activities/update';
    }
    // console.log(params)
    if(self.data.disabled){ return }
    self.setData({disabled:true})
    http.post(url, params, 1).then((res) => {
      // console.log('fsfssfs')
      if(res.code != 200){
        self.setData({disabled:false})
        return
      }
      self.subscribeMsg(() => {
        wx.navigateTo({
          url: '/myList/myIssue/myIssue',
        })
      })
    })
  },
  timeValit(startTime,endTime,uptoTime,cancelTime){
    // console.log(startTime.sub)
    let st = new Date(startTime?.substring(3).replace(/-/g,'/')).getTime();
    let se = new Date(endTime?.substring(3).replace(/-/g,'/')).getTime();
    let sp = new Date(uptoTime?.substring(3).replace(/-/g,'/')).getTime();
    let sc = new Date(cancelTime?.substring(3).replace(/-/g,'/')).getTime();
    if(st>se){
      wx.showToast({
        title: '活动开始时间应小于结束时间',
        icon: 'none'
      })
      return false;
    }
    if(sp>st){
      wx.showToast({
        title: '截止报名时间应小于活动开始时间',
        icon: 'none'
      })
      return false;
    }
    if(sc>sp){
      wx.showToast({
        title: '取消报名截止时间应小于截止报名时间',
        icon: 'none'
      })
      return false;
    }
    return true;
  },

  formatWeek(star) {
    if (!app.isNull(star)) {
      // console.log(star)
      var time_st = new Date( star.replace(/-/g, '/') )
      var weekNo = time_st.getDay();
      var week = "周" + "日一二三四五六日".charAt(weekNo);
      return week + ' ' + star
    }
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
})