
window.onload = function(){
  addGoodsInfo();
  addImgList();
}
/*生成图片详情列表*/
function addImgList(){
  /*找到商品详情主图以及列表所在所愿*/
  let mainImg = document.getElementsByClassName('main-goods-img')[0],
      list = document.getElementsByClassName('slider-img-list')[0],
      str = '';
  /*请求数据加载商品信息 通过商品信息加载图片*/
  ajax('GET', '../js/data.json', function(o) {
    let data = JSON.parse(o),
        goods = data.goods,
        clickGoods = sessionStorage.getItem('click-goods');
    /*获取在子页面点击的商品ID 获取该ID对应数据*/
    for(let i = 0, len = goods.length; i < len; i++){
      /*找到对应ID后*/
      if(goods[i].goodsId == clickGoods){
        /*生成主图*/
        mainImg.innerHTML = `<img src="../resource/goods/goods_${goods[i].goodsId}.jpg">`;
        /*生成图片列表字符串*/
        for(let j = 0; j < goods[i].goodsDatailsImgNum; j++){
          str += `<li><img src="../resource/datails/goods_1_${j+1}.jpg" alt="${goods[i].goodsName}"></li>`;
        }
      }
    }
    /*生成图片列表*/
    list.innerHTML = str;
    /*重新排列图片列表*/
    resetImgList(list);
    /*设置图片点击切换事件*/
    goodsImgTab(mainImg,list);
  });
}
/*商品详情 图片点击切换*/
function goodsImgTab(mainImg,list) {
  /*获取图片列表项*/
  let item = list.children;
  for(let i = 0, len = item.length; i < len; i++){
    /*为每个列表项添加点击事件*/
    item[i].onclick = function(){
      /*每次点击后清除所有列表项上的选中样式*/
      for(let j = 0; j < len; j++){
        item[j].className = item[j].className.replace(/active/g,'');
      }
      /*为选中的列表项添加选中样式*/
      this.className += ' active';
      /*设置主图路径为选中列表项路径*/
      mainImg.children[0].src = this.children[0].src;
    }
  }
}
/*排列详情图片列表*/
function resetImgList(list){
  let item = list.children,
      item_len = item.length,
      str = '';
  /*图片宽度为容器宽度减去边距宽度*/
  let item_w = (100 - 2 * (item_len - 1)) / item_len;
  /*为每个列表项设置2%的右边距 以及宽度*/
  for(let i = 0; i < item_len; i++){
    item[i].style.marginRight = '2%';
    item[i].style.width = item_w + '%';
  }
  /*默认为第一个元素添加选中状态*/
  item[0].className = 'active';
  /*清除最后一个item的右边距*/
  item[item_len-1].style.marginRight = '0';
  /*当item宽高长宽比大于1.1时 item高度等于宽度*/
  if(item[0].offsetHeight / item[0].offsetWidth > 1.1){
    for(let i = 0; i < item_len; i++){
      item[i].style.height = item[0].offsetWidth + 'px';
    }
  }
}
/*生成商品基本信息*/
function addGoodsInfo(){
  /*封装一个以class获取元素的方法  不兼容低版本IE*/
  let getClass = document.getElementsByClassName.bind(document);
  /*找到商品基本信息的容器*/
  let info = getClass('goods-info')[0],
      clickGoods = sessionStorage.getItem('click-goods'),
      str = '';
  /*请求数据 获得商品信息*/
  ajax('GET', '../js/data.json', function(o){
    let data = JSON.parse(o),
        userInfo = data.userInfo,
        goods = data.goods,
        presentGoods = null;
    /*通过存入session的商品ID加载商品*/
    for(let i = 0, len = goods.length; i < len; i++){
      if(goods[i].goodsId == clickGoods){
        /*存储当前获取到的商品信息*/
        presentGoods = goods[i];
        /*将获取到的商品名称以及标签存入临时字符串*/
        str += `<h1 class="goods-name">${goods[i].goodsName}</h1><p class="goods-tag"><span>${goods[i].goodsTag}</span></p><div class="goods-price">`;
        /*判断当前商品是否有原始购买价格*/
        if(goods[i].goodsOldPrice != ''){
          str += `<div class="price"><span class="up">￥</span><span class="num" >${goods[i].goodsOldPrice}</span><span class="down">元</span><span class="goods-old-price"></span></div>`;
        }
        /*将商品当前价格存入字符串*/
        str += `<div class="price"><span class="up">￥</span><span class="num" >${goods[i].goodsPrice}</span><span class="down">元</span></div></div>`;
        /*判断当前是否有原始购买价格 为真时将其存入字符串*/
        if(goods[i].goodsOldPrice != ''){
          str += `<p><span>原始购买价格：</span><span class="old-price">${goods[i].goodsOldPrice}</span><span>元</span></p>`;
        }
        /*加载用户积分信息 以及商品库存数量 生成操作按钮等*/
        str += `<p><span>积分：</span><span class="integral">${userInfo.integral}</span><a href="#">了解积分规则</a></p><p><span> 库存数量：</span><span class="goods-stock">${goods[i].goodsStock}</span></p><div class="goods-ctrl"><div class="count-group"><input type="text" readonly value="0"><div class="count-ctrl"><button class="add">+</button><button class="minus" disabled>-</button></div></div><button type="button" class="btn btn-buy">立即购买</button><button type="button" class="btn btn-shopCar">加入购物车</button></div><div><button class="btn btn-service"></button></div><p class="hint">户里服务： 该商品在仓库，23点前完成下单可在后天（5月15日）送达/该商品在用户家中，23点前完成下单，可在（5天后）送达</p>`;
      }
    }
    if(clickGoods){
      /*生成商品信息*/
      info.innerHTML = str;
      loadGoodsDaitals(goods,presentGoods);
      
    }
  })
}
/*加载商品详情*/
function loadGoodsDaitals(goods,present) {
  let getId = document.getElementById.bind(document);
  let stand = getId('desc-standard'),
      datails = getId('desc-datails'),
      delivery = getId('desc-delivery'),
      recommend = getId('desc-recommend'),
      str1 = '', str2 = '';
  /*添加详情图片*/
  for(let i = 0; i < present.goodsDatailsImgNum; i++) {
    str1 += `<img src="../resource/datails/goods_1_datails_${i+1}.jpg" alt="${present.goodsName}">`;
  }
  /*添加推荐商品*/
  for(let i = 0; i < 3; i++) {
    var r_num = Math.ceil(Math.random() * (goods.length - 1));
    str2 += `<a href="datails.html" class="goods-item" data-goods="${goods[r_num].goodsId}"><figure><img src="../resource/goods/goods_${goods[r_num].goodsId}.jpg" alt=""></figure><div class="goods-info"><span class="goods-name">${goods[r_num].goodsName}</span>`;
    /*判断商品是否存在原始购买价格 */
      if(goods[r_num].goodsOldPrice != ''){
        str2 += `<span class="goods-price">￥${goods[r_num].goodsOldPrice}<span class="old-price-line"></span></span>`
      }
      /*加载价格信息*/
      str2 += `<span class="goods-price">￥${goods[r_num].goodsPrice}</span>
          </div>
        </a>`
  }
  stand.innerHTML = `<tr><td>尺寸：${present.goodsSize}</td><td>材质：${present.goodsTexture}</td><td>颜色：${present.goodsColor}</td></tr>`;
  datails.innerHTML = str1;
  delivery.innerHTML = `<p>${present.goodsDelivery}</p>`;
  recommend.innerHTML = str2;
  selectGoodsNum(present.goodsStock);
  getGoodsDatails();
}
/*商品数量选择*/
function selectGoodsNum(max_num){
  let countGroup = document.getElementsByClassName('count-group')[0],
      count = countGroup.children[0],
      ctrl = countGroup.children[1],
      add = ctrl.children[0],
      minus = ctrl.children[1];
  add.onclick = function() {
    let num = Number(count.value);
    /*当数量小于库存时*/
    if(num < max_num){
      num++;
    }
    /*当数量大于0时 删除minus按钮禁用状态*/
    if(num > 0) {
      minus.removeAttribute('disabled');
    }
    /*当数量与库存相等时为add按钮添加禁用状态*/
    if(num >= max_num){
      this.setAttribute('disabled','disabled');
    }
    count.value = num;
  }
  minus.onclick = function() {
    let num = Number(count.value);
    if(num > 0) {
      num--;
    }
    if(num < max_num) {
      add.removeAttribute('disabled');
    }
    if(num < 1){
      this.setAttribute('disabled','disabled');
    }
    count.value = num;
  }
}









