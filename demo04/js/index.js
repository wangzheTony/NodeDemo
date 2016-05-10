$(function(){
	
	$(document).on('click', '.alert-text', function(){
		$.alert('这是一个提示语');
	});
	
	$(document).on('click', '.alert-text-title', function(){
		$.alert('这是一个提示语', '提示');
	});
	
	$(document).on('click', '.confirm-ok', function(){
		$.confirm('确定删除吗？',function(){
			$.alert('确定');
		});
	});
	
	$(document).on('click', '.open-indicator', function(){
		$.showIndicator();
	    setTimeout(function () {
	        $.hideIndicator();
	    }, 2000);
	});
	$(document).on('click', '.open-preloader', function(){
		$.showPreloader();
	    setTimeout(function () {
	        $.hidePreloader();
	    }, 2000);
	});
	$(document).on('click','.open-preloader-title', function () {
	    $.showPreloader('Custom Title')
	    setTimeout(function () {
	        $.hidePreloader();
	    }, 2000);
	});
	
	
	$(document).on('click','.open-about', function () {
		$.popup('.popup-about');
	});
	$(document).on('click','.open-services', function () {
		$.popup('.popup-services');
	});
	
	
	$(document).on('refresh', '.pull-to-refresh-content', function(e){
		// 模拟2s的加载过程
		setTimeout(function() {
	        var cardNumber = $(e.target).find('.card').length + 1;
	        var cardHTML = '<div class="card">' +
	                          '<div class="card-header">card'+cardNumber+'</div>' +
	                          '<div class="card-content">' +
	                            '<div class="card-content-inner">' +
	                                '这里是第' + cardNumber + '个card，下拉刷新会出现第' + (cardNumber + 1) + '个card。' +
	                            '</div>' +
	                          '</div>' +
	                      '</div>';
	
	        $(e.target).find('.card-container').prepend(cardHTML);
	        // 加载完毕需要重置
	        $.pullToRefreshDone('.pull-to-refresh-content');
	    }, 2000);
	});
	
	infiniteBottom();
	console.log($.device);
	$.compareVersion('8.0', '7.1.1');
	
	var photos = $.photoBrowser({
	    photos : [
	        '//gqianniu.alicdn.com/bao/uploaded/i4//tfscom/i1/TB1n3rZHFXXXXX9XFXXXXXXXXXX_!!0-item_pic.jpg_320x320q60.jpg',
	        '//gqianniu.alicdn.com/bao/uploaded/i4//tfscom/i4/TB10rkPGVXXXXXGapXXXXXXXXXX_!!0-item_pic.jpg_320x320q60.jpg',
	        '//gqianniu.alicdn.com/bao/uploaded/i4//tfscom/i1/TB1kQI3HpXXXXbSXFXXXXXXXXXX_!!0-item_pic.jpg_320x320q60.jpg',
	    ]
	});
	$(document).on('click', '.swiper-slide img', function(){
		photos.open();
	});
	/*=== 默认为 standalone ===*/
	var myPhotoBrowserStandalone = $.photoBrowser({
	    photos : [
	        '//img.alicdn.com/tps/i3/TB1kt4wHVXXXXb_XVXX0HY8HXXX-1024-1024.jpeg',
	        '//img.alicdn.com/tps/i1/TB1SKhUHVXXXXb7XXXX0HY8HXXX-1024-1024.jpeg',
	        '//img.alicdn.com/tps/i4/TB1AdxNHVXXXXasXpXX0HY8HXXX-1024-1024.jpeg',
	    ]
	});
	$(document).on('click', '.pb-standalone', function(){
		myPhotoBrowserStandalone.open();
	});
	/*=== Popup ===*/
  	var myPhotoBrowserPopup = $.photoBrowser({
      	photos : [
      		'//img.alicdn.com/tps/i3/TB1kt4wHVXXXXb_XVXX0HY8HXXX-1024-1024.jpeg',
        	'//img.alicdn.com/tps/i1/TB1SKhUHVXXXXb7XXXX0HY8HXXX-1024-1024.jpeg',
        	'//img.alicdn.com/tps/i4/TB1AdxNHVXXXXasXpXX0HY8HXXX-1024-1024.jpeg',
    	],
    	type: 'popup'
  	});
	$(document).on('click', '.pb-popup', function(){
		myPhotoBrowserPopup.open();
	});
	
	//	监听路由切换
	$(document).on("pageInit", function(e, pageId, $page) {
		if(pageId == "pageIndex") {}
	});
	
	
	
	$.init();
});


function infiniteBottom(){
	// 加载flag
    var loading = false;
    // 最多可加载的条目
    var maxItems = 100;

    // 每次加载添加多少条目
    var itemsPerLoad = 20;
    
    var addItems = function(number, lastIndex){
    	// 生成新条目的HTML
    	var html = '';
    	for(var i = lastIndex + 1; i <= lastIndex + number; i++){
    		html += '<li class="item-content"><div class="item-inner"><div class="item-title">Item ' + i + '</div></div></li>';
        }
    	// 添加新条目
      	$('.infinite-scroll-bottom .list-container').append(html);
    }
    
    //预先加载20条
	addItems(itemsPerLoad, 0);
	var lastIndex = $('.list-container li').length;
    
    // 注册'infinite'事件处理函数
	$(document).on('infinite', '.infinite-scroll-bottom', function(){
		// 如果正在加载，则退出
		if(loading) return;
		
		// 设置flag
		loading = true;
		
		// 模拟1s的加载过程
		setTimeout(function(){
			// 重置加载flag
			loading = false;
			
			if(lastIndex >= maxItems){
				// 加载完毕，则注销无限加载事件，以防不必要的加载
                $.detachInfiniteScroll($('.infinite-scroll'));
                // 删除加载提示符
                $('.infinite-scroll-preloader').remove();
                return;
			}
			
			// 添加新条目
			addItems(itemsPerLoad, lastIndex);
			// 更新最后加载的序号
	        lastIndex = $('.list-container li').length;
	        //容器发生改变,如果是js滚动，需要刷新滚动
	        $.refreshScroller();
		}, 1000);
	});
}
