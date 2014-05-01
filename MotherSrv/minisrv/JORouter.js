function route(handle,pathname,response,postData,query){
  // route(handle,pathname,oResponder,query)
  console.log("JORouter - Routs to " + pathname );
  if(typeof handle[pathname]==="function"){
    //response= oResponder.getResponse();
    // postData=oResponder.getPostData();
    // handle[pathname](oResponder,query);
    handle[pathname](response,postData,query);
  }else{
    console.log('----------------------------------------------------------------------------');
    console.log("JORouter: No request handler found for "+pathname);
    console.log('----------------------------------------------------------------------------');
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.write("404 Not Found");
    response.end();
  }
}
exports.route = route;