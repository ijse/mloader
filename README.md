
loader 组件加载 v0.4
====================

##特点 ##
	1. 组件编写非常简单，不需要像seaJS那样包裹define函数，直接将组件对象返回即可（不返回也可以）

##使用方法 ##

	// 设置组件目录
	window.moduleDir = "./modules/"; 
	// 同步引入
	var mod = require("mod"); // 组件名，不包括.js
	// 异步引入
	var mod = require("mod", true, callback, scope); // `callback`与`scope`可省略
	// 异步时返回Deferred对象
	require("mod", true).done(function(mod) {
		// load ok
	})
	// 也支持批量引入，此时返回一个Object，其键名为模块名
	var mods = require(["mod1", "mod2"]); // mods={ "mod1": Object, "mod2": Object }

##组件编写规范 ##

	(function() {
		// 组件代码

		return 组件实例
	})
		
##更新内容 ##
	1. 异步引入时返回Deferred对象
	2. 支持批量加载
	
##其它说明 ##
	1. 遇到循环依赖时会报错
	2. 其中某组件运行错误时会报错
	3. 组件加载是同步的，因此会阻塞页面其它内容的加载和JS代码的执行
	4. 已经加载的组件会被缓存，第二次require时直接返回同一个组件实例
