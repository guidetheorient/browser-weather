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

  fadeOut(ele) {
    if(!ele) return;
    ele.style.opacity = 0;
    setTimeout(function(){
      ele.parentNode.removeChild(ele);
    },500)
  },
  fadeIn(ele, parent) {
    if(!ele) return;
    ele.style.opacity = 0;
    parent.appendChild(ele);
    setTimeout(function(){ele.style.opacity = 1})
  },
  parentUntil(ele, tagName) {
    if(!ele.parentNode.tagName) return;
    if(ele.parentNode.tagName.toLowerCase() === tagName) {
      return ele.parentNode;
    } else {
      return util.parentUntil(ele.parentNode, tagName);
    }
  },
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

function locationOnSuccess(localData) {
  if (localData.status === 0) {
    var content = localData.content.address_detail;
    var city = content.city.slice(0, -1) + ',' + content.province.slice(0, -1);
    tool.getWeather(city, true)
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
    // 判定是用户搜索还是定位获得
    if(arguments.length !== 1) {
      var type = 'iplocated';
    }
    var responseData = {};
    util.request({
      url: 'https://free-api.heweather.com/s6/weather?',
      query: {
        location: city,
        // lang: 'en',
        key: '4a4cd82062fd4f8db1a9d7894e1aea92'
      }
    })
    .catch(error => {console.log(error,'请求失败1')})
    .then(weather => {
      responseData.weather = weather;
      return util.request({
        url: 'https://free-api.heweather.com/s6/air?',
        query: {
          location: city,
          key: '4a4cd82062fd4f8db1a9d7894e1aea92'
        }
      })
    })
    .catch(error => {console.log(error,'请求失败2')})
    .then(air => {
      responseData.air = air
      // console.log(type)
      updateWeather.init(responseData, type);
    })
  }
}

/**
 * jsonp成功后调用locationOnSuccess， locationOnSuccess调用tool.getWeather为ajax请求，返回后 * 调用update.init()
 */
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

    var observer = new MutationObserver((e) =>{
      this.value = this.ele.value;
      this.setWidth();
    })

    observer.observe(this.ele, {
      attributes: true,
      characterData: true,
      attributeFilter: ['value']
    })

    this.ele.addEventListener('input', () => {
      this.value = this.ele.value;
      this.setWidth();
    })
    this.ele.addEventListener('blur', () => {
      this.ele.value = this.value = this.ele.getAttribute('value');
      this.setWidth();
    })
  }
}
var fitWidth = new FitWidth(document.getElementById('search-ipt'))



