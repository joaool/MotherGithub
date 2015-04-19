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
				// alert("-------------------->"+fileName);
				if (fileName.length == 0){
					$('#confirmStatment').empty();
					$('#confirm').hide();
					FL.common.printToConsole("Filename is empty");
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
					//In fl_builder2.html we define  <input type='file' id='input1'> The event is caugth here...
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
					//In fl_builder2.html we define <button id='confirm' class='btn btn-primary btn-xs' type='button'>OK</button> The event is caugth here...
					// the button "OK" (with id="confirm") only appears after the file selection. See importButtonHtml
					// var sourceFile = $("input[type=file]").val();//ex:c:\fakepath\weadvice.csv
					var sourceFile = csvStore.currentGridCandidate.fileName;
					// alert("confirm -->"+sourceFile);

					if (sourceFile.length === 0) {
						BootstrapDialog.alert('Please choose a csv file to import, before confirmation !');
					}else{
						var attributesArrNoId = csvStore.getAttributesArrNoId();//we retrieve all except name="id"
						// tansform [{label:"xx",name:fieldName,type:xtype,enumerable:xEnumerable},{col2}...{}] in items
						var detailItems = utils.buildMasterDetailStructureFromattributesArr(attributesArrNoId);
						var masterDetailItems = {
							master:{entityName:"",entityDescription:""},
							detailHeader:["#","Attribute","what is it","Statement to validate"],
							detail:detailItems //format is array with {attribute:<attribute name>,description:<attr description>,statement;<phrase>}
						};
						FL.common.editMasterDetail("B"," Define data","_dictEditEntityTemplate",masterDetailItems,{type:"primary", icon:"pencil",button1:"Cancel",button2:"Confirm Grid Import"},function(result){
							if(result){
								//We update name and description in csvStore.attributesArr and then use it to create dictionary fields. 
								var attributesArrNoId = csvStore.getAttributesArrNoId();//we retrieve all except name="id"
								_.each(attributesArrNoId, function(element,index){
									element["name"] = masterDetailItems.detail[index].attribute;
									element["description"] = masterDetailItems.detail[index].description;
								});
								var singular = masterDetailItems.master.entityName;
								var description = masterDetailItems.master.entityDescription;
								if(FL.dd.createEntityAndFields(singular, description,csvStore.attributesArr)){
									var oEntity =  FL.dd.getEntityBySingular(singular);
									var plural = oEntity.plural;
									// alert(" singular="+singular+" plural="+plural);
									// var cEntity = FL.dd.getCEntity(masterDetailItems.master.entityName);
									//now we sync the dictionary for the new entity put grid data ond server and create menu option
										// FL.server.insertCsvStoreDataTo(singular,function(err){
										// 	if(err){
										// 		FL.common.printToConsole("Data from entity "+singular+" Error trying to store on server error="+err);
										// 		return;
										// 	}
										// 	FL.clearSpaceBelowMenus();
										// 	$.Topic( 'createGridOption' ).publish( plural,singular );//broadcast that will be received by FL.menu to add an option
										// 	FL.dd.displayEntities();
										// });
									FL.grid.insertDefaultGridMenu(singular,plural);
								}else{
									// alert("FLSlidePanels Error trying to create existing entity "+singular);
									FL.common.makeModalConfirm("Entity " + singular + " exists. Do you want to overwrite it ?","Yes - overwrite " + singular + "!","No",function(result){
										if(result){
											FL.common.makeModalInfo("Nothing was done"); 
										}else{
											alert("is going to overwrite");
											// FL.grid.insertDefaultGridMenu(singular,plural);
										}
									});
								}	
							}else{
								FL.common.makeModalInfo("Nothing was saved.");
							}
						});//OK						
					}
				});
				$('input').change(function(e) { //this change occurs after file selection - thi is the code to produce the grid
					// alert("FLLoadCss2 managePanel3 input changed");
					// FL.common.printToConsole("input changed");
					var fileName = extractFileName( $("input[type=file]").val() );//ex:c:\fakepath\weadvice.csv
					// alert("1---->"+fileName);
					csvStore.currentGridCandidate["fileName"] = fileName;
					$('#confirmStatment').html("<h4 id='confirmStatment' style='color:white;'>If <u>" + fileName + "</u> is the file you want to import, press the OK button</h4>");
					$('#confirm').show();
					FL.clearSpaceBelowMenus();
					$("#addGrid").show();
					$("#addGrid").html("Add Row");

					var csvFile = $('input[type=file]');
					// alert("2---->"+JSON.stringify(csvFile));

					FL.grid.csvToGrid(csvFile);//csvFile is a JQuery object
					FL.common.printToConsole("------------------------------------>"+fileName);
				});
			},
			dictTemplateChangeWhatIsLabel: function(form){
				// alert('saiu to dictTemplateExitingSingular with -->'+ form.singular.value);
				var articleAndWord = FL.dd.preArticle(form.entityName.value,"En");
				var plural = FL.dd.plural(form.entityName.value,"En");
				// var article = "a";
				// $("#_dictTemplate_whatIsLabel").html("What is " + articleAndWord + " " + form.singular.value + " ?");
				// $("#_dictTemplate_whatIsLabel").html("What is " + articleAndWord + " ?");
				$("#_dictEditEntityTemplate_whatIsLabel").html(articleAndWord +" is a:");
				$("#_dictEditEntityTemplate_plural").empty();
				// if(form.entityName.value.length>0)
				// 	$("#_dictEditEntityTemplate_plural").html("FrameLink will import a table of " + plural + " with " + csvStore.getNumberOfLines() + " lines, each one with a single " + form.singular.value + ".");
			},
			dictTemplateChangeDescription: function(form){
				// alert('saiu to dictTemplateExitingSingular with -->'+ form.singular.value);
				var articleAndWord = FL.dd.preArticle(form.entityName.value,"En");
				var plural = FL.dd.plural(form.entityName.value,"En");
				var description = form.entityDescription.value;
				var descriptionBeginning = FL.dd.preArticle(description,"En");
				description = descriptionBeginning;
				// var article = "a";
				// $("#_dictEditEntityTemplate_whatIsLabel").html("What is " + articleAndWord + " " + form.singular.value + " ?");
				// $("#_dictEditEntityTemplate_whatIsLabel").html("What is " + articleAndWord + " ?");
				$("#_dictEditEntityTemplate_whatIsLabel").html(articleAndWord +" is " + description);
			},
			dictTemplateAttributeValidation: function(form,order){
				// var statementId = "stat" + order;
				var statementId = "_dictEditEntityTemplate__f" + order +"_statement";
				var attrId = "_dictEditEntityTemplate__f" + order + "_attribute";
				var descriptionId =  "_dictEditEntityTemplate__f" + order + "_description";
				var attribute = $("#" + attrId).val();
				var attributeDescription = $("#" + descriptionId).val();
				// FL.common.printToConsole("FLSlidePanel.js dictTemplateAttributeValidation statementId=" + statementId + " attrId="+attrId+" attribute="+attribute);
				// FL.common.printToConsole("FLSlidePanel.js dictTemplateAttributeValidation form.singular.value=" + form.singular.value);


				var articleAndWord = FL.dd.preArticle(form.entityName.value,"En");
				if(!articleAndWord)
					articleAndWord = "entity";
				var plural = FL.dd.plural(form.entityName.value,"En");
				var description = form.entityDescription.value;
				var descriptionBeginning = FL.dd.preArticle(description,"En");
				description = descriptionBeginning;
				var statement = "The " + attribute + " of " + articleAndWord + " is the " +  attributeDescription;
				// FL.common.printToConsole("FLSlidePanel.js dictTemplateAttributeValidation statement=" + statement);
				$("#" + statementId ).html(statement);
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