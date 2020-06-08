
module.exports = Behavior({
  data: {

  },
  methods: {
    getweek(e){
      let weekend =[0,1,2,3,4,5,6].map(item =>{
        return this.getone(item)
      })
      let weekNo = weekend[0].weekNo
      this.setData({weekend,weekNo})
    },
    getone(AddDayCount){
      let dd = new Date();
      dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期  
      // console.log(dd.getDay())
    
      let week = "周" + "日一二三四五六".charAt(dd.getDay());
      let weekNo = dd.getDay()==0 ? ('07'): ('0' + dd.getDay());
    
      let y = dd.getFullYear();
    
      let m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1); //获取当前月份的日期，不足10补0  
    
      let d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate(); //获取当前几号，不足10补0  
    
      return {
        time: m + '-' + d,
        week: week,
        weekNo:weekNo
      }
    },

    formatData(tablemain){
      let self = this;
      let businessHours = this.data.businessHours;
      let businessHoursArr = businessHours.split('-')
      let startTime = parseInt(businessHoursArr[0]);
      let endTime = parseInt(businessHoursArr[1]);
      let fieldLockList = new Map();
      let configurationDatas = new Map();
      let mergeArr = [];
      // 占场、有效场
      tablemain.forEach(it => {
        it.fieldLockList.forEach(item => {
          fieldLockList.set(item.dataCode, {
            status: item.status
          })
        })

        it.configurationDatas.forEach((item,index,arr) => {
          if(item.merge != null){
            mergeArr.push(item.merge)
          }
          configurationDatas.set(item.dataCode, item)
        })
      })
      // 基础table
      let tb_time = []
      tablemain.forEach((it,index) => {
        // 基础时间
        let table_map = [];
        for (let i = startTime; i < endTime+1; i++) {
          if(index == 0){
            tb_time.push(i +':00');
          }
          if(i != endTime){
            let obj = {
              dataCode: it.code + (i < 10 ? ('0' + i) : i) + '-' + ((i + 1) < 10 ? ('0' + (i + 1)) : (i + 1)),
              status: -1
            }
            table_map.push(obj)
          }
        }
        // 加status
        let new_table = table_map.map(item => {
          let cfg = configurationDatas.get(item.dataCode)
          let lok = fieldLockList.get(item.dataCode)
          let obj = {...item};
  
          if (cfg && lok) {
            obj = {...item,...cfg,...lok}
          }
          if (cfg && !lok) {
            obj = {...item,...cfg,status:0}
          }
          if (!cfg && lok) {
            obj = {...item,...lok}
          }
          let mergeNum = (mergeArr.filter(x =>x == obj.merge)).length;
          obj.merge = mergeNum !=0 ? obj.merge +'-'+ mergeNum : obj.merge;
          return obj
        })
        it['new_table'] = new_table;

      })
      self.setData({tb_time,tablemain})

    }

  },

})
