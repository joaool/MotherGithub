/*



TODO :
    multi-server, multi-sessions

*/
var http=require('http');
var https=require('https');

var sId;
var secret;

function callAx() {};
function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }
    return true;
}
callAx.prototype.callAjax = function(protocol, srv, port, path, jsonData, inSession, callBack, flTraceSession, flTraceServer){
    // getsId to test session Mgt in client apps
    if (path == 'getsId')
        return sId;

    var js={ctrl:{ } };

    // not sure this code works...
    if (path.indexOf('session') >= 0){
        switch (path){
            case 'session/get':
                var jSess={data1: sId, data2: secret};
                sId=-1;
                secret='';
                return callBack(null, jSess);
            case 'session/set':
                sId = jsonData.data1;
                secret=jsonData.data2;
                return callBack(null, {'Status': 'OK'})
            }
        return callBack('API not available', null);
    }

    if(flTraceSession !=undefined && flTraceSession >= 0){
        js.ctrl.sessTrace=flTraceSession;
        flTraceSession=-1;
    }
   if(flTraceServer !=undefined && flTraceServer >= 0){
        js.ctrl.srvTrace=flTraceServer;
        flTraceServer=-1;
    }

    // disconnect a disconnected session just exit
    if (path === "/api/application/disconnect" && sId == undefined){
        return callBack(true, true);
    }


    if (inSession == true){
        if (path === "/api/application/connect"){
            if(sId != undefined){
                return callBack('Already connected', null);
            }
            secret=undefined; sId = undefined;
        }
        else
        {
            if (secret == undefined || sId == undefined)
                return callBack( "No session data", null);
            js.ctrl.sId=sId;
            js.ctrl.secret=secret;
        }
    }
    var options= {
        host: srv,
        port: port,
        path: path,
        method: 'POST',
        headers: {  'Content-Type': 'application/json'
                 }
        };
    var prot;
    if (protocol == 'https:')
        prot = https;
    else
        prot=http;

    js.apiData=jsonData;
    //console.log(' => to Server: ' + JSON.stringify(options));
    ////flTools.log(flTools.trcTraffic, flTools.levelInfo,' => data: ' + JSON.stringify(js));

    var resultJson;
    var req= prot.request(options, function(res){
        ////flTools.log(flTools.trcInfra, flTools.levelInfo,'in prot.request callback');
        res.setEncoding('utf-8');
        var dataReceived='';
        res.on('data', function(data){
            dataReceived += data;
        });
        res.on('end', function(){
            try
            {
                //console.log("***** ajaNode: data received: " + dataReceived); 
                resultJson=JSON.parse(dataReceived);
            }
            catch (err)
            {
                var errMsg = "Bad data received from client. Exception: " + err;
                console.log("***** ajaNode: ERROR DURING RECEIVE: " + err); 
                return callBack(errMsg);
            }
            if (resultJson == null)
                return callBack('empty response from server', null);

            if (resultJson.d != null && resultJson.d.sId != undefined){
                sId = resultJson.d.sId;
                delete resultJson.d.sId;
            }
            if (resultJson.ctrl != null && resultJson.ctrl.secret != undefined){
                //console.log('@@@@@@ secret updated: ' + resultJson.ctrl.secret)
                secret = resultJson.ctrl.secret;
                delete resultJson.ctrl.secret;
            }
            else
                ;//console.log('@@@@@@ secret not updated');

            if (path === "/api/application/disconnect"){
                secret=undefined;
                sId=undefined;
            }
            
            if (resultJson["ctrl"] != null && resultJson["ctrl"]["isOK"] == true){
                var resultJsonResponse = resultJson.d;
                //console.log('typeof resultJson: ' + typeof resultJson.d + ', isempty: '+isEmpty(resultJson.d)+', val: '+ JSON.stringify(resultJson));
                if (typeof resultJson.d === 'object' && isEmpty(resultJson.d)){
                    //console.log('I null resultJson.d');
                    resultJson.d=null;
                }

                return callBack(null, resultJson.d);
            }
            else {
                var errTxt;
                if(resultJson.ctrl == null)
                    return callBack('bad response from server, response was: '+JSON.stringify(resultJson));

                errTxt = resultJson.ctrl.err;
                if (errTxt==null)
                    errTxt="Error flag set, but no error message";
                return callBack(errTxt, null);
            }
        });

        req.on('error', function(e)
        {
                console.log("***** ajaNode: Error received: " + JSON.stringify(e)); 
                //flTools.log(flTools.trcAlways, flTools.levelError, 'prot.request-Error: ' + e);
                return callBack('Error received from server: ' + e, null);
        });
    });
    //console.log("***** ajaNode: data sent to " +path +' : '+ JSON.stringify(js)); 
    req.write(JSON.stringify(js));
    req.end();
}
module.exports = callAx;
