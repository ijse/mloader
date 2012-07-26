
/**
 * 动态组件加载v0.1
 * @author : ijse
 *
 * #使用方法：#
 * 
 *  	window.moduleDir = "./modules/"; // 设置组件目录
 *		var mod = require("mod"); // 组件名，不包括.js
 * 
 * #组件编写规范：#
 * 
 * 		(function() {
 *			// 组件代码
 *
 * 			return 返回的组件实例
 * 		})
 *
 * #其它说明：#
 * 	1. 遇到循环依赖时会报错
 * 	2. 其中某组件运行错误时会报错
 * 	3. 组件加载是同步的，因此会阻塞页面其它内容的加载和JS代码的执行
 * 	4. 已经加载的组件会被缓存，第二次require时直接返回同一个组件实例
 */

"use strict"

window.require = (function() {

	var modules = {};
	var stack = [];

	var fn = function(name) {
		var baseDir = window.moduleDir;
		var module;
		// If cached, return 
		if(module = modules[name]) {
			return module;
		}

		console.log("loading " + name);
		// Check if circled require
		if($.inArray(name, stack) !== -1) {
			var str = "<pre>ERROR: Circled Require when:\n" + 
							stack.toString().replace(",", "\n") + 
						"</pre>"; 
			document.write(str);
			throw str;
		}
		
		stack.push(name);

		// Load module sync
		var modulePath = baseDir + name + ".js";
		$.ajax({
			url: modulePath, 
			dataType: "text",
			async: false
		}).done(function(data) {
			try {
				module = eval(data);
			} catch(e) {
				// if module runs with error...
				var err = "ERROR: in module \"" + modulePath + "\"\n" + e.toString();
				document.write("<pre>" + err + "</pre>");
				throw err;
			}
			// Cache module
			modules[name] = module;
		})


		// Finish requiring
		stack.pop();
		return module;
	}

	return fn;
})()



