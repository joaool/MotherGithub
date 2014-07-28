var sId;
var uId;
var secret;

function  callAjax(urlProt, urlSrv, urlPort, suffix, jsonData, isJson, callBack, flTrace){
	var url=urlProt+'//'+urlSrv+':'+urlPort;
	if (url == "" || url.length < 5){
		return callBack("bad parameters", null);
	}
	if (!$.support.cors){
		alert("ajaxBrowser: the browser doesn't support cross domain calls");
		return callBack("Your browser does not support cross domain calls", null);
	}
	if (typeof isJson == 'function'){
		callBack = isJson;
		isJson=false;
	}

	var js={};
	// NCNC: js.d for the old flMains will use js.apiData too in future
	js.d = jsonData;
    js.apiData=jsonData;

	if (suffix === "/api/application/connect"){
		secret=jsonData.secret;
		uId=jsonData.uid;
	}
	else
	{
		if (sId == undefined){
			if(isJson == true){
				//console.log("     callAjax: no session data");
				return callBack("no active session", null);
			}
		}
		else {
	        js.sId = sId;
	        js.secret=secret;
    	    js.uId=uId;
            if(flTrace !=undefined)
			    js.flTraceMe=flTrace;
		}
	}
	url = url + suffix;
	//console.log("     callAjax: sending: " + JSON.stringify(js));
    //console.log('     callAjax. url: ' + url + ", isJson = " + isJson + ', data: ' + JSON.stringify(js));
    //console.log (" => " + suffix + ", data= " + JSON.stringify(js));
    if (isJson == true)
    {
    	// flApiSrv, new way
        delete js.d;

	    request=$.ajax({
		    url: url,
	    	type:'POST',
	    	dataType:'json',
	    	//contentType: 'json',
		    cache:false,
	    	data: JSON.stringify(js),
	    	withCredentials: true,
            crossDomain: true,

		    success: function (data2) {
		    	var data;
		    	if (typeof data2 === 'string')
		    		data = JSON.parse(data2);
		    	else
		    		data=data2;
			    //console.log (" <= " + suffix + ", data= " + JSON.stringify(data));
			    if (data.d != null && data.d.sId != undefined){
		        	sId = data.d.sId;
			    }
			    if (suffix == '/api/application/disconnect'){
			    	sId=undefined;
			    }
		        delete data.secret;
		        delete data.sId;
		        delete data.uId;
		        
				if (data["ctrl"] != null && data["ctrl"]["isOK"] == true){
					if (data == null)
						return callBack('no data found in response', null);
					var dataResponse = data.d;
				    return callBack(null, data.d);
				}
				else {
					if (data.ctrl == undefined)
						data={ctrl:{err: 'bad response from server: '+ JSON.stringify(data)}};
					var errTxt = data.ctrl.err;
					if (errTxt==null)
						errTxt="Error not found in client libs ! server message was: "+ JSON.stringify(data);
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
    	// old fashion, will disapear...
        delete js.apiData;
	    request=$.ajax({
		    url: url,
	    	type:'POST',
	    	dataType:'json',
		    cache:false,
	    	data: {j: jsonData},
	    	withCredentials: true,
            crossDomain: true,
		    success: function (data2) {
		    	var data;
		    	if (typeof data2 === 'string')
		    		data = JSON.parse(data2);
		    	else
		    		data=data2;
			    
				if (data["ctrl"] == null || data["ctrl"]["isOK"] == true){
				    callBack(null, data.d);
				}
				else {
					return callBack(data, null);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
                console.log("errorThrown:"+errorThrown);
                console.log("textStatus:"+textStatus);
                console.dir(jqXHR);
                var strTmp = errorThrown;
                if (strTmp.length < 1)
                	strTmp = textStatus;
                return callBack('{ctrl: {isOK: false, err: ' + strTmp + '}, d:{} }', null);
			}
		});
	}
}
