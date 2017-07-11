window.onload = function(){
  bindEvent();
}
function bindEvent(){
  /*获取登录或者注册的容器*/
  let box = document.getElementsByClassName('login-box')[0],
      /*获取容器中所有input元素*/
      input = box.getElementsByTagName('input'),
      /*当前页面为登录时 submit就是登录按钮 否则为注册*/
      submit = document.getElementById('login-submit') || document.getElementById('register-submit');
  /*遍历所有input元素添加keyup事件*/
  for(let i = 0, len = input.length; i < len; i++){
    input[i].oninput = function(){
      /*验证当前元素是否符合规则*/
      valider(this);
      /*设置submit是否禁用*/
      setSubmit(submit);
    }
    input[i].onfocus = function(){
      /*验证当前元素是否符合规则*/
      valider(this);
      /*设置submit是否禁用*/
      setSubmit(submit);
    }
  }
  /*点击登录或者注册按钮*/
  submit.onclick = function(){
    /*当submit按钮未禁用时验证账号*/
    if(getSubmit(this)){
      /*判断是否为注册按钮  为注册时调用注册方法反之调用登录方法*/
      if(this.getAttribute('id').indexOf('register') != -1){
        register();
      }else{
        login();
      }
    }
  }
}
/*注册*/
function register(){
  /*获取账号以及密码*/
  let user = document.getElementById('register-username').value,
      pwd = document.getElementById('register-password').value;
  /*将获取到的账号密码存入localstorge*/
  localStorage.setItem('username',user);
  localStorage.setItem('password',pwd);
  /*当localstorge中username不为空时 注册成功*/
  if(localStorage.getItem('username') != ''){
    alert('注册成功')
    /*跳转到登录界面*/
    setTimeout(function(){
      location.href = './login.html';
    },500);
  }
}
/*登录*/
function login(){
  /*获取账号以及密码*/
  let user = document.getElementById('login-username').value,
      pwd = document.getElementById('login-password').value;
  /*判断获取到的账号以及密码是否与loalstorge中所存储的是否相同*/
  if(user == localStorage.getItem('username') && pwd == localStorage.getItem('password')){
    /*核对成功后 早session中存入登录状态*/
    sessionStorage.setItem('loginState','logined');
    /*存入后判断当前是否为主页后跳转到主页 */
    setTimeout(function(){
      if(isIndex()){
        location.href = 'index.html';
      }else{
        location.href = '../index.html';
      }
    },0);
  }else{
    alert('登录失败 账号或密码有误');
  }
}
/**
* 获得提交按钮禁用状态
**/
function getSubmit(submit){
  let flag = false;
  if(submit.getAttribute('disabled') == null){
    flag = true;
  }else{
    flag = false;
  }
  return flag;
}
/**
*   设置提交按钮禁用状态
**/
function setSubmit(submit){
  let error = document.getElementsByClassName('error-info'),
      touched = document.getElementsByClassName('form-touched'),
      flag = true;
  /*touched为已操作标示   当已操作标示的长度与错误信息长度不一致时禁用提交按钮*/
  if(touched.length != error.length ){
    flag = false;
  }
  /*遍历所有错误信息元素 只要存在一个错误信息不为空 提交按钮禁用*/
  for(let i = 0, len = error.length; i < len; i++){
    if(error[i].textContent != ''){
      flag = false;
    }
  }
  if(flag){
    submit.removeAttribute('disabled')
  }else{
    submit.setAttribute('disabled','disabled')
  }
}

/*
* 设置显示错误信息
*/
function setError(e, msg){
  /*获取自定义属性data-type进行类型判断*/
  let type = e.getAttribute('data-type'),
      value = e.value,
      errorInfo = e.nextElementSibling;
  /*如果为确认密码时*/
  if(type == 'confirmPwd'){
    let pwd = document.getElementById('register-password');
    if(value != pwd.value){
      addError();
    }else{
      clearError();
    }
  }
  /*调用regValider 进行正则验证*/
  else if(regValider(type, value)){
    clearError();
  }else{
    addError();
  }
  /*添加错误信息以及样式*/
  function addError(){
    /*设置错误信息为参数msg*/
    errorInfo.textContent = msg;
    /*当不存在错误样式时添加*/
    if(e.className.indexOf('form-error') == -1){
      e.className += ' form-error';
    }
    /*当不存在操作标示样式时添加*/
    if(e.className.indexOf('form-touched') == -1){
      e.className += ' form-touched';
    }
  }
  /*清除错误信息以及样式*/
  function clearError(){
    /*为真时  错误信息清空*/
    errorInfo.textContent = '';
    /*清除 错误样式*/
    e.className = e.className.replace(/ ?form-error/g ,'');
    /*清除 多余已操作标示*/
    e.className = e.className.replace(/ ?form-touched/g ,' form-touched');
  }
}
/*
*   数据有效验证
*   验证后显示错误信息
*/
function valider(e){
  let type = e.getAttribute('data-type');
  switch(type){
    case 'username':
      setError(e, '请输入正确的邮箱!');
      break;
    case 'password':
      /*为注册界面时*/
      if(e.getAttribute('id').indexOf('register') != -1){
        /*当值为空或者不为数字时*/
        if(isNaN(Number(e.value)) || e.value == ''){
          setError(e, '请输入6~16位密码!');
        }else{
          setError(e, '不能使用纯数字!');
        }
      /*为登录界面时 */
      }else{
        setError(e, '请输入6~16位密码!');
      }
      break;
    case 'confirmPwd':
      setError(e, '两次输入密码不同!');
      break;
  }
}
/**
* 数据正则验证
* 返回布尔值
**/
function regValider(type,value){
  let reg = '',
      flag = false;
  /*判断传入的type为reg赋值不同的正则表达式*/
  switch(type){
    case 'username':
      reg = /^[\w^_]+@\w+\.\w+$/;
      break;
    case 'password':
      reg = /^([A-Za-z0-9]){6,16}$/;
      break;
  }
  flag = reg.test(value);
  return flag;
}
