window.onload = function(){
  setSubNav();
  loadGoods();
}


/*设置子页面导航*/
function setSubNav(){
  /*获取子页面分类标题 获取当前页面title元素*/
 let title = document.getElementsByClassName('title-text')[0],
     pageTitle = document.getElementsByTagName('title')[0],
     nav = title.nextElementSibling,
     str = '';
  /*添加默认存在的全部分类选项*/
  str += `<li><a href="#">全部</a></li>`;
  /*请求数据 获得上个页面点击的分类信息*/
  ajax('GET','../js/data.json',function(o){
    let data = JSON.parse(o),
        tag = data.header.nav,
        classify = sessionStorage.getItem('click-classify'),
        tag_nav = tag[classify];
    /*设置当前页面标题*/
    pageTitle.textContent = `商品分类--${tag_nav[0]}`;
    /*生成分类选项*/
    for(let i = 2, len = tag_nav.length; i < len; i++){
      str += `<li><a href="#">${tag_nav[i]}</a></li>`;
    }
    /*生成分类标题*/
    title.innerHTML = `<span>${tag_nav[0]}</span><span>${tag_nav[1].toUpperCase()}</span>`;
    nav.innerHTML = str;
    /*排列子页面分类*/
    resetSubNav();
  });
}
/*排列子页面导航标签*/
function resetSubNav(){
  /*获取子页面导航元素*/
  let nav = document.getElementsByClassName('title-tag')[0],
      item = nav.children;
  /*定义变量存放导航实际宽度以及子元素间隔距离*/
  let nav_w = 0,
      nav_interval = 0;
  /*获取导航实际宽度*/
  for(let i = 0, len = item.length; i < len; i++){
    nav_w += Number(item[i].offsetWidth);
  }
  /*设置子元素间隔距离  */
  if(item.length > 6){
    /*当子元素大于6个时通过1000px减去导航真实宽度除以间隔数量除以2则为边距*/
    nav_interval = ((1000 - nav_w) / (item.length - 1)) / 2;
  }else{
    /*等同于百分之三 但是为固定值*/
    nav_interval = 1260 / 100 * 3;
  }
  /*为每个导航子元素设置边距*/
  for(let i = 0, len = item.length; i < len; i++){
    item[i].style.margin = '0 ' + nav_interval + 'px';
  }
}
/*加载商品数据*/
function loadGoods(){
  let goodsList = document.getElementsByClassName('goods-list')[0],
      str = '';
  /*请求json 获得商品数据*/
  ajax('GET','../js/data.json',function(o){
    let data = JSON.parse(o),
        goods = data.goods;
    /*遍历商品对象*/
    for(let i = 0, len = goods.length; i < len; i++){
      /*将每个商品对象添加到临时字符串存储·*/
      str += `<a href="datails.html" class="goods-item" data-goods="${goods[i].goodsId}">
          <figure>
            <img src="../resource/goods/goods_${goods[i].goodsId}.jpg" alt="">
          </figure>
          <div class="goods-info">
            <span class="goods-name">${goods[i].goodsName}</span>`;
      /*判断商品是否存在原始购买价格 */
      if(goods[i].goodsOldPrice != ''){
        str += `<span class="goods-price">￥${goods[i].goodsOldPrice}<span class="old-price-line"></span></span>`
      }
      /*加载价格信息*/
      str += `<span class="goods-price">￥${goods[i].goodsPrice}</span>
          </div>
        </a>`
    }
    /*生成商品列表*/
    goodsList.innerHTML = str;
    /*绑定跳转*/
    getGoodsDatails();
  })
}




