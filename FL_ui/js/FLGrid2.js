// jQuery(document).ready(function($){
	/**
	* data dictionary UI methods 
	*/
	// FL = FL || {}; //gives undefined if FL is undefined 
	// FL = {};
	// // a="A";
	// b="B";
	// var a = (typeof a === 'undefined') ? b : a;//if a is defined returns "A" otherwise returns the content of b
	// alert("zzz="+a);//sets "B"

	FL = (typeof FL === 'undefined') ? {} : FL;
	FL["grid"] = (function(){//name space FL.grid
		var prepareAttributesArr = function(headerstring){
			// var attributesArr = [];
			var colHeaderArr = headerstring.split(",");
			var attributesArr = _.map(colHeaderArr,function(el){
				return {name: el,description: el + "'description",label: el,type: "string", typeUI: "textbox", enumerable: null, key: false};
			});
			return attributesArr;
		};
		var prepareOneEmptyRowArray = function(arrOfColumns){
			var emptyObj = {};
			_.each(arrOfColumns,function(element){
				emptyObj[element.name] = "";
			});
			// return {name: el,description: el + "'description",label: el,type: "string", typeUI: "textbox", enumerable: null, key: false};
			return [emptyObj];
		};
		var injectId = function(idTitle,arrOfColumns){//injects a first id column into the array
			arrOfColumns.splice(0, 0, {label:idTitle,name:"id",description: "order of lines",type:"number",typeUI:"numberbox",enumerable:null,key:true});
		};
		var extractUniqueFromArray = function(arr) { //http://stackoverflow.com/questions/18878571/underscore-js-find-the-most-frequently-occurring-value-in-an-array
			//returns an object {empties:no_of empties,uniqueArr:uniqueArr} where:
			//		empties - number of empties ocurrences in arr
			// 		uniqueArr - array with all unique occurences in arr including "" if it exists
			arr = _.filter(arr, function(element){
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
		};
		var dataRowAnalisys = function(rows, percent) {
			// this methods decides the date type of every single column in rows by analysing a sample (rows).
			// returns an array of attributes (one element per column) each element  with  format:
			//		{"fieldType":"string","fieldTypeUI":"textbox","numberFormat":null, enumerable:null,label:element};
			//
			// assumes that all rows have the same json pattern with same type in the whole array - assumes type of row = type of first row
			// If column row type is "string" search for enumerables within that column
			//    if [(total number of groups)/(number of rows) < percent ] assumes enumerable and identifies an array of enumerables
			// returns
			//   [ {name:{fieldType:"string", label:"Name"}}, ...., {service:{fieldType:"enumerable", label:"Name", enumerable:[*]}} ]
			//      if fieldType="enumerable" the property enumerable has an array with the enumerable options.
			var numOfRows = rows.length;
			var rowsSample = FL.common.makeFirstElementsSample(rows,50); //reduces max size of array to 50
			var numOfSampleRows = rowsSample.length;
			var arrOfKeys = _.keys( rows[0] );//at least row[0] must exist
			var arrOfTypes = [];
			_.each(arrOfKeys, function(element, index){
				var obj = {};
				var dataType = utils.typeOf((rows[0][element]));//one of  "number","string","email","boolean","object","array","null","undefined","date"
				//note about numbers: if dataType is number no doubt about it. But...it could be a string representing a number
				if (dataType == "string") {//possible datatypes:string, integer, number, boolean, date, or json 
					//analysis of the first 50 elements or all if length<50
					var arrOfSampleRowValues = _.pluck(rowsSample,element);
					//the base javascript is of type "string" but it can be:
					//    a date in string format
					//    an enumerable
					var numberObj=FL.common.getArrNumberFormat(arrOfSampleRowValues);
					if (numberObj.number){//this string is a number in string format
						obj[element] = {"fieldType":"number","fieldTypeUI":"numberbox","numberFormat":numberObj.format, enumerable:null, label:element};
						//now the whole column must be converted from string to numeric
						// var arrOfColumnToConvert = _.pluck(rows,element);
						// FL.common.convertStringVectorToNumber(arrOfColumnToConvert,numberObj.format);
					}else if( FL.common.is_dateArrInStringFormat(arrOfSampleRowValues) ){//values are in string format but are they a deguised date column ?
						obj[element] = {"fieldType":"date","fieldTypeUI":"datetextbox","numberFormat":null, enumerable:null, label:element};
					}else if( FL.common.is_enumerableArr(arrOfSampleRowValues,percent) ){//It is an enumerable we will prepare the enumerable content
						var arrOfAllRowValues = _.pluck(rows,element);
						var fullUniqueObj = FL.common.extractUniqueFromArray(arrOfAllRowValues);
						obj[element] = {"fieldType":"string","fieldTypeUI":"combobox","numberFormat":null, enumerable:fullUniqueObj.uniqueArr, label:element};
					}else{//not a string number, note a string date and  not an enumerable
						var uniqueObj = FL.common.extractUniqueFromArray(arrOfSampleRowValues);
						obj[element] = {"fieldType":"string","fieldTypeUI":"textbox","numberFormat":null, enumerable:null,label:element};
						if( is_ColumnOfSubtype( "email",uniqueObj.uniqueArr ) ) //checks that all sample objects are of subtype
							obj[element]["fieldTypeUI"] = "email";
						else if( is_ColumnOfSubtype( "url",uniqueObj.uniqueArr ) )
							obj[element]["fieldTypeUI"] = "url";
						else if( is_ColumnOfSubtype( "phone",uniqueObj.uniqueArr ) )
							obj[element]["fieldTypeUI"] = "phone";
					}
				}else{
					if (dataType == "number") {//possible datatypes:string, integer, number, boolean, date, or json 
						obj[element] = {"fieldType":"number","fieldTypeUI":"numberbox","numberFormat":null, enumerable:null, label:element};
					}else if(dataType == "email") {
						obj[element] = {"fieldType":"string","fieldTypeUI":"emailbox","numberFormat":null, enumerable:null, label:element};
					}else if(dataType == "boolean") {
						obj[element] = {"fieldType":"boolean","fieldTypeUI":"checkbox","numberFormat":null, enumerable:null, label:element};
					}else if(dataType == "date") {
						obj[element] = {"fieldType":"date","fieldTypeUI":"datetextbox","numberFormat":null, enumerable:null, label:element};
					}else{
						obj[element] = {"fieldType":"string","fieldTypeUI":"textbox","numberFormat":null, enumerable:null,label:element};
					}
				}
				arrOfTypes.push(obj);
			});
			return arrOfTypes;
		};
		var translateToDDFormat = function(arrOfAttributes){//translates arrOfAttributes format to dd format
			// format of array [attributeName1:{fieldType":"string","fieldTypeUI":"textbox","numberFormat":null, enumerable:null,label:element},attributeName2:{..}]
			// returns  - array of objects in dd format [{name:"address",description:"address to send invoices",label:"Address",type:"string",typeUI:"textbox",enumerable:null,key:false},{}..];
			var attributesArr = [];
			var attrName = null;
			_.each(arrOfAttributes, function(element,index){
				attrName = _.keys(element)[0];
				attributesArr.push({"name": attrName,description: "description of " + attrName,label: element[attrName].label,type: element[attrName].fieldType, typeUI: element[attrName].fieldTypeUI, enumerable: element[attrName].enumerable, key: false});
			});
			return attributesArr;
		};
		// var createAttributesArrFromCsvAnalisys = function(rows){//creates the equivalent to a dd entry from a set of rows
		var adjustRowsToAttributes = function(rows,arrOfAttributes){//creates the equivalent to a dd entry from a set of rows
			// rows - an array of objects format [{"colum1Name":col11,"colum2Name":col12,..},{"colum1Name":col21,"colum2Name":col22,..}...{}]
			// arrOfAttributes has analysis format ->[attributeName1:{fieldType":"string","fieldTypeUI":"textbox","numberFormat":null, enumerable:null,label:element},attributeName2{..}]
			//arrOfAttributes - array of objects ex: [{name:"address",description:"address to send invoices",label:"Address",type:"string",typeUI:"textbox",enumerable:null,key:false},{}..];
			// returns an array with the same format as dd dictionary array of attributes. Each element has the following format:
			//      ex: {name:"address",description:"address to send invoices",label:"Address",type:"string",enumerable:null,key:false});
			// var attributesArr = [];
		// var arrOfAttributes = dataRowAnalisys(rows, 0.5);//returns an array of attributes (one element per column) 
			var rrows = rows;
			//	format of arrOfAttributes {"fieldType":"string","fieldTypeUI":"textbox","numberFormat":null, enumerable:null,label:element};
			_.each(arrOfAttributes, function(element,index){
				var attrName = _.keys(element)[0];
				var fieldType =element[attrName].fieldType;
				var fieldTypeUI =element[attrName].fieldTypeUI;
				var numberFormat =element[attrName].numberFormat;
				var label =element[attrName].label;
				var enumerable = null;
				var columnVector = null;
				var rows = rrows;
				// if(fieldType=="enumerable"){
				//     enumerable = element[attrName].enumerable;
				// }
				if(fieldType=="string" && fieldTypeUI == "combobox"){
					enumerable = element[attrName].enumerable;
				}else if(fieldType=="number"){
					// columnVector = _.pluck(rows,attrName);
					var numberVal = null;
					// FL.common.convertStringVectorToNumber(columnVector,numberFormat);
					_.each(rows, function(rowElement,index){
						numberVal = rowElement[attrName];
						rowElement[attrName] =  FL.common.localeStringToNumber(numberVal,numberFormat);
					});
					console.log("createAttributesArrFromCsvAnalisys NUMERIC attrName="+attrName + " is complete........");
					var z= 32;
				}else if(fieldType=="date"){
					//we will see
					// columnVector = _.pluck(rows,attrName);
					_.each(rows, function(rowElement,index){
						if(typeof rowElement[attrName] != "date" ){//if is a string containing a date must be converted
							rowElement[attrName] = new Date( rowElement[attrName] );//old content in string is converted to date
						}
					});
					console.log("createAttributesArrFromCsvAnalisys DATE attrName="+attrName + " is complete........");
				}
			});
		};
		var is_ColumnOfSubtype = function(subtype,sampleArr){//scans all elements of sampleArr and returns true if all non empty elements belongs to subtype
			//example 
			//		if( is_ColumnOfSubtype("email",arrOfRowValues) )
			//		if( is_ColumnOfSubtype("url",arrOfRowValues) )
			//		if( is_ColumnOfSubtype("phone",arrOfRowValues) )
			//  the subtype must be one of the existing subtypes in FL.utils.typeUIOf() 				
			var is=false;
			var len = sampleArr.length;
			for(var i=0;i<len;i++){
				if (sampleArr[i].trim().length > 0 ){
					if( utils.typeUIOf(sampleArr[i]) == subtype ){
						is = true;
					}else{
						is = false;
						break;
					}
				}
			}
			return is;
		};
		var editGrid = function(entityName){
			// FL.common.makeModalInfo("Edit " + entityName + " x To be implemented soon");
			$("#_editGrid").empty();
			$("#_modalDialogB").empty();

			var singular  = entityName;
			var description = FL.dd.getEntityBySingular(entityName).description;
			var attributesArrNoId = csvStore.getAttributesArrNoId();//we retrieve all except name="id"
			var detailItems = utils.buildMasterDetailStructureFromAttributesArr(attributesArrNoId);
			var masterDetailItems = {
				master:{entityName:singular,entityDescription:description},
				detailHeader:["#","Attribute","what is it","Statement to validate"],
				detail:detailItems //format is array with {attribute:<attribute name>,description:<attr description>,statement:<phrase>,type:<type>}
			};
			var arrOfObj = FL.dd.arrOfUserTypesForDropdown();
			var options = {
				type:"primary",
				icon:"pencil",
				button1:"Cancel",
				button2:"Confirm Table Dictionary",
				detailDropdown:{
					"userType":{
						arr:arrOfObj,//array of types
						onSelect:function(objSelected,line){
							var selectedType = objSelected.text;
							//we need to get the current attribute name from the DOM because it could have been changed
							var oldAttribute = masterDetailItems.detail[line].attribute;
							var currentAttribute = $("#_dictEditEntityTemplate__f"+(line+1)+"_attribute").val();//"_dictEditEntityTemplate__f4_userType_options"
							// var title = " Define possible values for "+masterDetailItems.detail[line].attribute;
							var title = " Define possible values for "+currentAttribute;
							var enumArr = csvStore.getEnumerableFromAttribute(oldAttribute);
							var enumStr = "";
							if(enumArr)
								enumStr = enumArr.join(",");
							var masterDetailListItems = { master:{list:enumStr} };
							var enumOptions = {type:"primary", icon:"th-list", button1:"Cancel", button2:"Confirm select list"};
							if(selectedType == "combo list"){
								FL.common.editMasterDetail("A2",title,"_getComboList",masterDetailListItems,enumOptions,function(result){
									if(result){
										// alert("The list is ->"+masterDetailListItems.master.list);
										var listOfValuesStr = masterDetailListItems.master.list;
										csvStore.setEnumerableForAttribute(oldAttribute,listOfValuesStr.split(","));
									}
								});
							}
							// alert("The selection was "+selectedType);
						}
					}
				}
			};
			FL.common.editMasterDetail("B"," Define Table Dictionary","_dictEditEntityTemplate",masterDetailItems,options,function(result){
				if(result){
					//We update name and description in csvStore.attributesArr and then use it to create dictionary fields. 
					var attributesArrNoId = csvStore.getAttributesArrNoId();//we retrieve all except name="id"
					//   ex: {name:"address",description:"address to send invoices",label:"Address",type:"string",typeUI:"textbox",enumerable:null,key:false});		                
					var changedAttributesArr = [];
					var changedTypeArr = [];
					var newAttributesArr = [{name:"id",description:"order of lines",label:"id",type:"number",typeUI:"numberbox",enumerable:null,key:true}];
					_.each(attributesArrNoId, function(element,index){//to retrieve the lines content from the interface
						var elObj = {};
						elObj["oldName"] = attributesArrNoId[index].name;
						elObj["name"] = masterDetailItems.detail[index].attribute.trim();
						if(elObj["name"] != attributesArrNoId[index].name)
							changedAttributesArr.push( [ attributesArrNoId[index].name, elObj["name"] ] );//oldName,newName
						elObj["description"] = masterDetailItems.detail[index].description.trim();
						elObj["label"] = masterDetailItems.detail[index].attribute.trim();
						var userType = masterDetailItems.detail[index].userType.trim();//the item collected in the form combo
						var userTypeObj = FL.dd.userTypes[userType];//returns type and typeUI corresponding to that serType
						elObj["type"] = userTypeObj.type;
						if(elObj["type"] != attributesArrNoId[index].type)
							changedTypeArr.push( [ attributesArrNoId[index].name, attributesArrNoId[index].type, elObj["type"] ] );//oldName,oldType,newType
						elObj["typeUI"] = userTypeObj.typeUI;
						elObj["enumerable"] = csvStore.getEnumerableFromAttribute(attributesArrNoId[index].name);
						elObj["key"] = false;
						newAttributesArr.push(elObj);
					},this);
					var singular = masterDetailItems.master.entityName.trim();//to retrieve the header content from the interface
					var description = masterDetailItems.master.entityDescription.trim();//to retrieve the header content from the interface
					if( csvStore.is_dictionaryUpdateLoseInformation() ){
						FL.common.makeModalConfirm("You will lose some information. Do you want to continue ?","No, cancel changes","Yes Please",function(result){
							if(result){
								updateDictionaryAndTypesInServer(entityName,singular,description,newAttributesArr,changedAttributesArr,changedTypeArr);
							}else{
								FL.common.makeModalInfo("Nothing was saved. The original grid is going to be restored....");
								FL.grid.displayDefaultGrid(entityName);//loads from server and display
							}	
						});
					}else{
						updateDictionaryAndTypesInServer(entityName,singular,description,newAttributesArr,changedAttributesArr,changedTypeArr);
					}
				}else{
					FL.common.makeModalInfo("Nothing was saved.");
				}
			});//OK
		};
		var updateDictionaryAndTypesInServer = function(entityName,newSingularName,description,newAttributesArr,changedAttributesArr,changedTypeArr){
			//Update Dictionary and Entity data in server - silently uses csvStore.csvRows and local dictionary
			//updateTypesInServer must synchronize: local dictionary, server dictionary, csvStore and entity on server
			// if data dictionary update fails on server it rools back the local dictionary change
			//    tests:force dictionary fail
			// if data dictionary update succeds but entity update on server fails 
			var storedArr= csvStore.extractFromCsvStore();
			if( FL.API.nicoTestDuplicateIds(storedArr) ){//only works if no duplicate _id exist in csvStore
				alert("FLGrid2 updateTypesInServer - csvStore.csvRows _id duplicate DETECTED !!!. Nothing was done");
				return;	
			}
			// var z = msg.abc; //to force error
			var localDictEntityBackup = FL.dd.getEntityBySingular(entityName);
			var xPlural = FL.dd.plural(newSingularName,"En");  //+"s";
			FL.dd.updateEntityBySingular(entityName,{singular:newSingularName,plural:xPlural,description:description});

			var spinner=FL.common.loaderAnimationON('spinnerDiv');
			var updateDictionaryAllAttributesPromise = FL.API.updateDictionaryAllAttributes(entityName,newSingularName,description,newAttributesArr);
			updateDictionaryAllAttributesPromise.done(function(){
				if(changedTypeArr.length>0){//there is type change(s)
						FL.API.debug = true; FL.API.debugStyle= 0;
					csvStore.transformStoreTo(newAttributesArr,changedAttributesArr,changedTypeArr);//does changes in csvStore
					var updatePromise = FL.grid.updateCurrentCSVToServer(entityName);
					updatePromise.done(function(){
						spinner.stop();
						FL.API.debug = false; FL.API.debugStyle= 0;
						FL.grid.displayDefaultGrid(entityName);//loads from server and display
					});
					updatePromise.fail(function(err){
						spinner.stop();
						FL.dd.entities[newSingularName] = localDictEntityBackup;//rools back local dictionary update
						FL.dd.setSync(entityName,false); //warns that local dict is not in sync with server dictionary
						FL.API.debug = false; FL.API.debugStyle= 0;
						alert("editGrid updateCurrentCSVToServer Failure err="+err);//loads from server and displaywithout newsl
					});
				}	
			});
			updateDictionaryAllAttributesPromise.fail(function(err){
				spinner.stop();
				FL.dd.entities[newSingularName] = localDictEntityBackup;//rools back local dictionary update
				alert("editGrid updateTypesInServer updateDictionaryAllAttributes Failure err="+err);//loads from server and displaywithout newsl
			});
		};		
		var addImageToMandrillImageArr = function(name,srcContent){//mandrillImagesArr is formed to FL.login.emailImagesArray
			// var srcContent = imageFromJson.substring(23);//removes the beginning chars:"data:image/jpeg;base64,"
			var imageArrElement = {name:name, type:"image/jpg", content:srcContent};
			FL.login.emailImagesArray.push(imageArrElement);
		};
		var checkSocialblock = function(item){//HACK to introduce social links if text Item has "socialblock"
			var is_social = false;
			// if(item.type == "title"){//TEMPORARY to be a social element it must be type="title" and content = "socialblock"
			// 	var elementStr = item.title;
			// 	var element = $.parseHTML(elementStr);
			// 	var titleText = $(element).text();
			// 	if(titleText == "socialblock")
			// 		is_social = true
			// }
			if(item.type == "SocialLinks"){
				is_social = true
			}			
			return is_social;
		};		
		var appendTemplate = function(jsonObject, parentElement){
			// jsonObject - array jsons corresponding to a parentElement (ex.header, body or footer) 
			// ex:[{"title":"<p>Mastruncio1</p>","style":{"fontColor":"#000","fontFamily":"Arial",...."imagePadding":"10px"},"type":"title"}]
			$.each(jsonObject,function(i,item){//item is array element i
				// var element = temp.getElementToDrop(item.type);
				var element = null;
				if( checkSocialblock(item) ){//HACK 
					element = $("#socialblockDroppedItem").html();
					var facebookImg64  = "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";
					var googlePlusImg64 ="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";
					var linkedinImg64  = "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";
					var youtubeImg64   = "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";
					addImageToMandrillImageArr("facebook",facebookImg64);//name,imageFromJson
					addImageToMandrillImageArr("googlePlus",googlePlusImg64);
					addImageToMandrillImageArr("linkedin",linkedinImg64);
					addImageToMandrillImageArr("youtube",youtubeImg64);
					$(parentElement).append(element);
					$("#facebook").attr('src','cid:facebook');
					$("#googlePlus").attr('src','cid:googlePlus');
					$("#linkedin").attr('src','cid:linkedin');
					$("#youtube").attr('src','cid:youtube');
				}else{
					var elementId = item.type + "DroppedItem";
					element = $("#"+elementId).html();
					// element = $(element).filter("div");			
					element = $(element).prop("id","template"+ window.templateCounter);
					$(parentElement).append(element);
					if( item.type == "title" ) {
						$(element).css(item.style);
						$(element).html(item.title);
					}else if(item.type == "image"){
						var elementImg = $('#'+"template"+ window.templateCounter+ ' img');//Id already assigned we search the sub element image
						var elementAnchor = $('#'+"template"+ window.templateCounter+ ' a');//Id already assigned we search the sub element anchor
						if (item.link)
							$(elementAnchor).attr('href',item.link);	
						addImageToMandrillImageArr("template"+ window.templateCounter,item.source.substring(23));//name,imageFromJson - removes the beginning chars:"data:image/jpeg;base64,"
						$(elementImg).attr('src','cid:template'+ window.templateCounter);
						
						//test
						// if(window.templateCounter == 1){
						// 	item.style["width"] = "52px";						
						// }
						
						$(elementImg).css(item.style);
					}
					window.templateCounter++;
				}	
			});
		};		
		var getHTMLContent = function(jsonTemplate){
			// alert(jsonTemplate);
			var jsonObj = JSON.parse(jsonTemplate);

			//FORCING BACKGROUND TO BLACK
			// jsonObj.templateItems.header[0].style.backgroundColor = "#ffffff";
			// jsonObj.templateItems.footer[0].style.backgroundColor = "#ffffff";
			var rawEmailTemplate = $("#emailTemplateHolder").html();
			var templateFunc =  _.template(rawEmailTemplate);
			var emailTemplate = templateFunc({
				headerBgcolor:jsonObj.pageStyles.headerBgColor,
				headerPaddingLeft:jsonObj.pageStyles.headerPaddingLeft,
				headerPaddingRight:jsonObj.pageStyles.headerPaddingRight,
				bodyBgcolor:jsonObj.pageStyles.bodyBgColor,
				bodyPaddingLeft:jsonObj.pageStyles.bodyPaddingLeft,
				bodyPaddingRight:jsonObj.pageStyles.bodyPaddingRight,
				footerBgcolor:jsonObj.pageStyles.footerBgColor,
				footerPaddingLeft:jsonObj.pageStyles.footerPaddingLeft,
				footerPaddingRight:jsonObj.pageStyles.footerPaddingRight,				
				totWidth:jsonObj.pageStyles.pageWidth,
				lateralMargin:"80"
			});
			$("#templateHolder").empty();
			$(emailTemplate).appendTo('body');//place emailTemplate HTML in DOM
			
			var content = $("#templatePreview").html();
			// var template = _.template($("#templatePreview").html());
			var header = $("#template_holder_header");
			var body = $("#template_holder_body");
			var footer = $("#template_holder_footer");
			header.empty();
			body.empty();
			footer.empty();
			FL.login.emailImagesArray = [];
			// mountTemplate(jsonObj,header,body,footer);
			window.templateCounter = 0;
			appendTemplate(jsonObj.templateItems.header,header);//fills header template with header content extracted from jsonObj
			appendTemplate(jsonObj.templateItems.body,body);//fills body template with body content extracted from jsonObj
			appendTemplate(jsonObj.templateItems.footer,footer);//fills footer template with footer content extracted from jsonObj
			
			var emailJQ = $(emailTemplate);
			emailJQ.find("#template_holder_header").append(header.contents());
			emailJQ.find("#template_holder_body").append(body.contents());
			emailJQ.find("#template_holder_footer").append(footer.contents());
			// return $("#templateHolder").html();
			return $(emailJQ).html();
		};		
		var convertsToArrOfObj = function(templateOptionsArr){
			//receives [{"_id": "t 115",jsonTemplate:"dfdfdg"},{"_id": "t 116",jsonTemplate:"dfgd"}] and returns [{value:1,text: "t 115",template:"dfdfdg"},{value:2,text: "t 116",template:"dfgd"}]
			return _.map(templateOptionsArr, function(el,index){ return {"value":index+1,"text":el._id,"template":el.jsonTemplate}; });
		};
		var extractSenderObjFromModal = function() { //extracts senderObj from _sendNewsletterTemplate
			var name = $("#_sendNewsletter_name").val();
			var email = $("#_sendNewsletter_email").val();
			var subject = $("#_sendNewsletter_subject").val();
			var testEmail =  $("#_sendNewsletter_testEmail").val();
			var senderObj = {from_name:name,from_email:email,subject:subject,testEmail:testEmail};
			return senderObj;
		};			
		var newsletterEmissionUI = function(templateOptionsArr, entityName, grid, emailAttributeName) {//grid is the backgrid object necessary for select
			var def = $.Deferred();
			FL.login.emailTemplateName = null;//cleans any previous template name
			FL.login.emailContentTemplate = null;
			FL.login.emailImagesArray = [];
			var arrOfObj = convertsToArrOfObj(templateOptionsArr); //converts templateOptionsArr to arrOfObjects
			//ex:arrOfObj=[{value:1,text: "t 115",template:"dfdfdg"},{value:2,text: "t 116",template:"dfgd"}]

			var pos = FL.login.token.userName.indexOf("@");
			var shortUserName = FL.login.token.userName.substring(0,pos);
			var masterDetailItems = {
				master:{toEmail:shortUserName,email:FL.login.token.userName,subject:"",testEmail:FL.login.token.userName},
				detail:{} //no detail
			};
			var options = {
				type:"primary", 
				icon:"send",
				button1:"Cancel",
				button2:"Send Newsletter",
				dropdown:{
					"_sendNewsletter_template":{
						arr:arrOfObj,//titles,
						default:"No template",
						onSelect:function(objSelected){// console.log("Template choice was "+objSelected.text + " cId=" + objSelected.cId);
							FL.login.emailTemplateName = objSelected.text;
							var htmlTemplate = getHTMLContent(objSelected.template);
							FL.login.emailContentTemplate = htmlTemplate;
							// alert("Template choice was "+objSelected.text);
						}
					}
				}
			};
			FL.common.editMasterDetail("B"," Send email/Newsletter","_sendNewsletterTemplate",masterDetailItems,options,function(result){
				if(result){//user choosed button2 ==>Send Newsletter button
					if(FL.login.emailTemplateName !== null){					
						// var toArr = csvStore.extractEmailArray();//to arr becomes: [{"email":"e1@live.com"},{"email":"email2@gmail.com"}..]
						var toArr = getSelectedEmailArray(grid,emailAttributeName);//to arr becomes: [{"email":"e1@live.com"},{"email":"email2@gmail.com"}..]
						if( toArr.length == 0 ){
							FL.common.makeModalInfo("No email to send. To send one or more emails, click the left column checkbox.");
						}else{
							var senderObj = extractSenderObjFromModal();//var senderObj = {from_name:name,from_email:email,subject:subject,testEmail:testEmail};
							var mailHTML = FL.login.emailContentTemplate;// we also have FL.login.emailTemplateName
							// alert("FLmenulinks2 newsletterEmissionUI Ready to send after checking duplicates.....template=" + mailHTML);
							checkDuplicateEmission(entityName,FL.login.emailTemplateName,toArr,senderObj);						
						}
					}else{
						FL.common.makeModalInfo("Canceled !!! No template selected.");
					}	
				}else{
					FL.common.makeModalInfo("Canceled !!! you can always send these emails later...");				
				}
				return def.resolve();
			});			
			return def.promise();
		};	
		var getSelectedEmailArray = function(grid,emailAttributeName){//TEM DE RECEBER A GRID !!!!
            var emailsArr = [];
            var selectedModels = grid.getSelectedModels();
            if(selectedModels.length > 0 ){
            	// alert("FLGrid2 selectedModels="+selectedModels);
            	_.each(selectedModels,function(element,index){
            		emailsArr.push( element.attributes[emailAttributeName] );
            	});
            }
            return emailsArr;	
		};
		var prepareNewsletterEmission = function(entityName,grid,emailAttributeName){
			var getTemplatesPromise = FL.API.loadTableId("_templates","jsonTemplate");//("_templates","jsonTemplate");
			var entityName = entityName;
			getTemplatesPromise.done(function(data){
				console.log(">>>>>FLGrid2.js prepareNewsletterEmission  SUCCESS <<<<<");
				if( data.length === 0 ){
					FL.common.makeModalInfo('No templates available. You must have at least one template saved.');
				}else{
					// aGrid2nulinks2.js prepareNewsletterEmission =>\n" + JSON.stringify(data));//data array of objects
					var emissionPromise = newsletterEmissionUI(data,entityName,grid,emailAttributeName);
					emissionPromise.done(function(data){
						console.log("FLmenulinks2 prepareNewsletterEmission emission done !");
						return;// def.resolve(data);					
					});
					emissionPromise.fail(function(){
						alert("FLmenulinks2 prepareNewsletterEmission ->ERROR !!!");
						return;
					});

				}
			});
			getTemplatesPromise.fail(function(err){
				console.log(">>>>>FLGrid2.js prepareNewsletterEmission  FAILURE <<<<<"+err);
				return;
			});
		};
		var getMailchimpHTML = function(cId) {
			var def = $.Deferred();
			var arr = null;
			var fl = FL.login.token.fl;
			if(fl){
				var mc = new fl.mailChimp();
				mc.campaignContent({cid: cId}, function(err, data){
					if(!err){
						console.log("campaignlist returns no error data="+JSON.stringify(data.html));
						def.resolve(data.html);
					}else{
						return def.reject( "FLmenulink2.js getMailchimpHTML - ERROR:"+err );
					}
				});
			}else{
				return def.reject("FLmenulink2.js getMailchimpHTML ->ERROR: token is empty");
			}
			return def.promise();
		};		
		var getMailchimpTemplates = function() {
			var def = $.Deferred();
			var arr = null;
			var fl = FL.login.token.fl;
			if(fl){
				var mc = new fl.mailChimp();
				mc.campaignList( {data:1}, function(err, data){
					// console.log("campaignlist returns no error data="+JSON.stringify(data.data));
					if(!err){
						var arrOfObj = [];
						var item = null;
						_.each(data.data, function(element,index){
							item = {value:index,text:element.title,cId:element.id};
							arrOfObj.push(item);
						});
						// arrCid = _.pluck(data.data,"id");
						// arrTitles = _.pluck(data.data,"title");
						def.resolve(arrOfObj);
						// oneCampaign=data.data[data.data.length-1];
						// console.log("requesting content for cid: " + oneCampaign.id);					
					}else{
						return def.reject( "FLmenulink2.js getTemplates -ERROR:"+err );
					}
				});
			}else{
				return def.reject("FLmenulink2.js getTemplates ->ERROR: token is empty");
			}
			return def.promise();
		};		
		var prepareNewsletterMCEmission = function(entityName){
			//collects all data to send a newsletter to the current grid. Including the template to use.
			FL.login.emailTemplateName = null;//cleans any previous template name
			var pos = FL.login.token.userName.indexOf("@");
			var shortUserName = FL.login.token.userName.substring(0,pos);
			var masterDetailItems = {
				master:{toEmail:shortUserName,email:FL.login.token.userName,subject:"",testEmail:FL.login.token.userName},
				detail:{} //no detail
			};
			// prepares FL.common.editMasterDetail options (including the templates dropdown)
			FL.login.emailContentTemplate = null;
			var getTemplatesPromise = getMailchimpTemplates();
			getTemplatesPromise.done(function(arrOfObj){ 	
				// alert("getTemplatesPromise done getTemplates-->"+_.pluck(arrOfObj,"text"));
				var options = {
					type:"primary", 
					icon:"send",
					button1:"Cancel",
					button2:"Send MC Newsletter",
					dropdown:{
						"_sendNewsletter_template":{
							arr:arrOfObj,//titles,
							default:"No template",
							onSelect:function(objSelected){// console.log("Template choice was "+objSelected.text + " cId=" + objSelected.cId);
								//now we will get the html for the selected cId saving it in FL.login.emailContentTemplate for future consummation
								var getMailchimpHTMLPromise = getMailchimpHTML(objSelected.cId);
								getMailchimpHTMLPromise.done(function(data){
									// alert("getMailchimpHTMLPromise OK =>"+JSON.stringify(data));
									FL.login.emailContentTemplate = data;
									FL.login.emailTemplateName = objSelected.text;
								});
								getMailchimpHTMLPromise.fail(function(err){
									console.log(">>>>>FLGrid2.js prepareNewsletterMCEmission onSelect inside dropdown FAILURE <<<<<"+err);
								});
							}
						}
					}
				};
				FL.common.editMasterDetail("B"," Send MC email/Newsletter","_sendNewsletterTemplate",masterDetailItems,options,function(result){
					if(result){//user choosed button2 ==>Send Newsletter button
						// FL.links.testEmail();
						var senderObj = extractSenderObjFromModal();//var senderObj = {from_name:name,from_email:email,subject:subject,testEmail:testEmail};
						var toArr = csvStore.extractEmailArray();//to arr becomes: [{"email":"e1@live.com"},{"email":"email2@gmail.com"}..]
						var mailHTML = FL.login.emailContentTemplate;
						// alert("before calling checkDuplicate ->"+FL.login.emailTemplateName);
						if(FL.login.emailTemplateName !== null)
							checkDuplicateEmission(entityName,FL.login.emailTemplateName,toArr,senderObj);//CURRENTLY var IN FLmenulinks2.js 
						else
							FL.common.makeModalInfo("Canceled !!! No template selected.");
					}else{
						// alert("newsletter canceled");
						FL.common.makeModalInfo("Canceled !!! you can always send these emails later...");
					}
				});
				return;
			});
			getTemplatesPromise.fail(function(err){
				console.log(">>>>>FLGrid2.js prepareNewsletterMCEmission  FAILURE <<<<<"+err);
			});
		};
		var checkDuplicateEmission = function(entityName,NName,toSend,senderObj){
			// Assumes that NNAme is not null
			// This method manages the users dialogs for the following cases:
			//		First time emission - the newsletter was not sent before ->sends  to missingEmails = the whole list (recipientsArr)
			//		Remission to all recipients - The same newsletter was sent previously - DANGEROUS !!!!
			//         missing are null in this case ->
			//		Emission to new recipients that were introduced in the base table, after the last emission - sends to the missingEmails			var promise = FL.API.mailRecipientsOfTemplate(entityName,NName);
			var promise = FL.API.mailRecipientsOfTemplate(entityName,NName);
			promise.done(function(sent){
				// var toSend =  _.pluck(recipientsArr, "email");
				FL.API.debug = true; FL.API.debugStyle= 0;
				console.log("==========================================");
				console.log("toSend->"+JSON.stringify(toSend));
				var missingEmails = _.difference(toSend, sent); //if sent = null =>missing = toSend

				// missingEmails = [];//TEST CASE 2 - REEMISSION
				// missingEmails.splice(0,2);//TEST CASE 3 - NEW ADDITIONS - remove position 0 and 1
	
				console.log("Emails to sent->"+JSON.stringify(missingEmails));
				// alert("missingEmails->"+JSON.stringify(missingEmails));
				var confirmQuestion = null;
				var button2 = null;
				if(missingEmails.length == toSend.length){
					confirmQuestion = "Do you confirm the emission of " + toSend.length + " emails, using template '" + NName + "' ?";
					button2 = "OK execute first emission";
				}else{
					var missingHTML = "";
					_.each(missingEmails,function(element){
						missingHTML += "<li>" + element + "</li>";
					});
					confirmQuestion = NName + " was sent previously, but " + missingEmails.length + " new recipient(s) were added to the send list.<br>Do you want to send only to the new recipient(s) ?<br>"+missingHTML;
					button2 = "OK send to " + missingEmails.length + " new email(s)";
					if(missingEmails.length ==0){
						confirmQuestion = "This emission of " + NName + " was done previously to the same recipients !!! Do you really want to repeat it ?";
						button2 = "OK resend these emails";
					}
				}
				FL.common.makeModalConfirm(confirmQuestion,"No, cancel the emission",button2, function(result){
					if(result){
						var mailHTML = FL.login.emailContentTemplate;
						var imagesArr = FL.login.emailImagesArray;
						// mailHTML = null; //to TEST ONLY
						var msg = "Newsletter " + FL.login.emailTemplateName + " was not sent !!!. No content to send.";
						if(mailHTML!== null){
							if(  button2 == "OK resend these emails") {
								missingEmails = toSend; //missingEmails now refers to toSend
								// alert("Resend the emission ->"+JSON.stringify(missingEmails));
							}
							// var sentCount = FL.links.sendEmail(entityName,mailHTML,imagesArr,missingEmails,senderObj,FL.login.emailTemplateName);
							var eCN = FL.dd.getCEntity(FL.dd.histoMailPeer(entityName));
							var fCN = FL.dd.getFieldCompressedName(FL.dd.histoMailPeer(entityName),"msg");
							var metadataObj={newsletterName:FL.login.emailTemplateName,dbName:FL.login.token.dbName,eCN:eCN,fCN:fCN}
							// var sentCount = FL.emailServices.sendEmail(entityName,mailHTML,imagesArr,missingEmails,senderObj,metadataObj);
							var sentCount = FL.emailServices.sendEmail(mailHTML,imagesArr,missingEmails,senderObj,metadataObj);
							// var sentCount = missingEmails.length;
							msg = "Newsletter " + FL.login.emailTemplateName + " sent  to " + sentCount + " recipients !!!<br> - total rows checked = "+toSend.length;
						}	
						FL.common.makeModalInfo(msg);
					}else{
						FL.common.makeModalInfo("Canceled !!! you can always send these emails later...");
					}
				});
				FL.API.debug = false; FL.API.debugStyle= 0;
			});
			promise.fail(function(){
				alert("checkDuplicateEmission ->ERROR !!!");
			});
		};				
		var internalTest = function(x) {//
			alert("grid internalTest() -->"+x);
		};
		return{
			// getPageNo: function(pagName){ //to be used by savePage and restorePage
			// 	var pageNoObj = {"home":1,"about":2};
			// 	return  pageNoObj[pagName];
			// },
			csvFile: null,
			csvFileDelimiter: null,
			csvEncoding: null,
			createGrid: function() {//call with menu key "uri": "javascript:FL.grid.createGrid()"
				// FL.common.makeModalInfo("Create Grid to be implemented soon");
				var masterDetailItems = {
					master:{entityName:"sample",headerString:""},
					detail:{} //format is array with {attribute:<attribute name>,description:<attr description>,statement;<phrase>}
				};
				var options = {
					type:"primary", 
					icon:"th",
					button1:"Cancel",
					button2:"Create Grid"
				};
				FL.common.editMasterDetail("B"," Create Grid","_createGridTemplate",masterDetailItems,options,function(result){
					if(result){//user choosed create
						// FL.links.testEmail();
						var entityName = $("#_createGrid_entityName").val();
						var headerString = $("#_createGrid_header").val();
						// alert("Title:"+entityName+"-->"+headerString);
						if(entityName === "" || headerString === "")
							FL.common.makeModalInfo("Empty sample or headerString => nothing to do");
						else{
							var arrOfColumns =prepareAttributesArr(headerString);
							injectId("id",arrOfColumns); //now the first column is an "id" column
							if(FL.dd.createEntityAndFields(entityName,"description of "+entityName,arrOfColumns)){
								var columnsArr = utils.backGridColumnsFromArray(arrOfColumns);//extracts attributes from dictionary and prepares columns object for backgrid
								csvStore.setAttributesArr(arrOfColumns);//saves arrOfColumns on csvStore -  [{label:"xx",name:fieldName,description:xDescription,type:xtype,enumerable:xEnumerable},{col2}...{}]
								var emptyRowArr = prepareOneEmptyRowArray(arrOfColumns);
								FL.grid.csvToStore(emptyRowArr); //feeds the csvStore data store object. It inserts id element and converts keys to lowercase
								FL.common.clearSpaceBelowMenus();
								utils.mountGridInCsvStore(columnsArr);//mount backbone views and operates grid - columnsArr must be prepared to backGrid
								FL.grid.storeCurrentCSVToServerAndInsertMenu(entityName);//the 
							}else{
								FL.common.makeModalInfo("The entity name '" + entityName + "' already exist. Please choose another name.");
							}
						}
					}else{
						alert("Create Grid canceled");
					}
				});
			},
			adjustRowsToAttributes: function(rows,arrOfAttributes){
				adjustRowsToAttributes(rows,arrOfAttributes);
			},
			verifyPapaFields: function(metaFieldsArr){
				//Ex  metaFieldsArr has :{aborted: false, cursor: 322587, delimiter: ",",fields: Array[52],linebreak: "↵",truncated: false}
				//This is the place to add some inteligence in evaluation of CSV files.
				//   for the time being the only criteria to refuse is aborted
				//verifies if there are empty fields. If they exist flags an error. 
				//	if delimiter diferent from null means that probabily the delimiter is the specified
				//  NOTE: to choose the delimiter it checks the first field.
				//			if fistfields has more 
				//  encoding is the encoding recomendation - PC =>
				var ok=true;
				var fieldArray = metaFieldsArr.fields;
				var numberOfFields = 0;
				var emptyFields = 0;
				var delimiter = null;
				var linebreak = metaFieldsArr.linebreak;
				var encoding = null;
				var semi_colon_repetitions=0;
				var comma_repetitions=0;
				_.each(fieldArray, function(element, index){
					numberOfFields++;
					if(index==0){//check semicolumns anbd comma repetiions on firtst line
						semi_colon_repetitions=( element.match(/;/g) || [] ).length;
						comma_repetitions=( element.match(/,/g) || [] ).length;					
					}
					if(element === ""){
						emptyFields++;					
					}
				});
				if(metaFieldsArr.aborted)
					ok=false;//one criteria to repeat
				if(linebreak.length == 1 && linebreak.charCodeAt(0)==13 )
					encoding="MacRoman";//standard for mac
				else if(linebreak.length == 2 && linebreak.charCodeAt(0)==13 && linebreak.charCodeAt(1)==10 ) //CR + LF
					encoding="windows-1252";//standard for PC
				else 
					encoding="windows-1252";//standard for PC
				if(emptyFields>0){
					if(semi_colon_repetitions>numberOfFields){ //one heuristic criteria
						delimiter = ";"//recomended for next try
						ok=false;//one criteria to repeat
					}else if(comma_repetitions>numberOfFields){
						delimiter = ","
						ok=false;//one criteria to repeat
					}
				}
				return {ok:ok,linebreak:linebreak,delimiter:delimiter,encoding:encoding,numberOfFields:numberOfFields,emptyFields:emptyFields,comma_repetitions:comma_repetitions,semi_colon_repetitions:semi_colon_repetitions};
			},
			validateCSV: function(fileObj){//this is called directly from template id="_importCSV" ->onchange="FL.grid.validateCSV(this.files)" 
				// if there is an error FL.grid.csvFile will be null. No error => FL.grid.csvFile = csvFile
				// all this does is to leave a message in FL.grid.csvFile after verifing possible CSV errors !!!!
				// The real treatment to the csvFile is done in FL.grid.importGrid() using FL.grid.csvFile prepared in FL.grid.validateCSV()
				
				// alert("validateCSV---->"+fileObj[0].name + " type="+fileObj[0].type + " Elements=" + fileObj.length);
				if(fileObj[0].name == ""){
					alert("FL.grid.validateCSV() Error File Name Is empty");
				}else{
					// alert("File Name not empty");
					var csvFile = fileObj[0];
					FL.grid.csvFile = fileObj[0];
					FL.grid.csvFileDelimiter = null;
					Papa.parse(csvFile, {
						header: true,
						dynamicTyping: true,
						complete: function(results) {
							data = results;
							var rowsOnAttempt1 = results.data.length;
							// alert("Loaded rows:" + rowsOnAttempt1 +  "\nAborted--->" + results.meta.aborted + "\nDelimiter--->"+JSON.stringify(results.meta.delimiter) + "\nFields--->"+JSON.stringify(results.meta.fields) + "\n Errors--->"+JSON.stringify(results.errors));
							var resultObj = FL.grid.verifyPapaFields(results.meta);
							// alert("Result of verification:-->"+JSON.stringify(resultObj));
							FL.grid.csvEncoding = resultObj.encoding;
							if(resultObj.ok){
								console.log("OK on first attempt !!!!!!!!!!!!!! FILE IS A GOOD CSV ");
								// alert("OK on first attempt !!!!!!!!!!!!!! FILE IS A GOOD CSV ");
							}else{
								//SECOND ATTEMPT we will try again forcing the delimiter
								// FL.grid.csvFile = null;
								FL.grid.csvFileDelimiter = resultObj.delimiter;
								Papa.parse(csvFile, {
									delimiter: resultObj.delimiter,
									dynamicTyping: true,
									encoding: resultObj.encoding,
									complete: function(results) {
										data = results;
										if (results.data.length<rowsOnAttempt1){//refuse because lines will be lost
											FL.grid.csvFile = null;//to block the import
										}else{
											alert("attempt 2 --> !!!! Loaded rows:" + results.data.length +  "\nDelimiter--->"+JSON.stringify(results.meta.delimiter) + "\nFields--->"+JSON.stringify(results.meta.fields) + "\n Errors--->"+JSON.stringify(results.errors));
											var resultObj = FL.grid.verifyPapaFields(results.meta);
											alert("attempt 2 --->Result of verification:-->"+JSON.stringify(resultObj));
											if(resultObj.ok){
												alert("OK AT SECOND ATTEMPT !!!!!!!!!!!!!! FILE IS A GOOD CSV ");
											}else{
												FL.grid.csvFile = null;//to block the import
											}
										}
									}
								});									
							}

						}
					});					
				}	
			},
			importGrid: function() {//call with menu key "uri": "javascript:FL.grid.importGrid()" in Settings
				// The real treatment to the csvFile is done here  - FL.grid.importGrid() -  using FL.grid.csvFile prepared in FL.grid.validateCSV()
				var masterDetailItems = {
					master:{entityName:"",fileName:"jojo"},
					detail:{} //format is array with {attribute:<attribute name>,description:<attr description>,statement;<phrase>}
				};
				var options = {
					type:"primary", 
					icon:"cloud-upload",
					button1:"Cancel",
					button2:"Import CSV"
				};
				FL.common.editMasterDetail("B"," Upload CSV","_importCSV",masterDetailItems,options,function(result){
					if(result){//user choosed create
						// FL.links.testEmail();
						var entityName = $("#_importCSV_entityName").val();
						var fileName = $("#_importCSV_fileName").val();
						// alert("Title:"+entityName+"-->"+headerString);
						if(fileName === "")
							// alert("One missing ---> entityName="+entityName+" fileName="+fileName);
							FL.common.makeModalInfo('No CSV file selection - Nothing was done');
						else{
							//FL.ddcreateEntity()
							// alert("None missing ----> entityName="+entityName+" fileName="+fileName);
							if(!FL.grid.csvFile){
								FL.common.makeModalInfo('There is a problem with ' + fileName + ' - Nothing was done');
							}else{
								FL.common.clearSpaceBelowMenus();
								
								var csvFile = FL.grid.csvFile;//set by FL.grid.validateCSV(this.files) --- was val = $('input[type=file]');
								var delimiter = FL.grid.csvFileDelimiter;
								var encoding = FL.grid.csvEncoding;
								FL.grid.csvToGrid2(csvFile,delimiter,encoding,entityName);//csvFile is not a JQuery object
							}
                			// utils.mountGridInCsvStore(columnsArr);//mount backbone views and operates grid - columnsArr must be prepared to backGrid
						}
					}else{
						alert("Create Grid canceled");
					}
				});
			},
			csvToStore:function(rows){//rows is an array of JSON [{},{}...{}]; each JSON  has a key/value = attribute/content
				//feeds the csvStore (memoryCsv.js)  with rows injecting id column and converting other column names to lower case
				var csvrows = [];
				_.each( rows, function( element, index ) {
					// console.log((index+1)+" ---> "+element[data.fields[0]] + " --- " + element[data.fields[6]]);//shows column 0 and column 6
					element["id"] = index+1;//to insert id in element...
					//we need to be sure that each key is lowercase
					var arrOfPairs = _.pairs(element);//returns an array w/ pairs [["one", 1], ["two", 2], ["three", 3]]
					arrOfPairs =  _.map( arrOfPairs, function(value) {
						return [ value[0], value[1] ];
					});
					var element2 = _.object(arrOfPairs);//reconstruct object from arrOf Pairs
					csvrows.push(element2);
				});
				csvStore.store(csvrows);
			},
			insertDefaultGridMenu: function(singular,plural) {// Adds a menu with title <plural> and content displayDefaultGrid(<singular>)
				// cursor over menu position <plural> will show: javascript:FL.links.setDefaultGrid('<singular>')
				// if singular has spaces, they will be changed by "_"
				var singularToUseInMenu = singular.replace(/ /g,"_");
				// var arrToSend = FL.grid.extractFromCsvStore(singular);
				var arrToSend = csvStore.extractFromCsvStore(singular);
				// console.log("FLGrid2.js --> insertDefaultGridMenu show arrToSend="+JSON.stringify(arrToSend));
				// format for arraTosend must be-->[{"name":"Jojox","phone":"123"},{"name":"Anton","phone":"456"}];
				var saveTablePromise = FL.API.saveTable(singular,arrToSend);
				saveTablePromise.done(function(data){
					// console.log("FLGrid2.js --> insertDefaultGridMenu Succeded saving table. returned:"+JSON.stringify(data));
					FL.common.clearSpaceBelowMenus();
					$.Topic( 'createGridOption' ).publish( plural,singularToUseInMenu );//broadcast that will be received by FL.menu to add an option
				});
				saveTablePromise.fail(function(err){
					alert("FLGrid2.js --> insertDefaultGridMenu FAILURE !!! err="+err);
				});
			},
			storeCurrentCSVToServerAndInsertMenu: function(entityName,insertMenu){ //(entityName,plural) Adds a menu with title <plural> and content displayDefaultGrid(<singular>)
				// entityName- Name of entity that will be stored
				// insertMenu - true=> create new menu false=>no menu will be created
				// cursor over menu position <plural> will show: javascript:FL.links.setDefaultGridByCN('<eCN>')
				// if entityName has spaces, they will be changed by "_"
				var spinner=FL.common.loaderAnimationON('spinnerDiv');
				if(_.isUndefined(insertMenu) || insertMenu === null )
					insertMenu = true;
				var menuName = null;
				if(!entityName){
					entityName = FL.dd.nextEntityBeginningBy("unNamed");
					menuName = "New Grid";
				}else{
					menuName = FL.dd.plural(entityName,"En");
				}
				FL.dd.createEntityAndFields(entityName,entityName+" description",csvStore.attributesArr);
								
				// var arrToSend = FL.grid.extractFromCsvStore();
				var arrToSend = csvStore.extractFromCsvStore();
				var saveTablePromise = FL.API.saveTable(entityName,arrToSend);
				saveTablePromise.done(function(data){
					console.log("FL.grid.storeCurrentCSVToServerAndInsertMenu --> dict synch and saveTable sucessfull ->"+JSON.stringify(data));
					if(insertMenu){
						var eCN = FL.dd.getCEntity(entityName);
						FL.login.permissionToAddMenu = true;//forces true...tis flag is set to false in FL.menu.topicCreateGridByCN to prevent 2 calls
						$.Topic( 'createGridOptionByCN' ).publish( menuName,eCN );//broadcast that will be received by FL.menu to add an option
					}
					FL.common.clearSpaceBelowMenus();
					spinner.stop();
					return;
					// $.Topic( 'createGridOption' ).publish( plural,entityNameToUseInMenu );//broadcast that will be received by FL.menu to add an option
				});
				saveTablePromise.fail(function(err){
					spinner.stop();
					alert("FL.grid.storeCurrentCSVToServerAndInsertMenu --> after successful synch->FAILURE in FL.API.saveTable err="+err);
					return;
				});

				//--------------------- old code
				var singularToUseInMenu = entityName.replace(/ /g,"_");
			},			
			XupdateCurrentCSVToServer: function(entityName){ //update all records of entityName Table existing in dictionary
				// entityName- Name of entity that will be stored
				// if entityName has spaces, they will be changed by "_"
				if(FL.dd.isEntityInLocalDictionary(entityName)){
					var spinner=FL.common.loaderAnimationON('spinnerDiv');
					var removeTablePromise = FL.API.removeTable(entityName);
					removeTablePromise.done(function(data){					
						// var arrToSend = FL.grid.extractFromCsvStore();
						var arrToSend = csvStore.extractFromCsvStore();
						var saveTablePromise = FL.API.saveTable(entityName,arrToSend);
						saveTablePromise.done(function(data){
							console.log("FL.grid.updateCurrentCSVToServer --> dict synch and saveTable sucessfull ->"+JSON.stringify(data));
							spinner.stop();
							return;
						});
						saveTablePromise.fail(function(err){
							spinner.stop();
							alert("FL.grid.updateCurrentCSVToServer --> after successful remove ->FAILURE in FL.API.saveTable err="+err);
							return;
						});

					});
					removeTablePromise.fail(function(err){
						spinner.stop();
						alert("FL.grid.updateCurrentCSVToServer --> FAILURE to remove table err="+err);
						return;
					});
				}else{
					alert("FL.grid.updateCurrentCSVToServer --> " + entityName + " does not exist in Local Dictionary");
				}
				//--------------------- old code
				//var singularToUseInMenu = entityName.replace(/ /g,"_");
			},
			updateCurrentCSVToServer: function(entityName){ //update all records of entityName Table existing in dictionary
				// entityName- Name of entity that will be stored
				// if entityName has spaces, they will be changed by "_"
				// we will delete all records of entity name, and then insert all with the same _ids. 
				//		fd.remove("50", {query:{}, single:{single:false}}, function(er, dr){
				//		fd.insert("50",[{_id:x1,d:{"51":"cliente 1","52":"Lisboa","53":"Portugal"}}, {_id:x2,d:{"51":"cliente 2","52":"Porto","53":"Portugal"}}])
				var def = $.Deferred();
				if(FL.dd.isEntityInLocalDictionary(entityName)){
					var spinner=FL.common.loaderAnimationON('spinnerDiv');
					var eCN = FL.dd.getCEntity(entityName);
					var removeAllPromise = FL.API.removeAllRecords(eCN);
					removeAllPromise.done(function(data){
						console.log("FL.grid.updateCurrentCSVToServer --> removeAll sucessfull !!! ->"+JSON.stringify(data));
						//FL.API  var convertOneRecordTo_arrToSend
						// var arrToSend = csvStore.extractFromCsvStoreWith_Id();  //convertRecordsTo_arrToSend in FLAPI
						var arrToSend = csvStore.extractFromCsvStore();
						if(arrToSend.length!=data.count)
							alert("ça c'est pas bon --->arrToSend.length="+arrToSend.length+ " vs data.count="+ data.count );			
						// var insertAllPromise = FL.API._insert(eCN);
						//we NEED TO INTRODUCE _id at d:{} level and remove-it from 
						var insertAllPromise = FL.API.addRecordsToTable(entityName,arrToSend,true);//last parameter is withId to force the same Ids
						insertAllPromise.done(function(data){
							spinner.stop();
							return def.resolve(data);
						});
						insertAllPromise.fail(function(err){
							spinner.stop();
							console.log("FL.grid.updateCurrentCSVToServer --> after successful remove ->FAILURE in insertAllPromise err="+err);
							return def.reject(err);
						});
					});
					removeAllPromise.fail(function(err){
						spinner.stop();
						console.log("FL.grid.updateCurrentCSVToServer --> after successful remove ->FAILURE in FL.API.saveTable err="+err);
						return def.reject(err);
					});
				}else{
					return def.reject("FL.grid.updateCurrentCSVToServer --> " + entityName + " does not exist in Local Dictionary !");
				}
				return def.promise();
			},				
		   	csvToGrid: function(csvFile){//input is a JQuery object (a file representation). Ex var csvFile = $('input[type=file]');
		        csvFile.parse({//http://papaparse.com/  
		            config: {
		               // base config to use for each file
		               encoding:"ISO-8859-1" // ISO-8859-1 is the good encoding for Portuguese chars  - "UTF-8" or "utf-8", "latin-1", "windows-1255"
		               // encoding:"" // ISO-8859-1 is the good encoding for Portuguese chars  - "UTF-8" or "utf-8", "latin-1", "windows-1255"
		            },
		            before: function(file,inputElem) {
		                // alert("file name="+file.name);
		                // alert("inputElem="+inputElem);
		             },
		            checkData: function(data){//returns true if columns are ok..false otherwise
		                // alert("Before Cleaning -->"+JSON.stringify(data.results.fields));
		                var xRet = true;
		                _.each(data.results.fields,function(element){
		                    if(element === "")
		                        xRet = false;
		                });
		                return xRet;
		            },
		            complete: function(data) {
		                // data is an object data = {errors:{}, meta:{}, results:{fields:[ elements are fields],rows:[elements are objects]} } 
		                // data.results.fields - array with columns titles to show
		                // data.results.rows - an array of JSON [{},{}...{}]; each JSON  has a key/value = attribute/content
		                //     eventualy key names have upper case chars ->if columnsArr is provided by 
		                //       method utils.backGridColumnsExtractedFromDictionary() they will be converted to lower case only
		                //     eventually id will be missing among key names -  FL.grid.csvToStore() will inject id into csvStore
		                
		                //now we pass this entity to the data dictionary. Then the data dictionary will feed the grid columns
		                // csvStore.currentGridCandidate["entityName"] = entityName;
		                // var entityName = utils.createEntityFromCsvAnalisys(data.results.rows);
		                // FL.dd.displayEntities();
		                // var columnsArr2 = utils.backGridColumnsExtractedFromDictionary(entityName);//extracts attributes from dictionary and prepares columns object for backgrid
		                

		                // this is an alternative without creating any entry in data dictionary
		                // to use backGridColumnsFromArray() we need arrOfColumns with format: [{label:"xx",name:fieldName,type:xtype,enumerable:xEnumerable},{col2}...{}]
		                //  to get arrOfColumns we need a method similar to  createEntityFromCsvAnalisys(rows)
		                
		                //in some cases data.result.fields has an empty field
		                if(!this.checkData(data)){
		                    alert("Csv has a problem. Verify columns that have content but title is missing. Please suply a title or remove content.");
		                    return;
		                }
		                var arrOfColumns =  createAttributesArrFromCsvAnalisys(data.results.rows);//returns all coluns from CSV
		                injectId("id",arrOfColumns); //now the first column is an "id" column 
		                var columnsArr = utils.backGridColumnsFromArray(arrOfColumns);//extracts attributes from dictionary and prepares columns object for backgrid

		                console.log("columns defined...");
		                var columnsArr2 = [//columns definition to mountGrid - Manual equivalent  to utils.backGridColumnsExtractedFromDictionary()
		                    {label:"Order",name:"id",type:"string",enumerable:null},
		                    {label:"Col1",name:"f1",type:"string",enumerable:null},
		                    {label:"Col2",name:"f2",type:"string",enumerable:null},
		                    {label:"Col3",name:"f3",type:"enumerable",enumerable:["A","B","C"]},
		                    // {label:"Col4",name:"f4",type:"number",enumerable:null}
		                    {label:"Col4",name:"f4",type:"number",enumerable:null}
		                ];
		                var rowsArr2 = [
		                    {id:1,f1:"abcd Lda", f2:"Av Mortirmer 12",  f3:"C",f4:225},
		                    {id:2,f1:"Jua Lda",  f2:"Dr Vaquero 5",     f3:"A",f4:322},
		                    {id:3,f1:"Moe Corp", f2:"Latham Street 24C",f3:"A",f4:242},
		                    {id:4,f1:"Zuka",     f2:"123, Zuka Build.5",f3:"B",f4:357},
		                    {id:5,f1:"One World",f2:"One way street 23",f3:"A",f4:196},
		                    {id:6,f1:"Moe Corp", f2:"Latham Street 24C",f3:"A",f4:242},
		                    {id:7,f1:"ZumZum",   f2:"Vitesse Road.5",   f3:"B",f4:357},
		                    {id:8,f1:"2nd Lab",  f2:"Two way street 57",f3:"A",f4:196},
		                    {id:9,f1:"Moe Corp", f2:"Latin America 1",  f3:"A",f4:242},
		                    {id:10,f1:"Zukerman",f2:"29,Zukerman Bld.7",f3:"B",f4:357},
		                    {id:11,f1:"third A", f2:"One Str, 632",     f3:"A",f4:196}

		                 ];
		                // columnsArr - columns definition to mountGrid has the format: [{label:"xx",name:fieldName,type:xtype,enumerable:xEnumerable},{col2}...{}]
		                // columnsArr2 = utils.backGridColumnsFromArray(columnsArr2);
		                csvStore.setAttributesArr(arrOfColumns);
		                FL.grid.csvToStore(data.results.rows); //feeds the csvStore data store object. It inserts id element and converts keys to lowercase
		                
		                utils.mountGridInCsvStore(columnsArr);//mount backbone views and operates grid - columnsArr must be prepared to backGrid
		                // to prepare columnArr to backGrid use utils.backGridColumnsExtractedFromDictionary() or backGridColumnsFromArray()
		                // utils.mountGridInCsvStore(columnsArr2);//mount backbone views and operates grid - columnsArr must be prepared to backGrid
					}
		        });
		    },
			removeLastRowIfIncomplete: function (data){
				//by some unknown reason papaparse may leave a last row incomplete....
				//to prevent the existence of an incomplete last line. We will check if last line has the rigth number of columns if not we remove it
				var lastRowIndex = data.data.length - 1;
				var lastLineObj = data.data[lastRowIndex];
				var totColsPerRow = data.meta.fields.length;
				var lastLineCols = ( _.values(lastLineObj) ).length;
				if (lastLineCols != totColsPerRow)
					data.data.splice(lastRowIndex, 1);			
			},
	   		csvToGrid2: function(csvFile,delimiter,encoding,entityName){//input is a file object obtained from DOM	//http://papaparse.com/  
						//csvFile - file to load file from local computer
						//delimiter - eventual delimiter to use instead of auto delimiter. This is decided by onchange="FL.grid.validateCSV(this.files)"
						// var spinner=FL.common.loaderAnimationON('spinnerDiv');
						var thiz = this;
						skipEmptyLines = true;
						if(!delimiter){
							delimiter = "";//this is the default =>autodetect
							skipEmptyLines = false;//this is the default
						}	
						Papa.parse(csvFile, {
				        	header: true,
							dynamicTyping: true,//If true, numeric and boolean data will be converted to their type instead of remaining strings.
												//Numeric data must conform to the definition of a decimal literal. (European-formatted numbers must have commas and dots swapped.)
												//Papa parse don't know how to automatically detect if the number is American- or European-formatted. 
							delimiter: delimiter,
							skipEmptyLines: skipEmptyLines,
							// encoding:"ISO-8859-1",// ISO-8859-1 is the good encoding for Portuguese chars  - "UTF-8" or "utf-8", "latin-1", "windows-1255"
				            encoding: encoding, //defined in verifyPapaFields()
				            complete: function(data) {
				                // data is an object data = {errors:{}, meta:{}, results:{fields:[ elements are fields],rows:[elements are objects]} } 
				                // data.results.fields - array with columns titles to show
				                // data.results.rows - an array of JSON [{},{}...{}]; each JSON  has a key/value = attribute/content
				                //     eventualy key names have upper case chars ->if columnsArr is provided by 
				                //       method utils.backGridColumnsExtractedFromDictionary() they will be converted to lower case only
				                //     eventually id will be missing among key names -  FL.grid.csvToStore() will inject id into csvStore
				                
				                //Process: 
				                //  removeLastRowIfIncomplete->Analyse CSV data to determine type of columns ->
				                //  ->Scan every line to adjust it to type ->save data.rows to csvStore ->mount and display grid ->
				                //  ->Store csvStore to Serverr and place menu titem to acess data from server.
					                
								thiz.removeLastRowIfIncomplete(data);//to remove eventual incomplete last line
				                var arrOfAttributes = dataRowAnalisys(data.data, 0.5);//row analisys returning array of attributes (one element per column) 
				                // arrOfAttributes ->[attributeName1:{fieldType":"string","fieldTypeUI":"textbox","numberFormat":null, enumerable:null,label:element},attributeName2{..}]

				                adjustRowsToAttributes(data.data,arrOfAttributes);//here we will adjust data.data according with the analisys feedback in arrOfColumns

				                var arrOfColumns =  translateToDDFormat(arrOfAttributes);//translates arrOfAttributes format to dd format
				                // returns an array with the same format as dd dictionary array of attributes. Each element has the following format:
			        			//   ex: {name:"address",description:"address to send invoices",label:"Address",type:"string",enumerable:null,key:false});		                

				                // injectId("id",arrOfColumns); //now the first column is an "id" column 
				                injectId("#",arrOfColumns); //now the first column is an "id" column 

				                csvStore.setAttributesArr(arrOfColumns);
				                FL.grid.csvToStore(data.data); //feeds the csvStore data store object. It inserts id element and converts keys to lowercase
				                
				                var columnsArr = utils.backGridColumnsFromArray(arrOfColumns);//extracts attributes from dictionary and prepares columns object for backgrid
				               	console.log("columns defined..."+JSON.stringify(columnsArr));
				                
				                utils.mountGridInCsvStore(columnsArr);//mount backbone views and operates grid - columnsArr must be prepared to backGrid
				                // to prepare columnArr to backGrid use utils.backGridColumnsExtractedFromDictionary() or backGridColumnsFromArray()
				                // utils.mountGridInCsvStore(columnsArr2);//mount backbone views and operates grid - columnsArr must be prepared to backGrid
				                FL.grid.storeCurrentCSVToServerAndInsertMenu(entityName);//the 
				                // spinner.stop();
				            }
		        		});
		    },		    
			displayDefaultGrid: function(entityName) { //loads entity from server and display the grid with add,del,edit grid buttons at left and newsletter if a email field exist
				entityName = entityName.replace(/_/g," ");
				// FL.common.spin(true);
				var spinner=FL.common.loaderAnimationON('spinnerDiv');
				// setInterval(function(){spinner.stop();},1000);
				var promise=FL.API.loadTable(entityName);
				promise.done(function(data){
					console.log("New %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
					csvStore.setEntityName(entityName);//stores <entityName> in csvStore object 
					csvStore.store(data);//data is an array of objects [{},{},....{}] where id field is mandatory inside {}
					var z=csvStore.csvRows;//only for debugging
					// alert("New DefaultGridWithNewsLetterAndEditButtons -->import is done");
					console.log("New DefaultGridWithNewsLetterAndEditButtons -->import is done");
					console.log("show csvStore="+JSON.stringify(csvStore.csvRows));
					var columnsArr = utils.backGridColumnsExtractedFromDictionary(entityName);//extracts attributes from dictionary and prepares columns object for backgrid
					console.log("New &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& entity="+entityName);
					console.log("show columnsArr="+JSON.stringify(columnsArr));
					// FL.common.spin(false);
					spinner.stop();
					FL.common.clearSpaceBelowMenus();
					$("#addGrid").show();
					$("#addGrid").html(" Add Row");
					$('#_editGrid').off('click');
					$("#_editGrid").click(function(){
						editGrid(entityName);
					});				
					$("#_editGrid").show();
					var eCN = FL.dd.getCEntity(entityName);//to remove later when we change entityName by eCN
					var emailAttributeName = FL.dd.firstEmailAttribute(eCN);
					if(emailAttributeName) {
					// if( FL.dd.isEntityWithTypeUI(entityName,"emailbox") || FL.dd.isEntityWithTypeUI(entityName,"email") ){//the newsletter option only appears to entities that have an email
						$('#_newsletter').off('click');
						$("#_newsletter").click(function(){
							var templatePromise=FL.API.createTemplates_ifNotExisting();
							templatePromise.done(function(){
								// alert("FLGrid2 l1143 grid = "+grid);
								prepareNewsletterEmission(entityName,grid,emailAttributeName);
								return;
							});
							templatePromise.fail(function(err){
								alert("FLmenulinks2.js set3ButtonsAndGrid ->FAILURE with createTemplates_ifNotExisting err="+err);
								return;
							});
						});
						$('#_newsletter').show();
						$('#_newsletterMC').off('click');
						$("#_newsletterMC").click(function(){
							prepareNewsletterMCEmission(entityName);
						});							
						$('#_newsletterMC').show();
						$("#_newsletterMC").html(" MC");
					}	
					var grid = utils.mountGridInCsvStore(columnsArr);//mount backbone views and operates grid -	
				});
				promise.fail(function(err){
					spinner.stop();
					alert("DefaultGridWithNewsLetterAndEditButtons Error="+err);
				});				
			},
			displayDefaultGrid2: function(entityName) { //loads entity from server and display the grid with add,del,edit grid buttons at left and newsletter if a email field exist
				var def = $.Deferred();
				entityName = entityName.replace(/_/g," ");
				// FL.common.spin(true);

				var spinner=FL.common.loaderAnimationON('spinnerDiv');
				var promiseUnblock = FL.API.checkServerCallBlocked()
				.then(function(){//this only occurs when checkServerCallBlocked is resolved
					var promise=FL.API.loadTable(entityName);
					promise.done(function(data){
						csvStore.setEntityName(entityName);//stores <entityName> in csvStore object 
						csvStore.store(data);//data is an array of objects [{},{},....{}] where id field is mandatory inside {}
						console.log("FL.grid.displayDefaultGrid2 -->loadTable is done");console.log("show csvStore="+JSON.stringify(csvStore.csvRows));
						var columnsArr = utils.backGridColumnsExtractedFromDictionary(entityName);//extracts attributes from dictionary and prepares columns object for backgrid
						console.log("FL.grid.displayDefaultGrid2 &&&&&&&& entity="+entityName);console.log("show columnsArr="+JSON.stringify(columnsArr));
						FL.common.clearSpaceBelowMenus();
						$("#addGrid").show();$("#addGrid").html(" Add Row");$('#_editGrid').off('click');$("#_editGrid").click(function(){ editGrid(entityName);});
						$("#_editGrid").show();
						if( FL.dd.isEntityWithTypeUI(entityName,"emailbox") || FL.dd.isEntityWithTypeUI(entityName,"email") ){//the newsletter option only appears to entities that have an email
							$('#_newsletter').off('click');
							$("#_newsletter").click(function(grid){
								var templatePromise=FL.API.createTemplates_ifNotExisting();
								templatePromise.done(function(){
									prepareNewsletterEmission(entityName,grid);
									return;
								});
								templatePromise.fail(function(err){
									alert("FL.grid.displayDefaultGrid2 ->FAILURE with createTemplates_ifNotExisting err="+err);
									return;
								});
							});
							$('#_newsletter').show();$('#_newsletterMC').off('click');$("#_newsletterMC").click(function(){prepareNewsletterMCEmission(entityName);});							
							$('#_newsletterMC').show();$("#_newsletterMC").html(" MC");
						}	
						utils.mountGridInCsvStore(columnsArr);//mount backbone views and operates grid -	
						spinner.stop();
						return def.resolve();
					});
					promise.fail(function(err){
						spinner.stop();
						return def.reject("FL.grid.displayDefaultGrid2 failure on loadTable "+err);
					});
				}, function(err){
					spinner.stop();
					return def.reject("FL.grid.displayDefaultGrid2 failure on checkServerCallBlocked() "+err);
				});
            	return def.promise();
			},
			sendEmailTest: function() {//sends a sample email with eMail/newsletter
				if(FL.login.emailContentTemplate){
					// var mailHTML = '<p>Thank you for selecting <a href="http://www.framelink.co"><strong>FrameLink version 8</strong></a> to build your backend site !</p>';			
					var mailHTML = FL.login.emailContentTemplate;
					var imagesArr = FL.login.emailImagesArray;
					var senderObj = extractSenderObjFromModal();
					// var toArr = [{"email":testEmail}];
					var toArr = [senderObj.testEmail];
					var metadataObj={newsletterName:"test",dbName:"test",eCN:null,fCN:null}

					console.log("Sends test email to from_name:"+senderObj.from_name+" email:"+senderObj.from_email+" subject:"+senderObj.subject);
					console.log("Sends to -->"+JSON.stringify(toArr));
					console.log("Sends HTML -->"+mailHTML);
					console.log("----------------------------------------------------------------------");
					// FL.links.sendEmail(null,mailHTML,imagesArr,toArr,senderObj,"test");
					// FL.emailServices.sendEmail(null,mailHTML,imagesArr,toArr,senderObj,"test","test");//2 last param: FL.login.emailTemplateName,FL.login.token.dbName
					FL.emailServices.sendEmail(mailHTML,imagesArr,toArr,senderObj,metadataObj);
					// alert("Email test sent to "+senderObj.testEmail);
					FL.common.makeModalInfo("Test Email sent to "+senderObj.testEmail,null,2);
				}else{
					// alert("Email content is empty - choose a template and try again ");
					FL.common.makeModalInfo("Email content is empty - choose a template and try again",null,2);
				}
			},			
			testFunc: function(x) {
				alert("FL.grid.test() -->"+x);
			}
		};
	})();
// });