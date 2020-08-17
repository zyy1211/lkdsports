const Rx = require('../../../utils/rxjs');
const {
  distinctUntilChanged,
  debounceTime
} = Rx.operators;
var myObservable = new Rx.Subject();

module.exports = Behavior({
  data: {

  },
  attached() {

    let self = this;
    myObservable.pipe(debounceTime(200)).pipe(distinctUntilChanged()).subscribe(value => {
      self.changeInit(value)
    });
  },
  methods: {

    changeName(e) {
      // console.log(e)
      let key = e.currentTarget.dataset.key;
      let value = e.detail;
      this.setData({
        [key]: value
      })
      myObservable.next(value);
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