var webpack = require('webpack');
var fs = require('fs');
var path = require('path');
var glob = require('glob');
// plugins 是插件项，这里我们使用了一个 CommonsChunkPlugin 的插件，它用于提取多个入口文件的公共脚本部分，然后生成一个 common.js 来方便多页面之间进行复用。
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');
// 有时候可能希望项目的样式能不要被打包到脚本中，而是独立出来作为.css，然后在页面中以<link>标签引入。
var ExtractTextPlugin = require("extract-text-webpack-plugin");


const debug = process.env.NODE_ENV !== 'production';

/**
 * [entries 引入所有js文件]
 * @param  {[type]} globPath [description]
 * @return {[type]}          [description]
 */
function entries(globPath) {
    var files = glob.sync(globPath);
    var entries = {},
        entry, dirname, basename;

    for (var i = 0; i < files.length; i++) {
        entry = files[i];
        dirname = path.dirname(entry);
        basename = path.basename(entry, '.js');
        entries[path.join(dirname, basename)] = './' + entry;
    }

    // console.log(entries);
    return entries;
}

/**
 * [alias 引入所有js文件]
 * @param  {[type]} globPath [description]
 * @return {[type]}          [description]
 */
function alias(globPath) {
    var files = glob.sync(globPath);
    var alias = {},
        entry, dirname, basename;

    for (var i = 0; i < files.length; i++) {
        entry = files[i];
        dirname = path.dirname(entry);
        basename = path.basename(entry, '.js');
        alias[basename] = entry;
    }

    console.log(alias);
    return alias;
}

module.exports = {
    // 插件项
    plugins: [commonsPlugin, new ExtractTextPlugin('[name].css')],
    // 页面入口文件配置
    entry: entries('src/js/**/*.*'),
    // entry: {
    //     app: './src/js/app.js',
    //     index: './src/js/page/index.js'
    //     //支持数组形式，将加载数组中的所有模块，但以最后一个模块作为输出
    // },
    // 入口文件输出配置
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js'
    },
    module: {
        // 加载器配置
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
    // 其它解决方案配置
    resolve: {
        //查找module的话从这里开始查找
        root: 'G:/yaochufa/NodeDemo/demo07/dist', // 绝对路径
        //自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
        extensions: ['', '.js', '.json', '.scss'],
        //模块别名定义，方便后续直接引用别名，无须多写长长的地址
        alias: alias('src/js/**/*.js')
    }
}
