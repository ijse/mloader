
(function() {
	"use strict"
	console.log("执行mod1, 并异步引入mod1_1");
	require("mod1_1", true, function(m) {
		console.log("mod1_1引入完成！mod1_1 说：", m);
	});
	console.log("mod1执行完毕，但mod1_1正在引入")

	return "I'm mod1";
})()


