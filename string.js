//判断字符串是否为空
function isBlank(value) {
  if (value === null || value === undefined || 
    value === "" || value === 'null' || value === 'undefined') {
    return true
  }
  return false
}