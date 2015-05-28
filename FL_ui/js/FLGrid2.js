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
					FL.common.printToConsole("createAttributesArrFromCsvAnalisys NUMERIC attrName="+attrName + " is complete........");
					var z= 32;
				}else if(fieldType=="date"){
					//we will see
					// columnVector = _.pluck(rows,attrName);
					_.each(rows, function(rowElement,index){
						if(typeof rowElement[attrName] != "date" ){//if is a string containing a date must be converted
							rowElement[attrName] = new Date( rowElement[attrName] );//old content in string is converted to date
						}
					});
					FL.common.printToConsole("createAttributesArrFromCsvAnalisys DATE attrName="+attrName + " is complete........");
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
					if( csvStore.is_dictionaryUpdateLoseInformation( changedTypeArr) ){
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
			var localDictEntityBackup = FL.dd.getDictEntityBackup(entityName);
			var xPlural = FL.dd.plural(newSingularName,"En");  //+"s";
			FL.dd.updateEntityBySingular(entityName,{singular:newSingularName,plural:xPlural,description:description});
			// FL.dd.setEntityFieldsBySingular(entityName,newAttributesArr,changedAttributesArr);

			var spinner=FL.common.loaderAnimationON('spinnerDiv');
			//FL.API.updateDictionaryAllAttributes also updates local dictionary
			var updateDictionaryAllAttributesPromise = FL.API.updateDictionaryAllAttributes(entityName,newSingularName,description,newAttributesArr);
			updateDictionaryAllAttributesPromise.done(function(){//this update local and server dictionary
				if(changedTypeArr.length>0){//there is type change(s)
					csvStore.transformStoreTo(newAttributesArr,changedAttributesArr,changedTypeArr);//does changes in csvStore
					var updatePromise = FL.grid.updateCurrentCSVToServer(entityName);
					updatePromise.done(function(){
						spinner.stop();
						FL.grid.displayDefaultGrid(entityName);//loads from server and display
					});
					updatePromise.fail(function(err){
						spinner.stop();
						FL.dd.entities[newSingularName] = localDictEntityBackup;//rools back local dictionary update
						FL.dd.setSync(entityName,false); //warns that local dict is not in sync with server dictionary
						alert("editGrid updateCurrentCSVToServer Failure err="+err);//loads from server and displaywithout newsl
					});
				}else{
					spinner.stop();
					FL.grid.displayDefaultGrid(entityName);//loads from server and display
				}	
			});
			updateDictionaryAllAttributesPromise.fail(function(err){
				spinner.stop();
				FL.dd.entities[newSingularName] = localDictEntityBackup;//rools back local dictionary update - TESTED OK
				alert("editGrid updateTypesInServer updateDictionaryAllAttributes Failure err="+err);//loads from server and displaywithout newsl
			});
		};		
		var addImageToMandrillImageArr = function(name,srcContent){//mandrillImagesArr is formed to FL.login.emailImagesArray
			// var srcContent = imageFromJson.substring(23);//removes the beginning chars:"data:image/jpeg;base64,"
			var imageArrElement = {name:name, type:"image/jpg", content:srcContent};
			FL.login.emailImagesArray.push(imageArrElement);
		};
		var elementTemplateHTML = function(type,thiz){
			var elementId = type + "DroppedItem";
			var rawElementTemplate = $("#"+elementId).html();
			var templateFunc =  _.template(rawElementTemplate);
			var elementTemplate = templateFunc({
				bgColor:thiz.bgColor,
				paddingLeft:thiz.marginL,
				centralWidth:thiz.centralWidth,
				paddingRight:thiz.marginR,
				elNo:''//window.templateCounter FOR TESTING
			});
			return elementTemplate;
		};
		var buildSocialDivHTML = function(item){
//<a href="https://www.facebook.com/Weadvice.living.web"><img id="facebook" title="Facebook" src="http://framelink.co/app/images/social/Facebook.png" alt="Facebook" width="48" height="48"></a>
			var socialTemplate = '<a href="<%= url %>"><img id="<%= socialId %>" title="<%= socialTitle %>" src="<%= src %>" alt="<%= socialTitle %>" width="48" height="48"></a>';
			var socialEl = $("<div></div>");
			var templateFunc =  _.template(socialTemplate);
			var strHTML = "";
			if(item.linksData.facebook.enable){
				strHTML = templateFunc({
					url:item.linksData.facebook.url,
					socialId:"facebook",
					socialTitle:item.linksData.facebook.text,
					src:"http://framelink.co/app/images/social/Facebook.png",
				});
				socialEl.append(strHTML);
			}
			if(item.linksData.linkedIn.enable){
				strHTML = templateFunc({
					url:item.linksData.linkedIn.url,
					socialId:"linkedIn",
					socialTitle:item.linksData.linkedIn.text,
					src:"http://framelink.co/app/images/social/Linkedin.png",
				});
				socialEl.append(strHTML);
			}
			if(item.linksData.googlePlus.enable){
				strHTML = templateFunc({
					url:item.linksData.googlePlus.url,
					socialId:"googlePlus",
					socialTitle:item.linksData.googlePlus.text,
					src:"http://framelink.co/app/images/social/Google-Plus.png",
				});
				socialEl.append(strHTML);		
			}
			if(item.linksData.youTube.enable){ 
				strHTML = templateFunc({
					url:item.linksData.youTube.url,
					socialId:"youTube",
					socialTitle:item.linksData.youTube.text,
					src:"http://framelink.co/app/images/social/Youtube.png",
				});
				socialEl.append(strHTML);				
			}
			// if(item.linksData.twitter.enable){
			// 	strHTML = templateFunc({
			// 		url:item.linksData.twitter.url,
			// 		socialId:"twitter",
			// 		socialTitle:item.linksData.twitter.text,
			// 		src:"http://framelink.co/app/images/social/Twitter.png",
			// 	});
			// 	socialEl.append(strHTML);					
			// }
			if(item.linksData.mail.enable){
				strHTML = templateFunc({
					url:item.linksData.mail.url,
					socialId:"mail",
					socialTitle:item.linksData.mail.text,
					src:"http://framelink.co/app/images/social/Email.png",
				});
				socialEl.append(strHTML);		
			}
			return socialEl;
		};		
		var appendTemplate = function(jsonObject, parentElement,centralWidth,percent,marginL,marginR,bgColor){
			// jsonObject - array jsons corresponding to a parentElement (ex.header, body or footer) 
			// ex:[{"title":"<p>Mastruncio1</p>","style":{"fontColor":"#000","fontFamily":"Arial",...."imagePadding":"10px"},"type":"title"}]
			this.centralWidth = centralWidth;
			this.marginL = marginL;
			this.marginR = marginR;
			this.bgColor = bgColor;
			var thiz = this;
			var centralWidth = centralWidth;
			$.each(jsonObject,function(i,item){//item is array element i
				// var element = temp.getElementToDrop(item.type);
				var element = null;
				var elementId = item.type + "DroppedItem";
				if( item.type == "SocialLinks" ) {
					var rawElementTemplate = elementTemplateHTML(item.type,thiz);
					var element = $(rawElementTemplate);
					var insideDiv = element.find("div");//returns the only div in element
					var elementSocial = buildSocialDivHTML(item);
					insideDiv.empty();
					insideDiv.append(elementSocial.html());//only the innercontent of elementSocial is appended...
					$(parentElement).append(element);					
				}else if( item.type == "title" ) {
					var rawElementTemplate = elementTemplateHTML(item.type,thiz);
					var element = $(rawElementTemplate);
					var insideDiv = element.find("div");//returns the only div in element
					insideDiv.prop('id',"template"+ window.templateCounter);
					insideDiv.css(item.style);
					insideDiv.html(item.title);//PRODUCTION 
					// insideDiv.html("<p>text of "+window.templateCounter+"</p>");//TO TEST PURPOSES
					$(parentElement).append(element);
				}else if(item.type == "image"){
					var rawElementTemplate = elementTemplateHTML(item.type,thiz);
					var element = $(rawElementTemplate);
					var insideDiv = element.find("div").first();//returns the first div in element
					insideDiv.prop('id',"imageTemplate"+ window.templateCounter);

					// var elementImg = $('#'+"template"+ window.templateCounter+ ' img');//Id already assigned we search the sub element image
					var elementImg = insideDiv.find('img');//Id already assigned we search the sub element image
					// var elementAnchor = $('#'+"template"+ window.templateCounter+ ' a');//Id already assigned we search the sub element anchor
					var elementAnchor = insideDiv.find('a');//Id already assigned we search the sub element anchor
					if (item.link)
						$(elementAnchor).attr('href',item.link);


					/*
					//------TEST CODE
					//http://jsfiddle.net/joaool/MCSyr/230/
					var style ={};
					if(window.templateCounter==0){
						$(elementImg).attr('src','http://placehold.it/140x100');//<img src='http://placehold.it/200x200'/>
						$(elementImg).attr("align","right");
					}else if(window.templateCounter<4){
						$(elementImg).attr('src','http://dummyimage.com/200x100&text=200 by 100');//<img src='http://placehold.it/200x200'/>
					}else if(window.templateCounter<6){
						$(elementImg).attr('src','http://dummyimage.com/400x100&text=400 with max380');//<img src='http://placehold.it/200x200'/>
						$(elementImg).attr("width","380");
						$(elementImg).attr("height","auto");
					}else if(window.templateCounter<8){
						$(elementImg).attr('src','http://dummyimage.com/500x100&text=500 with max380');//<img src='http://placehold.it/200x200'/>
						$(elementImg).attr("width","380");
						$(elementImg).attr("height","auto");
					}else if(window.templateCounter<10){
						$(elementImg).attr('src','http://dummyimage.com/500x100&text=500 with max468');//<img src='http://placehold.it/200x200'/>
						$(elementImg).attr("width","468");
						$(elementImg).attr("height","auto");
						$(elementImg).attr("align","right");
						// $(elementImg).css(style);
					}else if(window.templateCounter<12){
						$(elementImg).attr('src','http://dummyimage.com/700x100&text=700 with max468');//<img src='http://placehold.it/200x200'/>
						$(elementImg).attr("width","468");
						$(elementImg).attr("height","auto");
						// $(elementImg).attr("border", "1px solid #ff0000;");
						$(elementImg).attr("align","right");
						$(elementImg).css(style);
					}else{
						$(elementImg).attr('src','http://placehold.it/350x150');//<img src='http://placehold.it/200x200'/>
					}
					$(parentElement).append(element);
					//------END OF TEST CODE
					*/
					//------- PRODUCTION CODE
					addImageToMandrillImageArr("template"+ window.templateCounter,item.source.substring(23));//name,imageFromJson - removes the beginning chars:"data:image/jpeg;base64,"
					$(elementImg).attr('src','cid:template'+ window.templateCounter);
					var style ={};
					var w = FL.common.getBase64Width(item.source);//check if size is bigger than central zone to prevebt broken layout
					if (w> thiz.centralWidth){//reduce size keeping ratio: (convenient for outlook)  width="400px" height="auto"
						// item.style["width"]= thiz.centralWidth + "px";
						$(elementImg).attr("width", thiz.centralWidth);
						$(elementImg).attr("height","auto");
					}else{
						$(elementImg).attr("width", w);
						$(elementImg).attr("height","auto");
					}
					$(parentElement).append(element);
					//------ END OF PRODUCTION CODE					
				}
				window.templateCounter++;
			});
		};		
		var getHTMLContent = function(jsonTemplate){
			// alert(jsonTemplate);
			var jsonObj = JSON.parse(jsonTemplate);
			// we assume a total with of 1300 - the percentage will act upon 1300 =>max=90%*1300 = 1170
			var percent = Math.floor( Math.min(jsonObj.pageStyles.pageWidth,900)/10 );
			// var marginL = jsonObj.pageStyles.headerPaddingLeft*percent/100;
			// var marginR = jsonObj.pageStyles.headerPaddingRight*percent/100;
			var marginL =  Math.floor(1300*(jsonObj.pageStyles.headerPaddingLeft/jsonObj.pageStyles.pageWidth)*percent/100);
			var marginR =  Math.floor(1300*(jsonObj.pageStyles.headerPaddingRight/jsonObj.pageStyles.pageWidth)*percent/100);

			// var centralWidthHeader = percent*1300/100 - marginL - marginR;
			var centralWidthHeader =1300*((jsonObj.pageStyles.pageWidth-jsonObj.pageStyles.headerPaddingLeft-jsonObj.pageStyles.headerPaddingRight)/jsonObj.pageStyles.pageWidth)*percent/100;
			var rawEmailTemplate = $("#emailTemplateHolder").html();
			var templateFunc =  _.template(rawEmailTemplate);
			var emailTemplate = templateFunc({
				globalPercent:percent,
				headerBgcolor:jsonObj.pageStyles.headerBgColor,
				headerPaddingLeft:marginL,//jsonObj.pageStyles.headerPaddingLeft,
				headerPaddingRight:marginR,//jsonObj.pageStyles.headerPaddingRight,
				bodyBgcolor:jsonObj.pageStyles.bodyBgColor,
				bodyPaddingLeft:marginL,//jsonObj.pageStyles.bodyPaddingLeft,
				bodyPaddingRight:marginR,//jsonObj.pageStyles.bodyPaddingRight,
				footerBgcolor:jsonObj.pageStyles.footerBgColor,
				footerPaddingLeft:marginL,//jsonObj.pageStyles.footerPaddingLeft,
				footerPaddingRight:marginR,//jsonObj.pageStyles.footerPaddingRight,				
				// totWidth:jsonObj.pageStyles.pageWidth,
				centralWidth:centralWidthHeader,
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
			appendTemplate(jsonObj.templateItems.header,header,centralWidthHeader,percent,marginL,marginR,jsonObj.pageStyles.headerBgColor);//fills header template with header content extracted from jsonObj
			appendTemplate(jsonObj.templateItems.body,body,centralWidthHeader,percent,marginL,marginR,jsonObj.pageStyles.bodyBgColor);//fills body template with body content extracted from jsonObj
			appendTemplate(jsonObj.templateItems.footer,footer,centralWidthHeader,percent,marginL,marginR,jsonObj.pageStyles.footerBgColor);//fills footer template with footer content extracted from jsonObj
			
			var emailJQ = $(emailTemplate);
			emailJQ.find("#template_holder_header").append(header.contents());
			emailJQ.find("#template_holder_body").append(body.contents());
			emailJQ.find("#template_holder_footer").append(footer.contents());
			// return $("#templateHolder").html();
			var z=$(emailJQ).html();
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
						onSelect:function(objSelected){// FL.common.printToConsole("Template choice was "+objSelected.text + " cId=" + objSelected.cId);
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
				FL.common.printToConsole(">>>>>FLGrid2.js prepareNewsletterEmission  SUCCESS <<<<<");
				if( data.length === 0 ){
					FL.common.makeModalInfo('No templates available. You must have at least one template saved.');
				}else{
					// aGrid2nulinks2.js prepareNewsletterEmission =>\n" + JSON.stringify(data));//data array of objects
					var emissionPromise = newsletterEmissionUI(data,entityName,grid,emailAttributeName);
					emissionPromise.done(function(data){
						FL.common.printToConsole("FLmenulinks2 prepareNewsletterEmission emission done !");
						return;// def.resolve(data);					
					});
					emissionPromise.fail(function(){
						alert("FLmenulinks2 prepareNewsletterEmission ->ERROR !!!");
						return;
					});

				}
			});
			getTemplatesPromise.fail(function(err){
				FL.common.printToConsole(">>>>>FLGrid2.js prepareNewsletterEmission  FAILURE <<<<<"+err);
				return;
			});
		};
		var getMailchimpHTML = function(cId) {
			var def = $.Deferred();
			var arr = null;
			var fl = FL.fl;
			if(fl){
				var mc = new fl.mailChimp();
				mc.campaignContent({cid: cId}, function(err, data){
					if(!err){
						FL.common.printToConsole("campaignlist returns no error data="+JSON.stringify(data.html));
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
			var fl = FL.fl;
			if(fl){
				var mc = new fl.mailChimp();
				mc.campaignList( {data:1}, function(err, data){
					// FL.common.printToConsole("campaignlist returns no error data="+JSON.stringify(data.data));
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
						// FL.common.printToConsole("requesting content for cid: " + oneCampaign.id);					
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
							onSelect:function(objSelected){// FL.common.printToConsole("Template choice was "+objSelected.text + " cId=" + objSelected.cId);
								//now we will get the html for the selected cId saving it in FL.login.emailContentTemplate for future consummation
								var getMailchimpHTMLPromise = getMailchimpHTML(objSelected.cId);
								getMailchimpHTMLPromise.done(function(data){
									// alert("getMailchimpHTMLPromise OK =>"+JSON.stringify(data));
									FL.login.emailContentTemplate = data;
									FL.login.emailTemplateName = objSelected.text;
								});
								getMailchimpHTMLPromise.fail(function(err){
									FL.common.printToConsole(">>>>>FLGrid2.js prepareNewsletterMCEmission onSelect inside dropdown FAILURE <<<<<"+err);
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
				FL.common.printToConsole(">>>>>FLGrid2.js prepareNewsletterMCEmission  FAILURE <<<<<"+err);
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
				FL.common.printToConsole("==========================================");
				FL.common.printToConsole("toSend->"+JSON.stringify(toSend));
				var missingEmails = _.difference(toSend, sent); //if sent = null =>missing = toSend

				// missingEmails = [];//TEST CASE 2 - REEMISSION
				// missingEmails.splice(0,2);//TEST CASE 3 - NEW ADDITIONS - remove position 0 and 1
	
				FL.common.printToConsole("Emails to sent->"+JSON.stringify(missingEmails));
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
				// var isIE = /*@cc_on!@*/false || !!document.documentMode;
				// var isFirefox = typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
				// if(isIE)
				// 	// alert("createGrid - you are using Internet Explorer");
				// if(isFirefox)
				// 	// alert("createGrid - you are using Firefox");
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
								var promise = FL.grid.storeCurrentCSVToServerAndInsertMenu(entityName);
								promise.done(function(){
									FL.grid.displayDefaultGrid(entityName);
								});
								promise.fail(function(err){
									alert("FLgrid2.js createGrid Error:"+err);
								});	
							}else{
								FL.common.makeModalInfo("The entity name '" + entityName + "' already exist. Please choose another name.");
							}
						}
					}else{
						// alert("Create Grid canceled");
						FL.common.makeModalInfo("Create Grid canceled");
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
								FL.common.printToConsole("OK on first attempt !!!!!!!!!!!!!! FILE IS A GOOD CSV ");
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
					// FL.common.printToConsole((index+1)+" ---> "+element[data.fields[0]] + " --- " + element[data.fields[6]]);//shows column 0 and column 6
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
				// FL.common.printToConsole("FLGrid2.js --> insertDefaultGridMenu show arrToSend="+JSON.stringify(arrToSend));
				// format for arraTosend must be-->[{"name":"Jojox","phone":"123"},{"name":"Anton","phone":"456"}];
				var saveTablePromise = FL.API.saveTable(singular,arrToSend);
				saveTablePromise.done(function(data){
					// FL.common.printToConsole("FLGrid2.js --> insertDefaultGridMenu Succeded saving table. returned:"+JSON.stringify(data));
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
				var def = $.Deferred();
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
					FL.common.printToConsole("FL.grid.storeCurrentCSVToServerAndInsertMenu --> dict synch and saveTable sucessfull ->"+JSON.stringify(data));
					if(insertMenu){
						var eCN = FL.dd.getCEntity(entityName);
						FL.login.permissionToAddMenu = true;//forces true...tis flag is set to false in FL.menu.topicCreateGridByCN to prevent 2 calls
						$.Topic( 'createGridOptionByCN' ).publish( menuName,eCN );//broadcast that will be received by FL.menu to add an option
					}
					FL.common.clearSpaceBelowMenus();
					spinner.stop();
					return def.resolve();
					// $.Topic( 'createGridOption' ).publish( plural,entityNameToUseInMenu );//broadcast that will be received by FL.menu to add an option
				});
				saveTablePromise.fail(function(err){
					spinner.stop();
					alert("FL.grid.storeCurrentCSVToServerAndInsertMenu --> after successful synch->FAILURE in FL.API.saveTable err="+err);
					def.reject("FL.grid.storeCurrentCSVToServerAndInsertMenu --> after successful synch->FAILURE in FL.API.saveTable err="+err);
				});

				//--------------------- old code
				var singularToUseInMenu = entityName.replace(/ /g,"_");
				return def.promise();
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
						FL.common.printToConsole("FL.grid.updateCurrentCSVToServer --> removeAll sucessfull !!! ->"+JSON.stringify(data));
						//FL.API  var convertOneRecordTo_arrToSend
						// var arrToSend = csvStore.extractFromCsvStoreWith_Id();  //convertRecordsTo_arrToSend in FLAPI
						var arrToSend = csvStore.extractFromCsvStore();
						if(arrToSend.length!=data.count)
							alert("FL.grid.updateCurrentCSVToServer - ça c'est pas bon --->arrToSend.length="+arrToSend.length+ " vs data.count="+ data.count );			
						// var insertAllPromise = FL.API._insert(eCN);
						//we NEED TO INTRODUCE _id at d:{} level and remove-it from 
						var insertAllPromise = FL.API.addRecordsToTable(entityName,arrToSend,true);//last parameter is withId to force the same Ids
						insertAllPromise.done(function(data){
							spinner.stop();
							return def.resolve(data);
						});
						insertAllPromise.fail(function(err){
							spinner.stop();
							FL.common.printToConsole("FL.grid.updateCurrentCSVToServer --> after successful remove ->FAILURE in insertAllPromise err="+err);
							return def.reject(err);
						});
					});
					removeAllPromise.fail(function(err){
						spinner.stop();
						FL.common.printToConsole("FL.grid.updateCurrentCSVToServer --> after successful remove ->FAILURE in FL.API.saveTable err="+err);
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

		                FL.common.printToConsole("columns defined...");
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
				               	FL.common.printToConsole("columns defined..."+JSON.stringify(columnsArr));
				                
				                utils.mountGridInCsvStore(columnsArr);//mount backbone views and operates grid - columnsArr must be prepared to backGrid
				                // to prepare columnArr to backGrid use utils.backGridColumnsExtractedFromDictionary() or backGridColumnsFromArray()
				                // utils.mountGridInCsvStore(columnsArr2);//mount backbone views and operates grid - columnsArr must be prepared to backGrid
				                // FL.grid.storeCurrentCSVToServerAndInsertMenu(entityName);//the 
								var promise = FL.grid.storeCurrentCSVToServerAndInsertMenu(entityName);
								promise.done(function(){
									FL.grid.displayDefaultGrid(entityName);
								});
								promise.fail(function(err){
									alert("FLgrid2.js csvToGrid2 Error:"+err);
								});					                
				                // spinner.stop();
				            }
		        		});
		    },		    
			displayDefaultGrid: function(entityName) { //loads entity from server and display the grid with add,del,edit grid buttons at left and newsletter if a email field exist
				//condition to execute is: FL.API.serverCallBlocked = false;	
				entityName = entityName.replace(/_/g," ");
				var spinner=FL.common.loaderAnimationON('spinnerDiv');
				
				var promiseUnblock = FL.API.checkServerCallBlocked()
				.then(function(){
					FL.API.serverCallBlocked = true;
					var promise=FL.API.loadTable(entityName);
					promise.done(function(data){
						FL.common.printToConsole("New %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
						csvStore.setEntityName(entityName);//stores <entityName> in csvStore object 
						csvStore.store(data);//data is an array of objects [{},{},....{}] where id field is mandatory inside {}
						var z=csvStore.csvRows;//only for debugging
						FL.common.printToConsole("show csvStore="+JSON.stringify(csvStore.csvRows));
						var columnsArr = utils.backGridColumnsExtractedFromDictionary(entityName);//extracts attributes from dictionary and prepares columns object for backgrid
						FL.common.printToConsole("New &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& entity="+entityName);
						FL.common.printToConsole("show columnsArr="+JSON.stringify(columnsArr));
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
						FL.API.serverCallBlocked = false;
					});
					promise.fail(function(err){
						FL.API.serverCallBlocked = false;
						spinner.stop();
						alert("DefaultGridWithNewsLetterAndEditButtons Error="+err);
					});				
				}, function(err){ alert("FL.grid.displayDefaultGrid ERROR: Please try again !" + err); } );			
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
						FL.common.printToConsole("FL.grid.displayDefaultGrid2 -->loadTable is done");FL.common.printToConsole("show csvStore="+JSON.stringify(csvStore.csvRows));
						var columnsArr = utils.backGridColumnsExtractedFromDictionary(entityName);//extracts attributes from dictionary and prepares columns object for backgrid
						FL.common.printToConsole("FL.grid.displayDefaultGrid2 &&&&&&&& entity="+entityName);FL.common.printToConsole("show columnsArr="+JSON.stringify(columnsArr));
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

					FL.common.printToConsole("Sends test email to from_name:"+senderObj.from_name+" email:"+senderObj.from_email+" subject:"+senderObj.subject);
					FL.common.printToConsole("Sends to -->"+JSON.stringify(toArr));
					FL.common.printToConsole("Sends HTML -->"+mailHTML);
					FL.common.printToConsole("----------------------------------------------------------------------");
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