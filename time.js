//判断两个时间相差多少月
function completeDate (startTime, endTime, m) {
  var time1 = new Date(startTime)
  var time2 = new Date(endTime)
  var diffYear = time2.getFullYear() - time1.getFullYear()
  var diffMonth = diffYear * 12 + time2.getMonth() - time1.getMonth()

  if (diffMonth < 0) {
    return false
  }
  var diffDay = time2.getDate() - time1.getDate()
  if (diffMonth < m || (diffMonth == m && diffDay <= 0)) {
    if (diffMonth == m && diffDay == 0) {
      var timeA = time1.getHours() * 3600 + 60 * time1.getMinutes() + time1.getSeconds()
      var timeB = time2.getHours() * 3600 + 60 * time2.getMinutes() + time2.getSeconds()
      if (timeB - timeA > 0) {
        return false
      }
    }
    return true
  }
  return false
}

//日期解析
function dateParse (dateString) {
  var SEPARATOR_BAR = "-"
  var SEPARATOR_SLASH = "/"
  var SEPARATOR_DOT = "."
  var dateArray
  if (dateString.indexOf(SEPARATOR_BAR) > -1) {
    dateArray = dateString.split(SEPARATOR_BAR)
  } else if (dateString.indexOf(SEPARATOR_SLASH) > -1) {
    dateArray = dateString.split(SEPARATOR_SLASH)
  } else {
    dateArray = dateString.split(SEPARATOR_DOT)
  }
  return new Date(dateArray[0], dateArray[1] - 1, dateArray[2])
}

//日期比较大小 
function dateCompare (dateString, compareDateString) {
  var dateTime = dateParse(dateString).getTime()
  var compareDateTime = dateParse(compareDateString).getTime()
  if (compareDateTime > dateTime) {
    return 1
  } else if (compareDateTime == dateTime) {
    return 0
  } else {
    return -1
  }
}

//判断日期是否在区间内
function dateBetween (dateString, startDateString, endDateString) {
  var flag = false
  var startFlag = (dateCompare(dateString, startDateString) < 1)
  var endFlag = (dateCompare(dateString, endDateString) > -1)
  if (startFlag && endFlag) {
    flag = true
  }
  return flag
}

//判断时间段内是否存在31号
function existThirtyOne (startDateString, endDateString) {
  let start = dateParse(startDateString)
  let end = dateParse(endDateString)

  let startYear = start.getFullYear()
  let endYear = end.getFullYear()
  let startMonth = start.getMonth()
  let endMonth = end.getMonth()
  let endDay = end.getDate()

  if (
    startYear < endYear ||
    startMonth + 2 <= endMonth ||
    endDay == 31 ||
    (startMonth != endMonth && [1, 3, 5, 7, 8, 10, 12].indexOf(startMonth + 1) != -1)
  ) {
    return true
  }
  return false
}

//判断2月份
function judgmentFebruary (startDateString, endDateString) {
  let start = dateParse(startDateString)
  let end = dateParse(endDateString)

  let startYear = start.getFullYear()
  let endYear = end.getFullYear()
  let startMonth = start.getMonth()
  let endMonth = end.getMonth()
  let endDay = end.getDate()

  if (startMonth + 1 == 2 && startYear == endYear) {
    if (startYear % 4 == 0 && startYear % 100 !== 0 || startYear % 400 == 0) {
      if (endMonth + 1 == 3 && endDay < 30) {
        return ['30']
      }
    } else {
      if (endMonth + 1 == 3 && endDay < 29) {
        return ['29', '30']
      }
    }
  }
  return []
}

//指定月份的最后一天
function getMonthFinalDay (year, month) {
  var day = ''
  if (year == null || year == undefined || year == '') {
    year = new Date().getFullYear()
  }
  if (month == null || month == undefined || month == '') {
    month = new Date().getMonth() + 1
  }
  day = new Date(new Date(year, month).setDate(0)).getDate()
  return year + "-" + month + "-" + day
}


