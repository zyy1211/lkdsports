Component({
  properties: {
    activitiesSkuList: Array
  },
  observers: {
    'activitiesSkuList': function (value) {
      // console.log(value)
      let money = 0;let count=0;
      value.forEach(item => {
        money += (item.price * item.num)
        count += item.num
      })
      this.triggerEvent('wishSuccess', {money:money/100,count}, '');
    }

  }
})