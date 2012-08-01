/**
 * 动态组件加载v0.4
 * @author ijse(i@ijser.cn)
 * @depend jQuery 1.5+
 * @date   2012-07-27
 * 
 * ##更新内容 ##
 * 	1. 异步引入时返回Deferred对象
 * 	2. 支持批量加载
 * 	3. 改进参数格式
 */
window.require = (function($) {
	"use strict";

	var thisLoader = this;
	var modules = {};
	var stack = [];

	function indexOfArray(arr, val) {
		var value = arr;
		for(var i =0; i < value.length; i++){  
			if(value[i] == val) return i;  
		}  
		return -1;  
	}

	function getOValues(obj) {
		var vals = [];
		for(var i in obj) {
			vals.push(obj[i]);
		}
		return vals;
	}

	function checkCircle(name) {
		if($.inArray(name, stack) !== -1) {
			var str = "<pre>ERROR: Circled Require when:\n" + 
							stack.toString().replace(",", "\n") + 
						"</pre>"; 
			document.write(str);
			throw str;
		}
	}

	function evalScript(data, modulePath) {
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
	 * @param  {String}   name     加载组件名称，不包含.js
	 * @param  {Boolean}  isAsync  是否为异步，默认为同步
	 * @param  {Function} callback 异步加载时的回调函数，参数为组件对象
	 * @param  {Object}   scope    异步加载时的回调函数执行域
	 * @return {Object}            同步加载时返回组件对象，异步时返回Deferred对象
	 */
	function fetch(name, isAsync, callback, scope) {
		var baseDir = require.base;
		var module = null;
		// If cached, return 
		if(module = modules[name]) {
			return module;
		}

		console.log((isAsync ? "异步" : "同步")  + " 加载 " + name);

		// Check if circled require
		checkCircle(name);
		
		stack.push(name);

		// Load module sync
		var modulePath = baseDir + name + ".js";
		var dfd = $.Deferred();
		$.ajax({
			url: modulePath, 
			dataType: "text",
			async: isAsync || false
		}).done(function(data) {
			this.module = module = evalScript(data, name);
			// Cache module
			modules[name] = module;

			if($.isFunction(callback)) {
				callback.call(scope || window, module);
			}
			dfd.resolve(module);
		});

		// Finish requiring
		stack.pop();

		// if async, return Deferred Object
		return isAsync ? dfd.promise() : module;
	}

	return function() {

		var args = Array.prototype.slice.call(arguments, 0);

		// Get minimum right(not -1) location of `isAsync` argument
		var bloc = Math.min.apply(null, $.grep([indexOfArray(args, true), indexOfArray(args, false)], 
							function(item) { return item>0; })) || args.length;

		var names = args.slice(0, bloc);
		var ocfg = args.slice(bloc);
		var isAsync = ocfg[0];
		var callback = ocfg[1];
		var scope = ocfg[2];

		// Filter string
		names = $.grep(names, function(i) { return typeof i === "string"; } );

		if(names.length === 1) {
			return fetch.apply(thisLoader, arguments);
		} else if(names.length > 1) {
			var mods = {};
			$(names).each(function(index, item) {
				mods[item] = fetch.apply(thisLoader, [item, isAsync]);
			});

			if(isAsync) {
				var dfds = getOValues(mods);
				var dfd = $.when.apply(thisLoader, dfds).done(function() {
					if($.isFunction(callback)) {
						callback.apply(scope || window, arguments);
					}
				});
				return dfd.promise();
			} else {
				return mods;
			}
		} else {
			throw "Wrong Arguments!";
		}
	}

})(jQuery)

// if(!Array.prototype.indexOf){  
// 	Array.prototype.indexOf = function(val){  
// 		var value = this;  
// 		for(var i =0; i < value.length; i++){  
// 			if(value[i] == val) return i;  
// 		}  
// 		return -1;  
// 	};  
// }