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
	FL["links"] = (function(){//name space FL.dd
		var internalTest = function ( x) { //returns a 2 bytes string from number 
			console.log( "FLmenulinks2.js internalTest -->"+x );
		};
		var extractSenderObjFromModal = function() { //extracts senderObj from _sendNewsletterTemplate
			var name = $("#_sendNewsletter_name").val();
			var email = $("#_sendNewsletter_email").val();
			var subject = $("#_sendNewsletter_subject").val();
			var testEmail =  $("#_sendNewsletter_testEmail").val();
			var senderObj = {from_name:name,from_email:email,subject:subject,testEmail:testEmail};
			return senderObj;
		};
		var XgetMailchimpHTML = function(cId) {
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
		var XconvertsToArrOfObj = function(templateOptionsArr){
			//receives [{"_id": "t 115",jsonTemplate:"dfdfdg"},{"_id": "t 116",jsonTemplate:"dfgd"}] and returns [{value:1,text: "t 115",template:"dfdfdg"},{value:2,text: "t 116",template:"dfgd"}]
			return _.map(templateOptionsArr, function(el,index){ return {"value":index+1,"text":el._id,"template":el.jsonTemplate}; });
		};
		var mountTemplate = function(jsonObj,header,body,footer) {
			window.templateCounter = 0;
			appendTemplate(jsonObj.templateItems.header,header);
			appendTemplate(jsonObj.templateItems.body,body);
			appendTemplate(jsonObj.templateItems.footer,footer);
		};
		var tt = function(){
			console.log("tt");
		};
		var XaddImageToMandrillImageArr = function(name,srcContent){//mandrillImagesArr is formed to FL.login.emailImagesArray
			// var srcContent = imageFromJson.substring(23);//removes the beginning chars:"data:image/jpeg;base64,"
			var imageArrElement = {name:name, type:"image/jpg", content:srcContent};
			FL.login.emailImagesArray.push(imageArrElement);
		};
		var XcheckSocialblock = function(item){//HACK to introduce social links if text Item has "socialblock"
			var is_social = false;
			if(item.type == "title"){//TEMPORARY to be a social element it must be type="title" and content = "socialblock"
				var elementStr = item.title;
				var element = $.parseHTML(elementStr);
				var titleText = $(element).text();
				if(titleText == "socialblock")
					is_social = true
			}
			return is_social;
		};
		var XappendTemplate = function(jsonObject, parentElement){
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
					element = $(element).filter("div");			
					$(parentElement).append(element);
					$(element).prop("id","template"+ window.templateCounter);
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
						$(elementImg).css(item.style);
					}
					window.templateCounter++;
				}	
			});
		};
		var XgetHTMLContent = function(jsonTemplate){
			// alert(jsonTemplate);
			var jsonObj = JSON.parse(jsonTemplate);
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
			appendTemplate(jsonObj.templateItems.header,header);
			appendTemplate(jsonObj.templateItems.body,body);
			appendTemplate(jsonObj.templateItems.footer,footer);
			return $("#templateHolder").html();
		};
		var XnewsletterEmissionUI = function(templateOptionsArr, entityName) {
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
						var senderObj = extractSenderObjFromModal();//var senderObj = {from_name:name,from_email:email,subject:subject,testEmail:testEmail};
						var toArr = csvStore.extractEmailArray();//to arr becomes: [{"email":"e1@live.com"},{"email":"email2@gmail.com"}..]
						var mailHTML = FL.login.emailContentTemplate;// we also have FL.login.emailTemplateName
						// alert("FLmenulinks2 newsletterEmissionUI Ready to send after checking duplicates.....template=" + mailHTML);
						checkDuplicateEmission(entityName,FL.login.emailTemplateName,toArr,senderObj);
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
		var XgetMailchimpTemplates = function() {
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
		var XeditGrid = function(entityName){
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
					
					
				// FL.grid.adjustRowsToAttributes(rows,arrOfAttributes);//here we will adjust data.data according with the analisys feedback in newAttributesArr
					
					var loseInfo = csvStore.transformStoreTo(newAttributesArr,changedAttributesArr,changedTypeArr);
					var columnsArrForGrid = utils.backGridColumnsFromArray(newAttributesArr);//uses dictionary format to prepare columns object for backgrid

					FL.common.clearSpaceBelowMenus();
					$("#addGrid").show();
					$("#addGrid").html("Add Row");
					$("#_editGrid").show();
					$("#_editGrid").html(" Edit Grid in editGrid");


					utils.mountGridInCsvStore(columnsArrForGrid);//mount backbone views and operates grid - columnsArr must be prepared to backGrid
					if(loseInfo){
						FL.common.makeModalConfirm("You will lose some information. Do you want to continue ?","No, cancel changes","Yes Please",function(result){
							if(result){
								FL.common.makeModalInfo("Now we will save it to server....");
							}else{
								FL.common.makeModalInfo("Nothing was saved the original grid is going to be restored....");
								FL.grid.displayDefaultGrid(entityName);//loads from server and display
							}
						});
					}else{//no info to be lost so we save in dict and reload
						//save to dict
					// FL.common.clearSpaceBelowMenus();
					// $("#addGrid").show();
					// $("#addGrid").html(" Add Row");
					// $("#_editGrid").show();
						FL.grid.displayDefaultGrid(entityName);//loads from server and display
					}
					var z=32;
				}else{
					FL.common.makeModalInfo("Nothing was saved.");
				}
			});//OK				
		};
		var checkDuplicateEmission = function(entityName,NName,recipientsArr,senderObj){
			// Assumes that NNAme is not null
			// This method manages the users dialogs for the following cases:
			//		First time emission - the newsletter was not sent before ->sends  to missingEmails = the whole list (recipientsArr)
			//		Remission to all recipients - The same newsletter was sent previously - DANGEROUS !!!!
			//         missing are null in this case ->
			//		Emission to new recipients that were introduced in the base table, after the last emission - sends to the missingEmails			var promise = FL.API.mailRecipientsOfTemplate(entityName,NName);
			var promise = FL.API.mailRecipientsOfTemplate(entityName,NName);
			promise.done(function(sent){
				var toSend =  _.pluck(recipientsArr, "email");
				console.log("==========================================");
				console.log("toSend->"+JSON.stringify(toSend));
				var missingEmails = _.difference(toSend, sent); //if sent = null =>missing = toSend

				// missingEmails = [];//TEST CASE 2 - REEMISSION
				// missingEmails.splice(0,2);//TEST CASE 3 - NEW ADDITIONS - remove position 0 and 1
	
				console.log("Emais to sent->"+JSON.stringify(missingEmails));
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
							msg = "Newsletter " + FL.login.emailTemplateName + " sent  to " + sentCount + " recipients !!!<br> - total rows checked = "+recipientsArr.length;
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
		var XprepareNewsletterEmission = function(entityName){
			var getTemplatesPromise = FL.API.loadTableId("_templates","jsonTemplate");//("_templates","jsonTemplate");
			var entityName = entityName;
			getTemplatesPromise.done(function(data){
				console.log(">>>>>FLmenulinks2.js prepareNewsletterEmission  SUCCESS <<<<<");
				if( data.length === 0 ){
					FL.common.makeModalInfo('No templates available. You must have at least one template saved.');
				}else{
					// alert("FLmenulinks2.js prepareNewsletterEmission =>\n" + JSON.stringify(data));//data array of objects
					var emissionPromise = newsletterEmissionUI(data,entityName);
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
				console.log(">>>>>FLmenulinks2.js prepareNewsletterEmission  FAILURE <<<<<"+err);
				return;
			});
		};
		var XprepareNewsletterMCEmission = function(entityName){
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
									console.log(">>>>>FLmenulinks2.js prepareNewsletterMCEmission onSelect inside dropdown FAILURE <<<<<"+err);
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
							checkDuplicateEmission(entityName,FL.login.emailTemplateName,toArr,senderObj);
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
				console.log(">>>>>FLmenulinks2.js prepareNewsletterMCEmission  FAILURE <<<<<"+err);
			});
		};
		var set3ButtonsAndGrid = function(entityName){//displays addGrid, delete and editGrid buttons (with clicks prepared) and services to the right
			$('#_editGrid').off('click');
			$("#_editGrid").click(function(){
				editGrid(entityName);
			});
			$('#_newsletter').off('click');
			$("#_newsletter").click(function(){
				var templatePromise=FL.API.createTemplates_ifNotExisting();
				templatePromise.done(function(){
					prepareNewsletterEmission(entityName);
					return;
				});
				templatePromise.fail(function(err){
					alert("FLmenulinks2.js set3ButtonsAndGrid ->FAILURE with createTemplates_ifNotExisting err="+err);
					return;
				});			
			});
			$('#_newsletterMC').off('click');
			$("#_newsletterMC").click(function(){
				prepareNewsletterMCEmission(entityName);
			});			
			FL.common.clearSpaceBelowMenus();
			$("#addGrid").show();
			$("#addGrid").html(" Add Row");
			$("#_delete").show();
			$("#_editGrid").show();
			$("#_newsletter").show();
			$("#_newsletter").html(" Newsletter");
			$("#_newsletterMC").show();
			$("#_newsletterMC").html(" MC");

			// $("#_editGrid").html(" Edit Grid");
			FL.grid.displayDefaultGrid(entityName);
		};
		var DefaultGridWithNewsLetterAndEditButtons = function(entityName) {
			//A)shows add button, newsletter and grid edit buttons if an email field exist in entityName
			//  	checks if _histoMail_<ecn(entityName)> exists. If not creates it.
			//B)shows add button and grid edit buttons if no email field exist in entityName				
			if(FL.dd.isHistoMailPeer(entityName)){
				// set3ButtonsAndGrid(entityName);//displays addGrid, newletter and editGrid buttons (with clicks prepared) and displays grid
				FL.grid.displayDefaultGrid(entityName);//loads from server and display buttons and Grid
			}else{
				// alert("_histoMail for "+entityName+" does not exist! we need to create it");
				promise = FL.API.createTableHistoMails_ifNotExisting(entityName)
				.then(function(){
					// this.setSync(FL.dd.histoMailPeer(entityName),true);
					// set3ButtonsAndGrid(entityName);
					FL.grid.displayDefaultGrid(entityName);//loads from server and display buttons and Grid
					return;}
					,function(err){alert("FL.links.DefaultGridWithNewsLetterAndEditButtons ERROR: cannot create histoMail peer for " + entityName + " - "+err); return;});
				// set3ButtonsAndGrid(entityName);//displays addGrid, newletter and editGrid buttons (with clicks prepared) and displays grid
			}
		};
		return{
			abc: "abc",
			test: function(x) {//call with menu key "uri": "javascript:FL.links.test('JOJO')"
				internalTest(x);
				alert("Fl.link.test(x) x="+x);
			},
			pageEditor: function(xPage) {//call with menu key "uri": "javascript:FL.links.pageEditor('home')"
				var connectionString = localStorage.login;// Retrieve format {email:x1,password:x3,domain:x4};
				if(connectionString.length === 0){
					alert("Fl.link.pageEditor PLEASE CONNECT TO THE DATABASE ");
					return;
				}
				connectionString = FL.common.enc(connectionString,1);
				var style = localStorage.style;
				var font = localStorage.fontFamily;
				var child = window.open("./page_editor.html?connectionString="+connectionString+"#page=" + xPage + "#style=" + style + "#font="+font, 'theWindow');
				// var child = window.open("./page_editor.html?connectionString="+connectionString+"#page=" + xPage + "#style=" + style + "#font="+font, "_blank");
				if (window.focus) {
					child.focus();
				}
				var timer = setInterval(checkChild, 500);
				function checkChild() {
					if (child.closed) {// we need this to show the new home page
						// alert("FrameLink Page Editor was closed \nconnectionString="+connectionString);
						clearInterval(timer);
						FL.login.home();
					}else{
						// child.focus();
					}
				}
			},
			newsletterEditor: function() {//call with menu key "uri": "javascript:FL.links.newsletterEditor()"
				var connectionString = localStorage.login;// Retrieve format {email:x1,password:x3,domain:x4};
				if(connectionString.length === 0){
					alert("Fl.link.newsletterEditor PLEASE CONNECT TO THE DATABASE ");
					return;
				}
				connectionString = FL.common.enc(connectionString,1);
				var child = window.open("./newsletter_editor.html?connectionString="+connectionString+"#", 'theWindow');
				// var child = window.open("./page_editor.html?connectionString="+connectionString+"#page=" + xPage + "#style=" + style + "#font="+font, "_blank");
				if (window.focus) {
					child.focus();
				}
				var timer = setInterval(checkChild, 500);
				function checkChild() {
					if (child.closed) {// we need this to show the new home page
						// alert("FrameLink Page Editor was closed \nconnectionString="+connectionString);
						clearInterval(timer);
						FL.login.home();
					}else{
						// child.focus();
					}
				}
			},
			setDefaultGridByCN: function(eCN) {//called with menu key "uri": "javascript:FL.links.setDefaultGridByCN('55')"
				var entityName = FL.dd.getEntityByCName(eCN);
				
				if(entityName == "_unNamed"){
					FL.dd.updateEntityByCName(eCN,{singular:"unNamed"});
					entityName = "unNamed";
				}
				// alert("entityName="+entityName+" eCN="+eCN+" synch="+FL.dd.isEntityInSync(entityName));
				
				if(entityName){
					this.setDefaultGrid(entityName);
				}else{
					alert("FL.links.setDefaultGridByCN ERROR: EntityCompressedName=" + eCN + " does not exist !!!");
				}
			},
			setDefaultGrid: function(entityName) {//called with menu key "uri": "javascript:FL.links.setDefaultGrid('JOJO')"
				// alert("setDefaultGrid"+entityName);
				entityName = entityName.replace(/_/g," ");//if entityName as a space like "test contacts" it will be saved in menu as "test_contact"
				// FL.API.debug = true;
				if(FL.dd.isEntityInLocalDictionary(entityName)){
					if(FL.dd.isEntityInSync(entityName) ){//entityName exists in local dictionary and is in sync
						DefaultGridWithNewsLetterAndEditButtons(entityName);
					}else{//entityName exists but is not in sync - we force synchronization
						alert("FL.links.setDefaultGrid - " + entityName + " not in sync we will syncronize local to backend.");
						FL.API.syncLocalDictionaryToServer(entityName)
							.then(function(){DefaultGridWithNewsLetterAndEditButtons(entityName);return;}
								,function(err){alert("FL.links.setDefaultGrid ERROR: cannot sync " + entityName + " to server!"); return;});
					}
				}else{//entity is not in local dictionary =>we force an update of local dictionary with server dictionary data
					// FL.API.syncLocalDictionary()
					// 	.then(function(){DefaultGridWithNewsLetterAndEditButtons(entityName);return;}
					// 		,function(err){alert("FL.links.setDefaultGrid ERROR: cannot read back end Dictionary !"); return;});

					alert("FL.links.setDefaultGrid - cannot display grid. Entity -->" + entityName + "<-- does not exist in Local Data Dictionary.");
					return;
				}
			},
			clearDictionary: function() {
				console.log("------------------------- before clearing data dictionary -----------------------------");
				FL.dd.displayEntities();
				console.log("------------------------- after clearing data dictionary -----------------------------");
				FL.dd.clear();
				FL.dd.displayEntities();
				FL.common.makeModalInfo("Local frameLink dictionary deleted. Synchronization with server failled.");

				// FL.server.syncLocalStoreToServer(function(err){
				// 	if(err){
				// 		console.log("FL.server.clearDictionary() ERROR --> failled !");
				// 		FL.common.makeModalInfo("Local frameLink dictionary deleted. Synchronization with server failled.");
				// 	}else{	
				// 		FL.dd.displayEntities();
				// 		FL.common.makeModalInfo("FrameLink dictionary was successfully deleted (client and server).");
				// 	}
				// });
			},
			userGrid: function() {//call with menu key "uri": "javascript:FL.links.setDefaultGrid('JOJO')"
				FL.common.makeModalInfo("To be implemented.");
			},			
			userAdministration: function() {//call with menu key "uri": "javascript:FL.links.setDefaultGrid('JOJO')"
				FL.common.makeModalInfo("You are the sole user, for the time being.");
				// var message = "<p>You are the sole user, for the time being.</p><br>" +
				// 			  "<button type='submit' class='btn btn-primary' onclick='xFL.links.userGrid()'>Add users</button>'";
				// FL.common.makeModal("A","User Administration",message,{type:"primary", icon:"pencil",button1:"",button2:"Ok"},function(){
				// 	if(result){
				// 		alert("Yup");
				// 	}else{
				// 		alert("Nope");
				// 	}
				// });
			},
			editStylesAndFonts: function() {//call with menu key "uri": "javascript:FL.links.setDefaultGrid('JOJO')"
				FL.common.makeModalInfo("Edit styles and fonts to be implemented here. Meanwhile use the cog slide at left");
			},			
			resetMenus: function() {//saves factory default menu in current user"
				// var lastMenuStr  = localStorage.storedMenu
				var oMenu = {
					"menu" : [
						{
							"title" : "User Administration",//0
							"uri":"javascript:FL.links.userAdministration()"
						}
					]
				};
				localStorage.storedMenu = JSON.stringify(oMenu);
				FL.server.syncLocalStoreToServer();
				FL.menu.topicUpdateJsonMenu(oMenu);
			},
			getMandrillRejectListForSender: function(senderEmail) {//returns Madrill rejectList for sender=senderEmail
				if(!senderEmail)
					senderEmail=null;
				promise = FL.API.mandrillRejectListForSender(senderEmail);
				// promise = FL.API.mandrillRejectListForSender('jessica.costa@weadvice.pt');
				promise.done(function(data){
					console.log(">>>>> FL.links.getMandrillRejectListForSender() SUCCESS <<<<< list returned!");
					// alert("getMandrillRejectListForSender:"+JSON.stringify(data));
					FL.common.clearSpaceBelowMenus();
					$( "#_placeHolder" ).show();
					$( "#_placeHolder" ).append( '<h2 style="margin-left: 30px">Rejected Email List for sender ' + senderEmail + ' </h2>' );
					$( "#_placeHolder" ).append( '<dl style="margin-left: 30px"></dl>' );
					_.each(data, function(element){
						$( "#_placeHolder dl" ).append( '<dt><span class="tab" >' + element.email + ' - rejected by ' + element.reason + '</span></dt><dd style="margin-left: 30px">' + element.detail + '</dd>' );
					});
					return;
				});
				promise.fail(function(err){console.log(">>>>> FL.links.getMandrillRejectListForSender() FAILURE returning list<<<<<"+err); return def.reject(err);});
			},
			setMandrillDeleteFromReject: function(arrayOfEmails) {//delete Emails from  Madrill rejectList
				promise = FL.API.mandrillDeleteFromReject(arrayOfEmails);
				promise.done(function(data){
					console.log(">>>>> FL.links.setMandrillDeleteFromReject() SUCCESS <<<<< list returned!");
					alert("setMandrillDeleteFromReject:"+JSON.stringify(data));
					return;
				});
				promise.fail(function(err){console.log(">>>>> FL.links.getMandrillRejectListForSender() FAILURE returning list<<<<<"+err); return def.reject(err);});

			},
			displayStatistics: function() {//delete Emails from  Madrill rejectList
				var user = "test";
				promise = FL.emailServices.mandrillStats();
				promise.done(function(data){
					console.log(">>>>> FL.links.displayStatistics() SUCCESS <<<<< list returned!");
					// alert("FL.links.displayStatistics():"+JSON.stringify(data));
					FL.common.clearSpaceBelowMenus();
					$( "#_placeHolder" ).show();
					$( "#_placeHolder" ).append( '<h2 style="margin-left: 30px">email statistics per user ' + user + ' </h2>' );
					$( "#_placeHolder" ).append( '<dl style="margin-left: 30px"></dl>' );
					_.each(data, function(element){
						$( "#_placeHolder dl" ).append( '<dt><span class="tab" >' + element.address + ' - created at ' + element.created_at + '</span></dt>' + 
							'<dd style="margin-left: 30px"> Sent         :' + element.sent + '</dd>' + 
							'<dd style="margin-left: 30px"> Hard-bounces :' + element.hard_bounces + '</dd>' + 
							'<dd style="margin-left: 30px"> Soft-bounces :' + element.soft_bounces + '</dd>' + 
							'<dd style="margin-left: 30px"> Rejects      :' + element.rejects + '</dd>' +
							'<dd style="margin-left: 30px"> Complaints    :' + element.complaints + '</dd>' +
							'<dd style="margin-left: 30px"> Unsubs       :' + element.unsubs + '</dd>' +
							'<dd style="margin-left: 30px"> Opens        :' + element.opens + '</dd>' +
							'<dd style="margin-left: 30px"> Clicks       :' + element.clicks + '</dd>' +
							'<dd style="margin-left: 30px"> Unique-opens :' + element.unique_opens + '</dd>' +
							'<dd style="margin-left: 30px"> Unique-clicks:' + element.unique_clicks + '</dd>' 
						);
					});
					return;
				});
				promise.fail(function(err){console.log(">>>>> FL.links.getMandrillRejectListForSender() FAILURE returning list<<<<<"+err); return def.reject(err);});

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
			}
		};
	})();
// });