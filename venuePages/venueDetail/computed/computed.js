Component({
  properties: {
    choiseList: Array
  },
  observers: {
    'choiseList': function (value) {
      // console.log(value)
      let num = 0;
      value.forEach(item => {
        num += (item.isprice * item.count)
      })
      this.triggerEvent('wishSuccess', num/100, '');

    }

  }
})