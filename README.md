####将webpack-dev-server产出在内存的文件夹输出到指定目录


		const WebpackDevServerOutput = require('webpack-dev-server-output');
		
		new WebpackDevServerOutput({
    		path: 指定输出目录(默认是output下的path)
		});
		

