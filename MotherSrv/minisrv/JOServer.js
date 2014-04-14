var http = require('http');
var url = require('url');
function start(route,handle){
  function onRequest(request, response) {
    var postData = "";
    var pathname=url.parse(request.url).pathname;
    var query=url.parse(request.url).query;
    console.log("Request for " + pathname + " received. Query is:"+query);
    request.setEncoding("utf8");//we expect UTF-8 encoding
    request.addListener("data", function(postDataChunk) {
      postData += postDataChunk;
      console.log("Received POST data chunk '" + postDataChunk + "'.");
    });
    request.addListener("end", function() {
      route(handle, pathname, response, postData,query);//the response object is injected through the router 
    });
  }
  http.createServer(onRequest).listen(3000);
  console.log('Server JOServer with url running on port 3000');
}
exports.start = start;