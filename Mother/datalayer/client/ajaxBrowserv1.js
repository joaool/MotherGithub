    function callAjax(protocol, srv, port, suffix, jsonData, callBack){
    	if (!$.support.cors){
    		alert("Your browser does't support cross domain calls");
    		return callBack('{ctrl: {isOk: false, err: ' +
    			'"Your browser do not support cross domain calls"}, d:{} }', null);
    	}
    	var url=protocol + "//" +srv+':'+port+suffix
        console.log('Ajax to ' + url + ' with data : ' + JSON.stringify(jsonData));
	    request=$.ajax({
		    url: url,
	    	type:'POST',
	    	dataType:'json',
	    	//contentType: 'json',
			//contentType: 'text/plain',
		    cache:false,
	    	data: jsonData,
	    	withCredentials: true,
            //headers: {'Set-Cookie': 'fl=1',
            //		  'Connection': 'keep-alive'
            /*,
            		  'Access-Control-Allow-Origin' : '*',
            		  'Access-Control-Allow-Credentials': true
            */
            //		  }, 
            crossDomain: true,
                //xhrFields: {withCredentials: true},
		    success: function (data2) {
		    	var data;
		    	if (typeof data2 === 'string')
		    		data = JSON.parse(data2);
		    	else
		    		data=data2;
			    console.log ("ajax callbacked: " + url + ', data=' + JSON.stringify(data));
			    
				if (data["ctrl"] == null || data["ctrl"]["isOk"] == true){
                    console.log('calling callback with data');
				    callBack(null, data.d);
				}
				else {

                    console.log('calling callback with ERROR');
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
	};
