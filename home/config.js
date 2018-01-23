/*
 * @Author: JackWang9583 
 * @Date: 2017-12-30 13:38:06 
 * @Last Modified by: JackWang9583
 * @Last Modified time: 2018-01-23 14:12:07
 */
// 定义数据和添加html
function addNav ($obj) {
  // 定义nav数组
  var data = [
    {
      head: {
        title: '百度API', url: 'javascript:;', fa: 'fa-building-o'
      },
      content: [
        { title: '地图', url: '../tabs/baidu/map/index.html' },
      ]
    },
    {
      head: {
        title: '儿童早起发育评测', url: 'javascript:;', fa: 'fa-stethoscope'
      },
      content: [
        { title: '儿童体格发育', url: '../tabs/TestManage/BodyTest05/index/index.html' },
        { title: '儿童喂养行为与膳食评估', url: '../tabs/TestManage/Nutrition/detail/index.html' }
      ]
    },
    {
      head: {
        title: '套餐服务', url: 'javascript:;', fa: 'fa-plus-square'
      },
      content: [
        { title: '创建档案', url: 'Position' },
        { title: '档案筛选', url: '' }
      ]
    },
    {
      head: {
        title: '基本信息', url: 'javascript:;', fa: 'fa-building-o'
      },
      content: [
        { title: '评测者信息', url: '../tabs/SystemManage/Tester/index/index.html' },
        { title: '办卡人信息', url: '' }
      ]
    }
  ];
  var html = '';
  $.each(data, function (key, el) {
    var str = `
      <li class="layui-nav-item">
        <a href="javascript:;"><i class="fa ${el.head.fa}"></i>${el.head.title}</a>
        <dl class="layui-nav-child">
    `;
    $.each(el.content, function (i, v) {
      str += `<dd><a href="${v.url}">${v.title}</a></dd>`
    });
    str += `
        </dl>
      </li>
    `;
    html += str;
  });
  $obj.html(html);
}