//判断按月是否超出
function isMonth (startDateString, endDateString, dateString) {

  let start = dateParse(startDateString)
  let end = dateParse(endDateString)

  let startYear = start.getFullYear()
  let endYear = end.getFullYear()
  let startMonth = start.getMonth() + 1
  let endMonth = end.getMonth() + 1

  //获取时间段是否存在31号
  let isExistThirtyOne = existThirtyOne(startDateString, endDateString)
  if (!isExistThirtyOne) {
    if (dateString == '31') {
      return false
    }
  }

  //获取时间段有无最后一个月
  if (dateString == '0') {
    let startDay = getMonthFinalDay(startYear, startMonth)
    let isStartDayBetween = dateBetween(startDay, startDateString, endDateString)
    let endDay = getMonthFinalDay(endYear, endMonth)
    let isEndDayBetween = dateBetween(endDay, startDateString, endDateString)
    if (isStartDayBetween || isEndDayBetween) {
      return true
    } else {
      return false
    }
  }

  //获取时间段是否相差一个月
  let isCompleteDate = completeDate(startDateString, endDateString, 1)
  //获取开始时间是否为2月份
  let isFebruary = judgmentFebruary(startDateString, endDateString)
  if (!isCompleteDate) {
    if (isFebruary.includes(dateString) && isFebruary.length > 0) {
      return false
    } else {
      return true
    }
  } else {
    if (isFebruary.includes(dateString) && isFebruary.length > 0) {
      return false
    } else {
      let startDate = startYear + '-' + startMonth + '-' + dateString
      let isStartDateBetween = dateBetween(startDate, startDateString, endDateString)
      let endDate = endYear + '-' + endMonth + '-' + dateString
      let isEndDateBetween = dateBetween(endDate, startDateString, endDateString)

      if (isStartDateBetween || isEndDateBetween) {
        return true
      } else {
        return false
      }
    }
  }
}

console.log(isMonth('2022-02-23', '2022-03-25', '28'))

//获得指定日期前一周、当前周、后一周
//weekNumber：从周几计算 | AddWeekCount：0 为当前周，1为下一周，-1为上一周  | date ： 日期
function getWeekStartAndEnd (weekNumber, AddWeekCount, date) {
  //一天的毫秒数
  var millisecond = 1000 * 60 * 60 * 24
  //获取时间
  var currentDate = dateParse(date)
  //相对于任意日期AddWeekCount个周的日期
  currentDate = new Date(currentDate.getTime() + (millisecond * 7 * AddWeekCount))
  //返回date是一周中的某一天
  var week = currentDate.getDay()
  //从周几开始计算
  if (week < weekNumber) {
    var minusDay = 7 - (weekNumber - week)
  } else {
    var minusDay = week - weekNumber
  }
  //获得周的第一天
  var currentWeekFirstDay = new Date(currentDate.getTime() - (millisecond * minusDay))
  //获得周的最后一天
  var currentWeekLastDay = new Date(currentWeekFirstDay.getTime() + (millisecond * 6))

  let weekFirstDay = currentWeekFirstDay.getFullYear() + '-' + (currentWeekFirstDay.getMonth() + 1) + '-' + currentWeekFirstDay.getDate()
  let weekLastDay = currentWeekLastDay.getFullYear() + '-' + (currentWeekLastDay.getMonth() + 1) + '-' + currentWeekLastDay.getDate()
  return [weekFirstDay, weekLastDay]
}

//判断星期是否超出
function isWeek (startDateString, endDateString, date) {
  let arr = []
  let start = dateParse(startDateString)
  let end = dateParse(endDateString)

  let startDay = start.getDay()
  let endDay = end.getDay() == 0 ? 7 : end.getDay()

  let nextWeekStartAndEnd = getWeekStartAndEnd(1, 1, startDateString)
  let nextWeekStart = nextWeekStartAndEnd[0]
  let nextWeekEnd = nextWeekStartAndEnd[1]

  if (dateBetween(nextWeekEnd, startDateString, endDateString)) {
    return true
  } else {
    if (dateBetween(nextWeekStart, startDateString, endDateString)) {
      for (let i = 1; i <= endDay; i++) {
        if (i == 7) {
          arr.push(0)
        } else {
          arr.push(i)
        }
      }
      for (let i = startDay; i < 8; i++) {
        if (i == 7) {
          arr.push(0)
        } else {
          arr.push(i)
        }
      }
    } else {
      for (let i = startDay; i <= endDay; i++) {
        if (i == 7) {
          arr.push(0)
        } else {
          arr.push(i)
        }
      }
    }
  }
  arr = [...new Set(arr)]

  let arr1 = date.filter(item => !arr.includes(item))
  return arr1.length > 0 ? false : true
}

// console.log(isWeek('2022-06-30', '2022-07-05', [5, 4, 1, 6]))