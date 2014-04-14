function route(handle,pathname,response,postData){
  console.log("JORouter - Routs to " + pathname );
  if(typeof handle[pathname]==="function"){
    handle[pathname](response,postData);
  }else{
    console.log("JORouter: No request handler found for "+pathname);
    console.log('----------------------------------------------------------------------------');
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.write("404 Not Found");
    response.end();
  }
}
exports.route = route;