# wipe
Wipe是一款基于HTML5 canvas的移动端，涂抹，自动播放涂抹轨迹，刮刮乐的插件。可以轻松实现，涂抹，记录涂抹轨迹自动播放。


#1 使用说明

###html
	<div id="wipe"></div>
	<script src="../src/canvas.js"></script>
	<script src="../src/wipe.js"></script>
其中canvas.js是CanvasRenderingContext2D.prototype.扩展库。方便链式操作。
###css
	#wipe {
		margin: 10px auto;
		width: 300px;
		height: 430px;
		background: url(img/girl.jpg) no-repeat;
		background-size: 100% 100%;
	}
	canvas {
		opacity: 0.9;
	}

css其实只是指定canvas后面的世界，和canvas的大小；
###js
	var wipe = new Wipe({
		el: '#wipe',
		fg: '#ccc',
		size: 50,
		debug: false,
		autoWipe: false,
		data: null,
		onswiping: function (percent) {
			//do something 涂抹回调函数
		}
	})

#2 演示 就是这么简单，开始玩起来吧！
###1、默认
![](http://leicdn.duapp.com/Github/wipe/demo/img/default.png)
###2、自动涂抹，需要生成轨迹
![](http://leicdn.duapp.com/Github/wipe/demo/img/auto_wipe.png)
###3、涂抹图片
![](http://leicdn.duapp.com/Github/wipe/demo/img/wipe_img.png)

###轨迹生成方法：
打开debug，autoWipe=false，然后会在控制台输出数据轨迹，copy下来，放入 data中即可！
