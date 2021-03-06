
/**
 * 动态组件加载v0.3 --- NOT FINISHED
 * @author : ijse
 *
 * #使用方法：#
 *
 * 		// 设置组件目录
 *  	window.moduleDir = "./modules/"; 
 *  	// 同步引入
 *		var mod = require("mod"); // 组件名，不包括.js
 *		// 异步引入
 *		var mod = require("mod", true, callback, scope); // `callback`与`scope`可省略
 * 
 * #组件编写规范：#
 * 
 * 		(function() {
 *			// 组件代码
 *
 * 			return 返回的组件实例
 * 		})
 * 		
 * # Updated
 * 	添加异步加载功能
 * 	
 * #其它说明：#
 * 	1. 遇到循环依赖时会报错
 * 	2. 其中某组件运行错误时会报错
 * 	3. 组件加载是同步的，因此会阻塞页面其它内容的加载和JS代码的执行
 * 	4. 已经加载的组件会被缓存，第二次require时直接返回同一个组件实例
 */
window.require = (function() {

	var modules = {};
	var stack = [];

	function checkCircle(name) {
		if($.inArray(name, stack) !== -1) {
			var str = "<pre>ERROR: Circled Require when:\n" + 
							stack.toString().replace(",", "\n") + 
						"</pre>"; 
			document.write(str);
			throw str;
		}
	}

	function evalScript(data) {
		var module = null; 
		try {
			module = eval(data);
		} catch(e) {
			// if module runs with error...
			var err = "ERROR: in module \"" + modulePath + "\"\n" + e.toString();
			document.write("<pre>" + err + "</pre>");
			throw err;
		}
		return module;
	}

	/**
	 * 加载js方法
	 * @param  {string}   name     加载组件名称，不包含.js，支持数组
	 * @param  {Boolean}  isAsync  是否为异步，默认为同步
	 * @param  {Function} callback 异步加载时的回调函数，参数为组件对象
	 * @param  {Object}   scope    异步加载时的回调函数执行域
	 * @return {Object}            同步加载时返回组件对象，异步时返回null
	 */
	return function(names, isAsync, callback, scope) {
		var baseDir = window.moduleDir;
		var module = null;

		if(typeof names === "string") {
			names = [ names ];
		} else if(typeof names !== "array") {
			throw "Arguments Error!!";
		}


		console.log((isAsync ? "async" : "sync")  + " loading " + names.toString());
		var alist = [];
		$(names).each(function(index, item) {
			var name = item;
			// If cached, return 
			if(modules[name]) {
				return false;
			}
			// Check if circled require
			checkCircle(name);
			stack.push(name);
			
			// Load module sync
			var modulePath = baseDir + name + ".js?v=34";

			alist.push($.ajax({
				url:modulePath,
				dataType: "text",
				async: isAsync || false
			}))
		});
		$.when(alist)
		 .done(function() {
		 	$(arguments).each(function(index, item) {
		 		module = eval(item);
		 		modules[name] = module;

		 		//FFFFFUCKKKKK! 



		 		// Finish requiring
				stack.pop();
		 	});
		 	
		 	if(typeof callback === "function") {
				callback.call(scope || window, module);
			}

		 }).fail(function() {
		 	//TODO: throw error when failed
		 })




		

		$.ajax({
			url: modulePath, 
			dataType: "text",
			async: isAsync || false
		}).done(function(data) {
			module = evalScript(data);
			// Cache module
			modules[name] = module;

			if(typeof callback === "function") {
				callback.call(scope || window, module);
			}
		})

		// Finish requiring
		stack.pop();
		return module;
	}

})()