/**
 * 1. 首次加载时，查询localStoage
 *      |有数据 => 更新至localStorage
 *      |没有数据 => 显示html初始数据
 *      |请求新数据，并保存至localStorage
 * 
 *  2. 按下enter键时，查询并更新视图，并更新localStorage数据
 */    
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

  getData(responseText){
    
    // 如果有请求到的数据
    if(responseText){
      // 原始数据
      this.originData = responseText;
      // 获取有用数据，挂到this上
      this.extractWeather();
      // 获取最新日期
      this.date = util.genDate();
    } else {
      // 获取本地数据
      var localData = util.loadFromLocal('__oldData');
      
      // 如果本地有数据
      if(localData) {
        this.address = localData.address;
        this.cond_txt_now = localData.cond_txt_now;
        this.cond_code_now = localData.cond_code_now;
        this.tmp_now = localData.tmp_now;
        this.min_tmp = localData.min_tmp;
        this.max_tmp = localData.max_tmp;
        this.comf = localData.comf;
        this.aqi = localData.aqi;
        this.dateToday = localData.dateToday;
        this.nextWeekDay = localData.nextWeekDay;
      } else {
        // 暂时没用，不能判定jsonp失败
        this.address = 'Lisbon';
        this.cond_txt_now = 'sunny';
        this.cond_code_now = '100';
        this.tmp_now = '0';
        this.min_tmp = '0';
        this.max_tmp = '0';
        this.comf = '舒适';
        this.aqi = '0';
        this.dateToday = 'Sun. 1 Jan.';
        this.nextWeekDay = 'Mon';
      }
    }
  },
  // 首次刷新初始化页面
  // 由locationOnSuccess（jsonp的callback）调用
  init(responseText, type){
    // 参数type可选
    // if(true) => iplocated 不更新至搜索历史
    // if(false) => 更新进搜索历史
    this.type = type;
    
    // 获取处理过的数据
    // 获取responseText或localStorage中数据
    this.getData(responseText);

    // 更新DOM
    this.update();
    // var status = this.update();

    // 保存数据
    if(responseText) {
      // 如果有请求到的数据，那么更新至localStoage;
      util.saveToLocal({
        address: this.address,
        cond_txt_now: this.cond_txt_now,
        cond_code_now: this.cond_code_now,
        tmp_now: this.tmp_now,
        min_tmp: this.min_tmp,
        max_tmp: this.max_tmp,
        comf: this.comf,
        aqi: this.aqi,
        dateToday: this.dateToday,
        nextWeekDay: this.nextWeekDay
      }, '__oldData__');

      // 保存搜索城市名
      // util.saveToLocal(this.address, '__citySearched__')
    }

    // if(status) {
    //   return true
    // }
  },
  extractWeather(){
    var weather = JSON.parse(this.originData.weather)["HeWeather6"][0];
    var air = JSON.parse(this.originData.air)["HeWeather6"][0];
    // 天气参数
    if(!weather.status === 'ok') return false;
    this.address = weather.basic.location;
    this.cond_txt_now = weather.now.cond_txt;
    
    // 天气代码
    this.cond_code_now = Number(weather.now.cond_code);
    this.tmp_now = weather.now.tmp;
    this.min_tmp = weather.daily_forecast[1].tmp_min;
    this.max_tmp = weather.daily_forecast[1].tmp_max;
    this.comf = weather.lifestyle[0].brf;
    this.aqi = air.air_now_city.aqi;

    return true
  },
  update(){
    this.searchInputDOM.setAttribute('value', this.address);
    this.searchInputDOM.value =  this.address;
    
    // 现在天气状况
    util.textChangeAnimate(this.skyconDOM, this.cond_txt_now);

    if(this.cond_txt_now.length >= 4) {
      this.skyconDOM.setAttribute('title', this.cond_txt_now);
    }

    // 现在温度
    util.textChangeAnimate(this.celsiusDOM, this.tmp_now);
    
    // aqi
    util.textChangeAnimate(this.aqiDOM, this.aqi);
    // 生活指数
    util.textChangeAnimate(this.lifestyleDOM, this.comf);
    // 明天最低气温
    util.textChangeAnimate(this.tmpMinDOM, this.min_tmp);
    // 明天最高气温
    util.textChangeAnimate(this.tmpMaxDOM, this.max_tmp);

    this.dateToday = this.date.weekDay + this.date.day + ' ' + this.date.month;
    this.nextWeekDay = this.date.nextWeekDay;
    
    // 今天日期
    util.textChangeAnimate(this.dateDOM, this.dateToday);
    // 明天日期
    util.textChangeAnimate(this.nextWeekDayDOM, this.nextWeekDay);
    
    // this.aqiDOM.innerText = this.aqi;
    // this.lifestyleDOM.innerText = this.comf;
    // this.tmpMinDOM.innerText = this.min_tmp;
    // this.tmpMaxDOM.innerText = this.max_tmp;

    // this.dateToday = this.date.weekDay + this.date.day + ' ' + this.date.month;
    // this.nextWeekDay = this.date.nextWeekDay;

    // this.dateDOM.innerText = this.dateToday;
    // this.nextWeekDayDOM.innerText = this.nextWeekDay;
    
    
    // 更新天气图标
    updateIcon.call(this, this.cond_code_now, this.weatherIconDOM)

    // 更新搜索历史
    // 如果是用户搜索
    if(!this.type) {
      searchHistory.updateDropdown(this.address)
    }

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
          console.log('unknown weather')
      }
    }

    return true
  }
}



