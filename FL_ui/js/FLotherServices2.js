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
	FL["otherServices"] = (function(){//name space FL.dd
		var internalTest = function ( x) { //returns a 2 bytes string from number
			FL.common.printToConsole( "otherServices2.js internalTest -->"+x );
		};
		return{
			abc: "abc",
			test: function(x) {//call with menu key "uri": "javascript:FL.links.test('JOJO')"
				internalTest(x);
				alert("Fl.otherServices2.test(x) x="+x);
				var spreadsheetName = "FrameLink Tab";
				var headerArr = ['JO Artist', 'JO Album', 'JOPrice'];
				var rowArr0 = ['Buckethead', 'Albino Slug', 8.99];
				var rowArr1 = ['Funfunfa', 'Gatulanças Unidos', 3.22];
				var rowArr2 = ['Samuel', 'O pensador', 1.23];
				// http://excelbuilderjs.com/
				exportSheet(spreadsheetName,headerArr,[rowArr0,rowArr1,rowArr2]);
				alert("Fl.otherServices2.test(x) after exporting");

			},
			getSelectedRows: function (grid) {//input is a grid object
				//Returns the object {header:headerArr,rows:rowsArr} where:
				//		headerArr - is an array where each element is a column header of the grid
				//		rowsArr - is an array with an element per selected row. Each element is an array with the content of each column				var keys;
				var gridObj = {};
				var headerArr = [];
				var rowsArr = [];
				var row = [];
				var selectedModels = grid.getSelectedModels();
				if (selectedModels.length > 0) {
					// alert("FLGrid2 selectedModels="+selectedModels);
					_.each(selectedModels, function (element, index) {
						headerArr = [];
						row = [];
						keys=_.keys(element.attributes);//ex of element.attributes={id: 1, email: "ana_jarego7779@hotmail.com", _id: "548f07caeff2082864b4ec5a"}
						_.each(keys, function (field) {
							if(field!="id" &&field!="_id"){
								headerArr.push(field);
								row.push(element.attributes[field]);
							}
						});
						rowsArr.push(row);
						var z=32;
					    //emailsArr.push(element.attributes[emailAttributeName]);
					});
				}
				return {header:headerArr,rows:rowsArr};
			},
			exportSheet: function(spreadsheetName,headerArr,row_data){
		    	var data = [headerArr];
		    	data = data.concat(row_data);
		    	$('#_temptable').remove();
		    	this.createTable(data);
			    window.open('data:application/vnd.ms-excel,' + $('#_temptable').html());
		    },			
			exportSheet2: function(spreadsheetName,headerArr,row_data){//reserve for csv
		      var data = [headerArr];
		      data = data.concat(row_data);
		      var csvContent = "data:text/csv;charset=utf-8,";
		      data.forEach(function(infoArray, index){

		         dataString = infoArray.join(",");
		         csvContent += index < data.length ? dataString+ "\n" : dataString;

		      });
		      var encodedUri = encodeURI(csvContent);
		      var link = document.createElement("a");
		      link.setAttribute("href", encodedUri);
		      link.setAttribute("download", "Framelink_data.csv");

		      link.click(); // This will download the data file named "my_data.csv".     
		    },
			createTable: function(tableData) {
				var table = document.createElement('div');
				table.setAttribute("id", "_temptable");
				var tableBody = document.createElement('table');

				tableData.forEach(function(rowData) {
				var row = document.createElement('tr');

				rowData.forEach(function(cellData) {
				  var cell = document.createElement('th');
				  cell.appendChild(document.createTextNode(cellData));
				  row.appendChild(cell);
				});

				tableBody.appendChild(row);
				});

				table.appendChild(tableBody);
				document.body.appendChild(table);
			},	    		
		};
	})();
// });