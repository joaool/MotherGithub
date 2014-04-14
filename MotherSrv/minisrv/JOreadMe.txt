FrameLink

MiniSrv JOServer to get basic data (extracted form Kiessling,M - The node beginner book). I placed a JO prefix to the book examples to have all sources together.

Features:
	1- Very small (easy to debug) and with file organization by funtions
	2- Loosely coupled server (functional programming aproach) recommended to node.js
	2- Responds to requests with non-blocking operations
	3- Easy to extend

nodejs server files:

	JOIndex.js (12 lines)
	JOServer.js (21 lines)
	JORouter.js (31 lines)
	JORequestHandlers.js

	currently files should be in the same directory - (To change this edit JOIndex.js)



To extend the server:
	1)Add a function to handle the request in the list of functions in JORequestHandlers.js 
		(use the response object to format the response, and eventually postData to collect any data send by POST method)
	2)at the end of JORequestHandlers.js add a line to export the function to be used in JOIndex.js
		example exports.someFunction = someFunction;
	3)In JOIndex.js add a line mapping the server request with the exported function (done in step 2)
		example:handle["/someF"] = requestHandlers.someFunction; 

To change listening port:
	Edit line 18 in JOServer.js. Currently is set to port 3000 with   http.createServer(onRequest).listen(3000);

Currently working examples:
	/start - returns html that shows a textarea and a button - clicking the button will call /upload
		in the browser: http://localhost:3000/dtTable
	/dir - returns JOIndex.js diretory
		in the browser: http://localhost:3000/dir
 	/upload - returns string "Hello upload. Received text:" followed by data sent to server by POST
		in the browser: http://localhost:3000/upload (this will return "Hello upload. Received text:undefined") because no POST data was sent. 
	/dtTable - returns a json (current example are 3 lines for jquery datatable component)


Next steps - to introduce mongo calls already tested in Nico's Miniserv
Joao
