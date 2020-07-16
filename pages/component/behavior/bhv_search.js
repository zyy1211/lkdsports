const Rx = require('../../../utils/rxjs');
const {
  throttleTime,
  debounceTime
} = Rx.operators;
var myObservable = new Rx.Subject();

module.exports = Behavior({
  data: {

  },
  attached() {
    // console.log('fffffffffff')
    let self = this;
    myObservable.pipe(debounceTime(200)).subscribe(value => {
      self.changeInit(value)
    });
  },
  methods: {

    changeName(e) {
      // console.log(e)
      let key = e.currentTarget.dataset.key;
      this.setData({
        [key]: e.detail
      })
      myObservable.next(key);
    },
    changeInit(key) {
      // console.log('fsssssssssssssss
      // console.log(key)
      this.setData({
        pageNum: 1
      })
      this.getData(0)
    }
  },

})