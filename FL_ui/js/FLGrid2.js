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
	    var firstRowAnalisys = function(rows, percent) {
	        // assumes that all rows have the same json pattern with same type in the whole array - assumes type of row = type of first row
	        // If column row type is "string" search for enumerables within that column
	        //    if [(total number of groups)/(number of rows) < percent ] assumes enumerable and identifies an array of enumerables
	        // returns
	        //   [ {name:{fieldType:"string", label:"Name"}}, ...., {service:{fieldType:"enumerable", label:"Name", enumerable:[*]}} ]
	        //      if fieldType="enumerable" the property enumerable has an array with the enumerable options.
	        var numOfRows = rows.length;
	        var arrOfKeys = _.keys( rows[0] );//at least row[0] must exist
	        var arrOfTypes = [];
	        _.each(arrOfKeys, function(element, index){
	            var obj = {};
	            var dataType = utils.typeOf((rows[0][element]).trim());//one of  "number","string","email","boolean","object","array","null","undefined","date"
	            // console.log(index+" firstRowAnalisys looking for enumerables -->"+element+ " dataType="+dataType);
	            if (dataType == "string") {//possible datatypes:string, integer, number, boolean, date, or json 

	                var arrOfRowValues = _.pluck(rows,element);
	                // var zz= _.chain(arrOfRowValues).countBy().pairs().max(_.last).value();
	                //http://stackoverflow.com/questions/18878571/underscore-js-find-the-most-frequently-occurring-value-in-an-array
	                var arrWrap = _.chain(arrOfRowValues).countBy().pairs(); //arrGroups gives us the number of different elements
	                var arrGroups = arrWrap._wrapped; //arrGroups gives us the number of different elements
	                //arrGroups has the format: [ ["High",40], ["Medium",47], ["Premium",5], ]
	                var columnPercent = arrGroups.length/numOfRows;
	                if ( columnPercent < percent ) { //we have an enumerable
	                    // console.log(index+" firstRowAnalisys looking for enumerables -->"+element+ " fieldType="+fieldType+" is enumerable ");
	                    var enumerableArr = _.map(arrGroups, function(element){ return element[0]; });
	                    obj[element.toLowerCase()] = {"fieldType":"string","fieldTypeUI":"combobox",enumerable:enumerableArr, label:element};
	                }else{
	                    obj[element.toLowerCase()] = {"fieldType":"string","fieldTypeUI":"textbox",enumerable:null,label:element};
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
        var arrOfAttributes = firstRowAnalisys(rows, 0.5);
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

            console.log(index+" - createAttributesArrFromCsvAnalisys -->"+attrName +" type="+fieldType+" label="+label );
            attributesArr.push({name: attrName,description: "description of " + attrName,label: label,type: fieldType, typeUI: fieldTypeUI, enumerable: enumerable, key: false});

            // FL.dd.addAttribute(entityName, attrName,entityName+"' "+attrName,label,fieldType,enumerable);//xEntity,xAttribute,xDescription,xLabel,xType,xEnumerable
        });
        // attributesArr.push({label:"Order",name:"id",description: "order of lines",type:"string",enumerable:null,key:true}); //injects id exactly like dd
        return attributesArr;
    };
		var internalTest = function(x) {//
			alert("grid internalTest() -->"+x);
		};
		return{
			// getPageNo: function(pagName){ //to be used by savePage and restorePage
			// 	var pageNoObj = {"home":1,"about":2};
			// 	return  pageNoObj[pagName];
			// },
			createGrid: function() {//call with menu key "uri": "javascript:FL.links.setDefaultGrid('JOJO')"
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
					console.log("FLGrid2.js --> insertDefaultGridMenu FAILURE !!! err="+err);
				});
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
			displayDefaultGrid: function(entityName) { //loads entity from server and display the grid
				entityName = entityName.replace(/_/g," ");
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
					utils.mountGridInCsvStore(columnsArr);//mount backbone views and operates grid -	
				});
				promise.fail(function(err){
					alert("DefaultGridWithNewsLetterAndEditButtons Error="+err);
				});				
			},		    
			testFunc: function(x) {
				alert("FL.grid.test() -->"+x);
			}
		};
	})();
// });