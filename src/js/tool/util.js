const util = {
  /**
   * 获取无单位的元素getComputedStyle属性值
   * 
   * 输入 ele, attr
   * 输出 去除单位的属性
   */
  trimUnit: function (ele, attr) {
    return parseFloat(getComputedStyle(ele)[attr])
  },

  /*
   * para为对象
   * para.method  三种类型 => 'GET','POST','JSONP'
   * para.query   为对象，用于拼接url
   * 
   */
  request: function (para) {
    var method = para.method || 'GET';
    var url = para.url;
    if (typeof para.query === 'object') {
      for (key in para.query) {
        if (para.query.hasOwnProperty(key) && para.query[key]) {
          url += key + '=' + para.query[key] + '&';
        }
      }
      url = url.slice(0, -1);
    }

    if (method.toUpperCase() === 'GET' || method.toUpperCase === 'POST') {
      return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.send();
        xhr.onload = function () {
          if (xhr.status === 200 || xhr.status === 304) {
            resolve(xhr.responseText)
          } else {
            reject(new Error(xhr.statusText));
          }
        }

        xhr.onerror = function () {
          reject(new Error('Ajax error'))
        }
      })
    } else if (method.toUpperCase() === 'JSONP') {
      var script = document.createElement('script');
      script.src = url + '&callback=locationOnSuccess';
      document.head.appendChild(script);
      document.head.removeChild(script);
    }
  },
  genDate(){
    var locale = {
      // dayNames: [Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday],
      shortDayNames: ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'],
      // monthNames: [January, February, March, April, May, June, July, August, September, October, November, December],
      shortMonthNames: ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'],
    }
    var result = {};
    var date = new Date();
    result.day = date.getDate();
    result.weekDay = locale.shortDayNames[date.getDay()];
    result.month = locale.shortMonthNames[date.getMonth()];
    result.nextWeekDay = locale.shortDayNames[date.getDay() + 1] || locale.shortDayNames[0];
    return result;
  },
  /***
   * localData要存的数据 
   * keyName存储为localStorage键名
   */
  saveToLocal(localData, keyName) {
    var oldData = localStorage.getItem(keyName);
    if(!oldData && typeof localData === 'string') {
      oldData = [];
      oldData.push(localData);
    } else if(oldData && typeof localData === 'string') {
      oldData = JSON.parse(oldData);
      if(oldData.indexOf(localData) === -1){
        oldData.push(localData);
      }
    } else {
      oldData = {};
      for(key in localData) {
        oldData[key] = localData[key];
      }
    }

    localStorage.setItem(keyName, JSON.stringify(oldData));
    // console.log(localStorage.getItem(keyName))
  },
    /***
   * keyName要取的localStorage键名
   */
  loadFromLocal(keyName){
    var localData = localStorage.getItem(keyName);
    if(localData) {
      return JSON.parse(localData);
    }
    return false;
  },

  removeFromLocal(localData, keyName){
    var oldData = localStorage.getItem(keyName);
    if(oldData && typeof localData === 'string') {
      oldData = JSON.parse(oldData);
      if(Array.isArray(oldData)) {
        oldData = oldData.filter(value => value !== localData);
        localStorage.setItem(keyName,JSON.stringify(oldData));
      }
    }    
  },

  // 元素fadeout动画
  fadeOut(ele) {
    if(!ele) return;
    ele.style.opacity = 0;
    setTimeout(function(){
      ele.parentNode.removeChild(ele);
    },500)
  },
  // 元素fadein动画
  fadeIn(ele, parent) {
    if(!ele) return;
    ele.style.opacity = 0;
    parent.appendChild(ele);
    setTimeout(function(){ele.style.opacity = 1})
  },
  // 寻找ele元素tag为tagName的祖先元素
  parentUntil(ele, tagName) {
    if(!ele.parentNode.tagName) return;
    if(ele.parentNode.tagName.toLowerCase() === tagName) {
      return ele.parentNode;
    } else {
      return util.parentUntil(ele.parentNode, tagName);
    }
  },
  // 文本变化时动画
  textChangeAnimate(ele, text){
    ele.classList.remove('text-in');
    ele.classList.add('text-out');
    ele.addEventListener('animationend', function(e){
      this.classList.remove('text-out');
      if(e.target === e.currentTarget) {
        this.innerText = text;
        this.classList.add('text-in');
      }
    })
  }
}

module.exports = util;