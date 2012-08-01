/* sub module 
 * 
 */



(function() {
	"use strict"

	console.log("执行mod1_1, 并同步引入mod1_1_1");
	var m = require("mod1_1_1");
	console.log("执行mod1_1_1, mod1_1_1说：", m);
	console.log("mod1_1执行完毕");
	return "I'm mod1_1!";
})()