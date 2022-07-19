// 最接近的
function findClosest(arr = [], num){
  let curr = arr[0]
  let diff = Math.abs (num - curr)
  for (let val = 0; val < arr.length; val++) {
     let newDiff = Math.abs (num - arr[val])
     if (newDiff < diff) {
        diff = newDiff
        curr = arr[val]
     }
  }
  return curr
}

// console.log(findClosest([2,3,9],7))

// 比指定值小的里最大的
function findClosestMax (arr,str) {
   let list = []
   // 比自身小的放入
   arr.forEach((el, index) => {
     if (el < str) {
       list.push(el)
     }
   })
   // 数组从⼩到⼤排序
   list.sort(function(a,b){return a-b;})
   // 从排序的数组⾥⾯获取最后⼀位
   return list[list.length-1]
}

// console.log(MaxFn([2,3,9],1))

//从给定的无序、不重复的数组 A 中，取出 N 个数，使其相加和 为 M
/*
  array： 数据源数组，必选；
  sum： 相加的和，必选；
  tolerance： 容差，如果不指定此参数，则相加的和必须等于sum参数，指定此参数可以使结果在容差范围内浮动，可选；
  targetCount： 操作数数量，如果不指定此参数，则结果包含所有可能的情况，指定此参数可以筛选出固定数量的数相加，假如指定为3，那么结果只包含三个数相加的情况，可选；
  返回值： 返回的是数组套数组结构，内层数组中的元素是操作数，外层数组中的元素是所有可能的结果；
*/
function getCombBySum(array,sum,tolerance,targetCount){
  //工具
  var util = {
     /*获取所有的可能组合
     如果是[1,2,3,4,5]取出3个，那么可能性就有10种 C(5,3)= C(5,2)
     公式： 
     全排列  P(n,m)=n!/(n-m)!
     组合排列 P(n,m)=n!/m!/(n-m)!
     C(5,2)=5!/2!*3!=5*4*3*2*1/[(2*1)*(3*2*1)]=10
     这是使用了循环加递归做出了组合排序
     */
    getCombination: function(arr, num) {  //  索引数组 操作数数量
      var r = [];
      (function f(t,a,n){
        if (n == 0){
          return r.push(t)
        }
        for (var i=0,l=a.length; i<=l-n; i++) {
          f(t.concat(a[i]), a.slice(i+1), n-1)
        }
      })([],arr,num)
      return r
    },
    // 获取数组的索引
    getArrayIndex: function(array) {
       var i = 0,
         r = [];
       for(i = 0;i<array.length;i++){
         r.push(i);
       }
       return r;
     }
  }

  var logic = {
    //  对数组进行排序
    //  获取数组中比sum小的数
    init: function(array,sum) {  //初始化去除不可能的元素
      // clone array
      var _array = array.concat()
      var r = []
      var i = 0
      // sort by asc
      _array.sort(function(a,b){
         return a - b
      })
      // 当它小于或等于总和时获得所有数字
      for(i = 0;i<_array.length;i++){
        if(_array[i]<=sum){
          r.push(_array[i])
        }else{
          break
        }
      }
       return r
    },
    // important function
    core: function(array,sum,arrayIndex,count,r){
      var i = 0
      var k = 0
      var combArray = []
      var _sum = 0
      var _cca = []
      var _cache = []
      
      if(count == _returnMark){
        return
      }
      // 获取当前的计数总和
      // 这里排序的不是原来的数组,而是求的索引后的数组
      combArray = util.getCombination(arrayIndex,count)
      for(i = 0;i<combArray.length;i++){
        _cca = combArray[i]
        _sum = 0
        _cache = []
        // calculate the sum from combination
        for(k = 0;k<_cca.length;k++){
          _sum += array[_cca[k]]
          _cache.push(array[_cca[k]])
        }
        if(Math.abs(_sum-sum) <= _tolerance){
          r.push(_cache)
        }      
      }

      logic.core(array,sum,arrayIndex,count-1,r)
    }
  }

  var r = []
  var _array = []
  var _targetCount = 0
  var _tolerance = 0
  var _returnMark = 0
     
  // check data
  _targetCount = targetCount || _targetCount
  _tolerance = tolerance || _tolerance
   
  _array = logic.init(array,sum)
  if(_targetCount){
    _returnMark = _targetCount - 1
  }
 
  logic.core(_array,sum,util.getArrayIndex(_array),(_targetCount || _array.length),r)
 
  return r
}
console.log(getCombBySum([1,2,3,9], 5, null, 2))