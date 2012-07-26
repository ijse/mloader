
 (function() {
	"use strict"

	var Class = function(properties) {
	    var Class = function() {
	        return (arguments[0] !== null && this.initialize && typeof(this.initialize) == 'function') ? 
	        		this.initialize.apply(this, arguments) : this;
	    };
	    Class.prototype = properties;
	    return Class;
	};

	var properties = {
		// 私有变量
		options: {
			height: 300,
			width: 400,
			name: "doreamon"
		},
		// 构造函数, 必须得是`initialize`
		initialize: function(opts) {
			// 初始化过程
			var self = this; 
			$.extend(this.options, opts); // 保存构造参数

			// 暴露接口
			return {
				// 公共方法
				description: function() {
					return "Description:\n" + self.show();
				}
			}
		}, 
		// 私有方法
		show: function() {
			return this.options.name + " " + this.options.width + "x" + this.options.height;
		}
	}

	var MyClass = new Class(properties); // 定义一个类
	var instance = new MyClass(); // 创建此类的一个对象实例

	//console.log(instance);
	//console.log(instance.description());

	var submod = require("mod1_1", true);
	
	console.log("mod1_1 sleep");
	for(var i=0; i<99999999; i++) ;
	console.log("mod1_1 awake");
	// load submodule


	//console.log("Submod: " + submod);
	console.log("run mod1.js");

	return instance;
 })()


