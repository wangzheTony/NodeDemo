var canvas = document.createElement("canvas");
var ctx = canvas.getContext('2d');
canvas.width = 340;
canvas.height = 340;
document.getElementById('content').appendChild(canvas);
//document.body.appendChild(canvas);

var bgReady = false;
var bgImage = new Image();
bgImage.onload = function(){
	bgReady = true;
}

bgImage.src = "http://www.gbtags.com/gb/laitu/340x340&text=game zone/555555/222222";// 定义背景图片


// 屌丝对象
var ds = {
	speed: 5
};
ds.x = canvas.width / 2;
ds.y = canvas.height / 2;

// 女神对象
var ns = {};
var nsCaught = 0;
// 键盘对象
var keysDown = {};
// 键盘事件处理
addEventListener("keydown", function(e){
	keysDown[e.keyCode] = true;
}, false);
addEventListener("keyup", function(e){
	delete keysDown[e.keyCode];
}, false);

// 重置女神位置
var reset = function(){
	ns.x = 20 + (Math.random() * (canvas.width - 40));
	ns.y = 20 + (Math.random() * (canvas.height - 40));
}

// 键盘控制效果
var update = function(){
	if(87 in keysDown){ // up
		ds.y -= ds.speed;
	}
	if(83 in keysDown){ // down
		ds.y += ds.speed;
	}
	if(65 in keysDown){ // left
		ds.x -= ds.speed;
	}
	if(68 in keysDown){ // right
		ds.x += ds.speed;
	}
	
	// 判断是否追上女生，即判断是否两个方框重叠
	if(
		ds.x <= (ns.x + 30)
		&& ns.x <= (ds.x + 30)
		&& ds.y <= (ns.y + 30)
		&& ns.y <= (ds.y + 30)){
		++nsCaught;
		reset();
	}
};
/*
 * canvas 生成的内容
 */
var render = function(){
	if(bgReady){
		ctx.drawImage(bgImage, 0, 0);
	}
	
	comm.drawCharactor(ns.x, ns.y, 'eb281d', 'ffffff');
	comm.drawCharactor(ds.x, ds.y, 'AAAAAA', 'ffffff');
	
	// 这里添加相关的游戏积分和倒计时
	ctx.fillStyle = 'rgb(250, 250, 250)';
	ctx.font = '18px microsoft yahei';
	ctx.fillStyle = '#efb73e';
	ctx.textAlign = 'left';
	ctx.textBaseline = 'top';
	
	if(endflag){
		ctx.fillText('游戏结束: 追上' + nsCaught + ' 位女神', 20, 20);
	} else {
		ctx.fillText('倒计时(' + count + ')：已追' + nsCaught + ' 位女神', 20, 20);
	}
}


/**
 * 游戏主程序，使用requestAnimationFrame生成动画效果
 */
var endflag = false, count = 10;
var main = function(){
	update();// 键盘控制效果
	render();// canvas 生成的内容
	
	if(!endflag){
		requestAnimationFrame(main);
	}
}

var comm = {
//	游戏任务生成方法
	drawCharactor: function(x, y, color, strokecolor){
		// 绘制正方形，并且填充颜色
		ctx.fillStyle = '#' + color;
		ctx.fillRect(x, y, 30, 30);
		ctx.fill();
		
		// 生成正方形边框
		ctx.strokeStyle = '#' + strokecolor;
		ctx.strokeRect(x, y, 30, 30);
	},
	gameover: function(){
		setTimeout(function(){
			endflag = true;
		}, 10000);
	},
	// 添加倒计时
	countdown: function(){
		var countinterval = setInterval(function(){
			count--;
		}, 1000);
		if(count === 0){
			clearInterval(countinterval);
		}
	}
}

var init = function(){
	main();
	reset();// 重置女神位置
	
	comm.countdown();
	comm.gameover();
}

//兼容不同浏览器
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
init();
