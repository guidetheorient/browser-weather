/**
 * ak: qhWvmiK2mMqkB88onRbGCfsc4n1oo4iO
 * created at 3/13'18 by guidetheorient 
 */
var util = {
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
    result.nextWeekDay = locale.shortDayNames[date.getDay() + 1];
    return result;
  }
}

function locationOnSuccess(data) {
  if (data.status === 0) {
    var content = data.content.address_detail;
    var city = content.city.slice(0, -1) + ',' + content.province.slice(0, -1);
    tool.getWeather(city)
  } else {
    console.log('获取城市失败')
  }
}

var tool = {
  getLoaction: function () {
    util.request({
      method: 'jsonp',
      url: '//api.map.baidu.com/location/ip?',
      query: {
        ak: 'qhWvmiK2mMqkB88onRbGCfsc4n1oo4iO'
      }
    })
  },
  getWeather: function (city) {
    var data = {};
    util.request({
      url: 'https://free-api.heweather.com/s6/weather?',
      query: {
        location: city,
        key: '4a4cd82062fd4f8db1a9d7894e1aea92'
      }
    })
    .then(weather => {
      data.weather = weather;
      return util.request({
        url: 'https://free-api.heweather.com/s6/air?',
        query: {
          location: city,
          key: '4a4cd82062fd4f8db1a9d7894e1aea92'
        }
      })
    })
    .then(air => {
      data.air = air
      updateWeather.init(data)
    })
  },
  saveToLocal(oldData) {

  },
  loadFromLocal(){

  }
}

tool.getLoaction();

/**
 * 输入框宽度随字符长度变化
 */
function FitWidth(ele) {
  this.ele = ele;

  this.parent = this.ele.parentNode;
  this.value = this.ele.value;
  this.fontSize = getComputedStyle(this.ele).fontSize;
  this.fontFamily = getComputedStyle(this.ele).fontFamily;
  this.padding = util.trimUnit(this.ele, 'paddingLeft') + util.trimUnit(this.ele, 'paddingRight')
  // 限制最大宽度
  this.maxValueWidth = 300;
  // 限制最小宽度
  this.minValueWidth = 140;
  // 文本宽度
  this.valueWidth = 0;
  // 隐藏元素
  this.span = null;

  this.init();
  this.bind();
}
FitWidth.prototype = {
  init: function () {
    this.genInvisibleEle();
    this.setWidth();
  },
  genInvisibleEle: function () {
    this.span = document.createElement('span');
    this.span.classList.add('invisible-span');
    this.parent.appendChild(this.span);
  },
  setWidth: function () {
    this.span.innerText = this.value;
    this.valueWidth = Math.ceil(this.span.getBoundingClientRect().width);
    var width = this.valueWidth + this.padding;
    if (width >= this.minValueWidth && width <= this.maxValueWidth) {
      this.ele.style.width = width + 'px';
    } else if (width < this.minValueWidth) {
      this.ele.style.width = this.minValueWidth + 'px';
    } else {
      this.ele.style.width = this.maxValueWidth + 'px';
    }
  },
  bind: function () {
    var _this = this;
    this.ele.addEventListener('input', function () {
      _this.value = this.value;
      _this.setWidth();
    })
  }
}
new FitWidth(document.getElementById('search-ipt'))


/**
 * 输入容器元素，数组
 * 依据数组内容生成下拉菜单；
 * ele为容器元素
 * arr为菜单数据
 * 依赖.dropdown CSS
 */
function Dropdown(ele, arr) {
  this.ele = ele;
  this.arr = arr;

  // 生成的元素
  this.domEle = null;

  this.init();
}
Dropdown.prototype = {
  init: function () {
    this.genDOM();
    this.positionDOM();
  },
  genDOM: function () {
    this.domEle = document.createElement('ul');
    this.domEle.classList.add('dropdown');

    var fragment = document.createDocumentFragment();
    this.arr.forEach(value => {
      if (typeof value === 'string') {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.innerText = value.toUpperCase();
        li.appendChild(a);
        fragment.appendChild(li);
      }
    })
    this.domEle.appendChild(fragment);
  },
  positionDOM: function () {
    this.ele.appendChild(this.domEle);
  }
}

/* drop-btn 绑定事件*/
function DropBtn(ele) {
  this.ele = ele;

  // 生成的dropdown
  this.dropdown = null;
  this.bind();
}
DropBtn.prototype = {
  bind() {
    var _this = this;
    this.ele.addEventListener('click', function (e) {
      var handler = _bodyEvent.bind(_this)

      e.preventDefault();
      e.stopPropagation();
      if (!_this.dropdown) {
        console.log(1);
        _this.dropdown = new Dropdown(document.getElementById('drop-btn'), ['BEIJING', 'LISBON', 'DENVER']);
        window.addEventListener('click', handler, false)
      } else {
        console.log(2)
        window.removeEventListener('click', handler, false)
        setTimeout(function () {
          _this.dropdown.domEle.parentNode.removeChild(_this.dropdown.domEle);
          console.log(4)
          _this.dropdown = null;
        })
      }

      function _bodyEvent() {
        console.log(3)
        if (this.dropdown) {
          this.dropdown.domEle.parentNode.removeChild(this.dropdown.domEle);
          this.dropdown = null;
        }
        window.removeEventListener('click', handler, false)
      }
    })
  }
}
new DropBtn(document.getElementById('drop-btn'))


