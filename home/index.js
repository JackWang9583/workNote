/*
 * @Author: JackWang9583 
 * @Date: 2017-12-30 23:02:13 
 * @Last Modified by: JackWang9583
 * @Last Modified time: 2018-01-23 14:12:19
 */
// 引用JS开始
addJS('../');
// 引用JS完毕
// 定义ayer模块
var layer,
  element;
window.onload =function() {
  enterLoadClose();
  // 添加nav
  addNav($('#navList'));
  // 加载layer模块
  layui.use(['layer', 'element'], () => {
    layer = layui.layer;
    element = layui.element;
  });
  // 打开/定位 窗口
  $('#navList .layui-nav-child a').click(function (e) {
    e.preventDefault();
    var obj = {
      title: $(this).text(), url: $(this).attr('href')
    }
    obj = JSON.stringify(obj);
    tabBar.open(obj);
  });
  // 关闭/切换窗口
  $('#tabBar').mouseenter(function () {
    // 先移除事件 方式重复触发
    $('#tabBar a').unbind('click');
    $('#tabBar .fa').unbind('click');
    // 切换窗口
    $('#tabBar a').click(function () {
      tabBar.switch(this);
    });
    // 关闭窗口
    $('#tabBar .fa').click(function () {
      tabBar.close($(this).parent().get(0), 1);
    });
  });
  // 定义滚动条插件
  $('#navList').mCustomScrollbar({
    autoHideScrollbar: true,
    autoExpandScrollbar: true,
    advanced:{ 
      autoExpandHorizontalScroll: true,
      updateOnSelectorChange: "*"
    }
  });
  // 左右按钮
  $('#toLeft').click(() => {
    tabBar.change(4);
  });
  $('#toRight').click(() => {
    tabBar.change(5);
  });
  // 下拉框操作
  $('#btnList').click(() => {
    if ( $('.myPop').css('display') === 'none' ) {
      $('.myPop').fadeIn();
    } else {
      $('.myPop').fadeOut();
    }
  });
  // 刷新
  $('.popReload').click(() => {tabBar.reload()});
  // 关闭全部
  $('.popAll').click(() => {tabBar.closeAll()});
  // 关闭其他
  $('.popOther').click(() => {tabBar.closeOther()});
  // 关闭左侧
  $('.popLeft').click(() => {tabBar.closeLeft()});
  // 关闭右侧
  $('.popRight').click(() => {tabBar.closeRight()});
}
// 查找active的iframe的name
function searchName () {
  var str = $('#iframeBox iframe.active').attr('name')
  return str;
}
