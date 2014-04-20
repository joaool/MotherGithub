	// This part will be in an external lib
    function entityGetAll(callBack){
	    request=$.ajax({
		    url: "http://localhost:3000/entityGetAll",
	    type:"get",
	    dataType:'json',
	    // dataType: 'jsonp',//requires that the response be wrapped in some kind of callback function.
	    // JSONP is not JSON. A JSONP response would consist of a JavaScript script containing only a function call (to a pre-defined function) with one argument (which is a JavaScript
	    // object literal conforming to JSON syntax).
	    // jsonpCallback: 'grid',
		    cache:false,
		    success: function (data) {
			    console.log ("ajax callbacked: ");
				if (data["ctrl"]["isOk"] == true){
				    console.log("entityGetAll Success...");
				    callBack(null, data.j);
				}
				else
				{
					console.log("entityGetAll empty !...");
					callBack(data, null);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
			    console.log("errorThrown:"+errorThrown);
		     	console.log("textStatus:"+textStatus);
			} 
		});
	};

    var flDico=function() {};

	flDico.prototype.entityGetAll=function (callBack) {
		entityGetAll(callBack); 
	};
	// end of lib