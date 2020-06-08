// activityPages/activityDetail/activityDetail.js

let bhv_back = require('../../pages/component/behavior/bhv_back.js');
let bhv_refresh = require('../../pages/component/behavior/bhv_refresh.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // opacity:0,
    // barHeight:app.globalData.barHeight,
    // height:app.globalData.height,
    arr:[{status:1},{status:1},{status:1},{status:0},{status:2},{status:2},{status:0},{status:3},{status:3},{status:3},{status:3},{status:0}],
    typeList: [{
      sportsName: '羽毛球'
    }, {
      sportsName: '篮球'
    }, {
      sportsName: '网球'
    }, {
      sportsName: '羽毛球'
    }],
    activityIndex: 0,
    isweek: 0,
    businessHours: '09:00-22:00',
    weekCode: '01',
    tableData: {
      "bVenueFieldCopyList": [{
          "lockList": [{
              "originalPrice": 45,
              "configId": 3,
              "price": 45,
              "id": 1,
              "status": 1,
              "dataCode": "0010111-12"
            },
            {
              "originalPrice": 45,
              "configId": 5,
              "price": 60,
              "id": 2,
              "status": 1,
              "dataCode": "0010109-10"
            },
            {
              "originalPrice": 45,
              "configId": 5,
              "price": 60,
              "id": 3,
              "status": 2,
              "dataCode": "0010110-11"
            }
          ],
          "name": "1号馆",
          "id": 1,
          "code": '001',
          "configList": [{
              "seniorConfigId": 2,
              "baseConfigId": 1,
              "mergeIdentification": "2-0",
              "id": 1,
              "dataCode": "0010109-10",
              "basePrice": 45,
              "peice": 60
            },
            {
              "seniorConfigId": 2,
              "baseConfigId": 1,
              "mergeIdentification": "2-0",
              "id": 2,
              "dataCode": "0010110-11",
              "basePrice": 45,
              "peice": 60
            },
            {
              "seniorConfigId": 0,
              "baseConfigId": 1,
              "mergeIdentification": "",
              "id": 3,
              "dataCode": "0010111-12",
              "basePrice": 45,
              "peice": 0
            },
            {
              "seniorConfigId": 2,
              "baseConfigId": 1,
              "mergeIdentification": "2-1",
              "id": 4,
              "dataCode": "0010114-15",
              "basePrice": 50,
              "peice": 110
            },
            {
              "seniorConfigId": 2,
              "baseConfigId": 1,
              "mergeIdentification": "2-1",
              "id": 5,
              "dataCode": "0010115-16",
              "basePrice": 50,
              "peice": 110
            },
            {
              "seniorConfigId": 2,
              "baseConfigId": 1,
              "mergeIdentification": "2-1",
              "id": 5,
              "dataCode": "0010116-17",
              "basePrice": 50,
              "peice": 110
            }
          ],
          "type": 0
        },
        {
          "lockList": [],
          "name": "散客1号馆",
          "id": 2,
          "code": '002',
          "configList": [{
            "seniorConfigId": 2,
            "baseConfigId": 1,
            "mergeIdentification": "",
            "id": 10,
            "dataCode": "0020110-12",
            "basePrice": 45,
            "peice": 25
          },{
            "seniorConfigId": 2,
            "baseConfigId": 1,
            "mergeIdentification": "",
            "id": 10,
            "dataCode": "0020113-15",
            "basePrice": 45,
            "peice": 25
          },{
            "seniorConfigId": 2,
            "baseConfigId": 1,
            "mergeIdentification": "",
            "id": 10,
            "dataCode": "0020115-20",
            "basePrice": 45,
            "peice": 25
          }],
          "type": 1
        }
      ]
    }
  },
  behaviors: [bhv_back,bhv_refresh],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData()
  },

  initData() {
    let bVenueFieldCopyList = this.data.tableData.bVenueFieldCopyList;
    let businessHours = this.data.businessHours;
    let businessHoursArr = businessHours.split('-')
    let weekCode = this.data.weekCode;
    let startTime = parseInt(businessHoursArr[0]);
    let endTime = parseInt(businessHoursArr[1]);

    let lockList = new Map();
    let configList = new Map();
    bVenueFieldCopyList.forEach(it => {
      it.lockList.forEach(item => {
        lockList.set(item.dataCode, {
          status: item.status
        })
      })
      it.configList.forEach(item => {
        configList.set(item.dataCode, item)
      })
    })
    // console.log(lockList)
    // console.log(configList)
    bVenueFieldCopyList.forEach(it => {
      let table_map = [];
      if (it.type == 0) {
        // console.log(it)
        for (let i = startTime; i < endTime; i++) {
          let obj = {
            dataCode: it.code + weekCode + (i < 10 ? ('0' + i) : i) + '-' + ((i + 1) < 10 ? ('0' + (i + 1)) : (i + 1)),
            status: -1
          }
          table_map.push(obj)
        }
        let new_table = table_map.map(item => {
          let cfg = configList.get(item.dataCode)
          let lok = lockList.get(item.dataCode)
          if (cfg && lok) {
            return {
              ...item,
              ...cfg,
              ...lok
            }
          }
          if (cfg && !lok) {
            return {
              ...item,
              ...cfg
            }
          }
          if (!cfg && lok) {
            return {
              ...item,
              ...lok
            }
          }
          return item
        })
        it['new_table'] = new_table;
        // console.log(new_table)
      }
    })
  },
  // 切换
  tabVenuesList: function (e) {
    let activityIndex = e.currentTarget.dataset.index;
    let key = e.currentTarget.dataset.key;
    this.setData({
      [key]: activityIndex
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return{
      title:'自定义标题',
      path: '/activityPages/activityDetail/activityDetail',
      imageUrl:'/static/111.png'
    }
  }
})