function getDateString(date){
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate()
  const hour = date.getHours()< 10 ? `0${date.getHours()}` : date.getHours()
  const minute = date.getMinutes()
  return `${year} ${day}/${month} ${hour}:${minute}`;
}

module.exports = {
  getDateString
}