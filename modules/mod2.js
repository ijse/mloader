
(function() {

	console.log("执行mod2, 并同步引入mod2_1");
	var mod2_1 = require("mod2_1", "mod1", false)["mod2_1"];
	console.log("执行mod2_1,mod2_1说:", mod2_1.alert());
	console.log("mod2执行完毕");
	return "I'm mod2!";
})()