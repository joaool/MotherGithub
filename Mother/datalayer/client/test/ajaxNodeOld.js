var http=require('http');
var https=require('https');
var toolsDef=require('../tools.js');
//var tools = new toolsDef(65535);
var tools = new toolsDef(0);

	function callAx() {};

    callAx.prototype.callAjax = function(protocol, srv, port, path, jsonData, callBack){
        if (tools.testFlag(tools.trace_Infrastructure))
            tools.logTrace("ajaxNode.js","callAjax",tools.trace_Info,"in real node.ajax ! " + protocol);
        if (protocol == "ping")
            return true;
    	if (tools.testFlag(tools.trace_Infrastructure))
			tools.logTrace("ajaxNode.js","callAjax",tools.trace_Info,'Entering');
    	var dataToSend = JSON.stringify(jsonData);
    	var options= {
    		host: srv,
    		port: port,
    		path: path,
    		method: 'POST',
    		headers: {  'Content-Type': 'application/json', 
                        'Content-Length': dataToSend.length,
                        'Set-Cookie': 'fl=1'}
                    };
    	if (tools.testFlag(tools.trace_Infrastructure))
            console.dir({o: options, d: jsonData});


        var options= {
            host: srv,
            port: port,
            path: path,
            method: 'POST',
            headers: {  'Content-Type': 'application/json', 
                        'Content-Length': dataToSend.length,
                        'Set-Cookie': 'fl=1'}
                    };
    	var prot;
    	if (protocol == 'https:')
    		prot = https;
    	else
    		prot=http;

    	var req= prot.request(options, function(res){
	    	if (tools.testFlag(tools.trace_Infrastructure))
				tools.logTrace("ajaxNode.js","callAjax",tools.trace_Info,'in prot.request callback');
    		res.setEncoding('utf-8');
    		var dataReceived='';
    		var resultJson;
    		res.on('data', function(data){
    			dataReceived += data;
    		});
    		res.on('end', function(){
    			try
    			{
			    	if (tools.testFlag(tools.trace_Infrastructure))
						tools.logTrace("ajaxNode.js","callAjax",tools.trace_Info,'all data received: ' + dataReceived);
    				resultJson=JSON.parse(dataReceived);
	    		}
	    		catch (err)
	    		{
			    	if (tools.testFlag(tools.trace_Infrastructure))
						tools.logTrace("ajaxNode.js","callAjax",tools.trace_Error,'catch in res.on.end: ' + err);

	    			resultJson={ctrl: {isOk: false, err: 'Bad data received from server: ' + dataReceived}, d:{} }
	    		}
    			if (resultJson.ctrl.isOk == false)
    			{
			    	if (tools.testFlag(tools.trace_Infrastructure))
						tools.logTrace("ajaxNode.js","callAjax",tools.trace_Info,
							'call failed(sending to caller): ' + resultJson.ctrl.err);
    				return callBack(resultJson.ctrl.err, null);
    			}
    			else{
			    	if (tools.testFlag(tools.trace_Infrastructure))
						tools.logTrace("ajaxNode.js","callAjax",tools.trace_Info,
							'call ok, sending back the data to the caller ');
	    			return callBack(null, resultJson.d);
    			}
    		});

    		req.on('error', function(e)
    		{
					tools.logTrace("ajaxNode.js","callAjax",tools.trace_Info,
						'exception in req.on: ' + e);
	    			resultJson={ctrl: {isOk: false, err: 'Bad data received from server: ' + dataReceived}, d:{}}
    				return callBack(resultJson.ctrl.err, null);
    		});
	    	if (tools.testFlag(tools.trace_Infrastructure))
				tools.logTrace("ajaxNode.js","callAjax",tools.trace_Info,
					'going to write datatoSend');
    });
    req.write(dataToSend);
    req.end();
};
module.exports = callAx;

//----------
var http=require('http');
var https=require('https');

