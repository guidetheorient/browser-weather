# browser-weather

* :partly_sunny:A pretty weather forcast webpage built with vanilla JS and CSS(No third library).

* :sun_with_face: Only support searching cities in China :panda_face:.

## 预览
[预览](https://guidetheorient.github.io/browser-weather/dist/)

## 功能特色

* 配色，动画，精挑细选的字体
* 支持中国城市拼音，汉字搜索天气
* IP定位获取首屏城市天气
* 显示搜索历史，收藏城市


## 进度

#### finished
- [x] 输入框宽度随文字长短自动变化  
- [x] 首次加载数据更新  
- [x] 收藏和搜索记录下拉列表  
- [x] localStorage存取数据  
- [x] 水波动画  
- [x] 首屏加载数据更新效果优化

#### todo
- [ ] 搜索城市提示  
- [ ] 模块进一步分离  
- [ ] ajax和jsonp整合


#### 本以为非常小的项目，涉及的知识点和问题却很多
* svg图标渐变色设置
* 怎样使input框长度随文字变化
* getBoundClientRect()与getComputedStyle(ele).width与offsetWidth
* input事件触发类型: keypress, keyup, keydown, compositionstart, compositionend input change
* jsonp判定
* promise
* localStorage API
* flex
* mutationobserver
* js改变的input值如何监听
* input.value和input.getAttribute('value')的区别，ele.setAttribute(key, value)与ele.key = value的区别
* placeholder与input文本位置不一致以及中英文同fontSize位置不一致的处理
* Ajax，原生动画的简单，原生祖先元素封装  
* switch..case..也终于找到了用武之地  
* 事件代理，阻止冒泡的效用  
* js修改innerText时触发动画效果
* ...

## 依赖

* [百度地图API](http://lbsyun.baidu.com/index.php?title=webapi) / [和风天气API](https://www.heweather.com/documents)