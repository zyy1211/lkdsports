
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

  },
  attached() {
    let pickList = app.globalData.pickList;
    let strap = app.globalData.strap;
    this.setData({
      pickList,strap
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showpicker(day,time) {
      let value = this.selectComponent("#lkdvanpicker").getIndexes();
      if((app.isNull(day) && app.isNull(time)) && (value[0]==0 && value[1]==0 && value[2]==0 ) ){
        let index2 = app.globalData.today.toTime.split(':')[0]
        let index3 = app.globalData.today.toTime.split(':')[1]
        this.selectComponent("#lkdvanpicker").setColumnIndex(1,index2);
        this.selectComponent("#lkdvanpicker").setColumnIndex(2,index3);
      }
      if(!app.isNull(day) && !app.isNull(time)){
        // console.log(this.data.strap)
        let indexof = this.data.strap.indexOf(day)
        let index2 = time.split(':')[0]
        let index3 = time.split(':')[1]
        this.selectComponent("#lkdvanpicker").setColumnIndex(0,indexof);
        this.selectComponent("#lkdvanpicker").setColumnIndex(1,index2);
        this.selectComponent("#lkdvanpicker").setColumnIndex(2,index3);
      }
      this.setData({
        sheetShow: true
      })

    },
    closeSheet() {
      this.setData({
        sheetShow: false
      })
    },
    onConfirm(e) {
      // console.log(e.detail.value)
      let value = e.detail.value;
      let day = value[0];
      let hour = value[1];
      let minute = value[2];
      this.triggerEvent('choisePicker', {day,hour,minute})
      this.closeSheet();
    },
    onCancel() {
      this.closeSheet();
    },
  }
})