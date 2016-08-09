var gulp = require('gulp'),
	argv = require('yargs').argv,
	fs = require('fs'),
	fse = require('fs-extra'),
	path = require('path'),
	util = require('util');

var	webpack = require('webpack'),
	commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common', 'common.js'),
	ExtractTextPlugin = require("extract-text-webpack-plugin");
// var webpack = require('webpack-stream');


var isWatch = true;
var isProduct = false;
var project = 'iwjw-pc';
//gulp --product
gulp.task('default', function(){
	isProduct = argv.product;
	isWatch = !isProduct;

	console.log('正在处理：' + (isProduct ? '线上' : '本地') + '环境');
	fse.emptydirSync('./dist/js');

	gulp.start('webpack');
});

/* 将dist/js下面所有的js计算md5戳, 并将dist/app/下的html中script中的src引用文件名替换为加了md5的文件名，再将md5文件替换到目标目录dist/js。 */
gulp.task('md5:js', function(done) {
	gulp.src('dist/js/*.js')
		.pipe(md5(10, 'page/**/*.html'))
		.pipe(gulp.dest('dist/js'))
		on('end', done);
});
/* 将dist/style, 并将dist/app/下的html中script中的src引用文件名替换为加了md5的文件名，再将md5文件替换到目标目录dist/style。 */
gulp.task('md5:css', function(done) {
	gulp.src('dist/style/*.css')
		.pipe(md5(10, 'page/**/*.html'))
		.pipe(gulp.dest('dist/style'))
		on('end', done);
});



/**************************************************************************************/

var src = './src';
function getEntry() {
	var jsPath = path.resolve(src, 'js');
	var dirs = fs.readdirSync(jsPath);
	var matchs = [], files = {};
	dirs.forEach(function(item) {
		matchs = item.match(/(.+)\.js$/);
		if(matchs) {
			files[matchs[1]] = path.resolve(src, 'js', item);
			// console.log(files[matchs[1]]);
		}
	});
	return files;
}
/**
 * [alias 引入所有js文件]
 * @param  {[type]} globPath [description]
 * @return {[type]}          [description]
 */
function alias() {
    var jsPath = path.resolve(src, 'js');
	var dirs = fs.readdirSync(jsPath);
	var matchs = [], files = {};
	dirs.forEach(function(item) {
		matchs = item.match(/(.+)\.js$/);
		if(matchs) {
			files[matchs[1].split('.')[0]] = path.resolve('./dist', 'js', item);
		}
	});
	// files['jquery'] = path.resolve('src/lib/jquery.min.js');
	// console.log(files);
	return files;
}

gulp.task('webpack', function(callback) {
	var minfy = [];
	isProduct && minfy.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        },
        mangle: {
            except: ['$', 'm', 'webpackJsonpCallback']
        }
    }));

    //webpack配置文件
   	var config = {
   		devtool: (isProduct ? false : 'source-map'),
   		watch: isWatch,
   		entry: getEntry(), // 获取项目入口js文件
   		debug: true,
   		output: {
			path: path.join(__dirname, 'dist/js/'), // 文件输出目录
			publicPath: 'dist/js/', // 用于配置文件发布路径，如CDN或本地服务器
			filename: "[name].js" // 根据入口文件输出的对应多个文件吗
		},
		module: {
			// 各种加载器，即让各种文件格式可用rquire引用
			loaders: [
				//.css 文件使用 style-loader 和 css-loader 来处理
	            { test: /\.css$/, loader: 'style-loader!css-loader' },
	            //.js 文件使用 jsx-loader 来编译处理
	            { test: /\.js$/, loader: 'jsx-loader?harmony' },
	            //.scss 文件使用 style-loader、css-loader 和 sass-loader 来编译处理
	            { test: /\.scss$/, loader: 'style!css!sass?sourveMap' },
	            //图片文件使用 url-loader 来处理，小于8kb的直接转为base64
	            { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192' }
			]
		},
		resolve: {
			//查找module的话从这里开始查找
        	// root: path.resolve('src/js'), //绝对路径
			//自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
			// extensions: ['', '.js', '.json', '.scss'],
			// 配置别名，在项目中可缩减引用路径
			// alias: {
			// 	jquery: path.resolve('src/lib/jquery.min.js'),
			// 	js: path.resolve('dist/js') // gulp别名必须是打包之后的路径，不能是打包之前的路径
			// }
			alias: alias()
		},
		plugins: [
			//提供全局的变量，在模块中使用无需用require引入
			// new webpack.ProvidePlugin({
			// 	jQuery: 'jquery',
			// 	$: 'jquery'
			// }),
			// 将公共代码抽离出来合并为一个文件
			commonsPlugin,
			new ExtractTextPlugin("[name].css"),
			// js文件的压缩
			// new webpack.optimize.uglifyJsPlugin({
			// 	compress: {
			// 		warnings: false
			// 	}
			// })
		]
   	};

   	webpack(config, function(err, stats) {
        console.log(stats.toString());
    });
});

/*
module.exports = {
	devtool: 'source-map', // 生成sourcemap,便于开发调试
	entry: getEntry(), // 获取项目入口js文件
	output: {
		path: path.join(__dirname, 'dist/js/'), // 文件输出目录
		publicPath: 'dist/js/', // 用于配置文件发布路径，如CDN或本地服务器
		filename: "[name].bundle.js" // 根据入口文件输出的对应多个文件吗
	},
	module: {
		// 各种加载器，即让各种文件格式可用rquire引用
		loaders: [
			//.css 文件使用 style-loader 和 css-loader 来处理
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            //.js 文件使用 jsx-loader 来编译处理
            { test: /\.js$/, loader: 'jsx-loader?harmony' },
            //.scss 文件使用 style-loader、css-loader 和 sass-loader 来编译处理
            { test: /\.scss$/, loader: 'style!css!sass?sourveMap' },
            //图片文件使用 url-loader 来处理，小于8kb的直接转为base64
            { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192' }
		]
	},
	resolve: {
		// 配置别名，在项目中可缩减引用路径
		alias: {
			jquery: path.resolve('src/lib/jquery.min.js'),
			core: path.resolve('src/core')
		}
	},
	plugins: [
		//提供全局的变量，在模块中使用无需用require引入
		new webpack.ProvidePlugin({
			jQuery: 'jquery',
			$: 'jquery'
		}),
		// 将公共代码抽离出来合并为一个文件
		commonsPlugin,
		// js文件的压缩
		// new webpack.optimize.uglifyJsPlugin({
		// 	compress: {
		// 		warnings: false
		// 	}
		// })
	]
};
*/