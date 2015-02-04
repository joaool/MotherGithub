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
			var arrWrap = _.chain(arr).countBy().pairs(); //arrGroups gives us the number of different elements
			var arrGroups = arrWrap._wrapped; //arrGroups gives us the number of different elements
			//arrGroups has the format: [ ["High",40], ["Medium",47], ["Premium",5], ]
			var emptyPair = _.find(arrGroups,function(pair){return pair[0]==="";});
			var empties = 0;
			if(typeof emptyPair !== 'undefined'){
				empties = emptyPair[1];
			}
			var uniqueArr = _.map(arrGroups,function(element){return element[0];});
			return {empties:empties,uniqueArr:uniqueArr};
		};
		var dataRowAnalisys = function(rows, percent) {
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
				if (dataType == "string") {//possible datatypes:string, integer, number, boolean, date, or json 
					//analysis of the first 50 elements or all if length<50
					var arrOfRowValues = _.pluck(rowsSample,element);
					var uniqueObj = extractUniqueFromArray(arrOfRowValues);//returns {empties:no_of empties,uniqueArr:uniqueArr}
					//percent = (total diferent cases excluding empty)/(total non empty cases)
					var columnPercent = ( uniqueObj.uniqueArr.length - ((uniqueObj.empties == 0) ? 0 : 1))/( numOfSampleRows - uniqueObj.empties );
					if ( columnPercent < percent ) { //we have an enumerable
						var arrOfAllRowValues = _.pluck(rows,element);
						var fullUniqueObj = extractUniqueFromArray(arrOfAllRowValues);
						obj[element.toLowerCase()] = {"fieldType":"string","fieldTypeUI":"combobox",enumerable:fullUniqueObj.uniqueArr, label:element};
					}else{//not an enumerable
						obj[element.toLowerCase()] = {"fieldType":"string","fieldTypeUI":"textbox",enumerable:null,label:element};
						if( is_ColumnOfSubtype( "email",uniqueObj.uniqueArr ) )
							obj[element.toLowerCase()]["fieldTypeUI"] = "email";
						else if( is_ColumnOfSubtype( "url",uniqueObj.uniqueArr ) )
							obj[element.toLowerCase()]["fieldTypeUI"] = "url";
						else if( is_ColumnOfSubtype( "phone",uniqueObj.uniqueArr ) )
							obj[element.toLowerCase()]["fieldTypeUI"] = "phone";
					}
				}else{
					if (dataType == "number") {//possible datatypes:string, integer, number, boolean, date, or json 
						obj[element.toLowerCase()] = {"fieldType":"number","fieldTypeUI":"numberbox",enumerable:null, label:element};
					}else if(dataType == "email") {
						obj[element.toLowerCase()] = {"fieldType":"string","fieldTypeUI":"emailbox",enumerable:null, label:element};
					}else if(dataType == "boolean") {
						obj[element.toLowerCase()] = {"fieldType":"boolean","fieldTypeUI":"checkbox",enumerable:null, label:element};
					}else if(dataType == "date") {
						obj[element.toLowerCase()] = {"fieldType":"date","fieldTypeUI":"datetextbox",enumerable:null, label:element};
					}else{
						obj[element.toLowerCase()] = {"fieldType":"string","fieldTypeUI":"textbox",enumerable:null,label:element};
					}
				}
				arrOfTypes.push(obj);
				var z=32;
			});
			return arrOfTypes;
		};
		var createAttributesArrFromCsvAnalisys = function(rows){//creates the equivalent to a dd entry from a set of rows
			// returns an array with the same format as dd dictionary array of attributes. Each element has the following format:
			//      ex: {name:"address",description:"address to send invoices",label:"Address",type:"string",enumerable:null,key:false});
			var attributesArr = [];
			var arrOfAttributes = dataRowAnalisys(rows, 0.5);
			_.each(arrOfAttributes, function(element,index){
				var attrName = _.keys(element)[0];
				var fieldType =element[attrName].fieldType;
				var fieldTypeUI =element[attrName].fieldTypeUI;
				var label =element[attrName].label;
				var enumerable = null;
				// if(fieldType=="enumerable"){
				//     enumerable = element[attrName].enumerable;
				// }
				if(fieldType=="string" && fieldTypeUI == "combobox"){
					enumerable = element[attrName].enumerable;
				}
				console.log(index+" - createAttributesArrFromCsvAnalisys "+attrName +" type="+fieldType+" label="+label + +" typeUI="+fieldTypeUI );
				attributesArr.push({name: attrName,description: "description of " + attrName,label: label,type: fieldType, typeUI: fieldTypeUI, enumerable: enumerable, key: false});

				// FL.dd.addAttribute(entityName, attrName,entityName+"' "+attrName,label,fieldType,enumerable);//xEntity,xAttribute,xDescription,xLabel,xType,xEnumerable
			});
			// attributesArr.push({label:"Order",name:"id",description: "order of lines",type:"string",enumerable:null,key:true}); //injects id exactly like dd
			return attributesArr;
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
							alert("Empty sample or headerString => nothing to do");
						else{
							//FL.ddcreateEntity()
							var arrOfColumns =prepareAttributesArr(headerString);
							injectId("id",arrOfColumns); //now the first column is an "id" column 
							// alert("--->"+JSON.stringify(arrOfColumns));
							var columnsArr = utils.backGridColumnsFromArray(arrOfColumns);//extracts attributes from dictionary and prepares columns object for backgrid
							csvStore.setAttributesArr(arrOfColumns);//saves arrOfColumns on csvStore -  [{label:"xx",name:fieldName,description:xDescription,type:xtype,enumerable:xEnumerable},{col2}...{}]

							var emptyRowArr = prepareOneEmptyRowArray(arrOfColumns)
                			// utils.csvToStore(data.results.rows); //feeds the csvStore data store object. It inserts id element and converts keys to lowercase
               				// {id:1,f1:"abcd Lda", f2:"Av Mortirmer 12",  f3:"C",f4:225},
               				// alert("--->"+JSON.stringify(emptyRowArr));


               				utils.csvToStore(emptyRowArr); //feeds the csvStore data store object. It inserts id element and converts keys to lowercase
 							// var histoPromise=FL.API.createTableHistoMails_ifNotExisting(entityName);

 							FL.common.clearSpaceBelowMenus();
							$("#addGrid").show();
							$("#addGrid").html("Add Row");
			 				$("#_editGrid").show();
							$("#_editGrid").html(" Edit Grid");
							
                			utils.mountGridInCsvStore(columnsArr);//mount backbone views and operates grid - columnsArr must be prepared to backGrid
						}
					}else{
						alert("Create Grid canceled");
					}
				});
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
								$("#addGrid").show();
								$("#addGrid").html("Add Row");
				 				$("#_editGrid").show();
								$("#_editGrid").html(" Edit Grid");
								
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
			extractFromCsvStore: function(){
				//Ex: from csvStore.csvRows = {"1":{"id":1,"shipped":true,"product":"Prod 1"},"2":{"id":2,"shipped":false,"product":"Prod 2"}}
				var retArr=_.map(csvStore.csvRows, function(value,key){return value});
				return retArr;
			},
			insertDefaultGridMenu: function(singular,plural) {// Adds a menu with title <plural> and content displayDefaultGrid(<singular>)
				// cursor over menu position <plural> will show: javascript:FL.links.setDefaultGrid('<singular>')
				// if singular has spaces, they will be changed by "_"
				var singularToUseInMenu = singular.replace(/ /g,"_");
				var arrToSend = FL.grid.extractFromCsvStore(singular);
				// console.log("FLGrid2.js --> insertDefaultGridMenu show arrToSend="+JSON.stringify(arrToSend));
				// format for arraTosend must be-->[{"name":"Jojox","phone":"123"},{"name":"Anton","phone":"456"}];
				var saveTablePromise = FL.API.saveTable(singular,arrToSend);
				saveTablePromise.done(function(data){
					// console.log("FLGrid2.js --> insertDefaultGridMenu Succeded saving table. returned:"+JSON.stringify(data));
					FL.clearSpaceBelowMenus();
					$.Topic( 'createGridOption' ).publish( plural,singularToUseInMenu );//broadcast that will be received by FL.menu to add an option
				});
				saveTablePromise.fail(function(err){
					alert("FLGrid2.js --> insertDefaultGridMenu FAILURE !!! err="+err);
				});
			},
			storeCurrentCSVToServerAndInsertMenu: function(entityName){ //(entityName,plural) Adds a menu with title <plural> and content displayDefaultGrid(<singular>)
				// cursor over menu position <plural> will show: javascript:FL.links.setDefaultGridByCN('<eCN>')
				// if entityName has spaces, they will be changed by "_"
				var spinner=FL.common.loaderAnimationON('spinnerDiv');
				var menuName = null;
				if(!entityName){
					entityName = FL.dd.nextEntityBeginningBy("unNamed");
					menuName = "New Grid";			
				}else{
					menuName = FL.dd.plural(entityName,"En");
				}
				FL.dd.createEntityAndFields(entityName,entityName+"' description",csvStore.attributesArr);

				// $.Topic( 'createGridOptionByCN' ).publish( menuName,eCN );//broadcast that will be received by FL.menu to add an option
				// alert("storeCurrentCSVToServerAndInsertMenu --> will create a new entity called:"+entityName+"/"+eCN + " in menu "+menuName+" synch="+FL.dd.isEntityInSync(entityName));//(entityName,entityDescription,fieldDefinitionArray)

						// FL.API.syncLocalDictionaryToServer(entityName)
						// 	.then(function(){
						// 		var eCN = FL.dd.getCEntity(entityName);
						// 		var arrToSend = FL.grid.extractFromCsvStore(entityName);
						// 		// console.log("FLGrid2.js --> insertDefaultGridMenu show arrToSend="+JSON.stringify(arrToSend));
						// 		// format for arraTosend must be-->[{"name":"Jojox","phone":"123"},{"name":"Anton","phone":"456"}];
						// 		var saveTablePromise = FL.API.saveTable(entityName,arrToSend);
						// 		saveTablePromise.done(function(data){
						// 			console.log("FL.grid.storeCurrentCSVToServerAndInsertMenu --> dict synch and saveTable sucessfull ->"+JSON.stringify(data));
						// 			FL.clearSpaceBelowMenus();
						// 			$.Topic( 'createGridOptionByCN' ).publish( menuName,eCN );//broadcast that will be received by FL.menu to add an option
						// 			return;
						// 			// $.Topic( 'createGridOption' ).publish( plural,entityNameToUseInMenu );//broadcast that will be received by FL.menu to add an option
						// 		});
						// 		saveTablePromise.fail(function(err){
						// 			alert("FL.grid.storeCurrentCSVToServerAndInsertMenu --> after successful synch->FAILURE in FL.API.saveTable err="+err);
						// 			return;
						// 		});							
						// 		return;
						// 	}
						// 	,function(err){alert("FL.grid.storeCurrentCSVToServerAndInsertMenu --> ERROR: cannot sync " + entityName + " to server!"); return;});
								
				var arrToSend = FL.grid.extractFromCsvStore();
				var saveTablePromise = FL.API.saveTable(entityName,arrToSend);
				saveTablePromise.done(function(data){
					console.log("FL.grid.storeCurrentCSVToServerAndInsertMenu --> dict synch and saveTable sucessfull ->"+JSON.stringify(data));
					var eCN = FL.dd.getCEntity(entityName);
					$.Topic( 'createGridOptionByCN' ).publish( menuName,eCN );//broadcast that will be received by FL.menu to add an option
					FL.clearSpaceBelowMenus();
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
		                //     eventually id will be missing among key names -  utils.csvToStore() will inject id into csvStore
		                
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
		                utils.csvToStore(data.results.rows); //feeds the csvStore data store object. It inserts id element and converts keys to lowercase
		                // utils.csvToStore(rowsArr2); //feeds the csvStore data store object. It inserts id element and converts keys to lowercase
		                
		                utils.mountGridInCsvStore(columnsArr);//mount backbone views and operates grid - columnsArr must be prepared to backGrid
		                // to prepare columnArr to backGrid use utils.backGridColumnsExtractedFromDictionary() or backGridColumnsFromArray()
		                // utils.mountGridInCsvStore(columnsArr2);//mount backbone views and operates grid - columnsArr must be prepared to backGrid
		            }
		        });
		    },
	   		csvToGrid2: function(csvFile,delimiter,encoding,entityName){//input is a file object obtained from DOM	//http://papaparse.com/  
						//csvFile - file to load file from local computer
						//delimiter - eventual delimiter to use instead of auto delimiter. This is decided by onchange="FL.grid.validateCSV(this.files)"
						// var spinner=FL.common.loaderAnimationON('spinnerDiv');
						skipEmptyLines = true;
						if(!delimiter){
							delimiter = "";//this is the default =>autodetect
							skipEmptyLines = false;//this is the default
						}	
						Papa.parse(csvFile, {
				        	header: true,
							dynamicTyping: true,
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
				                //     eventually id will be missing among key names -  utils.csvToStore() will inject id into csvStore
				                
				                //now we pass this entity to the data dictionary. Then the data dictionary will feed the grid columns
				                // csvStore.currentGridCandidate["entityName"] = entityName;
				                // var entityName = utils.createEntityFromCsvAnalisys(data.results.rows);
				                // FL.dd.displayEntities();
				                // var columnsArr2 = utils.backGridColumnsExtractedFromDictionary(entityName);//extracts attributes from dictionary and prepares columns object for backgrid
				                

				                // this is an alternative without creating any entry in data dictionary
				                // to use backGridColumnsFromArray() we need arrOfColumns with format: [{label:"xx",name:fieldName,type:xtype,enumerable:xEnumerable},{col2}...{}]
				                //  to get arrOfColumns we need a method similar to  createEntityFromCsvAnalisys(rows)
				                
				                //in some cases data.result.fields has an empty field
				                // if(!this.checkData(data)){
				                //     alert("Csv has a problem. Verify columns that have content but title is missing. Please suply a title or remove content.");
				                //     return;
				                // }
				                var arrOfColumns =  createAttributesArrFromCsvAnalisys(data.data);//returns all coluns from CSV
				                // returns an array with the same format as dd dictionary array of attributes. Each element has the following format:
			        			//      ex: {name:"address",description:"address to send invoices",label:"Address",type:"string",enumerable:null,key:false});
				                injectId("id",arrOfColumns); //now the first column is an "id" column 

				                var columnsArr = utils.backGridColumnsFromArray(arrOfColumns);//extracts attributes from dictionary and prepares columns object for backgrid
				                //exemple [{"name":"del","label":"Delete"},{"name":"id","editable":false,"label":"id"},{"name":"a","label":"a","cell":"number"},
				                console.log("columns defined..."+JSON.stringify(columnsArr));

				                csvStore.setAttributesArr(arrOfColumns);
				                utils.csvToStore(data.data); //feeds the csvStore data store object. It inserts id element and converts keys to lowercase
				                // utils.csvToStore(rowsArr2); //feeds the csvStore data store object. It inserts id element and converts keys to lowercase
				                
				                utils.mountGridInCsvStore(columnsArr);//mount backbone views and operates grid - columnsArr must be prepared to backGrid
				                // to prepare columnArr to backGrid use utils.backGridColumnsExtractedFromDictionary() or backGridColumnsFromArray()
				                // utils.mountGridInCsvStore(columnsArr2);//mount backbone views and operates grid - columnsArr must be prepared to backGrid
				                FL.grid.storeCurrentCSVToServerAndInsertMenu(entityName);//the 
				                // spinner.stop();
				            }
		        		});
		    },		    
			displayDefaultGrid: function(entityName) { //loads entity from server and display the grid
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
					utils.mountGridInCsvStore(columnsArr);//mount backbone views and operates grid -	
				});
				promise.fail(function(err){
					spinner.stop();
					alert("DefaultGridWithNewsLetterAndEditButtons Error="+err);
				});				
			},		    
			testFunc: function(x) {
				alert("FL.grid.test() -->"+x);
			}
		};
	})();
// });