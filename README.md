loader 动态组件加载v0.2
======

async/sync load module with ajax

@author : ijse

##使用方法：##

	// 设置组件目录
	window.moduleDir = "./modules/"; 
	// 同步引入
	var mod = require("mod"); // 组件名，不包括.js
	// 异步引入
	var mod = require("mod", true, callback, scope); // `callback`与`scope`可省略

##组件编写规范：#

	(function() {
		// 组件代码

		return 返回的组件实例
	})
		
## Updated ##
	添加异步加载功能
	
##其它说明：##
	1. 遇到循环依赖时会报错
	2. 其中某组件运行错误时会报错
	3. 组件同步引入时，会阻塞页面其它内容的加载和JS代码的执行
	4. 已经加载的组件会被缓存，第二次require时直接返回同一个组件实例
