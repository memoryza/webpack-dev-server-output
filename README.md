####将webpack-dev-server产出在内存的文件夹输出到指定目录

####Output webpack-dev-server output to the specified folder in the folder
		1、npm install webpack-dev-server-output --save-dev
	
		2、
		const WebpackDevServerOutput = require('webpack-dev-server-output');

		new WebpackDevServerOutput({
    		path: 'output-path',
    		isDel: true | false
		});


path: Specify file output directory(<font color="red">full path</font>) (指定文件产出目录)
 		
 		[default '/output'] 
 		Output folder for the current project root directory（项目根目录下的output文件夹）

isDel: Update related old files （更新改动相关的旧文件，删除旧文件）
	
	[default: false]

 


