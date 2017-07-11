window.onload = function(){
  slider({
    id: 'index-banner',
    time: 3000,
    docs: true
  });
}
/* 轮播*/
function slider(param){
  /*配置默认参数*/
  param.time = param.time || 3000;
  param.docs = param.docs || false;
  /*获取轮播容器*/
  let box = document.getElementById(param.id),
      li =  box.children[0].children,
      li_len = li.length,
      str = '',temp = 0;
  /*通过配置的参数生成可点击锚点 重新排列轮播项位置*/
  if(param.docs){
    str += `<ul class="slider-ctrl">`;
    for(let i = 0,l = li.length; i < l; i++){
      li[i].style.left = i*100+'%';
      if(i == 0){
        str += `<li class="active"></li>`
      }else{
        str += `<li></li>`
      }
    }
    str += `</ul>`;
    box.innerHTML += str;
    var ctrl = box.getElementsByClassName('slider-ctrl')[0],
        c_li = ctrl.children;
    /*为所有锚点添加切换 */
    for(let i = 0; i < li_len; i++){
      c_li[i].onclick = function(){
        for(let j = 0; j < li_len; j++){
          c_li[j].className = '';
        }
        if(this.className != 'active'){
          this.className = 'active';
          box.children[0].style.left = -100 * i + '%';
          temp = i;
        }
      }
    }
  }else{
    /*初始化需要轮播的元素*/
    for(let i = 0,l = li.length; i < l; i++){
      li[i].style.left = i*100+'%';
    }
  }
  /*设置轮播定时器*/
  setInterval(function(){
    if(temp < li.length-1){
      temp++;
    }else{
      temp = 0;
    }
    /*轮播*/
    box.children[0].style.left = -100 * temp + '%';
    /*轮播锚点*/
    if(param.docs){
      for(let j = 0; j < li_len; j++){
        c_li[j].className = '';
      }
      c_li[temp].className = 'active'; 
    }
  },param.time);
}