function Search(ele) {
  this.ele = ele;
  
  this.dropdown = null;

  // input首次加载城市
  this.originCity = '';
  this.init();
}
Search.prototype = {
  init: function(){
    var _this = this;
    // 绑定事件
    // 1.只有keyup回车可触发查询天气
    // 2.focus事件触发生成dropdown
    // 3.blur恢复为focus前的value

    this.ele.addEventListener('keyup', function (e) {
      if(e.keyCode === 13 && e.target.value.trim()) {
        var status = tool.getWeather(e.target.value.trim());
        // console.log(status)
        // 如何获取promise状态，根据状态判定是否移除
        // this.removeEventListener('blur', t)
      }
    })
    this.ele.addEventListener('focus', function(e){
      e.stopPropagation();

      this.addEventListener('transitionend', function(e) {
        this.value = '';
        this.style.opacity = 1;
      })
      this.style.opacity = 0;

      _this.originCity = this.value;
      
      if(!document.querySelector('.dropdowm')) {
        // 去掉可能存在的收藏mark dropdown
        util.fadeOut(document.querySelector('.mark-dropdown'))

        _this.dropdown = _this.genDropdown();
      }
    })

    this.ele.addEventListener('click', function(e){
      e.stopPropagation();
    })

    var t1 = function (e) {
        // console.log(e.target)
        _this.value = _this.originCity;
        fitWidth.setWidth();
        
        // 不再显示搜索历史
        util.fadeOut(document.querySelector('.dropdown'))
    }.bind(this);
    window.addEventListener('click', t1)
  },
  genDropdown: function(){
    this.citySearched = util.loadFromLocal('__citySearched__');

    this.domEle = document.createElement('ul');
    this.domEle.classList.add('dropdown');
    var fragment = document.createDocumentFragment();
   
    if(!this.citySearched || this.citySearched.length === 0) {
      var li = document.createElement('li');
      li.innerHTML = `<p class="no-history">no history</p>`;
      fragment.appendChild(li);
    } else {
      let cityMarked = util.loadFromLocal('__cityMarked__');
      this.citySearched.forEach(value => {
        if (typeof value === 'string') {
          var li = document.createElement('li');
          li.innerHTML = `<a href="#">${value}</a>
                          <div class="btns">
                          <span class="mark">
                            <svg class="icon" aria-hidden="true">
                              <use xlink:href="#icon-mark4"></use>
                            </svg>
                          </span>
                          <span class="delete">
                            <svg class="icon" aria-hidden="true">
                              <use xlink:href="#icon-close3"></use>
                            </svg>
                          </span>
                        </div>`;
          
          if(Array.isArray(cityMarked) && cityMarked.indexOf(value) !== -1){
            li.querySelector('.mark').classList.add('active');
          }
          fragment.appendChild(li);
        }
      })
    }

    this.domEle.appendChild(fragment);
    
    util.fadeIn(this.domEle, this.ele.parentNode)

    this.bindDropdown();
  },
  bindDropdown: function(){
    var _this = this;
    this.domEle.addEventListener('click', function(e) {
      e.stopPropagation();
      var tagName = e.target.tagName.toLowerCase();
      if(tagName !== 'ul' && tagName !== 'li') {
        var index = [].indexOf.call(this.children, parentUntil(e.target, 'li'));
        var ele = this.children[index];
        var cityLink = ele.querySelector('a');
        var markIcon = ele.querySelector('.mark');
        var closeIcon = ele.querySelector('.delete');

        if(tagName === 'a') {
          tool.getWeather(cityLink.innerText);
        } else if(e.target.classList.contains('mark') || parentUntil(e.target, 'span').classList.contains('mark')){
          // 如果点的是收藏按钮

          // 如果还未收藏， 点亮并存到localStorage;
          if(! markIcon.classList.contains('active')) {
            markIcon.classList.add('active');
            util.saveToLocal(cityLink.innerText, '__cityMarked__');
          } else {
            markIcon.classList.remove('active');
            util.removeFromLocal(cityLink.innerText, '__cityMarked__');
          }
        } else if(e.target.classList.contains('delete') || parentUntil(e.target, 'span').classList.contains('delete')) {
          // 如果点的是删除按钮
          util.removeFromLocal(cityLink.innerText, '__citySearched__');
          _this.deleteDropdownItem(index);
        }
      }
    })

    function parentUntil(ele, tagName) {
      if(ele.parentNode.tagName.toLowerCase() === tagName) {
        return ele.parentNode;
      } else {
        return parentUntil(ele.parentNode, tagName);
      }
    }
  },
  updateDropdown: function(item){
    // 1.dropdown只有 no history
    // 2.dropdown已经有内容
    var li = document.createElement('li');
    li.innerHTML = `<a href="#">${item}</a>
                    <div class="btns">
                    <span class="mark">
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-mark4"></use>
                      </svg>
                    </span>
                    <span class="delete">
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-close3"></use>
                      </svg>
                    </span>
                  </div>`;

    if(this.domEle && this.domEle.querySelector('.no-history')) {
      var noHistory = this.domEle.querySelector('li');
      this.domEle.replaceChild(li, noHistory);
    } else if(this.domEle){
      var history = Array.from(this.domEle.querySelectorAll('a')).map(ele => ele.innerText)
      if(history.indexOf(item) === -1) {
        this.domEle.appendChild(li);
      }
    }
    util.saveToLocal(item, '__citySearched__');
  },
  deleteDropdownItem: function(index){
    var length = this.domEle.children.length;
    if(length > 1) {
      this.domEle.removeChild(this.domEle.children[index]);
    } else {
      this.domEle.removeChild(this.domEle.children[index]);
      var li = document.createElement('li');
      li.innerHTML = `<p class="no-history">no history</p>`;
      this.domEle.appendChild(li)
    }
  }
}
var searchHistory = new Search(document.getElementById('search-ipt'))


