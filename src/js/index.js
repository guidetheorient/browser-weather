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
  }
}

function locationOnSuccess(data) {
  if (data.status === 0) {
    var content = data.content.address_detail;
    var city = content.city.slice(0, -1) + ',' + content.province.slice(0, -1);
    console.log(city)
    tool.getWeather(city)
    
    
    
    
    
    // 开始updateWeather
    // updateWeather.init(city);
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
  // 首次刷新初始化页面
  // 由locationOnSuccess（jsonp的callback）调用
  init(data){
    if(!this.oldData){
      this.originData = data;
      this.extractWeather();
      this.update();
    }
  },
  extractWeather(){
    window.a = this.originData.weather
    var weather = JSON.parse(this.originData.weather)["HeWeather6"][0];
    var air = JSON.parse(this.originData.air)["HeWeather6"][0];
    
    // 天气参数
    this.location = weather.basic.location;
    this.cond_code_now = weather.now.cond_txt;
    this.tmp_now = weather.now.tmp;
    this.min_tmp = weather.daily_forecast.tmp_min;
    this.max_tmp = weather.daily_forecast.tmp_max;
    this.comf = weather.lifestyle[0].brf;
    this.aqi = air.air_now_city.aqi;
  },
  update(){
    this.searchInputDOM = document.getElementById('search-ipt');
    this.celsiusDOM = document.getElementById('celsius');
    this.skyconDOM = document.getElementById('skycon');
    this.aqi = document.getElementById('aqi')
    
  }
}