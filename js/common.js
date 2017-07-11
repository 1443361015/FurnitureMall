document.onreadystatechange = function () {
  if (document.readyState == 'interactive') {
    /*初始化  主要初始化header与footer*/
    init();
  }
  if(document.readyState == 'complete'){
    /*下拉菜单读取*/
    dropDown('address-select');
    /*导航栏列表项排列*/
    setTimeout(mainNav, 0);
  }
}
/*网页顶部加载*/
function init() {
  /*获取header元素*/
  let header = document.getElementById('header'),
      headStr = '';
  /*如果header不存在则创建一个header*/
  if(!header){
    let main = document.getElementById('main'),
        head = document.createElement('header');
    head.setAttribute('id', 'header');
    main.insertBefore(head, null);
    header = document.getElementById('header');
  }
  headStr += `<div class="head-bg">
    <div class="user-info">
      <div class="login-info">`;
  /*判断是否登录*/
  if(sessionStorage.getItem('loginState') == 'logined'){
    /*已登录时 获取localstorge中存储的账号信息*/
    let name = localStorage.getItem('username').slice(0,localStorage.getItem('username').indexOf('@'));
    headStr += `<a href="userinfo.html" class="login-info-user">${name}</a>`
  } /*判断是否为主页*/
  else if(isIndex()){
    headStr += `<a href="pages/login.html" class="btn btn-login"></a>`;
  }else{
    headStr += `<a href="login.html" class="btn btn-login"></a>`;
  }
  /*添加购物车信息*/
  headStr += `</div>
    <div class="shop-cart">
      <i class="icon icon-shop-cart"></i>
      <div class="shop-info">
        <ul class="shop-list">
          <li>
            <a href="#">商品名</a>
            <span class="price">123</span>
            <span class="num">x3</span>
          </li>
          <li>
            <a href="#">商品名</a>
            <span class="price">123</span>
            <span class="num">x3</span>
          </li>
          <li>
            <a href="#">商品名</a>
            <span class="price">123</span>
            <span class="num">x3</span>
          </li>
        </ul>
        <button type="button" class="btn btn-shoping">查看购物车</button>
      </div>
    </div>
  </div>
  <a href="#" class="link-block sell"></a>`;
  /*判断是否为主页*/
  if(isIndex()){
    headStr += `<a href="index.html" class="link-block logo"></a>`
  }else{
    headStr += `<a href="../index.html" class="link-block logo"></a>`
  }
  headStr += `<div class="drop-down" id="address-select">
    <p><span>成都地区</span><i class="icon icon-select"></i></p><ul></ul></div></div><nav class="main-nav">`;
  header.innerHTML += headStr;
  /*生成导航栏*/
  addHeadNav();
  /*生成footer*/
  addFooter();
}
/*生成footer*/
function addFooter(){
  let footer = document.getElementById('footer'),
    footStr = '',
    url = getUrl();
  if(!footer){
    let main = document.getElementById('main'),
        foot = document.createElement('footer');
    foot.setAttribute('id', 'footer');
    main.appendChild(foot);
    footer = document.getElementById('footer');
  }
  /*请求JSON数据*/
  ajax('GET',url,function(o){
    let data = JSON.parse(o),
        title = data.footer.title,
        tag = data.footer.tag,
        desc = data.footer.tagDesc,
        copyright = data.footer.copyRight;
    /*添加footer的title*/
    footStr += `<p class="footer-title">${title}</p><nav class="footer-tag">`;
    /*添加footer的tag标签*/
    for(let i = 0, l = tag.length; i < l; i++){
      footStr += `<li>
            <div class="tag-title">${tag[i]}</div>
            <p class="tag-desc">${desc[i]}</p>
          </li>`;
    }
    /*生成底部footer 导航元素*/
    footStr += `</nav>
        <nav class="footer-info">
          <li class="footer-info-item">
            <h3>关于我们</h3>
            <p>
              <a href="#">关于我们</a>
              <a href="#">注册协议</a>
            </p>
            <p>
              <a href="#">业务合作</a>
              <a href="#">免责声明</a>
            </p>
            <p>
              <a href="#">加入户里</a>
              <a href="#">隐私保护</a>
            </p>
          </li>
          <li class="footer-info-item">
            <h3>流程指南</h3>
            <p>
              <a href="#">购买家具</a>
              <a href="#">出售家具</a>
            </p>
            <p>
              <a href="#">支付方式</a>
              <a href="#">配送安装</a>
            </p>
            <p>
              <a href="#">售后保障</a>
            </p>
          </li>
          <li class="footer-info-item">
            <h3>会员中心</h3>
            <p>
              <a href="#">会员计划</a>
            </p>
            <p>
              <a href="#">积分规则</a>
            </p>
            <p>
              <a href="#">投诉建议</a>
            </p>
          </li>
          <li class="footer-info-item">
            <h3>联系客服</h3>
            <p>电话:</p>
            <p>028-67635062</p>
            <p>邮箱:</p>
            <p>hello@hulihome.com</p>
          </li>
          <li class="footer-info-item">
            <p><i class="icon icon-weibo"></i>新浪微博@户里网</p>
            <div class="footer-code code-weibo"></div>
          </li>
          <li class="footer-info-item">
            <p>
              <i class="icon icon-weixin"></i>
              <span>关注微信“户里网”</span>
            </p>
            <div class="footer-code code-weixin"></div>
          </li>
        </nav>
      <p class="footer-copyright">${copyright}</p>`
    footer.innerHTML = footStr;
  });
}
/*下拉菜单*/
function dropDown(param_id){
  /*获取下拉菜单容器ID*/
  let select = document.getElementById(param_id),
      /*找到显示元素p*/
      p = select.children[0],
      /*找到ICON*/
      icon = p.children[1],
      /*找到下拉菜单*/
      ul = select.getElementsByTagName('ul')[0],
      li = null,
      /*下拉菜单初始状态 false为关闭 */
      flag = false,
      str = '',
      url = getUrl();
  /*异步请求json中地区内容生成下拉框*/
  ajax('GET',url,function(o){
    /*获取address的数据*/
    let address = JSON.parse(o).header.address;
    /*将获取到的address数据存入str中*/
    for(let i = 0, l = address.length; i < l; i++){
      str += `<li data-value="${i}">${address[i]}</li>`;
    }
    /*生成address数据标签*/
    ul.innerHTML = str;
    /*找到生成的li元素*/
    li = ul.children;
    /*为新生成的li添加点击事件*/
    ul.addEventListener('click', function(e){
      /*设置p元素data-value为选中项的data-value*/
      p.setAttribute('data-value',e.target.getAttribute('data-value'));
      /*设置显示文本*/
      p.children[0].textContent = e.target.textContent;
      /*设置图标class*/
      icon.className = 'icon icon-select';
      /*点击任意li后 关闭ul  ul高度为0*/
      ul.style.height = 0;
      flag = false;
    })
  });
  /*显示元素点击事件*/
  p.onclick = function(){
    if(!flag){
      /*显示ul  设置ul高度为单个li的高度乘上li的数量*/
      ul.style.height = li[0].offsetHeight * li.length + 'px';
      /*设置图标状态class*/
      icon.className = 'icon icon-select unfold';
      flag = true;
    }else{
      /*关闭Ul*/
      ul.style.height = 0;
      icon.className = 'icon icon-select';
      flag = false;
    }
  }
  select.onmouseleave = function(){
      /*关闭Ul*/
      ul.style.height = 0;
      icon.className = 'icon icon-select';
      flag = false;
  }
}
/*添加顶部导航栏*/
function addHeadNav(){
  let url = getUrl();
  ajax('GET', url,function(o){
    /*获取nav数据*/
    let nav = JSON.parse(o).header.nav,
        mainNav = header.getElementsByClassName('main-nav')[0],
        str = '';
    /*遍历nav数据*/
    for(x in nav){
      /*添加nav数据第一项为列表头 判断是否为主页*/
      if(isIndex()){
        str += `<li class="main-item">
          <a href="pages/subpage.html" data-classify="${x}">${nav[x][0]}&nbsp;&nbsp;${nav[x][1].toLocaleUpperCase()}</a><ul>`;
      }else{
        str += `<li class="main-item">
          <a href="subpage.html" data-classify="${x}">${nav[x][0]}&nbsp;&nbsp;${nav[x][1].toLocaleUpperCase()}</a><ul>`;
      }
      /*添加每一项nav的列表项*/
      for(let i = 2, l = nav[x].length; i < l; i++){
        str += `<li><a href="#">${nav[x][i]}</a></li>`
      }
      str += `</ul></li>`;
    }
    /*添加搜索框*/
    str += `<li class="nav-search"><input type="text" placeholder="搜索"><button type="button" class="icon icon-search"></button></li></nav>`;
    /*生成导航*/
    mainNav.innerHTML = str;
    /*绑定导航事件*/
    getClassify();
  });
}

