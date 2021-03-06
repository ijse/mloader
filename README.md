mloader 组件加载 v0.4
====================

##特点 ##
1. 随用随调，支持缓存，节省带宽资源
2. 支持同步和异步两种加载方式, 并且可以混合使用
3. 基于jQuery1.5+, 异步时返回Deferred对象，使用起来更加优雅
4. 组件编写非常简单，不需要像seaJS那样包裹define函数，直接将组件对象返回即可（无须引用则不返回也可以）
5. 百十行代码实现，小巧简洁，压缩后不到1KB

##使用方法 ##

1. 引入jQuery 1.5+和mloader

		<script src="jquery.js" type="text/javascript"></script>
		<script src="mloader.js" type="text/javascript"></script>

2. 配置及使用   


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
		var mods = require("mod1", "mod2"); // mods={ "mod1": Object, "mod2": Object }


##组件编写规范 ##

	(function() {
		// 组件代码

		return 组件实例
	})

## 兼容Combo合并的考虑 ##
根据原理，require()函数获取到组件代码后，会执行并把组件对象缓存到window.modules对象中，若已经有缓存则不会再去服务器端取。因此合并时只需要缓存对象即可完美兼容。
代码改动起来很简单，合并组件时，只需要在每个组件代码前面添加：
	
		window.modules[组件文件名]=组件代码

合并时要考虑引入（执行）顺序。


##更新内容 ##
1. 异步引入时返回Deferred对象
2. 支持批量加载
	
##其它说明 ##
1. 遇到循环依赖时会报错
2. 其中某组件运行错误时会报错
3. 组件加载是同步的，因此会阻塞页面其它内容的加载和JS代码的执行
4. 已经加载的组件会被缓存，第二次require时直接返回同一个组件实例
