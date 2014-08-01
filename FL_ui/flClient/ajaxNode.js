var http=require('http');
var https=require('https');
//var flTools = require('../tools-1.js');

var sId;
var uId;
var secret;

function callAx() {};
callAx.prototype.callAjax = function(protocol, srv, port, path, jsonData, isJson, callBack, flTrace){
    var js={};
    js.d = jsonData;
    js.apiData=jsonData;

    if(flTrace !=undefined){
        js.flTraceMe=flTrace;
    }
    if (isJson == true){
        if (path === "/api/application/connect"){
            secret=jsonData.secret;
            uId=jsonData.uid;
            //console.log("     callAjax uId and Secret are stored: " + uId + ":" + secret);
        }
        else
        {
            if (sId == undefined)
                return callBack( "No session data", null);
            else {
                js.sId = sId;
                js.secret=secret;
                js.uId=uId;
            }
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

    ////flTools.log(flTools.trcTraffic, flTools.levelInfo,' => to Server: ' + JSON.stringify(options));
    ////flTools.log(flTools.trcTraffic, flTools.levelInfo,' => data: ' + JSON.stringify(js));

    if (isJson == true)
    {
        delete js.d;
        var req= prot.request(options, function(res){
            ////flTools.log(flTools.trcInfra, flTools.levelInfo,'in prot.request callback');
            res.setEncoding('utf-8');
            var dataReceived='';
            var resultJson;
            res.on('data', function(data){
                dataReceived += data;
            });
            res.on('end', function(){
                try
                {
                    ////flTools.log(flTools.trcTraffic, flTools.levelInfo,' <= data: ' + dataReceived);
                    resultJson=JSON.parse(dataReceived);
                }
                catch (err)
                {
                    var errMsg = "Bad data received from client. Exception: " + err;
                    //flTools.log(flTools.trcAlways, flTools.levelError, errMsg);
                    return callBack(errMsg);
                }
                if (resultJson.d != null && resultJson.d.sId != undefined){
                    sId = resultJson.d.sId;
                }

                if (resultJson == null)
                    return callBack('empty response from server', null);

                delete resultJson.secret;
                delete resultJson.sId;
                delete resultJson.uId;
                
                if (resultJson["ctrl"] != null && resultJson["ctrl"]["isOK"] == true){
                    var resultJsonResponse = resultJson.d;
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
                    //flTools.log(flTools.trcAlways, flTools.levelError, 'prot.request-Error: ' + e);
                    return callBack('Error received from server: ' + e, null);
            });
        });
        req.write(JSON.stringify(js));
        req.end();
    }
    else
    {
        delete js.apiData;
        var req= prot.request(options, function(res){
            //flTools.log(flTools.trcInfra, flTools.levelInfo,'in prot.request callback');
            res.setEncoding('utf-8');
            var dataReceived='';
            var resultJson;
            res.on('data', function(data){
                dataReceived += data;
            });
            res.on('end', function(){
                try
                {
                    //flTools.log(flTools.trcTraffic, flTools.levelInfo,' <= data: ' + dataReceived);
                    resultJson=JSON.parse(dataReceived);
                }
                catch (err)
                {
                    var errMsg = "Bad data received from client. Exception: " + err;
                    //flTools.log(flTools.trcAlways, flTools.levelError, errMsg);
                    return callBack(errMsg);
                }

                if (resultJson["ctrl"] != null && resultJson["ctrl"]["isOK"] == true){
                    if (resultJson == null)
                        return callBack('no resultJson found in response', null);
                    var resultJsonResponse = resultJson.d;
                    return callBack(null, resultJson.d);
                }
                else {
                    var errTxt = resultJson.ctrl.err;
                    if (errTxt==null)
                        errTxt="Error not found in client libs";
                    return callBack(errTxt, null);
                }
            });

            req.on('error', function(e)
            {
                    //flTools.log(flTools.trcAlways, flTools.levelError, 'prot.request-Error: ' + e);
                    resultJson={ctrl: {isOK: false, err: 'Error received from server: ' + e}, d:{}}
                    return callBack(resultJson.ctrl.err, null);
            });
        });
        req.write(JSON.stringify({j:js.d} ));
        req.end();
    }
}

module.exports = callAx;