var updateWeather = {
  // 保存上次查询结果
  oldData: null,
  originData: null,
  newData: {},

  searchInputDOM: document.getElementById('search-ipt'),
  skyconDOM: document.getElementById('skycon'),
  celsiusDOM: document.getElementById('celsius'),
  aqiDOM: document.getElementById('aqi'),
  lifestyleDOM: document.getElementById('other'),
  tmpMinDOM: document.getElementById('min'),
  tmpMaxDOM: document.getElementById('max'),
  dateDOM: document.getElementById('date'),
  nextWeekDayDOM: document.getElementById('next-weekday'),
  weatherIconDOM: document.getElementById('weather-icon').querySelector('use'),
  waveWrapperDOM: document.getElementById('wave-wrapper'),

  // 首次刷新初始化页面
  // 由locationOnSuccess（jsonp的callback）调用
  init(data){
    if(!this.oldData){
      this.originData = data;
      this.extractWeather();
      this.date = util.genDate();
      this.update();
    } 
  },
  extractWeather(){
    window.a = this.originData.weather
    var weather = JSON.parse(this.originData.weather)["HeWeather6"][0];
    var air = JSON.parse(this.originData.air)["HeWeather6"][0];
    window.b = this;
    // 天气参数
    this.address = weather.basic.location;
    this.cond_txt_now = weather.now.cond_txt;
    
    // 天气代码
    this.cond_code_now = Number(weather.now.cond_code);
    this.tmp_now = weather.now.tmp;
    this.min_tmp = weather.daily_forecast[1].tmp_min;
    this.max_tmp = weather.daily_forecast[1].tmp_max;
    this.comf = weather.lifestyle[0].brf;
    this.aqi = air.air_now_city.aqi;
  },
  update(){
    this.searchInputDOM.value = this.address;
    this.skyconDOM.innerText = this.cond_txt_now;
    this.celsiusDOM.innerText = this.tmp_now;
    this.aqiDOM.innerText = this.aqi;
    this.lifestyleDOM.innerText = this.comf;
    this.tmpMinDOM.innerText = this.min_tmp;
    this.tmpMaxDOM.innerText = this.max_tmp;

    this.dateDOM.innerText = this.date.weekDay + this.date.day + ' ' + this.date.month
    this.nextWeekDayDOM.innerText = this.date.nextWeekDay;
    
    
    // 更新天气图标
    updateIcon.call(this, this.cond_code_now, this.weatherIconDOM)
    function updateIcon(index, target) {
      var iconDict = {
        sunny: 'icon-qingtianbaitian',
        overcast: 'icon-yintian',
        partlyCloudy: 'icon-qingzhuanduoyunbaitian',
        ligthRain: 'icon-xiaoyu',
        moderateRain: 'icon-zhongyu',
        heavyRain: 'icon-dayu',
        storm: 'icon-baoyu',
        thundershower: 'icon-leizhenyu',
        freezingRain: 'icon-dongyu',
        lightSnow: 'icon-xiaoxue',
        moderateSnow: 'icon-zhongxue',
        heavySnow: 'icon-daxue',
        sleet: 'icon-yujiaxue',
        snowStorm: 'icon-baoxue',
        foggy: 'icon-wu',
        haze: 'icon-wumai',
        dust: 'icon-yangchen',
        duststorm: 'icon-shachen',
        wind: 'icon-feng',
        tornado: 'icon-longjuanfeng',
        hail: 'icon-bingbao',
        unknown: 'icon-rila'
      };
      this.waveWrapperDOM.classList.remove('sunny');
      switch (index) {
        case 100:
        case 102:
        case 200:
        case 201:
        case 202:
        case 203:
        case 204:
          target.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#' + iconDict.sunny);
          this.skyconDOM.style.color = 'rgba(66, 102, 233, 0.6)';
          this.waveWrapperDOM.classList.add('sunny');
          break;
        case 101:
        case 103:
          target.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#' + iconDict.partlyCloudy)
          break;
        case 104:
          target.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#' + iconDict.overcast);
          break;
        case 205:
        case 206:
        case 207:
        case 208:
          target.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#' + iconDict.wind);
          break;
        case 209:
        case 210:
        case 211:
        case 212:
        case 213:
          target.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#' + iconDict.tornado);
          break;
        case 300:
        case 306:
          target.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#' + iconDict.moderateRain);
          break;
        case 301:
        case 307:
          target.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#' + iconDict.heavyRain);
          break;
        case 302:
        case 303:
          target.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#' + iconDict.thundershower);
          break;
        case 304:
          target.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#' + iconDict.hail);
          break;
        case 305:
        case 309:
          target.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#' + iconDict.ligthRain);
          break;
        case 308:
        case 310:
        case 311:
        case 312:
          target.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#' + iconDict.storm);
          break;
        case 313:
          target.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#' + iconDict.freezingRain);
          break;
        case 400:
          target.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#' + iconDict.lightSnow);
          break;
        case 401:
          target.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#' + iconDict.moderateSnow);
          break;
        case 402:
        case 407:
          target.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#' + iconDict.heavySnow);
          break;
        case 403:
          target.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#' + iconDict.snowStorm);
          break;
        case 404:
        case 405:
        case 406:
          target.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#' + iconDict.sleet);
          break;
        case 500:
        case 501:
          target.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#' + iconDict.foggy);
          break;
        case 502:
          target.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#' + iconDict.haze);
          break;
        case 503:
        case 504:
          target.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#' + iconDict.dust);
          break;
        case 507:
        case 508:
          target.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#' + iconDict.duststorm);
          break;
        case 999:
        default:
          target.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#' + iconDict.unknown);
          console.log('unkown weather')
      }
    }
  }
}

function Search(ele) {
  this.ele = ele;
  console.log(this.ele.value)

  this.init();
}
Search.prototype = {
  init: function(){
    this.ele.addEventListener('')
  }
}
new Search(document.getElementById('search-ipt'))