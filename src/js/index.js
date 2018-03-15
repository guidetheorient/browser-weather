/**
 * ak: qhWvmiK2mMqkB88onRbGCfsc4n1oo4iO
 * created at 3/13'18 by guidetheorient 
 */
var util = {
  trimUnit: function (ele, attr) {
    return parseFloat(getComputedStyle(ele)[attr])
  }
}

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
        _this.dropdown.domEle.parentNode.removeChild(_this.dropdown.domEle);
        window.removeEventListener('click', handler, false)
        _this.dropdown = null;
      }

      function _bodyEvent() {
        console.log(3)
        this.dropdown.domEle.parentNode.removeChild(this.dropdown.domEle);
        this.dropdown = null;
        window.removeEventListener('click', handler, false)
      }
    })
  }
}
new DropBtn(document.getElementById('drop-btn'))