jQuery(document).ready(function($){
	/**
	* This code suports the slide panels html files (only markup)
		'FL_ui/sidepanel/fl_settings.html'
		'FL_ui/sidepanel/fl_builder.html' 
		'FL_ui/sidepanel/fl_services.html'
	*/
	// var FL = FL || {};
	FL["slidePanels"] = (function(){//name space FL.slidePanels
		//NOTE: the management of panel 1 - Global Definitions (styles and font changes...) is done in module FLLoadCss2.js to minimize calls across modules
		return{
			managePanel2: function() {//code to fl_builder.html
				// alert("managePanel2 ! in FLSlidePanels.js");
				// var fileName = csvStore.currentGridCandidate;
				var fileName = csvStore.currentGridCandidate.fileName;
				var importButtonHtml =
					"<div class='col-xs-6' style='width: 300px;' >" +
						"<div class='form-group'>" +
							"<input type='file' id='input1'>" +
							"<label>" +
								"<div id='confirmStatment'" +
									"<h4 style='color:white;'>" +
										// "Do you confirm " + zz + " " +
										"If <%= fileName %> is the file you want to import, press the OK button " +
										"<button id='confirm' class='btn btn-primary btn-xs' type='button'>OK</button>" +
									"</h4>" +
								"</div>" +
							"</label>" +
						"</div>" +
					"</div>";					
				// var compiled = _.template(importButtonHtml);
			// $('#importButton').html(compiled( {fileName:fileName} ));
				if (fileName.length == 0){
					$('#confirmStatment').empty();
					$('#confirm').hide();
					console.log("Filename is empty");
				}else{
					$('#confirmStatment').html("<h4 id='confirmStatment' style='color:white;'>If <u>" + fileName + "</u> is the file you want to import, press the OK button</h4>");
					$('#confirm').show();
				}
				// compiled({fileName:"abc"});
				// fileName = "";
				if (csvStore.arrayOfGrids.length > 0){
					fileName = csvStore.arrayOfGrids[csvStore.arrayOfGrids.length-1];
				}
				// $('#importButton').html(compiled( {fileName:fileName} ));

				$('#input1').filestyle({//http://markusslima.github.io/bootstrap-filestyle/
					input : true,
					buttonText : 'Import new csv file',
					buttonName : 'btn-primary',
					// size:"sm",
					buttonBefore : true
				});
				var extractFileName = function(nameStr){
					var xPos = nameStr.lastIndexOf("\\");
					return  nameStr.substring(xPos + 1);
				};
				$('#confirm').click(function() {
					// var sourceFile = $("input[type=file]").val();//ex:c:\fakepath\weadvice.csv
					var sourceFile = csvStore.currentGridCandidate.fileName;
					// alert("confirm -->"+sourceFile);

					if (sourceFile.length == 0) {
						BootstrapDialog.alert('Please choose a csv file to import, before confirmation !');
					}else{
						// alert(extractFileName(sourceFile));
						var templateFunc = _.template($("#dictTemplate").html());
						var formA = templateFunc({name:"Joao",age:58,occupation:"tangas"});
						BootstrapDialog.confirm(formA, function(result) {
							if(result){//logedIn
								var singular = $('#_dictTemplate_singular').val();
								var description = $('#_dictTemplate_singularDescription').val();
								var entityName = csvStore.currentGridCandidate.entityName;
								var plural = FL.dd.plural(singular,"En");

								// alert(singular + " --" +description+ " entity=" + entityName);
								
								// update dictionary with singular and description
								var cEntity = FL.dd.getCEntity(entityName);
								csvStore.insertInArrayOfGrids(singular);
								FL.dd.updateEntityByCName(cEntity,{singular:singular,plural:plural,description:description});
								//now we sync the dictionary for the new entity and then we send the content to the server
								FL.server.insertCsvStoreDataTo(singular,function(err){
									if(err){
										console.log("Data from entity "+singular+" Error trying to store on server error="+err);
										return;
									}
									$.Topic( 'createGridOption' ).publish( plural,singular );//broadcast that will be received by FL.menu to add an option
									console.log("save menu goes here");
									// var z = FL.menu
									console.log("Data from entity "+singular+" stored on server");
								});
								
								// $.Topic( 'createOption' ).publish( plural );//broadcast that will be received by FL.menu to add an option
								console.log("FLSlidePanels.js '#confirm' click -->A new menu " + plural + " was created");
								// FL.dd.displayEntities();
 
								// alert("cEntity = "+cEntity);

							}else{//logedOut
								alert("Non OK");
							}
						},{title:"Identify your data",button1:"Cancel",button2:"Confirm data",type:'type-success',cssButton2:"btn-danger"});
					}
				});
				$('input').change(function(e) { //this is the code to produce the grid
					// alert("FLLoadCss2 managePanel3 input changed");
					// console.log("input changed");
					var fileName = extractFileName( $("input[type=file]").val() );//ex:c:\fakepath\weadvice.csv
					csvStore.currentGridCandidate["fileName"] = fileName;
					$('#confirmStatment').html("<h4 id='confirmStatment' style='color:white;'>If <u>" + fileName + "</u> is the file you want to import, press the OK button</h4>");
					$('#confirm').show();
					FL.clearSpaceBelowMenus();
					$("#addGrid").show();
					$("#addGrid").html("Add Row");

					var csvFile = $('input[type=file]');
					utils.csvToGrid(csvFile);
					console.log("------------------------------------>"+fileName);
				});
			},
			dictTemplateChangeWhatIsLabel: function(form){
				// alert('saiu to dictTemplateExitingSingular with -->'+ form.singular.value);
				var articleAndWord = FL.dd.preArticle(form.singular.value,"En");
				var plural = FL.dd.plural(form.singular.value,"En");
				// var article = "a";
				// $("#_dictTemplate_whatIsLabel").html("What is " + articleAndWord + " " + form.singular.value + " ?");
				$("#_dictTemplate_whatIsLabel").html("What is " + articleAndWord + " ?");
				$("#_dictTemplate_plural").empty();
				if(form.singular.value.length>0)
					$("#_dictTemplate_plural").html("You loaded a table of " + plural );
			},
			editForm: function(formName){//Panel 2  when Home Link is clicked
				alert("editForm in FL.slidePanels -->"+formName);
				FL.clearSpaceBelowMenus();
				var person = new App.Models.Person({name:'Test FrameLInk',age:'3',occupation:'BackEnd Web App'});
				var personView = new App.Views.Person({model:person});
				$("#personContent").append(personView.render().el);   // adding people view in DOM.. Only for demo purpose...
			},
			listForm: function(formName){//Panel 2  when list Link is clicked
				alert("listForm in FL.slidePanels -->"+formName);
				FL.clearSpaceBelowMenus();
			},
			selectStyle: function() {
				alert("selectStyle !");
			}

		};
	})();
});