var srvPrefix="http://localhost:3000";
// Entity series
    function entityGet(e, callBack){
    	if (e.entityCN == null || j.entityCN=={}){
    		callBack(formateErreurMsg(1, "entityGet: entityCN is missing"));
    		return;
    	}
    	var superJ=[
    		e
    	];
    	callAjax(srvPrefix+"/dataGet", superJ, callBack);
	};
    function entityGetAll(e, callBack){
    	if (e.entityCN == null || j.entityCN=={}){
    		callBack(formateErreurMsg(6, "entityGetAll: entityCN is missing"));
    		return;
    	}
    	var superJ=[
    		e
    	];
    	callAjax(srvPrefix+"/dataGetAll", superJ, callBack);
	};
	function checkJsonEntity(jE, method, callBack) {
    	if (jE.name == null){
    		callBack(formateErreurMsg(3, method + ': name is missing'));
    		return false;
    	}
    	if (jE.names == null){
    		callBack(formateErreurMsg(4, method + ': names is missing'));
    		return false;
    	}
    	if (jE.desc == null){
    		callBack(formateErreurMsg(5, method + ': desc is missing'));
    		return false;
    	}
    	return true;
	}
    function entityAdd(j, callBack){
    	if (typeof(f) == "function"){
    		callBack(formateErreurMsg(2, 'entityAdd: bad parameter'));
    		return;
    	}
    	if (checkJsonEntity(j) != true)
    		return;
		var superJ=[
    		j
    	];
    	callAjax(srvPrefix+"/entityAdd", superJ, callBack);
	};
    function entityUpdate(e, j, callBack){
    	if (typeof(f) == "function"){
    		callBack(formateErreurMsg(2, 'entityUpdate: bad parameter'));
    		return;
    	}
    	if (e.entityCN == null || j.entityCN=={}){
    		callBack(formateErreurMsg(1, "entityUpdate: entityCN is missing"));
    		return;
    	}
    	if (checkJsonEntity(j) != true)
    		return;
    	var superJ=[
    		j,
    		w,
    		f
    	];
    	callAjax(srvPrefix+"/entityUpdate", superJ, callBack);
	};

    function dataGetAll(j, w, f, callBack){
    	if (typeof(w) == "function"){
    		callBack=w; w={}; f={};
    	}
    	if (typeof(f) == "function"){
    		callBack=f; f={};
    	}
    	if (j.entityCN == null || j.entityCN=={}){
    		callBack(formateErreurMsg(1, "dataGetAll: entityCN is missing"));
    		return;
    	}
    	var superJ=[
    		j,
    		w,
    		f
    	];
    	callAjax(srvPrefix+"/dataGetAll", superJ, callBack);
	};

    function dataUpdate(eCN, j, callBack){
    	if (eCN==null || eCN.entityCN == null || eCN.entityCN=={}){
    		callBack(formateErreurMsg(1, "dataUpdate: entityCN is missing"));
    		return;
    	}
    	if (j.j == null || j.j=={}){
    		callBack(formateErreurMsg(1, "dataUpdate: j is missing"));
    		return;
    	}
    	if (j.j['_id'] == null || j.j['_id']=={}){
    		callBack(formateErreurMsg(1, "dataUpdate: j._id is missing"));
    		return;
    	}
    	var superJ=[
    		eCN,
    		j
    	];
    	
    	callAjax(srvPrefix+"/dataUpdate", superJ, callBack);
	};
    function dataInsert(eCN, j, callBack){
    	if (eCN==null || eCN.entityCN == null || eCN.entityCN=={}){
    		callBack(formateErreurMsg(1, "dataInsert: entityCN is missing"));
    		return;
    	}
    	if (j.j == null || j.j=={}){
    		callBack(formateErreurMsg(1, "dataInsert: j is missing"));
    		return;
    	}
    	var superJ=[
    		eCN,
    		j
    	];
    	
    	callAjax(srvPrefix+"/dataInsert", superJ, callBack);
	};

	// Tools
	function formateErreurMsg(no, msg){
		return {'errno':no, 'errmsg':msg};
	}
    function callAjax(url, jsonData, callBack){
	    request=$.ajax({
		    url: url,
	    	type:"post",
	    	dataType:'json',
	    // dataType: 'jsonp',//requires that the response be wrapped in some kind of callback function.
	    // JSONP is not JSON. A JSONP response would consist of a JavaScript script containing only a function call (to a pre-defined function) with one argument (which is a JavaScript
	    // object literal conforming to JSON syntax).
	    // jsonpCallback: 'grid',
		    cache:false,
	    	data: JSON.stringify(jsonData),
		    success: function (data) {
			    console.log ("ajax callbacked for " + url);
				if (data["ctrl"]["isOk"] == true){
				    callBack(null, data.j);
				}
				else {
					callBack(data, null);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
			    console.log("errorThrown:"+errorThrown);
		     	console.log("textStatus:"+textStatus);
			} 
		});
	};

	// Object definitions
    var flDico=function() {};

	flDico.prototype.dataGetAll=function (e, w, f, callBack) {
		dataGetAll(e, w, f, callBack); 
	};
	flDico.prototype.dataUpdate=function (e,j,callBack){
		dataUpdate(e,j,callBack);
	};
	flDico.prototype.dataInsert=function (e,j,callBack){
		dataInsert(e,j,callBack);
	}
	// end of lib