/**
 * 动态组件加载v0.2
 *
 * Update:
 * 	添加异步加载功能
 *
 * TODO:
 * 	批量加载
 * 	
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
	 * @param  {string}   name     加载组件名称，不包含.js
	 * @param  {Boolean}  isAsync  是否为异步，默认为同步
	 * @param  {Function} callback 异步加载时的回调函数，参数为组件对象
	 * @param  {Object}   scope    异步加载时的回调函数执行域
	 * @return {Object}            同步加载时返回组件对象，异步时返回null
	 */
	return function(name, isAsync, callback, scope) {
		var baseDir = window.moduleDir;
		var module = null;
		// If cached, return 
		if(module = modules[name]) {
			return module;
		}

		console.log((isAsync ? "async" : "sync")  + " loading " + name);

		// Check if circled require
		checkCircle(name);
		
		stack.push(name);

		// Load module sync
		var modulePath = baseDir + name + ".js?v=34";
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