;(function($){
	$.verify = {

		// /i (忽略大小写)
		// /g (全文查找出现的所有匹配字符)
		// /m (多行查找)
		// /gi(全文查找、忽略大小写)
		// /ig(全文查找、忽略大小写)

		/**
		 * [getByte 获取字节长度]
		 * @param  {[type]} val [description]
		 * @return {[type]}     [description]
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
         * [ifYCF 判断是否要出发App]
         * @return {[type]} [description]
         */
        ifYCF: function(){
        	var flag = navigator.userAgent.match(/yaochufa/i) ? true : false;
        	return flag;
        },

       	/**
       	 * [getVersion 获取版本号]
       	 * @return {[type]} [description]
       	 */
        getVersion: function(){
        	var agent = navigator.userAgent.toLowerCase();
        	var regStr_ie = /msie [\d.]+/gi;
			var regStr_ff = /firefox\/[\d.]+/gi;
			var regStr_chrome = /chrome\/[\d.]+/gi;
			var regStr_saf = /safari\/[\d.]+/gi;
			var regStr_ycf = /appversion\/[\d.]+/gi;
			//IE
			if(agent.indexOf("msie") > 0) {
				return agent.match(regStr_ie);
			}

			//firefox
			if(agent.indexOf("firefox") > 0) {
				return agent.match(regStr_ff);
			}

			//Chrome
			if(agent.indexOf("chrome") > 0)	{
				return agent.match(regStr_chrome);
			}

			//Safari
			if(agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0) {
				return agent.match(regStr_saf);
			}

			//Ycf
			if(agent.indexOf("appversion") > 0) {
				return agent.match(regStr_ycf);
			}
        },

        /**
         * [countDown 倒计时] 
         * @param  {[type]} time [时间戳， 结束时间] 时间戳为毫秒，如果是秒，无需除以1000
         * @return {[type]}      [倒计时参数对象]
         */
        countDown: function(time, intetval){
			var timer = null;
        	var startTime = new Date().getTime(); // 开始时间
            var endTime = time; // 结束时间
            var countdownTamp = endTime - startTime;

            // countdownTamp -=1000;
            if(countdownTamp < 0){
                countdownTamp = 0;
                clearInterval(intetval);
            }
            var s = datePlusZero(Math.floor(countdownTamp / 1000 % 60));
            var m = datePlusZero(Math.floor(countdownTamp / (60 * 1000) % 60));
            var h = datePlusZero(Math.floor(countdownTamp / (60 * 60 * 1000) % 24));
            var d = datePlusZero(Math.floor(countdownTamp / (24 * 60 * 60 * 1000)));
            timer = {
            	day: d,
            	hour: h,
            	minute: m,
            	second: s
            }


            function datePlusZero(num) {//时间日期小于10前面的加0
	            if (num < 10) num = '0' + num;
	            return num;
	        }
	        return timer;
        },

        /**
		 *1.采用getSearchParameter().get("参数名")获取结果
		 *2.或者var param=getSearchParameter();
		 *  var value=param.参数名;
		**/
		/**
		 * [getSearchParameter 获取URL地址后面所带参数]
		 * @return {[type]} [description]
		 */
		getSearchParameter: function() {
		    var theRequest = new Object();
		    theRequest.get = function(name) {
		        var value = this[name];
		        if (value == null) {
		            return;
		        }
		        if (value.length < 1) {
		            return;
		        }
		        return value[0];
		    };
		    var url = location.search;
		    if (url == null || url == '') {
		        return theRequest;
		    }
		    if (url.indexOf("?") == -1) {
		        return theRequest;
		    }
		    var str = url.substr(1);
		    var strs = str.split("&");
		    for (var i = 0; i < strs.length; i++) {
		        var entry = strs[i].split("=");
		        if (entry.length != 2) {
		            continue;
		        }
		        var name = decodeURIComponent(entry[0]);
		        var value = decodeURIComponent(entry[1]);
		        var values = theRequest[name];
		        if (values == null) {
		            values = new Array();
		            theRequest[name] = values;
		        }
		        values[values.length++] = value;
		    }
		    return theRequest;
		},

		/**
         * 电话号码/传真 ok
         * @param object 参数对象options
	     * @return 空、公司名称
         * @rules 数字、减号-
         */
        telephone: function (options) {
            var options = $.extend({
                elem: null,
                must: true
            }, options);

            var $elem = options.elem instanceof jQuery ? options.elem : $(options.elem);
            var result = '';

            if ($elem.length) {
                var defaultValue = $elem[0].defaultValue;
                var val = $.trim($elem.val());
                var reg = /^[0-9-]+$/;
                if (options.must) {
                    result = !reg.test(val) ? '' : val;
                } else {
                    if (val != '' && val != defaultValue) {
                        result = reg.test(val) ? val : '';
                    } else {
                        result = true;
                    }
                }

            }
            return result;
        },

        /**
         * 手机号码 ok
         * @param object 参数对象options
	     * @return 空、公司名称
         * @rules 11位手机号
         */

        mobilePhone: function (options) {

            var options = $.extend({
                elem: null,
                must: true
            }, options);

            var $elem = options.elem instanceof jQuery ? options.elem : $(options.elem);
            var result = '';

            if ($elem.length) {

                var defaultValue = $elem[0].defaultValue;
                var val = $.trim($elem.val());
                var dReg = /^1[3578][01379]\d{8}$/g; // 电信
                var lReg = /^1[34578][01256]\d{8}$/g; // 联通
                var yReg = /^(134[0-8]\d{7}|1[34578][0-47-8]\d{8})$/g; // 移动

                if (options.must) {
                    if (val != defaultValue && (dReg.test(val) || lReg.test(val) || yReg.test(val))) {
                        result = val;
                    } else {
                        result = '';
                    }
                } else {
                    if (val != '' && val != defaultValue) {
                        result = reg.test(val) ? val : '';
                    } else {
                        result = true;
                    }
                }

            }

            return result;

        },

        /**
         * QQ号码 ok
         * @param object 参数对象options
	     * @return 空、公司名称
         * @rules 数字
         */

        qq: function (options) {

            var options = $.extend({
                elem: null,
                must: false
            }, options);

            var $elem = options.elem instanceof jQuery ? options.elem : $(options.elem);
            var result = '';

            if ($elem.length) {

                var defaultValue = $elem[0].defaultValue;
                var val = $.trim($elem.val());
                var reg = /^[0-9]+$/;

                if (options.must) {
                    result = (val == defaultValue || !reg.test(val)) ? '' : val;
                } else {
                    if (val != '' && val != defaultValue) {
                        result = reg.test(val) ? val : '';
                    } else {
                        result = true;
                    }
                }

            }

            return result;

        },

        /**
         * email ok
         * @param object 参数对象options
	     * @return 空、公司名称
         * @rules 必须带@
         */

        email: function (options) {

            var options = $.extend({
                elem: null,
                must: false
            }, options);

            var $elem = options.elem instanceof jQuery ? options.elem : $(options.elem);
            var result = '';

            if ($elem.length) {

                var defaultValue = $elem[0].defaultValue;
                var val = $.trim($elem.val());
                var reg = /\w+((-w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+/;

                if (options.must) {
                    result = (val == defaultValue || !reg.test(val)) ? '' : val;
                } else {
                    if (val != '' && val != defaultValue) {
                        result = reg.test(val) ? val : '';
                    } else {
                        result = true;
                    }
                }

            }

            return result;

        },

        /**
         * 密码验证
         * @param object 参数对象options
	     * @return 空、公司名称
         * @rules 长度必须为6至32位,且包含数字或字母
         */

        password: function (options) {

            var options = $.extend({
                elem: null,
                must: true
            }, options);

            var $elem = options.elem instanceof jQuery ? options.elem : $(options.elem);
            var result = '';

            if ($elem.length) {

                var defaultValue = $elem[0].defaultValue;
                var val = $.trim($elem.val());
                var reg = /^[0-9|a-zA-Z]{6,32}$/;

                if (options.must) {
                    result = (val == defaultValue || !reg.test(val) || val.indexOf(' ') > -1) ? '' : val;
                } else {
                    if (val != '' && val != defaultValue) {
                        result = reg.test(val) ? val : '';
                    } else {
                        result = true;
                    }
                }

            }

            return result;

        }
	}
})(jQuery);