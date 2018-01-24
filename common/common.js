function addJS (url) {
  if( !url ) return;
  var url = url;
  var plugins = [
    'plugins/jquery/jquery.min.js',
    'plugins/layui/layui.js',
    'plugins/html2Canvas/html2canvas.js',
    'plugins/jqScroll/jquery.mCustomScrollbar.concat.min.js',
    'tyTool/tyTool.js',
    'plugins/echart/echarts.common.min.js',
    'plugins/jsPDF/jspdf.min.js',
  ];
  var index = 0;
  var doc = document;
  var doc_curren = document.currentScript;
  var errorTime = 0;
  function doAction () {
    var oScript = doc.createElement("script");
    oScript.type = "text\/javascript";
    doc_curren.parentNode.insertBefore(oScript, doc_curren);
    oScript.src = url + plugins[index];
    oScript.onerror = function () {
      alert('文件加载失败');
    };
    oScript.onload = function () {
      index++;
      if ( index < plugins.length )  doAction();
    };
  }
  doAction();
}
// 页面刚刚开始加载
var html = document.body.innerHTML;
var loadHtml = '<div id="enterLoader"> <div class="loader-inner line-scale"> <div></div> <div></div> <div></div> <div></div> <div></div> </div> </div>';
document.body.innerHTML = html + loadHtml;
function enterLoadClose () {
  $('#enterLoader').animate({
    opacity: 0
  }, 300, function () {
    $(this).remove();
  });
  // 定义body滚动条
  $('body').mCustomScrollbar({
    autoHideScrollbar: true,
    autoExpandScrollbar: true,
    advanced:{ 
      autoExpandHorizontalScroll: true,
      updateOnSelectorChange: "*"
    }
  });
}