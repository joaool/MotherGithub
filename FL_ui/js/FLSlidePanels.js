jQuery(document).ready(function($){
	/**
	* This code suports the slide panels html files (only markup)
		'FL_ui/sidepanel/fl_settings.html'
		'FL_ui/sidepanel/fl_builder.html' 
		'FL_ui/sidepanel/fl_services.html'
	*/
	// var FL = FL || {};
	FL["slidePanels"] = (function(){//name space FL.login
		var currentStyle = null; //currentStyle is set at launch by resetStyle(true) inside FL.login.checkSignIn(true);
		var selectBox = function(options, onSelection) {
			//fills the content of dropdown box with id=options.boxId with array=options.boxArr presenting options.boxCurrent as default
			//example: selectBox({boxId:"#styleSet", boxCurrent:currentStyle, boxArr:stylesForSelection}, function(selected){
			//             //code with what to do on selection
			//             alert(selected); //selected is the selected element 
			//         });
			// Drop box needs a format like:
				// <div class="btn-group">
				// 	<a class="btn btn-primary dropdown-toggle" data-toggle="dropdown" style="font-size:14px;font-weight:bold;margin-right:-4.0em" href="#"> Style Set <span class="caret"></span></a>
				// 	<ul id="styleSet" class="dropdown-menu">
				// 		<li><a href="#">xxcerulean</a></li>
				// 		<li><a href="#">xxxcosmos</a></li>
				// 		....
				// 	</ul>
				// </div>
			//var $styleSet = $("#styleSet");
			var $dropDownSelect = $(options.boxId);
			// $dropDownSelect.parents('.btn-group').find('.dropdown-toggle').html(options.boxCurrent+' <span class="caret"></span>');//shows current value
			//... and we load the select box with the current available values
			$dropDownSelect.empty();//removes the child elements of #styleSet.
			// _.each(stylesForSelection,function(element){
			_.each(options.boxArr,function(element){
				$dropDownSelect.append("<li><a href='#'>" + element.text + "</a></li>");
			});
			// $("#styleSet li a").click(function(){
			$( options.boxId + " li a").click(function(){
				var selText = $(this).text();
				// alert("the choice was:"+selText);
				// $(this).parents('.btn-group').find('.dropdown-toggle').html(selText+' <span class="caret"></span>');
				$dropDownSelect.parents('.btn-group').find('.dropdown-toggle').html(selText+' <span class="caret"></span>');
				onSelection(selText);//runs the callback function
			});
		};
		var messageEnabler = (function(){ //a singleton (to be instantiated by checkSignIn) to receive and dispatch topic messages.http://addyosmani.com/resources/essentialjsdesignpatterns/book/#singletonpatternjavascript
			var instantiated;
			function init() {
				var lastMessage = null;
				var receiver =  function(triggerName,enter){//enter true means ENTERING the slide panel trigger, false means EXITING
					lastMessage = triggerName;//triggerName is the id of the slide panel "#trigger1" or "#trigger2" or "#trigger3"
					// alert("messageEnabler.receiver received message="+lastMessage+" enter="+enter+" style="+currentStyle+" font="+currentFontFamily);
					// alert("messageEnabler.receiver triggerName="+triggerName+" enter="+enter);

					if(triggerName == "#trigger1") {//user entered or exited slide panel fl_settings.html
						// alert("messageEnabler.receiver received message from trigger1="+lastMessage+" currentStyle="+currentStyle+" font="+currentFontFamily);
						// $("#styleSet").parents('.btn-group').find('.dropdown-toggle').html(currentStyle +' <span class="caret"></span>');//shows current value
						//the values that appear before any selection....
						$("#styleSet").parents('.btn-group').find('.dropdown-toggle').html(currentStyle +' <span class="caret"></span>');//shows current value
						$("#fontFamily").parents('.btn-group').find('.dropdown-toggle').html(currentFontFamily +' <span class="caret"></span>');//shows current value

						selectBox({boxId: "#styleSet",boxCurrent: currentStyle,boxArr: stylesForSelection},function(selected){
							//following code is what is done on selection
							currentStyle = selected;
							localStorage.style = currentStyle;
							$.Topic( 'styleChange' ).publish( currentStyle);//broadcast that will be received by FL.tour
							FL.mix("ChangeStyle",{"newStyle":currentStyle});
							FL.currentStyle = currentStyle;//compatibility with touring - before code review
							resetStyle(true);
						});
						selectBox({boxId:"#fontFamily", boxArr:fontFamilyForSelection},function(selected){
							//following code is what is done on selection
							// alert("font "+selected+" was selected !");
							currentFontFamily = selected;
							localStorage.fontFamily = currentFontFamily;
							FL.mix("ChangeFontFamily",{"newFont":currentFontFamily});
							resetStyle(true);
						});
					}else if(triggerName == "#trigger2") {//user entered or exited slide panel fl_builder.html
						alert("FLSlidePanel.js init.receiver() -->Entered trigger2");
						// FL.login.managePanel3();
						// window.zz="firstTime.csv";
					}else if(triggerName == "#trigger3") {//user entered or exited slide panel fl_service.html
						// alert("FLLoadCss.js init.receiver() -->Entered trigger3");		
					}
				};
				$.Topic( 'slidePanel' ).subscribe( receiver );

				return {//the singleton
					lastMessage: lastMessage
				};
			}
			return {
				getInstance: function(){
					if(!instantiated) {
						instantiated = init();
					}
					return instantiated;
				}
			};
		})();
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