var sId;
var uId;
var secret;

    function      callAjax(url, suffix, jsonData, isJson, callBack){
        if (url == "" || url.length < 5){
            return callBack(new flTools.err(1, "you are not loggued"), null);
        }
        if (!$.support.cors){
            alert("ajaxBrowser: the browser doesn't support cross domain calls");
            return callBack(new flTools.err(1, "Your browser do not support cross domain calls"), null);
        }
        if (typeof isJson == 'function'){
            callBack = isJson;
            isJson=false;
        }
        var js={};
        js.d = jsonData;

        if (suffix === "/api/application/connect"){
            secret=jsonData.secret;
            uId=jsonData.uid;
            console.log("     callAjax uId and Secret are stored: " + uId + ":" + secret);
        }
        else
        {
            if (sId == undefined)
                return callBack( new flTools.err(1, "No session data"), null);
            else {
                js.sId = sId;
                js.secret=secret;
                js.uId=uId;
                console.log("     callAjax: session restored sId: " + sId + ", uId: " + uId + ", secret: " + secret);
            }
        }
        url = url + suffix;
        console.log("     callAjax: sending: " + JSON.stringify(js));

        var urlArr = url.split(':');
        var port = url

        var options= {
            host: urlArr[0],
            port: urlArr[1].slice(1, ,urlArr[1].indexOf('/');
            path: suffix,
            method: 'POST',
            headers: {  'Content-Type': 'application/json', 
                        'Content-Length': dataToSend.length,
                        'Set-Cookie': 'fl=1'}
                    };
        console.log("options: " + JSON.stringify(options));

        var prot;
        if (protocol == 'https:')
            prot = https;
        else
            prot=http;

        //console.log('     callAjax. url: ' + url + ", isJson = " + isJson + ', data: ' + JSON.stringify(js));
        if (isJson == true)
        {
            var req= prot.request(options, function(res){
                flTools.log(flTools.trcInfra, flTools.lvInfo,'in prot.request callback');
                res.setEncoding('utf-8');
                var dataReceived='';
                var resultJson;
                res.on('data', function(data){
                    dataReceived += data;
                });
                res.on('end', function(){
                    try
                    {
                        flTools.log(flTools.trcTraffic, flTools.lvInfo,' <= data: ' + dataReceived);
                        resultJson=JSON.parse(dataReceived);
                    }
                    catch (err)
                    {
                        flTools.log(flTools.trcInfra, flTools.lvError, 'Exception: ' + err);
                        return callBack("prot.request: Bad data received from client. Exception: " + err);
                    }

                    if (resultJson.d != null && resultJson.d.sId != undefined){
                        console.log('     callAjax - set sId: ' + resultJson.d.sId);
                        sId = resultJson.d.sId;
                    }

                    delete resultJson.secret;
                    delete resultJson.sId;
                    delete resultJson.uId;
                    
                    console.log("     callAjax - ctrl.isOk: " + resultJson["ctrl"]['isOk']);

                    if (resultJson["ctrl"] != null && resultJson["ctrl"]["isOk"] == true){
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
                        flTools.log(flTools.trcInfra, flTools.lvError, 'prot.request-Error: ' + e);
                        resultJson={ctrl: {isOk: false, err: 'Error received from server: ' + e}, d:{}}
                        return callBack(resultJson.ctrl.err, null);
                });
            });
            req.write(JSON.stringify(js));
            req.end();


            request=$.ajax({
                url: url,
                type:'POST',
                dataType:'json',
                //contentType: 'json',
                cache:false,
                data: JSON.stringify(js),
                withCredentials: true,
                //headers: {'Set-Cookie': 'fl=10'
                //          ,
                //        'Connection': 'keep-alive'
                /*,
                          'Access-Control-Allow-Origin' : '*',
                          'Access-Control-Allow-Credentials': true
                */
                //        }, 
                crossDomain: true,

                success: function (data2) {
                    var data;
                    if (typeof data2 === 'string')
                        data = JSON.parse(data2);
                    else
                        data=data2;

                    console.log ("     callAjax callbacked, data.ctrl= " + JSON.stringify(data.ctrl) + ", data just after");
                    console.dir(data);

                    if (data.d != null && data.d.sId != undefined){
                        console.log('     callAjax - set sId: ' + data.d.sId);
                        sId = data.d.sId;
                    }

                    delete data.secret;
                    delete data.sId;
                    delete data.uId;
                    
                    console.log("     callAjax - ctrl.isOk: " + data["ctrl"]['isOk']);
                    if (data["ctrl"] != null && data["ctrl"]["isOk"] == true){
                        if (data == null)
                            return callBack('no data found in response', null);
                        var dataResponse = data.d;
                        return callBack(null, data.d);
                    }
                    else {
                        var errTxt = data.ctrl.err;
                        if (errTxt==null)
                            errTxt="Error not found in client libs";
                        return callBack(errTxt, null);
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log("errorThrown:"+errorThrown);
                    console.log("textStatus:"+textStatus);
                    console.dir(jqXHR);
                    var strTmp = errorThrown;
                    if (strTmp.length < 1)
                        strTmp = textStatus;
                    return callBack(strTmp, null);
                }
            });

        }
        else
        {
            request=$.ajax({
                url: url,
                type:'POST',
                dataType:'json',
                //contentType: 'json',
                //contentType: 'text/plain',
                cache:false,
                data: {j: jsonData},
                withCredentials: true,
                //headers: {'Set-Cookie': 'fl=1',
                //        'Connection': 'keep-alive'
                /*,
                          'Access-Control-Allow-Origin' : '*',
                          'Access-Control-Allow-Credentials': true
                */
                //        }, 
                crossDomain: true,
                    //xhrFields: {withCredentials: true},
                success: function (data2) {
                    var data;
                    if (typeof data2 === 'string')
                        data = JSON.parse(data2);
                    else
                        data=data2;
                    //console.log ("ajax callbacked: " + url + ', data=' + JSON.stringify(data));
                    
                    if (data["ctrl"] == null || data["ctrl"]["isOk"] == true){
                        //console.log('calling callback with data');
                        callBack(null, data.d);
                    }
                    else {

                        //console.log('calling callback with ERROR');
                        return callBack(data, null);
                    }
                    // 'Access-Control-Allow-Origin: *''
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log("errorThrown:"+errorThrown);
                    console.log("textStatus:"+textStatus);
                    console.dir(jqXHR);
                    var strTmp = errorThrown;
                    if (strTmp.length < 1)
                        strTmp = textStatus;
                    return callBack('{ctrl: {isOk: false, err: ' + strTmp + '}, d:{} }', null);
                }
            });
        }
    };

