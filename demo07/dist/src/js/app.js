webpackJsonp([0,3],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var verify = __webpack_require__(1);

/***/ },
/* 1 */
/***/ function(module, exports) {

	webpackJsonp([2,3],[
	/* 0 */
	/***/ function(module, exports) {

		;(function(){

			window.event = {
				version: '0.0.1'
			};
			var app = {};

			var ua = navigator.userAgent.toLowerCase(),
				match = ua.match(/(opera|firefox|chrome|version)[\s\/:]([\w\d\.]+)?.*?(safari|version[\s\/:]([\w\d\.]+)|$)/) || [null, 'unknown', 0];

			app['browser'] = (match[1] == 'version') ? match[3] : match[1];                                 //浏览器类型opera|firefox|chrome|safari
		    app['version'] = parseFloat((match[1] == 'opera' && match[4]) ? match[4] : match[2]);

		    //只有ie有documentMode
		    if(document.documentMode){
		        app['browser'] = 'ie';
		        app['version'] = document.documentMode; // ie浏览器版本
		    }

		    //新版本的opera，会同时有chrome和safari的信息，所以用opr
		    if(match = ua.match(/(opr)[\s\/:]([\w\d\.]+)?/)){
		        app['browser'] = 'opera';
		        app['version'] = match[2];
		    }

		    app[app['browser']] = parseInt(app['version'], 10);                                              //浏览器类型名称作为属性，值为版本整数值，可以当boolean值用
		    app[app['browser'] + parseInt(app['version'], 10)] = true;                                       //浏览器类型加版本号作为属性值为true

		    app['webkit'] = (ua.indexOf('webkit') != -1);



			/* 基础方法 */
			var methods = {

				isDef: function(value) {
					// return typeof value != 'undefined'; 慢
					return value !== undefined;
				},
				isNull: function(value) {
					return value !== null;
				},
				isArr: function(value) {
					return Object.prototype.toString.call(value) === '[object Array]';
				},
				isDate: function(value) {
					return Object.prototype.toString.call(value) === '[object Date]';
				},
				isObj: (app['ie'] <= 8) ? function(value) {
					return !!value && Object.prototype.toString.call(value) === '[object object]' && value.hasOwnProperty && !value.callee;
				} : function(value) {
					return Object.prototype.toString.call(value) === '[object object]';
				},
				isFun: function(value) {
					// return Object.prototype.toString.call(value) === '[object Function]'; 慢
					return typeof value === 'function';
				},
				isNum: function(value) {
					// return Object.prototype.toString.call(value) === '[object Number]' && isFinite(value); 慢
		            // 除去Infinity和NaN
		            return (typeof value === 'number') && isFinite(value);
				},
				isStr: function(value) {
					return typeof value === 'string';
				},
				isBool: function(value) {
					return typeof value === 'boolean';
				},
				isDom: function(value) {
					return this.isNode(value) || this.isWin(value);
				},
				isNode: function(value) {
					return value ? !!value.nodeType : false;
				},
				isTag: function(value) {
					return value ? !!value.tagName : false;
				},
				isBody: function(value) {
					return (/^(?:body|html)$/i).test(value.tagName);
				},
				isDoc: function(value) {
					return value && value.nodeType == 9;
				},
				isWin: function(value) {
					var str = value ? value.toString() : '';
					return str == '[object Window]' || str == '[object DOMWindow]';
				},
				typeOf: function(item) {
					if(item == null) {
						return 'null';
					}
					if(this.isArr(item)) {
						return 'array';
					}
					if(this.isDate(item)) {
						return 'date';
					}
					if(item.nodeName) {
						if(item.nodeType == 1) {
							return 'element';
						}
						if(item.nodeType == 3) {
							return (/\S/).test(item.nodeValue) ? 'textnode' : 'whitespace';
						}
					} else if(typeof item.length == 'number') {
						if(item.callee) {
							return 'arguments';
						}
					}
					return typeof item;
				},
				trim: function (string) {
		            return string ? string.replace(/^\s+|\s+$/g, '') : '';
		        },
		        ltrim: function(string){
					return string ? string.replace(/(^\s*)/g, "") : '';
				},
				rtrim: function(string){
					return string ? string.replace(/(\s*$)/g, "") : '';
				},
				/**
				 * [dateToStr Date对象转字符串]
				 * @param  {[type]} date    [要转换的Date对象]
				 * @param  {[type]} pattern [字符串格式模板, 其中字符"y"、"M"、"d"、"h"、"m"、"s"、"w"、"q"、"S"会被替代成日期对应的数值，长度由字符数决定]
				 * @return {[type]}         [满足pattern格式的字符串]
				 * eg:
				 * pattern 为 "yyyy-MM-dd", 返回 "2015-08-18"
				 * pattern 为 "yyyy-MM-dd hh:mm:ss"，则返回如 "2015-08-18 09:41:13"
		         * pattern 为 "yyyy-MM-dd hh:mm:ss"，则返回如 "2015-08-18 09:41:13"
		         * pattern 为 "yyyy-MM-dd hh:mm:ss +(S)"，则返回如 "2015-08-18 09:43:44 +(902)"
		         * pattern 为 "yy年第q季度"，则返回如 "15年第3季度"
		         * pattern 为 "今天是星期w"，则返回如 "今天是星期二"
				 */
				dateToStr: function(date, pattern) {
					if(this.isStr(date)) return date;

					var pattern = pattern || 'yyyy-MM-dd';
					var o = {
						"M+": date.getMonth() + 1, // Month 从Date对象返回月份（0 ~ 11）加以改成1 ~ 12月份
						"d+": date.getDay(), // day 从 Date 对象返回一个月中的某一天 （1 ~ 31）
						"h+": date.getHours(), // hour 从 Date 对象的小时（0 ~ 23）
						"m+": date.getMinutes(), // minute 返回 Date 对象的分钟（0 ~ 59）
						"s+": date.getSeconds(), // second 返回 Date 对象的秒数（0 ~ 59）
						"w+": "\u65e5\u4e00\u4e8c\u4e09\u56db\u4e94\u516d".charAt(date.getDay()), // "日一二三四五六"中的某一个
						"q+": Math.floor((date.getMonth() + 3) / 3), // 季度
						"S": date.getMilliseconds() // Date 对象的毫秒（0 ~ 999）
					};

					// 将 "yyyy-MM-dd"中的y替换成具体年份，并根据"y"的数量保留对应的位数
					if(new RegExp("(y+)").test(pattern)) {
						pattern = pattern.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
					}

					// 替换剩下的模板， 如果有的模板长度大于1， 如 "yyyy-MM-dd"中的"MM", "dd",则定位两位，实际字符串长度不足两位的，前面用0补足
					for(var k in o) {
						if(new RegExp("("+ k +")").test(pattern)) {
							pattern = pattern.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
						}
					}
					console.log(pattern);
					return pattern;
				},


				/**
				 * [strToDate 字符串转换成Date对象]
				 * @param  {[type]} str       [要转换的字符串]
				 * @param  {[type]} delimiter [字符串年月日分隔符，默认为 "-"]
				 * @param  {[type]} pattern   [字符串年月日模板（年月日的索引对应字符串按delimiter分割后的数组索引）]
				 * @return {[type]}           [日期对象]
				 * eg:
				 * app.strToDate('2015-03-28') 返回Sat Mar 28 2015 00:00:00 GMT+0800 (中国标准时间) 的Date对象
		         * app.strToDate('2015/03/28', '/') 返回Sat Mar 28 2015 00:00:00 GMT+0800 (中国标准时间) 的Date对象
		         * app.strToDate('03/28/2015', '/', 'mdy') 返回Sat Mar 28 2015 00:00:00 GMT+0800 (中国标准时间) 的Date对象
				 */
				strToDate: function(str, delimiter, pattern) {
					if(this.isDate(str)) return str;

					delimiter = delimiter || "-";
					pattern = pattern || "ymd";
					var array = str.split(delimiter); // 当前字符串值的年月日数组
					var y = parseInt(array[pattern.indexOf("y")], 10); // 年的整数值

					// 如果年的值小，则为20xx年
					if(y.toString().length <= 2) {
						y += 2000;
					}

					// 如果年不是数字，则取当前年
					if(isNaN(y)){
						y = new Date().getFullYear();
					}

					var m = parseInt(array[pattern.indexOf("m")], 10) - i; // 月为字符串月的整数值减一，变成下班从0开始
					var d = parseInt(array[pattern.indexOf("d")], 10); // 字符串日的整数值

					// 如果日不是数字，则是1日
					if(isNaN(d)){
						d = 1;
					}

					return new Date(y, m, d);
				},
				/* 数组合并,将两个数组合并成一个数组 */
				append: function(array, newArray) {
					array.push.apply(array, newArray);
					return array;
				}
			};

			/* 校验方法 */
			var verify = {

				/**
		         * 获取字节长度 ok
		         * @param {string} val 要计算字节长度的字符串
			     * @return number 字节长度
		         */

		        getByte: function (val) {
		            var len = 0;
		            for (var i = 0; i < val.length; i++) {
		                if (val[i].match(/[^\x00-\xff]/ig) != null) { //全角
		                    len += 2;
		                } else {
		                    len += 1;
		                }
		            };
		            return len;
		        },

		        /**
		         * 电话号码/传真 ok
		         * @param object 参数对象options
			     * @return 空、公司名称
		         * @rules 数字、减号-
		         */

		        telephone: function (options) {
		        	// js 合并多个对象（等同于jquery里面的$.extend)
		            var options = Object.assign({
		                phone: null,
		                must: true
		            }, options);

		            var $val = options.phone;
		            var result = '';

		            if ($val.length) {

		                var val = methods.trim($val);
		                var reg = /^[0-9-]+$/;

		                if (options.must) {
		                    result = !reg.test(val) ? '' : val;
		                } else {
		                    if (val != '') {
		                        result = reg.test(val) ? val : '';
		                    } else {
		                        result = true;
		                    }
		                }
		            }
		            return result;
		        },
			};

			window.event.methods = methods;
			window.event.verify = verify;
		})();

	/***/ }
	]);

/***/ }
]);