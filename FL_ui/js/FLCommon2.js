/**
* Common functions to all FL modules 
	http://naveensnayak.wordpress.com/2013/06/26/dynamically-loading-css-and-js-files-using-jquery/
	http://stackoverflow.com/questions/950087/how-to-include-a-javascript-file-in-another-javascript-file
*/
var FL = FL || {};
FL["common"] = (function(){//name space FL.common
	var loadCSS = function(fileCss) {
		var cssLink = $("<link rel='stylesheet' type='text/css' href='FL_ui/css/"+fileCss+"'>");
		//    <link href="../bootstrap/css/cerulean.css" rel="stylesheet">
		$("head").append(cssLink);
		// $('#_css').editable("activate");
	};
	var fillMasterForTemplate = function(templateName,masterJson) {
		// returns masterJson with new values retrieved from the template for ids corresponding to the keys in masterJson
		//ex: if templateName="_A" and masterJson={entityName:"client",entityDescription:"someone we may invoice"}
		//      and if id="_A_entityName" has "xclient" and  id="_A_entityDescription" has "xsomeone we may invoice" 
		//		returns {entityName:"xclient",entityDescription:"xsomeone we may invoice"}
		//  
		// the same as:
		//		var singular = $("#_dictEditEntityTemplate_entityName").val();
		//		var description = $("#_dictEditEntityTemplate_entityDescription").val();
		_.each(masterJson, function(value,key){
			var domTarget = "#" + templateName + "_" + key;
			var newValue = $(domTarget).val();
			masterJson[key] = newValue;
		});
	};
	var getValueForAnyTag = function(id){
		//ex of id = "#_dictEditEntityTemplate__f1_attribute" - DO NOT FORGET THE #
		var value = $(id).val();//this works for input tags and textarea tags. Not for td or a tags
		var tag = $(id).prop("tagName");
		if ( tag =="A"){
			value = $(id).text();
		}else if(tag =="TD"){
			value = $(id).text();
		}
		return value;
	};
	var fillDetailForTemplate = function(templateName,detailJson) {
		// returns the array detailJson with new values retrieved from the lines in the detailled section of template
		// equivalent to (example for line 1...similar for all other lines)
		//		var field1attr =  $("#_dictEditEntityTemplate__f1_attribute").val();
		//		var field1descr = $("#_dictEditEntityTemplate__f1_description").val();
		//		var field1stat = $("#_dictEditEntityTemplate__f1_statement").text();
		_.each(detailJson, function(element,index){
			_.each(element, function(value,key){
				var domTarget = "#" + templateName + "__f" + (index + 1) + "_" + key;
				var newValue = getValueForAnyTag(domTarget);
				// var newValue = $(domTarget).val();//this works for input tags and textarea tags. Not for td or a tags
				element[key] = newValue;
			});
			detailJson[index] = element;
		});
	};
	var selectBox = function(options, onSelection) {
		//fills the content of dropdown box with id=options.boxId with array=options.boxArr presenting options.boxCurrent as default
		//example: selectBox({boxId:"styleSet", boxCurrent:currentStyle, boxArr:stylesForSelection}, function(selected){
		//             //code with what to do on selection
		//             alert(selected); //selected is the selected object element 
		//         });
		//	NOTE:boxArr must have the format example: value and text are non optional keys All other are optional
			// var stylesForSelection = [
			// 	{value: 0, text: 'cerulean'},
			// 	{value: 1, text: 'cosmos'},
			// 	{value: 2, text: 'readable'},
			// 	{value: 3, text: 'red'},
			// 	{value: 4, text: 'spacelab'}
			// ];
		// Drop box needs a format like:
			// <div class="btn-group">
			// 	<a class="btn btn-primary dropdown-toggle" data-toggle="dropdown" style="font-size:14px;font-weight:bold;margin-right:-4.0em" href="#"> Style Set <span class="caret"></span></a>
			// 	<ul id="styleSet" class="dropdown-menu">
			// 		<li><a href="#">xxcerulean</a></li>
			// 		<li><a href="#">xxxcosmos</a></li>
			// 		....
			// 	</ul>
			// </div>
			//onSelection argument is the full object corresponding to the choosed option
			//   ex. 	{value: 1, text: 'cosmos'}

		//var $styleSet = $("#styleSet");
		var $dropDownSelect = $("#" + options.boxId);
		$dropDownSelect.parents('.btn-group').find('.dropdown-toggle').html(options.boxCurrent+' <span class="caret"></span>');//shows current value
		//... and we load the select box with the current available values
		$dropDownSelect.empty();//removes the child elements of #styleSet.
		// _.each(stylesForSelection,function(element){
		_.each(options.boxArr,function(element){
			var id = options.boxId + "_" + element.text;
			$dropDownSelect.append("<li id='" + id + "'><a href='#'>" + element.text + "</a></li>");
		});
		// $("#styleSet li a").click(function(){
		$( "#" + options.boxId + " li a").click(function(){
            var detailLine = -1; //assumes master
            var detailLineStr = FL.common.stringAfterLast(options.boxId,"__f");//"_dictEditEntityTemplate__f4_userType_options"
            if(detailLineStr){
                detailLineStr = FL.common.stringBeforeFirst(detailLineStr,"_");//"4_userType_options" =>"4"
                detailLine = parseInt(detailLineStr,10)-1;//to convert to base 0
            }
			var selText = $(this).text();
			var list = $( "#" + options.boxId + " li a");
			var index = list.index(this);
			var elObj = options.boxArr[index];
			$dropDownSelect.parents('.btn-group').find('.dropdown-toggle').html(selText+' <span class="caret"></span>');
			// onSelection(selText);//runs the callback function
			onSelection(elObj,detailLine);//runs the callback function with the element object as argument and the detail line (-1 =>master)
		});
	};
    var getDialogHTML = function(id,stackLevel,title,htmlIn,options){
        //to work in IE and Firefox always enclose button inside a tag. not a tag inside button tag. - http://stackoverflow.com/questions/12856851/jquery-modal-window-only-working-on-chrome-but-not-ff-ie9
        // CORRECT - Button inside a ref
        //  <div class="btn-group" style="margin: 0 5px 0 0;">
        //     <a href="#?w=385" rel="login_popup" class="poplight" style="text-decoration:none;"><button type="button">Login</button></a>
        //  </div><!-- /btn-group --> 
        // INCORRECT - ref inside a button tag
        //  <div class="btn-group" style="margin: 0 5px 0 0;">
        //      <button class="btn btn-small btn-info" type="button"><a href="#?w=385" rel="login_popup" class="poplight" style="text-decoration:none;">Login</a></button>
        //  </div><!-- /btn-group --> 
        var modalId = "__FLmodalId_"+id;
        var zIndexContent = "";
        if(stackLevel>1) zIndexContent = "z-Index:"+(1000*stackLevel);//place a modal inside a modal
        var iconHTML = "";
        if(options.icon) iconHTML = '<i class="glyphicon glyphicon-' + options.icon +'"></i>';
        var button1HTML = "";
        if(options.button1){
            button1HTML = '<a href="#" id="__FLDialog_button1" data-dismiss="modal" class="btn">' + options.button1 + '</a>';
        }
        var button2HTML = "";
        if(options.button2){ //this button has the parsley validate (like APPLE ->OK at right)
            button2HTML = '<a href="#" id="__FLDialog_button2" class="btn btn-' + options.type + ' validate">' + options.button2 + '</a>';   
        }
        var before = '<div class="modal fade" id="' +modalId+ '" style="' + zIndexContent + '">' +
                        '<div class="modal-dialog">' +
                            '<div class="modal-content">' +
                                '<div class="modal-header modal-header-' + options.type + '">' +
                                    '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
                                    // '<h3 style="color:white;" class="modal-title">' + title + '</h3>' +
                                    // '<h3 style="color:white;" class="modal-title"><i class="glyphicon glyphicon-thumbs-up"></i>' + title + '</h3>' +
                                    '<h3 style="color:white;" class="modal-title">' + iconHTML + title + '</h3>' +
                                '</div>' +
                                '<div class="modal-body">';
         var after =             '</div>' +
                                    '<div class="modal-footer">' +
                                        // '<a href="#button1" id="__FLDialog_button1" data-dismiss="modal" class="btn">Close</a>' +
                                        button1HTML +
                                         // '<a href="#button2" id="__FLDialog_button2" class="btn btn-primary">Save changes</a>' +
                                        button2HTML +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>';
         return before + htmlIn + after;
    };
	return{
        editMasterDetail: function(id,title,templateName,masterDetailJson,options,editMasterDetailCB) {
			// returns masterDetailJson with new values collected from modal dialog  with title and templateName - options like makeModa()
			//  EXEMPLE OF FORMAT FOR masterDetailJson:
			//	var masterDetailItems = {
			//		master:{entityName:"client",entityDescription:"someone we may invoice"},
			//		detailHeader:["#","ZAttribute","what is it","Statement to validate"],
			//		detail:[
			//			{attribute:"name", description:"official designation",statement:"the name of the client is the official designation"},
			//			{attribute:"address", description:"place to send invoices",statement:"The address of the client is the place to send invoices"},
			//			{attribute:"city", description:"headquarters place", statement:"The city of the client is the headquarters place"},
			//			{attribute:"postal code", description:"postal reference for delivery",statement:"The postal code of the client is the postal reference for delivery"}
			//		]
			//	};
            // options - {type:"primary", icon:"send",button1:"Cancel",button2:"Send Newsletter",dropdown:{"#_sendNewsletter_templates":{arr:["op1","op2"],onSelect:function(){FL.common.printToConsole("choise was "+selected);}}}
			//   notice the optional dropdown key in options. This is a way to send dropdown options yp edit masterdetail
            //     for each dropdown editmaster detail must receive: the set of values to present, the function to run on selection
            //     Example:
            //          dropdown:{
            //              "#dropdownId1":{ arr:['a','b','c','d','e'],
            //                                  default:"c",
            //                                  onSelect:function(selected){
            //                                        FL.common.printToConsole("The choice was "+selected);    
            //                                  }
            //                             },                                   
            //              "#dropdownId2":{ arr:['a1','a2','a3','a4','a5'],
            //                                  default:"a3",
            //                                  onSelect:function(selected){
            //                                        FL.common.printToConsole("For id2 the choice was "+selected);    
            //                                  }                                   
            //                            }
            //               }
            //          }
            var masterDetailItems = masterDetailJson ;
			this.makeModal(id,title,templateName,options,function(result){
				if(result){
					fillMasterForTemplate(templateName,masterDetailJson.master);
					fillDetailForTemplate(templateName,masterDetailJson.detail);
					return editMasterDetailCB(true);
				}else{
					return editMasterDetailCB(false);
				}
			},masterDetailJson);
        },
        makeModalInfo: function(message,makeModalInfoCB,stackLevel) {
        	if(FL.common.getBrowser() == "Xie"){
        		alert(message);
        	}else{
            	this.makeModal2("Information","<p>"+message+"</p>",{type:"primary",button1:"Ok",button2:null},makeModalInfoCB,stackLevel);//OK
            }
        },
        makeModalConfirm: function(message,btn1,btn2,makeModalConfirmCB,stackLevel) {//button 2 is the default
            this.makeModal2("Confirmation","<p>"+message+"</p>",{type:"primary",button1:btn1,button2:btn2},makeModalConfirmCB,stackLevel);//OK
        },
		makeModal2: function(title,message,options,makeModalCB,stackLevel) {
			// version specific for makeModalInfo and makeModal confirm - does not use parsley
			// CONDITIONS NECESSARY FOR makeModal() to work:
            //      1 - THE BODY MUST HAVE A DEDICATED SLOT: <div id="_modalDialog"+{id}></div>
            //	title - Model window title
            //	message - Dialog content
            //	options  - JSON with icon and type
            //      icon - termination of http://getbootstrap.com/components/ -
            //          ex: glyphicon glyphicon-thumbs-up   =>"thumbs-up" 
            //              glyphicon glyphicon-search      =>"search" 
            //              glyphicon glyphicon-ok          =>"ok"   etc...
            //      type - success, primary, info, warning and danger
            //      button1 - name of first button
            //      button2 - name of second button (null =>only one button is available)
            //  callback - to return result example:
            //          makeModal(" Juakim","dictTemplate",{type:"primary", icon:"search",button1:"Close",button2:"Save Changes"},function(result){
            //              if(result){
            //                  alert("Yup");
            //              }else{
            //                  alert("Nope");
            //              }
            //          });
            //          NOTE: Callback argument result = true if button 2 is pressed, result = false if button 1 is pressed
            // http://www.sitepoint.com/understanding-bootstrap-modals/
			var $modalDialog = $("#_modalDialog");
			options = _.extend( {icon:null,type:"success",button1:"Cancel",button2:"Ok"},options);
            if(!stackLevel)
                stackLevel=0;
            var modalId = "__FLmodalId_";
            var fullHTML = getDialogHTML("",stackLevel,title,message,options);
            $modalDialog.empty().append(fullHTML);
            var $modal = $('#' + modalId );
            if(makeModalCB){
                $modal.on("click","#__FLDialog_button1", function() {
                    // alert("makeModal - You clicked button1"); 
                    $modal.off('hidden.bs.modal');
                    $modal.modal('hide');
                    return makeModalCB(false);
                });
				$modal.on("click","#__FLDialog_button2", function() {
					$modal.off('hidden.bs.modal');
                    $modal.modal('hide');
					return makeModalCB(true);
                });
                $modal.on('hidden.bs.modal', function() {
                    // alert("makeModal - You closed the window !!!");
                    return makeModalCB(false);
                });
            }else{
                // $modal.off('hidden.bs.modal');              
				FL.common.printToConsole("makeModal ----->No callback");
				$modal.modal('hide');
				$('body').removeClass('modal-open');
				$('.modal-backdrop').remove();
             }
            // $('#' + modalId ).modal('show');//to launch it immediatly when calling makeModal
            $modal.modal('show');//to launch it immediatly when calling makeModal	
		},
		makeModal: function(id,title,templateName,options,makeModalCB,dataStructureForSubstitution) {
			//id = "A" or "B" followed by an optional number that indicates the stack level. If number=1 is ignored if number =2 z-index=2000
            //  if number =3 =>z-index=3000   suporting a modal inside a modal
            //CONDITIONS NECESSARY FOR makeModal() to work:
            //      1 - THE BODY MUST HAVE A DEDICATED SLOT: <div id="_modalDialog"+{id}></div>
            // title - Model window title
            // templateName - normally is a html template defined with  <script id="templateName" type="text/template"> 
            //     it can be a direct html string if first char is "<".
            // options  - JSON with icon and type
            //      icon - termination of http://getbootstrap.com/components/ -
            //          ex: glyphicon glyphicon-thumbs-up   =>"thumbs-up" 
            //              glyphicon glyphicon-search      =>"search" 
            //              glyphicon glyphicon-ok          =>"ok"   etc...
            //      type - success, primary, info, warning and danger
            //      button1 - name of first button
            //      button2 - name of second button (null =>only one button is available)
            //      dropdown - optional to be used when template has dropdowns
            //          dropdown:{ "#_sendNewsletter_templates":{ arr:["op1","op2"],default:"op2",onSelect:function(){FL.common.printToConsole("choise was "+selected);} } }
            //
            //  callback - to return result example:
            //          makeModal(" Juakim","dictTemplate",{type:"primary", icon:"search",button1:"Close",button2:"Save Changes"},function(result){
            //              if(result){
            //                  alert("Yup");
            //              }else{
            //                  alert("Nope");
            //              }
            //          });
            //          NOTE: Callback argument result = true if button 2 is pressed, result = false if button 1 is pressed
            // http://www.sitepoint.com/understanding-bootstrap-modals/
			var masterDetailItems = null;
			if(dataStructureForSubstitution)
				window.masterDetailItems = dataStructureForSubstitution;//HACK for _.template()
			var stackLevel = 0; //this is used  to define z-Index allowing to place modals inside modals 0 or 1 => first level          
            if (id.length>1){
                stackLevel = parseInt( id.substr(1,1),10 );//"A2" => 2
                id = id.substr(0,1);
            }    
            var $modalDialog = $("#_modalDialog"+id);
			if($modalDialog.length === 0) {//if it does not exist in DOM -THIS IS NO WORKING...WHY ??? -IT MUST EXIST ALREADY
				// alert("the id="+ ("#_modalDialog"+id) + " does not exist in DOM !!");
				//<div id='_modalDialogB'></div> -->
				var htmlId = "<div id='#_modalDialog" + id + "'></div>";
				FL.common.printToConsole(htmlId);
				$(htmlId).prependTo('body');
				$modalDialog = $("#_modalDialog"+id);
				var z= 32;
			}
			options = _.extend( {icon:null,type:"success",button1:"Cancel",button2:"Ok"},options);


            var modalId = "__FLmodalId_"+id;
            var htmlIn = null;
            // alert("Inside:"+templateName.substring(0,0));
            var form = null;

            if( templateName.substring(0,1) == "<"){
                htmlIn = templateName;
            }else{
				var t1 = $("#" + templateName ).html();
				var f1 =  _.template(t1);
				var htmlT1 = f1();
                var templateFunc = _.template($("#" + templateName ).html());
                htmlIn = templateFunc({name:"Joao",age:58,occupation:"tangas"});
				form = $("#form_" + templateName );
				// form.parsley();
				// form.parsley().validate();
            }

            var fullHTML = getDialogHTML(id,stackLevel,title,htmlIn,options);

            $modalDialog.empty().append(fullHTML);
            if(options.dropdown){//dropdown is an object with one key per drop down - the key is #id of dropdown on template
                 _.each(options.dropdown, function(value,key){
                    if(value.default && value.arr && value.onSelect ){
                        // var arrOfObjs =_.map(value.arr,function(element,index){ //converted to format {value:0,text:arr[0]},{value:1,text:arr[1]}...etc
                        //     return {value:index,text:element};
                        // });
                        selectBox({boxId: key,boxCurrent: value.default,boxArr: value.arr},value.onSelect);
                    }else{
                        alert("FLcommon2.js makeModal - Error dropdown definition missing - check default or arr or onselect");
                    }
                });                
            }
            if(options.detailDropdown){//detailDropdown is an object with one key per drop down in detail - the key is #id of dropdown on template
                var templateName = templateName; //to make it accessible inside _.each
                var index = 0;
                _.each(options.detailDropdown, function(value,key){//each key is a dropdown inside detail
                	index ++;//the line number inside detail
                    if( value.arr && value.onSelect ){                      
                        // var arrOfObjs =_.map(value.arr,function(element,index){ //converted to format {value:0,text:arr[0]},{value:1,text:arr[1]}...etc
                        //     return {value:index,text:element};
                        // });
                		_.each(window.masterDetailItems.detail, function(element,index){//within each dropdown for each detail line. 
                			var lineKey = templateName +  "__f" + (index+1) + "_" + key +"_options";
                			var defaultValue = element[key]; //masterDetailItems.detail always has a default value !!!!
	                        selectBox({boxId: lineKey,boxCurrent: defaultValue,boxArr: value.arr},value.onSelect);
                		});
                    }else{
                        alert("FLcommon2.js makeModal - Error detailDropdown definition missing - check default or arr or onselect");
                    }
                });                
            }                        
            var $modal = $('#' + modalId );

			form = $("#form_" + templateName );
			form.parsley();
			form.parsley().validate();

            if(makeModalCB){
                $("#__FLDialog_button1").off('click');
                $modal.on("click","#__FLDialog_button1", function() {
                    // alert("makeModal - You clicked button1"); 
                    FL.common.printToConsole("Button 1 was clicked");
                    $modal.off('hidden.bs.modal');
                    $modal.modal('hide');
                    window.masterDetailItems = null;
                    return makeModalCB(false);
                });
                $("#__FLDialog_button2").off('click');
                $modal.on("click","#__FLDialog_button2", function() {
/*				
					$modal.off('hidden.bs.modal');
                    $modal.modal('hide');
                    window.masterDetailItems = null;
                    return makeModalCB(true);
*/
					FL.common.printToConsole("Button 2 was clicked");
					// var form = $("#form_" + templateName );
					// form.parsley();
					// form.parsley().validate();
					if(form.parsley().isValid()){//http://stackoverflow.com/questions/19821934/parsley-js-validation-not-triggering
						FL.common.printToConsole('no client side errors!');
						$modal.off('hidden.bs.modal');
						$modal.modal('hide');
						window.masterDetailItems = null;
						return makeModalCB(true);						
					}else{
						FL.common.printToConsole('Client side errors!!!!');
						$('.invalid-form-error-message')
							.html("You must correctly fill the fields...")
							.addClass("filled");
						event.preventDefault();
					}
                });
                $modal.on('hidden.bs.modal', function() {
                    // alert("makeModal - You closed the window !!!");
                    window.masterDetailItems = null;
                    return makeModalCB(false);
                });
            }else{
                // $modal.off('hidden.bs.modal');              
				FL.common.printToConsole("makeModal ----->No callback");
				$modal.modal('hide');
				$('body').removeClass('modal-open');
				$('.modal-backdrop').remove();
             }
            // $('#' + modalId ).modal('show');//to launch it immediatly when calling makeModal
            $modal.modal('show');//to launch it immediatly when calling makeModal	
		},
		setStyleAndFont: function(styleName,fontName){//the css files FL<styleName>.css and FLfont_<fontName>.css must exist in FL_ui/css
			loadCSS("FL" + styleName + ".css");
			loadCSS("FLfont_" + fontName + ".css");
		},
		getTag: function(str,tagName,tagTerminator) {//returns the content of str after the last separator character or string - no separator found  =>null
			//get tag with name tagName embeded in string str - if several exist it takes the last one
			//ex. FL.common.getTag(fullUrl,"connectionString","#") -->returns  "abc" for fullUrl="#connectionString=abc#pag=home"
			var retTag = null;
			retTag = this.getLastTagInString(str,tagName+"=",tagTerminator);
            if(retTag){
                var firstChar = retTag.substring(0,1);
                if(firstChar == "{"){//tag is the string format of a JSON
                    retTag=retTag.replace(/%22/g,'"');
                    retTag=retTag.replace(/%20/g,' ');
                }
            }
			return retTag;
		},
		stringAfterLast: function(str,separator) {//returns the content of str after the last separator character or string - no separator found  =>null
			//ex. FL.common.stringAfterLast("http://www.framelink.co/app?d=myDomain1","=") -->returns  "myDomain1"
			var retStr = null;
            if(str){
    			var pos = str.lastIndexOf(separator);
    			var separatorLen = separator.length;
    			if(pos>=0)
    				retStr = str.substring(pos+separatorLen);               
            }
			return retStr;
		},
		stringBeforeLast: function(str,separator) {//simply returns the content of str before the last separator character or string - no separator found  =>null
			//ex. FL.common.stringBeforeLast("this is (one) or (two) values","(") -->returns  "this is (one) or "
			var retStr = null;
            if(str){
    			var pos = str.lastIndexOf(separator);
     			if(pos>=0)
    				retStr = str.substring(0,pos);
            }    
			return retStr;
		},
        stringBeforeFirst: function(str,separator) {//simply returns the content of str before the first separator character or string - no separator found  =>null
            //ex. FL.common.stringBeforeFirst("this is (one) or (two) values","(") -->returns  "this is "
            var retStr = null;
            if(str){
                var pos = str.indexOf(separator);
                if(pos>=0)
                    retStr = str.substring(0,pos);
            }    
            return retStr;
        },        
		getLastTagInString: function(str,separator,tagTerminator) {//returns the content after the last separator until end or terminal char
			// str - string that will be processed
			// separator - last ocurrence to be identified in string
			// tagTerminator - character (or set of caracters) that define the end-of-tag
			//		if tagTerminator is a string any of the string chars will be considered a tag terminator ex "/#"
			//		if no tagTerminator is found the full string after the separator is returned
			//		ex. getTagInString("http://www.framelink.co/app?d=myDomain1#","=","#") -->returns  "myDomain1" (the "#" is excluded)
			var retStr = this.stringAfterLast(str,separator);
			var terminatorChar = null;
			var terminatorPos = null;
			if(retStr){	
				for(var i=0;i<tagTerminator.length;i++){
					terminatorChar = tagTerminator[i];
					// FL.common.printToConsole("getLastTagInString -> char="+terminatorChar);
					terminatorPos = retStr.indexOf(terminatorChar);
					if(terminatorPos>=0){
						retStr = retStr.substring(0,terminatorPos);
						break;
					}
				}
			}
			return retStr;
		},
		repeat: function(str,n){//repeat str n times
			n = n || 1;
			if( n < 0 )
				n = 0;
			return Array(n+1).join(str);
		},
        validateEmail: function(email) {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        },
        clearSpaceBelowMenus: function() {
            $("#_placeHolder").empty();
            $("#personContent").empty();
            $("#csvcontent").empty();
            $("#grid").empty();
            $("#paginator").empty();

            $("#addGrid").hide();
            $("#_delete").hide();
            $("#_editGrid").hide();
            $("#_newsletterMC").hide();
            $("#_newsletter").hide();

            // $("#_belowMenus").hide();
            $("#templateHolder").hide();
         },      
        buildDiff: function(arrOfObjA,arrOfObjB,pivotKey) {
            //given two arrays of objects A and B, both containing key pivotKey, returns an array with all the elements 
            //  existing in A whose pivotKey exists in A and not in B.
            //example
            //   A = [{_id:"abc1",name:"jojo",email:"jojo@j.com"},{_id:"abc2",name:"toto",email:"toto@t.com"},{_id:"abc3",name:"zozo",email:"zozo@z.com"}];
            //   B = [{_id:"abc1"]},{_id:"abc2"}];
            //   FL.common.buildDiff(A,B,"_id") ->[{_id:"abc3",name:"zozo",email:"zozo@z.com"}]
            var arrA = _.pluck(arrOfObjA, pivotKey) 
            var arrB = _.pluck(arrOfObjB, pivotKey) 
            var diffArr = _.difference(arrA, arrB); //returns the values of A not present in B
            var outArr = _.map(diffArr,function(element){
               //scn diffArr and return all arrObjA that match the same _id 
               index = _.find(arrOfObjA, function(elementOfA){return elementOfA[pivotKey] == element}); 
               return arrOfObjA[index-1];
            });
        },
        shortEmailName: function(email){
            var pos = email.indexOf("@");
            return email.substring(0,pos);
        },
        enc:  function(str,incr) {//FL.common.enc("o gato patolinas",1) =>fuzzy => FL.common.enc(fuzzy,-1))=>"o gato patolinas"
           //'H'.charCodeAt(0) =>72 , String.fromCharCode(72) =H
           // var encoded =  FL.common.enc('{Patolinas},:',1);
            // alert("Patolinas >"+encoded+"< - >"+FL.common.enc(encoded,-1)+"<");
            str = str.replace(/"/g,"'");
            var encoded = "";
            for (i=0; i<str.length;i++) {
                var a = str.charCodeAt(i);//returns a number
                // var b = a ^ 123;    // bitwise XOR with any number, e.g. 123

                encoded = encoded+String.fromCharCode(a+incr);//add a char to the string 
            }
            encoded = encoded.replace(/'/g,'"');
            return encoded;
        },
        loaderAnimationON: function(div) {
            var opts = {
                lines: 13, // The number of lines to draw
                length: 20, // The length of each line
                width: 10, // The line thickness
                radius: 30, // The radius of the inner circle
                corners: 1, // Corner roundness (0..1)
                rotate: 0, // The rotation offset
                direction: 1, // 1: clockwise, -1: counterclockwise
                color: '#000', // #rgb or #rrggbb or array of colors
                speed: 1, // Rounds per second
                trail: 60, // Afterglow percentage
                shadow: false, // Whether to render a shadow
                hwaccel: false, // Whether to use hardware acceleration
                className: 'spinner', // The CSS class to assign to the spinner
                zIndex: 2e9, // The z-index (defaults to 2000000000)
                top: '50%', // Top position relative to parent in px
                left: '50%' // Left position relative to parent in px
            };
            var target = document.getElementById(div);
            var spinner = new Spinner(opts).spin(target);
            return spinner;
        },
        makeFirstElementsSample: function(arr,sampleSize){//returns a similar array with max size of sampleSize
			var sample = [];
			var len = arr.length;
			if(len > sampleSize)
				len=sampleSize;
			for(var i=0;i<len;i++){
				sample.push(arr[i]);
			}
			return sample;
        },
    	selectBox: function(options, onSelection) {
			selectBox(options, onSelection);
		},
        is_ValidDate: function(dateString){
            // returns true - if dateString has an acceptable format for a date
            // refuse ->"Stage Paris 2014", "209999" 
            if( isNaN( Date.parse(dateString) ) ){
                return false;//if Date.parse does not return a number it is not a valid date for sure!!!
            //but Date.parse will return a number for ..."Stage Paris 2014" or "209999" ->we must exclude these
            }
            var d = new Date(Date.parse(dateString));//always a valid date because it passed the previous test
            var monthsArr = ["January", "February", "March", "April", "May","June", "July", "August", "September", "October", "November", "December"];
            var monthsArr3 = ["Jan", "Feb", "Mar", "Apr", "May","Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            var weekDaysArr = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday"];
            var weekDaysArr3 = ["Sun","Mon","Tue","Wed","Thu","Fri"];
            var testArr = [ monthsArr[d.getMonth()], monthsArr3[d.getMonth()], weekDaysArr[d.getDay()], weekDaysArr3[d.getDay()] ];//possible values for first string
            var firstString = this.stringBeforeFirst(dateString," ");//for "Stage Paris 2014", first will be -->"Stage"
            if(!firstString){ //examples: "Stage,Paris,2014" or "209999" 
                firstString = this.stringBeforeFirst(dateString,",");//for "Stage,Paris,2014", first will be -->"Stage"
                if(!firstString)
                    firstString = dateString; //example "209999"
            }
            var is_date = false; //it will be false except if firstString matches any of testArr values
            var foundMatch = _.find(testArr, function(element){return (element == firstString); } );
            if( !_.isUndefined(foundMatch) ){
                is_date = true;   
            }else{//first string does not match any of test array element - now we check match with:
                //mm-dd-yy "03-21-12" or "03/21/12"
                //dd-mm-yy  "03/21/12 0:01"
                //dd-mmm-yy "21-Mar-2012"
                // var re = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;//this regex validates for either DD/MM/YYYY or DD-MM-YYYY
                // var re = /[0-9]{2}/[0-9]{2}/[0-9]{4}/;//99/99/1000. will pass
                var re = /^(0[1-9]|1[012])([- /.])(0[1-9]|[12][0-9]|3[01])\2(19|20)\d\d$/;//Formats accepted mm/dd/yyyy or mm-dd-yyyy or mm.dd.yyyy format
                //group 1 -  /^(0[1-9]|1[012]) - ^begins by  ()a group of 0 folowed by one of 1-9 =>01-09 or 1 followed by 0,1,o2 2 =>10, 11 or 12 =>02 or 11
                //group 2 -  ([- /.]) - the char - or space or / or .
                //group 3 -  (0[1-9]|[12][0-9]|3[01]) - the digits 01 until 09 or ( 1 or 2 followed by any of 0-9 ) or (3 followed by 0 or 1)
                //group 4 -  \2 Backreference. It matches the contents of the n'th set of parentheses in the expression. repeats ([- /.])
                //group 5 -  (19|20)\d\d$  19 or 20 followed by any d (digit) and d(another digit)  $ means look at the end of string while ^means look at the beginning
                if( re.test(firstString) ){
                    is_date = true;
                }
                var re = /^(0[1-9]|1[012])([- /.])(0[1-9]|[12][0-9]|3[01])\2\d\d$/;//Formats accepted mm/dd/yyyy or mm-dd-yyyy or mm.dd.yyyy format
                if( re.test(firstString) ){
                    is_date = true;
                }
                var re = /^(0[1-9]|[12][0-9]|3[01])([- /.])(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\2(19|20)\d\d$/;//Formats accepted dd/Mar/yyyy 
                if( re.test(firstString) ){
                    is_date = true;
                }
                var re = /^(0[1-9]|[12][0-9]|3[01])([- /.])(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\2\d\d$/;//Formats accepted dd/Mar/yy
                if( re.test(firstString) ){
                    is_date = true;
                }                
            }
            return is_date;
        },
        is_dateArrInStringFormat: function(arrOfRowValues){//returns true if all array elements are a valid string format
            //var d = Date.parse("March 21, 2012");//1332288000000
            //var d = Date.parse("03-21-12");//1332288000000
            //var d = Date.parse("15-21-12");//NaN
            //var d = Date.parse("03/21/12 0:01");//1332288060000
            //var d = Date.parse("21-Mar-2012");//1332288000000
            //var d = Date.parse("21-Mar-12");//1332288000000
            //var d = Date.parse("21-Mar-1112");//-27069033600000
            //var d = Date.parse("Wednesday,March 21,2012");//1332288000000
            //var d = Date.parse("Wednesday,  March 21,  2012");//1332288000000
            //var d = Date.parse("Wednesday ,  March 21 ,  2012");//1332288000000
            //var d = Date.parse("Friday,  March 21 ,  2012");//1332288000000
            //var d = Date.parse("Friday,  MARCH 21 ,  2012");//1332288000000
            //var d = Date.parse("Friday MARCH21 2012");//1332288000000         
            var is_date = false;
            var dateCandidate = null;
            var thiz = this;
            var emptyCounter = 0;
            var failElement = _.find(arrOfRowValues, function(element){ //if failElement is undefined => all elements are a valid date format
                if (element && element.trim().length>0){//skips null,"" and spaces - it enters test if it is a valid element
                    // return isNaN(Date.parse(element));//a non empty element that is not a date -
                    return !thiz.is_ValidDate(element);//a non empty element that is not a date -
                    //This returns a date for string "Stage Paris 2014" or "2013-02-31" or "209999"
                    //return moment(element).isValid() // using moment() =>refuses "2013-02-31" but accepts "Stage Paris 2014" and accepts "209999"
                }else{
                    emptyCounter++;
                }
                return false;
            });
            if( emptyCounter == arrOfRowValues.length ){ //all elements are empty
                is_date = false;
            }else if( _.isUndefined(failElement) )
                is_date = true;
            return is_date;
        },
        is_enumerableArr: function(arrOfRowValues,percent){//returns true arrOfRowValues can colapse to less than percent with unique values
            //normally arrOfRowValues is a sample of the whole array, only to decide if it is enumerable or not
            var is_enumerable = false;
            var numOfSampleRows = arrOfRowValues.length;
            var uniqueObj = this.extractUniqueFromArray(arrOfRowValues);//returns {empties:no_of empties,uniqueArr:uniqueArr}
            var columnPercent = ( uniqueObj.uniqueArr.length - ((uniqueObj.empties == 0) ? 0 : 1))/( numOfSampleRows - uniqueObj.empties );
            if ( columnPercent < percent ) 
                is_enumerable = true;
            return is_enumerable;
        },
        extractUniqueFromArray: function(arr){//returns object with {empties:no_of empties,uniqueArr:uniqueArr}
            //returns an object {empties:no_of empties,uniqueArr:uniqueArr} where:
            //      empties - number of empties ocurrences in arr
            //      uniqueArr - array with all unique occurences in arr including "" if it exists
            var arr = _.filter(arr, function(element){
                return typeof element !="undefined";
            });//exclude undefined elements
            var arrWrap = _.chain(arr).countBy().pairs(); //arrGroups gives us the number of different elements
            var arrGroups = arrWrap._wrapped; //arrGroups gives us the number of different elements
            //arrGroups has the format: [ ["High",40], ["Medium",47], ["Premium",5], ]
            var emptyPair = _.find(arrGroups,function(pair){return pair[0]==="";});
            var empties = 0;
            if(typeof emptyPair !== 'undefined'){//the case where there is no emptyPair =>undefined
                empties = emptyPair[1];
            }
            var uniqueArr = _.map(arrGroups,function(element){return element[0];});
            return {empties:empties,uniqueArr:uniqueArr};
        },
        getLocalLanguage: function() {
            var language = navigator.languages? navigator.languages[0] : (navigator.language || navigator.userLanguage);
            if(_.isUndefined(language) )
                language = window.navigator.userLanguage || window.navigator.language;
            return language;
        },
        is_decimal_US: function(strNumber){
            is_US = false;
            var lastDotIndex = strNumber.lastIndexOf(".");
            var firstDotIndex = strNumber.indexOf(".");
            if(firstDotIndex >=0){//possible: (4.294,00) (4.294.123,00) (0.123) (4,294.00) (4,294,967.00)
                    if(lastDotIndex ==  firstDotIndex)
                        is_us= true; // (0.123) or (4,294.00) or (4,294,967.00)
            }        
        },
        is_oneOfCharsInString: function(str,charList){//returns true if any of the chars in par2 exists in par1.
            //ex FL.common.is_oneOfCharsInString("anc 1002,3","* ") =>true because space exists in string
            var is = false;
            var targetChar = null;
            var pos = null;
            for(var i=0;i<charList.length;i++){
                targetChar = charList.charAt(i);
                pos = str.indexOf(targetChar);
                if(pos>=0){
                    is=true;
                    break
                }
            }
            return is;
        },
        isNumberSep: function(strNumber,sep){//sep is thousands sep - returns true if string is a valid number with that thousand separator
            var isNumber = false;
            //case strNumber "1.000,3" with sep="," =>should return false. Without the "special if" it would return true =>1.0002 is valid
            if(sep==","){ //"Special if for comma" will check if there is one last "," ocurrence, the first dot must comme after the ","
                var commaPos = strNumber.lastIndexOf(",");
                if(commaPos>=0){
                    var dotPos = strNumber.indexOf(".");
                    if(dotPos>=0){
                        if(dotPos < commaPos)
                            return isNumber;                       
                    }
                }
            }
            if(sep==" "){ //"Special if for space" -> "1 000,3" -> will check if there is one last " " ocurrence, the first dot must comme after the " "
                var spacePos = strNumber.lastIndexOf(" ");
                if(spacePos>=0){
                    if( strNumber.indexOf(".") >= 0 )//if it exist a space the decimal point must be a "," : "1 000.3" => false
                        return false;
                    var commaPos = strNumber.indexOf(",");
                    if(commaPos>=0){
                        if(commaPos < spacePos) //"1,000 3"
                            return isNumber;                       
                    }
                }
            }            
            if(sep==".") //.. we need to escape the . because it has the meaning of "an arbitrary character" in a regular expression.mystring.replace(/\./g,' ')
                sep="\\.";
            var regex = new RegExp(sep+"\\d", "g");//ex for sep="," all ocurrences of ,+digit will be deleted "123,,456,789.01" =>"123,456789.01"
            // var noSep = strNumber.replace(/,/g, '');
            var noSep = strNumber.replace(regex, '');//(',') 4,294,967,295.00 => 4294967295.00 ok 
                                                     // ('.') 4.294.967.295,00 => 4294967295,00 ok
            if( !isNaN( noSep) ){//4,294,295.00 becomes =>4294295.00
                isNumber = true;
            }else{//failled because it is 4294967295,00 or 124,14,534 or ascd
                var lastCommaIndex = noSep.lastIndexOf(",");
                if(lastCommaIndex >=0){//possible: 4294967295,000  or asdasdasd,000
                    noSep=noSep.substr(0,lastCommaIndex) + "." + noSep.substr(lastCommaIndex+1);
                }    
                if( !isNaN( noSep) ){//4294295,00 becomes 4294295.00
                    isNumber = true;
                }    
            }  
            return isNumber;
        },
        getArrNumberFormat: function(arrOfRowValues){//given an array of strings returns id it is a number representation and if yes returns the format
            //Possible formats : us,de,fr 
            //returns {number:false, format:null} or {number:true, format:"us"} or (if all integers){number:true, format:null}
            //4,294,967,295.00  US-English, Thai, 
            //4 294 967 295,000  =>Dan, Fin, France, sweeden
            //4.294.967.295,000  =>Italy, Norway, Spain, Portugal,Germany(de)
            // returns lang ("us","de","fr","neutral") neutral means a number simply
            var xRet = {"number":null,"format":null};
            var is_de = null;
            var is_fr = null;
            var is_us = null;
            var decimalPos = null;
            var thiz = this;
            var failElement = _.find(arrOfRowValues, function(element){ //if failElement is undefined => all elements are a valid number format
                if( !_.isNumber(element) ){//skips numbers
                    if (element && element.trim().length>0){//skips null,"" and spaces - it enters test if it is a valid element
                        if(!xRet.format){
                            is_de = thiz.isNumberSep(element,".");//a non empty element that has a "de" format 4.294.967.295,000
                            if(is_de){//is valid as a german format but may be ambiguous. If it has a comma is not ambiguous otherwise it is ambiguous
                                xRet = {"number":true,"format":null};
                                if( thiz.is_oneOfCharsInString( element,",.") )
                                    xRet = {"number":true,"format":"de"};
                            }else{
                                is_fr = thiz.isNumberSep(element," ");//a non empty element that has "fr" format 4 294 967 295,000
                                if(is_fr){
                                    xRet = {"number":true,"format":null};
                                    if( thiz.is_oneOfCharsInString( element," ,") )
                                    // decimalPos = element.lastIndexOf(",");
                                    // if(decimalPos>=0)
                                        xRet = {"number":true,"format":"fr"};
                                }else{
                                    is_us = thiz.isNumberSep(element,",");//a non empty element that has "us" format 4,294,967,295.000
                                    if(is_us){
                                        xRet = {"number":true,"format":null};
                                        if( thiz.is_oneOfCharsInString( element,",.") )
                                           xRet = {"number":true,"format":"us"};
                                    }else{
                                       xRet = {"number":false,"format":null};
                                    }
                                }
                            }
                        }else if(xRet.format == "de"){
                            is_de = thiz.isNumberSep(element,".");//a non empty element that has a "de" format 4.294.967.295,000
                            if(is_de)
                                return false;//goes to next element
                            else{
                                xRet = {"number":false,"format":null};//its is not a consistent number !!" previous was de but this one is not !"                  
                                return true;
                            }
                        }else if(xRet.format == "fr"){
                            is_fr = thiz.isNumberSep(element," ");//a non empty element that has a "de" format 4.294.967.295,000
                            if(is_fr)
                                return false;//goes to next element
                            else{
                                xRet = {"number":false,"format":null};//its is not a consistent number !!" previous was fr but this one is not !"                  
                                return true;
                            }
                        }else if(xRet.format == "us"){
                            is_us = thiz.isNumberSep(element,",");//a non empty element that has a "de" format 4.294.967.295,000
                            if(is_us)
                                return false;//goes to next element
                            else{
                                xRet = {"number":false,"format":null};//its is not a consistent number !!" previous was us but this one is not !"                  
                                return true;
                            }
                        }
                    }
                }    
                return false;//goes to next element
            });
            if( !_.isUndefined(failElement) )
                xRet = {"number":false,"format":null};
            return xRet;
        },
        localeStringToNumber: function(str,format){//returns number or 0 if is unable to convert
            // str - str to convert to number
            // format - us, de or fr -->all other formats return 0
            //ex:FL.common.localeStringToNumber("1,002.3","us") =>1000.3
            //ex:FL.common.localeStringToNumber("1.002,3","de") =>1000.3
            //http://stackoverflow.com/questions/642650/how-to-convert-string-into-float-in-javascript
            // we will use +(str) to cast str to number. We could use parseFloat("554,20") +540. The difference is that parse float ignores invalid chars after the number while cast returns NaN
            if(!isNaN(str))
                return +(str);//always does a cast because str may be a number or a string with a valid number format
            var n=+(str);//tries a simple conversion
            if(isNaN(n)){//simple conversion fails
                var strNoSepThousands = null;
                var strFinal = null;
                if( format == "de" ){//european 1.002.003,4 format
                   strNoSepThousands = str.replace(/\./g, '');
                   strFinal = strNoSepThousands.replace(',', '.'); 
                }else if( format == "fr" ){//french 1 002 003,4 format
                   strNoSepThousands = str.replace(/ /g, '');
                   strFinal = strNoSepThousands.replace(',', '.'); 
                }else if( format == "us" ){//us 1,002,003.4 format
                    strNoSepThousands = str.replace(/,/g, '');
                    strFinal = strNoSepThousands;
                }
                n=+(strFinal);//retries a conversion
                if(isNaN(n))
                    n=0;
            }
            return n;
        },
        convertStringVectorToNumber: function(arr,format) {//given an array of strings and a format converts that string to a number to numeric according to string format
            return _.map(arr,function(element){ 
                return FL.common.localeStringToNumber(element,format); 
            });
        }, 
        getServerName: function() {//return server name form url. if server is local host =>test.framelink.co
            //extracts content from url in browser (after // and before the first /)
            //example (in FL.API _login):fl.serverName(FL.common.getServerName());
            var currentURL =window.location.href;
            var server = this.stringAfterLast(currentURL,"//");
            server = this.stringBeforeFirst(server,"/");
            if (server =="localhost")
                server = "test.framelink.co";            
            FL.common.printToConsole("FL.common.getServerName() -->"+server);
            return server;
        },
        getMandrillKey: function() {
            var server = this.getServerName();
            var key = "S8_4ExqKlIdZiSBqgiLBUw"; //assume
            if(server == "framelink.co"){//production
                key = "vVC6R5SZJEHq2hjEZfUwRg";
            }
            return key;
        },
        debugFilter: null,//an object with all  filters collected from the app. Each key is a filter with value true or false. To be created by printToConsole()
        printToConsole: function(toDisplay,filter){//forces (whatever the debug or debugStyle values) a display without line numbers link
            //example of use:FL.common.printToConsole("   => " + apiName + ' : ' + JSON.stringify(superJ),"API");

            // var debugStatus = FL.API.debug;
            // var debugStyleStatus = FL.API.debugStyle;
            // FL.API.debug = true;FL.API.debugStyle = 1;//show FL.common.printToConsole without line numbers link;
            if(filter){
                this.debugFilter = this.debugFilter || {};
                if(_.isUndefined(this.debugFilter[filter]))
                    this.debugFilter[filter]=true;
            };    
            if(FL.API.debug){//shows all FL.common.printToConsole() even without filter parameter
                console.log(toDisplay);
            }else{
                if(filter){//if there is no filter, does not display, otherwise checks if there is a reason to display
                    _.each(FL.API.debugFiltersToShow, function(element){
                        if( element == filter ) //checks if print request is inside filters to display (FL.API.debugFiltersToShow)
                            if( this.debugFilter[element] )//checks if the current filter is active
                                console.log(" -->"+filter+":"+toDisplay);
                    },this);
                }
            }    
            // FL.API.debug = debugStatus;
            // FL.API.debugStyle = debugStyleStatus;
        },
        getBrowserWidth: function(){
            if (window.innerWidth){
                return window.innerWidth;}  
            else if (document.documentElement && document.documentElement.clientWidth != 0){
                return document.documentElement.clientWidth;    }
            else if (document.body){return document.body.clientWidth;}      
                return 0;
        },
        getBase64Width: function(imageData) {
            $("body").append("<img id='hiddenImage' src='"+imageData+"' />");
            var w = $('#hiddenImage').width();
            var h = $('#hiddenImage').height();
            $('#hiddenImage').remove();
            console.log("width:"+w+" height:"+h);
            FL.common.printToConsole("getBase64Width before exit w="+w+" h="+h,"abc");
            return w;
        },
        getBrowser: function() {
  			var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  			if(isChrome)
  				return "chrome";
  			var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
  			if(isSafari)
  				return "safari";
        	var browser = null;
			var isFF = false;
			var isOpera = false;
  			var ua = navigator.userAgent.toLowerCase();
			if(ua.indexOf("firefox") > -1){
				browser = "firefox";
			}else if(ua.indexOf("opera") > -1){
 				browser = "opera";
			}else if(ua.indexOf("msie") > -1 || navigator.appVersion.indexOf('Trident/')){
				browser = "ie";
			}
			return browser;
		},
		testFunc: function(x) {
			alert("FL.common.test() -->"+x);
		}
	};
})();
FL["topics"] = {};
jQuery.Topic = function( id ) {//https://gist.github.com/addyosmani/1321768 publisher/subscriber
	//publishing ex.	$.Topic( 'signInDone' ).publish( 'hello Sign In !!!' );
	//subscribe example:
	// $.Topic( 'signInDone' ).subscribe( fn1 );//where-> var fn1 = function(par1){alert("par1 says:"+par1);};
	// $.Topic( 'signInDone' ).subscribe( fn2 );//where-> var fn2 = function(par1){alert("par2 ---->says:"+par1);};
	var callbacks,
		topic = id && FL.topics[ id ];
	if ( !topic ) {
		callbacks = jQuery.Callbacks();
		topic = {
			publish: callbacks.fire,
			subscribe: callbacks.add,
			unsubscribe: callbacks.remove
		};
		if ( id ) {
			FL.topics[ id ] = topic;
		}
	}
	return topic;
};
// BootstrapDialog.alert("FrameLink"); //http://nakupanda.github.io/bootstrap3-dialog/
// BootstrapDialog.confirm("FrameLink menus ?"); //http://nakupanda.github.io/bootstrap3-dialog/
//  BootstrapDialog.confirm = function(message, callback,options) {//http://nakupanda.github.io/bootstrap3-dialog/

// BootstrapDialog.confirm = function(message,callback,options) {//http://nakupanda.github.io/bootstrap3-dialog/	
// 	new BootstrapDialog({
// 		//element = _.extend(element,updatedElement);//passed by reference
// 		title: _.extend({title:"CONFIRMATION"},options).title,
// 		message: message,
// 		// form: '<label>Email </label><input type="text" id="titleDrop"><br><label>User Name</label><input type="text" id="descriptionDrop">',//form,
// 		// type: BootstrapDialog.TYPE_PRIMARY, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
// 		type: _.extend({type:'type-primary' },options).type, //'type-primary', 'type-info' .'type-success','type-warning','type-danger' 
// 		draggable:true,
// 		data: {
// 			'callback': callback
// 		},
// 		buttons: [{
// 				label: _.extend({button1:"Cancel"},options).button1,
// 				action: function(dialog) {
// 					typeof dialog.getData('callback') === 'function' && dialog.getData('callback')(false);
// 					dialog.close();
// 				}
// 			}, {
// 				label:  _.extend({button2:"Ok"},options).button2,
// 				cssClass: _.extend({cssButton2:"btn-primary"},options).cssButton2,
// 				action: function(dialog) {
// 					typeof dialog.getData('callback') === 'function' && dialog.getData('callback')(true);
// 					dialog.close();
// 				}
// 			}
// 		]
// 	}).open();
// };

FL["clone"] = function(obj) {//http://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-clone-an-object/5344074#5344074
	var ss = JSON.stringify(obj);
	return JSON.parse(ss);
	// return JSON.parse(JSON.stringify(obj));
};
FL["domInject"] = function(id,htmlContent) {//clean and replace content by htmlContent
	var target="#" + id;
	var $id = $(target);
	$id.empty();//removes the child elements of the selected element(s).
	if(htmlContent)
		$id.append( $( htmlContent ) );//with $(htmlContent) we convert htmlStr to a JQuery object
};
// FL["validateEmail"] = function(email) {
// 	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// 	return re.test(email);
// };
FL["domain"]  = null;
FL["mixPanelEnable"]  = false;
FL["mix"] = function(mixEvent,propObj) {//if FL.mixPanelEnable = true, trigger  events  to mix panel
	//examples:
	//		FL.mix("Entering",{});
	//		FL.mix("ChangeStyle",{"newStyle":FL.currentStyle});
	//		FL.mix("TourIcon",{step:FL.setNextPrevOfCurrentStep()});
	if(FL.mixPanelEnable){
		// mixpanel.track("TourIcon", {//-----------------------------------------------mixpanel
		// 	"step":FL.setNextPrevOfCurrentStep()
		// });
		alert("calls mixpanel.track for event="+mixEvent+" ->props="+JSON.stringify(propObj));
		//mixpanel.track(mixEvent,propObj);
	}
};