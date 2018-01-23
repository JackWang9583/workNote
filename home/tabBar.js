/*
 * @Author: JackWang9583 
 * @Date: 2017-12-30 22:51:24 
 * @Last Modified by: JackWang9583
 * @Last Modified time: 2018-01-22 17:52:24
 */
var tabBar = {
  /**
   * 定位到选项卡
   * 
   * @param {Object} obj JQ 或者 DOM 对象 
   */
  switch: (obj) => {
    $(obj).addClass('active');
    $(obj).siblings().removeClass('active');
    var index = $('#tabBar a').index(obj);
    var $iframe = $('#iframeBox').children(':eq(' + index + ')');
    $iframe.siblings().removeClass('active');    
    $iframe.addClass('active');
  },
  /**
   * 打开新窗口
   * 
   * @param {Object} obj {title: '', url: ''}
   * @returns 
   */
  open: (obj) => {
    if ( !obj ) return;
    var obj = eval('(' + obj + ')');
    if ( !obj.title || !obj.url ) return;
    var title = obj.title,// 窗口名称
      url = obj.url// 窗口url
      isNew = true// 是否创建
    ;
    // 判断是否存在
    $('#tabBar a').each((key, el) => {
      var dataUrl = $(el).attr('data-url');
      if ( dataUrl === url  ) {// 存在则定位
        tabBar.switch(el);
        isNew = false;// 不创建
        tabBar.change(1);// 定位选项卡
      }
    });
    if ( !isNew ) return;// 不创建则返回
    $('#tabBar a').removeClass('active');
    $('#iframeBox iframe').removeClass('active');
    var htmlBar = `<a href="javascript:;" class="tabLi active" data-url="${url}">${title}<i class="fa fa-times-circle"></i></a>`;
    var htmlIframe = `<iframe class="iframeLi active" name="${url}" src="${url}" frameborder="0"></iframe>`;
    $('#tabBar').append(htmlBar);
    $('#iframeBox').append(htmlIframe);
    tabBar.change(0);// 定位选项卡
  },
  /**
   * 关闭窗口
   * 
   * @param {Object} obj JQ 或者 DOM 对象
   * @param {Number} type 关闭的类型 1 => 关闭非active窗口; 2 => 关闭active窗口
   */
  close: (obj, type) => {
    var index = $('#tabBar a').index(obj);
    var $iframe = $('#iframeBox').children(':eq(' + index + ')');    
    if ( $(obj).attr('class').indexOf('active') > 0 ) type = 2;  
    if ( type === 1 ) {
      $(obj).remove();
      $iframe.remove();
    } else if ( type === 2 ){
      $('#tabBar a').removeClass('active');
      $('#iframeBox iframe').removeClass('active');
      $(obj).prev().addClass('active');
      $(obj).remove();
      $iframe.prev().addClass('active');
      $iframe.remove();
    }
    tabBar.change(2);    
  },
  /**
   * 改变显示窗口的位置
   * 
   * @param {Number} type 0 => 新建一个窗口; 1 => 定位窗口; 2 => 关闭窗口; 3 => 向左翻页; 4 => 向右翻页;
   * @returns 
   */
  change: (type) => {
    var showWidth = tabBar.computer($('.tabBarBox'));// 显示的最大长度
    var allWidth = tabBar.computer($('.tabLi'));// 所有窗口的长度
    var barWidth = tabBar.computer($('.tabLi.active').prevAll());// 显示窗口前面窗口的总长度
    var nowWidth = tabBar.computer($('.tabLi.active'));// 显示窗口的长度
    var nowLeft = Math.abs(parseFloat($('#tabBar').css('left')));// 目前的偏移距离
    // 新增
    if ( allWidth > showWidth + nowLeft && type === 0 ) {// 如果active窗口不能完全显示
      $('#tabBar').css('left', '-' + barWidth + 'px');
      return;
    }
    // 定位
    if (type === 1) {// active窗口显示在第一个
      if ( allWidth > showWidth ) $('#tabBar').css('left', '-' + barWidth + 'px');
      return;
    }
    // 关闭（当关闭显示区域的最后一个窗口的时候触发） 和 向左翻页
    if ( (Math.abs(allWidth - nowLeft) < 10 && type === 2) || type === 4 ){
      if ( nowLeft === 0 ) return;// 如果不能翻页则返回
      var width = 0;// 声明辅助变量
      var arr = [];// 声明数据，容纳前方未显示的窗口
      $('.tabLi').each((key, el) => {
        if ( width < nowLeft ) {// 添加数组
          arr.push($(el));
        }
        width += $(el).outerWidth(true);
      });
      arr = arr.reverse();// 倒叙
      var offSet = 0// 声明偏移量
        addOffSet = true;// 是否增加偏移量
      $.each(arr, (key, el) => {
        var w = $(el).outerWidth(true);
        if ( addOffSet ) offSet += w;// 增加偏移量
        if( offSet > showWidth ) {// 如果偏移量大于显示宽度，贼减少并之后不在添加
          addOffSet = false;
          offSet -= w;
        }
      });
      $('#tabBar').css('left', '-' + (nowLeft - offSet > 0 ? nowLeft - offSet : 0) + 'px');
      return;
    }
    // 向右边翻页
    if ( type === 5 ) {// 如果不能翻页则返回
      if ( allWidth - nowLeft < showWidth ) return;
      var width = 0// 声明辅助变量
        offSet = 0;// 声明偏移量
      $('.tabLi').each((key, el) => {
        width += $(el).outerWidth(true);
        if ( width > nowLeft && width < nowLeft + showWidth ) {// 显示的完整的窗口的总长度为偏移量
          offSet += $(el).outerWidth(true);
        }
      });
      $('#tabBar').css('left', '-' + (nowLeft + offSet) + 'px');      
      return;
    }
  },
  // 刷新
  reload: () => {
    var index = $('#tabBar a').index($('#tabBar a.active').get(0));
    var $obj = $('#iframeBox').children(':eq(' + index + ')');
    $obj.attr('src', $obj.attr('src'));
  },
  // 关闭全部
  closeAll: () => {
    $('#tabBar a:not(:first-child)').remove();
    $('#iframeBox iframe:not(:first-child)').remove();
    $('#tabBar').css('left', '0px');
  },
  // 关闭其他
  closeOther: () => {
    $('#tabBar a').each((key, el) => {
      if ( key !== 0 && $(el).attr('class').indexOf('active') < 0 ) $(el).remove();
    });
    $('#iframeBox iframe').each((key, el) => {
      if ( key !== 0 && $(el).attr('class').indexOf('active') < 0 ) $(el).remove();
    });
    $('#tabBar').css('left', '0px');
  },
  // 关闭左侧
  closeLeft: () => {
    var $obj1 = $('#tabBar a.active').prevAll();
    $obj1.each((key, el) => {
      if ( key !== $obj1.length - 1 ) $(el).remove();
    });
    var $obj2 = $('#iframeBox iframe.active').prevAll();
    $obj2.each((key, el) => {
      if ( key !== $obj2.length - 1 ) $(el).remove();
    });
    $('#tabBar').css('left', '0px');
  },
  // 关闭右侧
  closeRight: () => {
    $('#tabBar a.active').nextAll().remove();
  },
  /**
   * 计算元素宽度
   * 
   * @param {Object} obj JQ 或则 DOM 对象
   * @returns 
   */
  computer: (obj) => {
    var width = 0;
    $(obj).each((key, el) => {
      width += $(el).outerWidth(true);
    });
    return width;
  }
}