/* drop-btn 绑定事件*/
function DropBtn(ele) {
  this.ele = ele;
  this.dropBtn = document.querySelector('.btn');
  // 生成的dropdown
  this.dropdown = null;

  this.bind();
}
DropBtn.prototype = {
  bind() {
    var _this = this;

    this.dropBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      // 如果还未生成dropdown
      if (!document.querySelector('.mark-dropdown')) {
        
        // 去掉可能存在的搜索记录dropdown
        util.fadeOut(document.querySelector('.dropdown'))

        _this.cityMarked = util.loadFromLocal('__cityMarked__');
        _this.dropdown = new Dropdown(_this.ele, _this.cityMarked, 3);

        util.fadeIn(_this.dropdown.domEle, _this.ele)
      } else {
        util.fadeOut(document.querySelector('.mark-dropdown'))
      }
    })


    var t2 = function() {
      // 不再显示收藏
      util.fadeOut(document.querySelector('.mark-dropdown'))
    }

    window.addEventListener('click', t2)
  }
}
new DropBtn(document.getElementById('drop-btn'))



/**
 * 输入容器元素，数组
 * 依据数组内容生成下拉菜单；
 * ele为容器元素
 * arr为菜单数据, 预期为数组或者null
 * type
 *     number: 1  纯文字
 *     number: 2  收藏按钮
 *     number: 3  删除按钮
 *     number: 4  收藏 + 删除
 *
 * 依赖.mark-dropdown CSS
 * 
 * 范围绑定好事件监听的ul列表dom
 * 
 * 应该再加length为空时，innerText值
 */

function Dropdown(ele, arr, type) {
  this.ele = ele;
  this.arr = arr;
  this.type = type;

  // 生成的元素
  this.domEle = null;

  this.genDOM();
}

Dropdown.prototype = {
  genDOM: function () {
    if(this.type === 3) {
      this.domEle = document.createElement('ul');
      this.domEle.classList.add('mark-dropdown');
      var fragment = document.createDocumentFragment();

      if(Array.isArray(this.arr) && this.arr.length){
        this.arr.forEach(value => {
          if (typeof value === 'string') {
            var li = document.createElement('li');
            li.innerHTML = `<a href="#">${value}</a>
                            <div class="btns">
                              <span class="delete">
                                <svg class="icon" aria-hidden="true">
                                  <use xlink:href="#icon-close3"></use>
                                </svg>
                              </span>
                            </div>`;
            fragment.appendChild(li);
          }
        })
      } else {
        var li = document.createElement('li');
        li.innerHTML = `<p class="no-mark">no bookmark</p>`;
        fragment.appendChild(li);
      }
      this.domEle.appendChild(fragment);
      this.bind()
    }
  },
  bind: function() {
      var _this = this;

      this.domEle.addEventListener('click', function(e) {
        // console.log(1)
        // 防止window捕获
        e.stopPropagation();
        var tagName = e.target.tagName.toLowerCase();
        if(tagName !== 'ul' && tagName !== 'li') {

          // 获取到点击元素所在li元素的index
          var index = [].indexOf.call(this.children, parentUntil(e.target, 'li'));
          var ele = this.children[index];
          
          // 获取到li元素的直接子元素，根据type类型备用
          var cityLink = ele.querySelector('a');
          var markIcon = ele.querySelector('.mark');
          var closeIcon = ele.querySelector('.delete');
          
          // 只有删除按钮
          if(_this.type === 3) {
            // console.log('type === 3');
            if(tagName === 'a') {
              tool.getWeather(cityLink.innerText);
            } else if(e.target.classList.contains('delete') || parentUntil(e.target, 'span').classList.contains('delete')) {
              util.removeFromLocal(cityLink.innerText, '__cityMarked__');
              _this.deleteDropdownItem(index);
            }
          }
        }
      })
  
      function parentUntil(ele, tagName) {
        if(ele.parentNode.tagName.toLowerCase() === tagName) {
          return ele.parentNode;
        } else {
          return parentUntil(ele.parentNode, tagName);
        }
      }
  },
  deleteDropdownItem: function(index){
    var length = this.domEle.children.length;

    if(this.type === 3) {
      if(length > 1) {
        this.domEle.removeChild(this.domEle.children[index]);
      } else {
        this.domEle.removeChild(this.domEle.children[index]);
        var li = document.createElement('li');
  
        // 只有删除按钮
        li.innerHTML = `<p class="no-mark">no bookmark</p>`;
        this.domEle.appendChild(li)
      }
    }
  }
}


// 页面失去焦点时，去掉下拉菜单
window.addEventListener('blur', function(){
  Array.from(document.querySelectorAll('.dropdown')).map(ele => {
    if(ele) {
      util.fadeOut(ele)
    }
  })
  Array.from(document.querySelectorAll('.mark-dropdown')).map(ele => {
    if(ele) {
      util.fadeOut(ele)
    }
  })
})