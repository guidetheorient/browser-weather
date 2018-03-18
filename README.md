# browser-weather

A pretty weather web page built with origin JS and CSS(No third library).

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