var tyTool = {
	// 数据格式化函数集合
	format: {
		/**
     * 格式化url
     * 
     * @param {string} [url=''] 
     * @param {number} [type=0] 
     * @returns 
     */
    url: function(url = '', type = 0) {
			if (url === '') return;
			if (url.indexOf('https://') >= 0) url = url.split('https://').join(''); // 去掉https
			if (url.indexOf('http://') >= 0) url = url.split('http://').join(''); // 去掉http
			if (type === 0) return url; // 返回标准格式
			if (type === 1) return 'http://' + url; // 返回http格式
			if (type === 2) return 'https://' + url; // 返回https格式
		},
		/**
     * 格式化日期
     * 
     * @param {string} [date=''] 
     * @param {string} [type='yyyy-mm-dd'] 
     * @returns 
     */
    date: function(date = '', type = 'yyyy-mm-dd') {
			var date = new Date(date);
			if (date === 'Invalid Date') return ' ';
			if (type === 'yyyy-mm-dd')
				return (
					date.getFullYear() +
					'-' +
					(date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)) +
					'-' +
					(date.getDate() >= 10 ? date.getDate() : '0' + date.getDate())
				);
			// if ( type === 'yyyy/mm/dd' ) return date.getFullYear() + '/' + (date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1) ) + '/' + ( date.getDate() >= 10 ? date.getDate() : '0' + date.getDate() )
		},
		/**
     * 格式化文本
     * 
     * @param {string} [text=''] 
     * @returns 
     */
    text: function(text = '') {
			if ( text === '' ) return;
			[
				[ '<.*?>', '<br />' ],
				[ '&amp;', '&' ],
				[ '&apos;', '’' ],
				[ '&#x27;', '’' ],
				[ '&#x2F;', '/' ],
				[ '&#39;', '’' ],
				[ '&#47;', '/' ],
				[ '&lt;', '<' ],
				[ '&gt;', '>' ],
				[ '&nbsp;', ' ' ],
				[ '&quot;', '"' ],
				[ '\\n+', '' ],
				[ '\\s+', ' ' ],
				[ '(^\\s*)|(\\s*$)', '' ]
			].forEach((pair) => {
				text = text.replace(new RegExp(pair[0], 'ig'), pair[1]);
			});
			return text;
		}
	},
	/**
   * 获取地址栏参数
   * 
   * @param {string} [name=''] 
   * @returns 
   */
  getUrlParams: function(name = '') {
		if (name === '') return;
		var url = window.location.search; //获取url中"?"符后的字串
		var theRequest = new Object();
		if (url.indexOf('?') != -1) {
			var str = url.substr(1);
			strs = str.split('&');
			for (var i = 0; i < strs.length; i++) {
				//就是这句的问题
				theRequest[strs[i].split('=')[0]] = decodeURI(strs[i].split('=')[1]);
				//之前用了unescape()
				//才会出现乱码
			}
		}
		return theRequest[name];
	},
	/**
   * 计算年龄
   * 
   * @param {any} [startTime=new Date()] 
   * @param {any} [endTime=new Date()] 
   * @returns { dayAge: {Number},// 天龄
                weekAge: {Number},// 周龄
                monthAge: {Number},// 月龄
                yearAge: {String}// 年龄详情显示} 
   */
  computerBirth: function(startTime = new Date(), endTime = new Date()) {
		var startTime = tyTool.format.date(startTime),
			endTime = tyTool.format.date(endTime);
		var regTime = new RegExp('^\\d{4}-\\d{2}-\\d{2}$'); // 验证日期格式;
		if (!regTime.test(startTime)) return;
		if (!regTime.test(endTime)) return;
		if (new Date(startTime).getTime() > new Date(endTime).getTime()) {
			// 如果开始事件大于结束事件 交换起始时间
			var _startTime = startTime,
				_endTime = endTime;
			startTime = _endTime;
			endTime = _startTime;
		}
		// 数组化日期
		startTime = startTime.split('-');
		endTime = endTime.split('-');
		var startYear = parseInt(startTime[0]), // 获取开始年
			startMonth = parseInt(startTime[1]), // 获取开始月
			startDay = parseInt(startTime[2]), // 获取开始日
			endYear = parseInt(endTime[0]), // 获取结束年
			endMonth = parseInt(endTime[1]), // 获取结束月
			endDay = parseInt(endTime[2]), //  获取结束日
			resYear = endYear - startYear, // 计算年份差
			resMonth = endMonth - startMonth, // 计算月份差
			resDay = endDay - startDay; // 计算天份差
		if (resMonth < 0) {
			// 如果月份差小于0
			resYear--;
			resMonth += 12;
		}
		// 计算天龄
		var dayAge = (function() {
			var n = 0;
			var nowYear = startYear, // 声明当前计算年
				nowMonth = startMonth; // 声明当前计算月
			function a() {
				// 以月份为单位，从开始加到结束
				var date = new Date(nowYear + '-' + nowMonth + '-1');
				var month = date.getMonth() + 1;
				date.setMonth(month);
				date.setDate(0);
				n += date.getDate();
				if (date.getTime() < new Date(endYear + '-' + endMonth + '-1').getTime()) {
					// 如果未到结束日期，自调形成循环
					nowMonth++;
					if (nowMonth > 12) {
						// 如果大于12月
						nowYear++;
						nowMonth -= 12;
					}
					a(); //自调
				}
			}
			a();
			n = (function() {
				// 最终计算的准确值
				var date = new Date(endTime);
				var month = date.getMonth() + 1;
				date.setMonth(month);
				date.setDate(0);
				return n - date.getDate() + endDay - startDay;
			})();
			return n;
		})();
		// 计算周龄
		var weekAge = (function() {
			return parseFloat((dayAge / 7).toFixed(2));
		})();
		// 计算月龄
		var monthAge = (function() {
			var n1 = 12 * resYear;
      var n2 = resMonth;
      var date = new Date(endTime);
      var month = date.getMonth() + 1;
      date.setMonth(month);
      date.setDate(0);
      var days = date.getDate();// 当前月的天数
			return parseFloat((n1 + n2 + resDay/days).toFixed(1));
		})();
		// 计算完整的单位
		// var yearAge = resYear + '年' + resMonth + '月' + resDay + '天';
		var yearAge = (function() {
			var GetYear = resYear,
				GetMonth = resMonth,
				GetDay = resDay;
			if (GetDay < -15) {
				// 如果差值小于-15
				if (GetMonth > 0) {
					// 且月份差大于0
					resMonth--;
					var date = new Date(endYear + '-' + (endMonth - 1) + '-' + endDay);
					var month = date.getMonth() + 1;
					date.setMonth(month);
					date.setDate(0);
					GetDay += date.getDate();
					return GetYear + '年' + GetMonth + '月' + GetDay + '天';
				} else {
					// 但是月份差为0
					return GetYear + '年' + GetMonth + '月差' + GetDay * -1 + '天';
				}
			} else if (GetDay < 0) {
				// 差值小于0大于-15
				return GetYear + '年' + GetMonth + '月差' + GetDay * -1 + '天';
			} else {
				// 差值大于0
				return GetYear + '年' + GetMonth + '月' + GetDay + '天';
			}
		})();

		var obj = {
			dayAge: dayAge,
			weekAge: weekAge,
			monthAge: monthAge,
			yearAge: yearAge
		};
		return obj;
	},
	/**
   * 表单反赋值
   * 
   * @param {any} [obj={}] 
   * @param {any} [checks=-1] 
   * @returns 
   */
  formEvaluate: function(obj = {}, checks = -1) {
		if (!obj || !checks) return;
		var obj = obj,
			checks = checks;
		$.each(obj, function(key, el) {
			var mark = document.getElementsByName(key); // 获取元素
			if (mark && mark.length > 0) {
				// 如果获取的元素存在
				var markName = mark[0].tagName; // 获取元素的 标签类型
			}
			if (markName === 'INPUT') {
				// 如果是 input 元素
				var $obj = $('input[name=' + key + ']');
				if (!$obj) return;
				var type = $obj.attr('type'); // 获取input类型
				if (type === 'radio') {
					// 如果是单选框
					$('input[name=' + key + '][value=' + el + ']').attr('checked', true);
				} else if (type === 'checkbox') {
					// 如果是复选框且被选中
					if (el == checks) $obj.attr('checked', true);
				} else {
					// 其他
					$obj.val(el);
				}
			} else if (markName === 'SELECT') {
				// 如果是select元素
				if (!$('select[name=' + key + ']')) return;
				$('select[name=' + key + ']').val(el);
			}
		});
	},
	/**
   * 图片懒加载
   * 
   * 需要使用懒加载的图片需要 添加class  lazyImg
   * 图片路径存放再 lazy-imgUrl
   */
	lazyImg: function() {
		var arr = document.getElementsByClassName('lazyImg'); // 获取需要懒加载的所有的图片
		loadImg(arr); // 第一次触发
		window.onscroll = function() {
			//滚动条滚动触发
			var arr = document.getElementsByClassName('lazyImg'); // 获取需要懒加载的所有的图片
			loadImg(arr);
		};
		//getBoundingClientRect 是图片懒加载的核心
		function loadImg(arr) {
			for (var i = 0, len = arr.length; i < len; i++) {
				if (arr[i].getBoundingClientRect().top < document.documentElement.clientHeight && !arr[i].isLoad) {
					arr[i].isLoad = true; // 表示图片已经开始显示
					aftLoadImg(arr[i], arr[i].getAttribute('lazy-imgUrl'));
				}
			}
		}
		function aftLoadImg(obj, url) {
			var oImg = new Image();
			oImg.src = url; //oImg对象先下载该图像
			oImg.onload = function() {
				obj.src = oImg.src; //下载完成后将该图片赋给目标obj目标对象
			};
		}
	},
	/**
   * loading模态框
   * 
   * @param {Object} $obj 必须为 jq 对象 默认值为 $('body')
   */
	loadModal: function($obj) {}
};
