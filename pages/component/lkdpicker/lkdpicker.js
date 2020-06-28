// pages/component/picker/picker.js
// let app = getApp();
// Component({
//   /**
//    * 组件的属性列表
//    */
//   properties: {

//   },

//   /**
//    * 组件的初始数据
//    */
//   data: {
//     sheetShow: false,
//     isend: true,
//   },
//   attached() {
//     this.setData({
//       pickList: app.globalData.pickList
//     })
//   },

//   /**
//    * 组件的方法列表
//    */
//   methods: {
//     showpicker(day, time) {
//       let self = this;
//       let {
//         pickList
//       } = this.data;
//       // console.log(pickList)
//       let index1, index2, index3;
//       if (!app.isNull(day)) {
//         // console.log(pickList.strap);
//         let isarr = time.split(':');
//         index1 = pickList.strap.indexOf(day)
//         index2 = pickList.hourList.indexOf(isarr[0])
//         index3 = pickList.minuteList.indexOf(isarr[1])
//         // console.log(index1)
//         let today = pickList.dayList[index1];
//         let hour = pickList.hourList[index2];
//         let minute = pickList.minuteList[index3]
//         self.setData({
//           isColume: [index1, index2, index3],
//           choiseTime: {
//             day: today,
//             hour,
//             minute
//           }
//         })
//         // console.log(this.data.choiseTime)
//       }
//       this.setData({
//         sheetShow: true
//       })
//       self.setData({
//         isColume: [index1, index2, index3]
//       })
//     },
//     bindChange(e) {
//       let arr = e.detail.value;
//       let {
//         pickList
//       } = this.data;
//       // console.log(pickList)

//       let day = pickList.dayList[arr[0]];
//       let hour = pickList.hourList[arr[1]];
//       let minute = pickList.minuteList[arr[2]]

//       this.setData({
//         choiseTime: {
//           day,
//           hour,
//           minute
//         }
//       })
//       // console.log(this.data.choiseTime)
//     },
//     pickStart(e) {
//       this.setData({
//         isend: false
//       })
//     },
//     pickEnd(e) {
//       // console.log(e)
//       setTimeout(() => {
//         this.setData({
//           isend: true
//         })
//       }, 500);
//     },
//     closeSheet() {
//       this.setData({
//         sheetShow: false
//       })
//     },
//     sureSheet() {
//       let {
//         isend,
//         choiseTime
//       } = this.data;
//       if (!isend) {
//         return
//       }
//       this.triggerEvent('choisePicker', choiseTime)
//       this.setData({
//         sheetShow: false
//       })
//     },
//     onChange(e) {
//       console.log(e)
//     }
//   }
// })



let app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    defaultIndex: ''
  },
  attached() {
    let pickList = app.globalData.pickList;
    this.setData({
      pickList: [{
          values: pickList.dayList,
          className: 'column1'
        },
        {
          values: pickList.hourList,
          className: 'column2'
        },
        {
          values: pickList.minuteList,
          className: 'column3'
        }
      ]
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showpicker(day, time) {
      let self = this;
      this.setData({
        sheetShow: true
      })

    },
    closeSheet() {
      this.setData({
        sheetShow: false
      })
    },
    onConfirm() {
      this.closeSheet();
    },
    onCancel() {
      this.closeSheet();
    },
    onChange(e) {
      console.log(e)
    },
    sureSheet() {
      let {
        isend,
        choiseTime
      } = this.data;
      if (!isend) {
        return
      }
      this.triggerEvent('choisePicker', choiseTime)
      this.setData({
        sheetShow: false
      })
    },

  }
})