/*排列顶部导航栏*/
function mainNav(){
  /*获取顶部导航栏容器*/
  let mainNav = document.getElementsByClassName('main-nav')[0],
      ul = mainNav.getElementsByTagName('ul');
  for(let i = 0, l = ul.length; i < l; i++){
    let li = ul[i].children;
    for(let j = 0, l2 = li.length; j < l2; j++){
      if(li[j].offsetWidth * 2.5 <= ul[i].offsetWidth - 55){
        li[j].style.width = '50%';
      }else{
        li[j].style.width = '100%';
      }
    }
  }
}
/*获取请求URL*/
function getUrl(){
  let url = '';
  /*判断当前是否为主页设置不同的JSON路径*/
  if(isIndex()){
    url = 'js/data.json';
  }else{
    url = '../js/data.json';
  }
  return url;
}
/*判断是否为 主页*/
function isIndex(){
  let title = document.getElementsByTagName('title')[0].textContent,
      flag = false;
  if(title == '户里·家'){
    flag = true;
  }else{
    flag = false;
  }
  return flag;
}
/*绑定跳转详情前获取商品信息*/
function getClassify(){
  let item = document.getElementsByClassName('main-item');
  for(let i = 0, len = item.length; i < len; i++){
    /*点击顶部导航时向session存入类型*/
    item[i].children[0].onclick = function(){
      let classify = this.getAttribute('data-classify');
      sessionStorage.setItem('click-classify',classify);
    }
  }
}
/*绑定跳转详情前获取商品信息*/
function getGoodsDatails(){
  /*获取到商品列表项*/
  let item = document.getElementsByClassName('goods-item');
  for(let i = 0, len = item.length; i < len; i++){
    /*为所有商品列表项添加点击事件*/
    item[i].onclick = function(){
      /*点击后获取当前点击元素自定义属性data-goods该属性为商品id*/
      let id = this.getAttribute('data-goods');
      /*将所点击的商品ID存入session*/
      sessionStorage.setItem('click-goods',id);
    }
  }
}
/*异步请求方法*/
function ajax(type, url, suc){
  var ajax = null;
  if(window.XMLHttpRequest){
    ajax = new XMLHttpRequest(); //IE6以上
  }else{
    ajax = new ActiveXObject('Microsoft.XMLHTTP');//IE6
  }
  ajax.open(type, url, true);
  ajax.send();
  ajax.onreadystatechange = function(){
    if(ajax.readyState == 4){
      if(ajax.status == 200){
        suc(ajax.responseText);
      }
    }
  }
}
