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
		var editGrid = function(entityName){
			// FL.common.makeModalInfo("Edit " + entityName + " x To be implemented soon");
			$("#_editGrid").empty();
			$("#_modalDialogB").empty();
			alert('This is a dummy version to edit ' + entityName + '. It is not yet operational');
			var singular  = entityName;
			var description = FL.dd.getEntityBySingular(entityName).description;
			var attributesArrNoId = csvStore.getAttributesArrNoId();//we retrieve all except name="id"
			var detailItems = utils.buildMasterDetailStructureFromattributesArr(attributesArrNoId);
			var masterDetailItems = {
				master:{entityName:singular,entityDescription:description},
				detailHeader:["#","Attribute","what is it","Statement to validate"],
				detail:detailItems //format is array with {attribute:<attribute name>,description:<attr description>,statement;<phrase>}
			};
			FL.common.editMasterDetail("B"," Define Table Dictionary","_dictEditEntityTemplate",masterDetailItems,{type:"primary", icon:"pencil",button1:"Cancel",button2:"Confirm Table Dictionary"},function(result){
				if(result){
					//We update name and description in csvStore.attributesArr and then use it to create dictionary fields. 
					var attributesArrNoId = csvStore.getAttributesArrNoId();//we retrieve all except name="id"
					_.each(attributesArrNoId, function(element,index){
						element["name"] = masterDetailItems.detail[index].attribute;
						element["description"] = masterDetailItems.detail[index].description;
					});
					var singular = masterDetailItems.master.entityName;
					var description = masterDetailItems.master.entityDescription;
							// if(FL.dd.createEntityAndFields(singular, description,csvStore.attributesArr)){
							// 	var oEntity =  FL.dd.getEntityBySingular(singular);
							// 	var plural = oEntity.plural;
							// 	// alert(" singular="+singular+" plural="+plural);
							// 	// var cEntity = FL.dd.getCEntity(masterDetailItems.master.entityName);
							// 	//now we sync the dictionary for the new entity put grid data ond server and create menu option
							// 		// FL.server.insertCsvStoreDataTo(singular,function(err){
							// 		// 	if(err){
							// 		// 		console.log("Data from entity "+singular+" Error trying to store on server error="+err);
							// 		// 		return;
							// 		// 	}
							// 		// 	FL.clearSpaceBelowMenus();
							// 		// 	$.Topic( 'createGridOption' ).publish( plural,singular );//broadcast that will be received by FL.menu to add an option
							// 		// 	FL.dd.displayEntities();
							// 		// });
							// 	FL.grid.insertDefaultGridMenu(singular,plural);
							// }else{
							// 	// alert("FLSlidePanels Error trying to create existing entity "+singular);
							// 	FL.common.makeModalConfirm("Entity " + singular + " exists. Do you want to overwrite it ?","Yes - overwrite " + singular + "!","No",function(result){
							// 		if(result){
							// 			FL.common.makeModalInfo("Nothing was done"); 
							// 		}else{
							// 			alert("is going to overwrite");
							// 			// FL.grid.insertDefaultGridMenu(singular,plural);
							// 		}
							// 	});
							// }
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
					confirmQuestion = "No risk of duplicates. It is the first emission of template " + NName + ". Do you want to send these " + toSend.length + " emails ?";
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
						// mailHTML = null; //to TEST ONLY
						var msg = "Newsletter " + FL.login.emailTemplateName + " was not sent !!!. No content to send.";
						if(mailHTML!== null){
							if(  button2 == "OK resend these emails") {
								missingEmails = toSend; //missingEmails now refers to toSend
								// alert("Resend the emission ->"+JSON.stringify(missingEmails));
							}
							var sentCount = FL.links.sendEmail(entityName,mailHTML,missingEmails,senderObj,FL.login.emailTemplateName);
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
		var prepareNewsletterEmission = function(entityName){
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
			getTemplatesPromise.done(function(arrOfObj){ //arrOfObj has the format: {value:index,text:element.title,cId:element.id}
				// alert("getTemplatesPromise done getTemplates-->"+_.pluck(arrOfObj,"text"));
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
								//now we will get the html for the selected cId saving it in FL.login.emailContentTemplate for future consummation
								var getMailchimpHTMLPromise = getMailchimpHTML(objSelected.cId);
								getMailchimpHTMLPromise.done(function(data){
									// alert("getMailchimpHTMLPromise OK =>"+JSON.stringify(data));
									FL.login.emailContentTemplate = data;
									FL.login.emailTemplateName = objSelected.text;
								});
								getMailchimpHTMLPromise.fail(function(err){
									console.log(">>>>>FLmenulinks2.js prepareNewsletterEmission onSelect inside dropdown FAILURE <<<<<"+err);
								});
							}
						}
					}
				};
				FL.common.editMasterDetail("B"," Send email/Newsletter","_sendNewsletterTemplate",masterDetailItems,options,function(result){
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
				console.log(">>>>>FLmenulinks2.js prepareNewsletterEmission  FAILURE <<<<<"+err);
			});
		};
		var set3ButtonsAndGrid = function(entityName){//displays addGrid, newletter and editGrid buttons (with clicks prepared) and display grid
			$('#_editGrid').off('click');
			$("#_editGrid").click(function(){
				editGrid(entityName);
			});
			$('#_newsletter').off('click');
			$("#_newsletter").click(function(){
				prepareNewsletterEmission(entityName);
			});
			FL.clearSpaceBelowMenus();
			$("#addGrid").show();
			$("#addGrid").html(" Add Row");
			$("#_newsletter").show();
			$("#_newsletter").html(" Newsletter");
			$("#_editGrid").show();
			// $("#_editGrid").html(" Edit Grid");
			FL.grid.displayDefaultGrid(entityName);
		};
		var DefaultGridWithNewsLetterAndEditButtons = function(entityName) {
			//A)shows add button, newsletter and grid edit buttons if an email field exist in entityName
			//  	checks if _histoMail_<ecn(entityName)> exists. If not creates it.
			//B)shows add button and grid edit buttons if no email field exist in entityName
					
			// FL.dd.setFieldTypeUI(entityName,"email","phonebox");//only for test
			// FL.dd.displayEntities();

			if(FL.dd.isEntityWithTypeUI(entityName,"emailbox")){//the newsletter option only appears to entities that have an email
				if(FL.dd.isHistoMailPeer(entityName)){
					set3ButtonsAndGrid(entityName);//displays addGrid, newletter and editGrid buttons (with clicks prepared) and displays grid
				}else{
					// alert("_histoMail for "+entityName+" does not exist! we need to create it");
					promise = FL.API.createTableHistoMails_ifNotExisting(entityName)
					.then(function(){
						// this.setSync(FL.dd.histoMailPeer(entityName),true);
						set3ButtonsAndGrid(entityName);
						return;}
						,function(err){alert("FL.links.DefaultGridWithNewsLetterAndEditButtons ERROR: cannot create histoMail peer for " + entityName + " - "+err); return;});
					// set3ButtonsAndGrid(entityName);//displays addGrid, newletter and editGrid buttons (with clicks prepared) and displays grid
				}
			}else{//no newsletter button because entity has no email field
				FL.clearSpaceBelowMenus();
				$("#addGrid").show();
				$("#addGrid").html(" Add Row");
				$("#_editGrid").show();
				// $("#_editGrid").html(" Edit Grid");
				FL.grid.displayDefaultGrid(entityName);
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
			newsletterEditor: function() {//call with menu key "uri": "javascript:FL.links.pageEditor('home')"
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
			setDefaultGrid: function(entityName) {//called with menu key "uri": "javascript:FL.links.setDefaultGrid('JOJO')"
				// alert("setDefaultGrid"+entityName);
				entityName = entityName.replace(/_/g," ");//if entityName as a space like "test contacts" it will be saved in menu as "test_contact"
				FL.API.debug = true;
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
					FL.API.syncLocalDictionary()
						.then(function(){DefaultGridWithNewsLetterAndEditButtons(entityName);return;}
							,function(err){alert("FL.links.setDefaultGrid ERROR: cannot read back end Dictionary !"); return;});

					// alert("FL.links.setDefaultGrid - cannot display grid. Entity " + entityName + " does not exist in Data Dictionary.");
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
			sendEmail:function(entityName,mailHTML,recipientsArray,senderObj,NewsletterName){//sends an email to the recipients
				//recipientsArray = ["joaoccoliveira@live.com","joaocarloscoliveira@gmail.com"]
				//returns the total number of emails sent. Notice that from the recipientsArray the methods will skip all those that do not have a valid email
				if(mailHTML ==="" || mailHTML === null){
					alert("Send Mail ->Cannot send an empty email !");
					return 0;
				}
				if(NewsletterName === null){
					alert("Send Mail ->Do document identifier (Newslettername) !");
					return 0;
				}
				// var eCN = FL.dd.getCEntity("_histoMail");//necessary for metadata. Later on we need this for each table (that has an email field) in framelink
				// var fCN = FL.dd.getFieldCompressedName("_histoMail","msg");//necessary for metadata
				var eCN = null;
				var fCN = null;
				if(entityName !== null){//if the send request comes from sendEmailTest entityName = null
					eCN = FL.dd.getCEntity(FL.dd.histoMailPeer(entityName));
					fCN = FL.dd.getFieldCompressedName(FL.dd.histoMailPeer(entityName),"msg");//necessary for metadata
				}
				var dbName = FL.login.token.dbName;//necessary for metadata		
				var m = new mandrill.Mandrill('vVC6R5SZJEHq2hjEZfUwRg');
				var toEmail = null;
				var count = 0;
				var countSend = 0;
				var total_toSend = recipientsArray.length;
				_.each(recipientsArray, function(element){
					count++;
					if(FL.common.validateEmail(element)){
						countSend++;

						var params2 = {
							"message": {
								"from_email": senderObj.from_email,
								"from_name" : senderObj.from_name,
								"to":[{email:element}],//[{"email":"joaoccoliveira@live.com"}],//{"email":"joaocarloscoliveira@gmail.com"},{"email":"nicolas@cuvillier.net"}],
								// "to":[{"email":"joaoccoliveira@live.com"}],
								// "to":[{"email":"joaocarloscoliveira@gmail.com"}],
								"subject": senderObj.subject,
								"html": mailHTML,
								"autotext":true,
								"track_opens":true,
								"track_clicks":true,
								"metadata": {
									"dbName": dbName,//"45829",//it is in token
									"eCN": eCN,	//"111",
									"fCN": fCN,   //456",
									"NName": NewsletterName  //Newsletter Name
								}				
							}
						};
						console.log("sendEmail() "+ count +"/"+total_toSend+ " --> sent Count=" + countSend + " -->" + element + " with label=" +NewsletterName);
						console.log("	to from_name:"+senderObj.from_name+" email:"+senderObj.from_email+" subject:"+senderObj.subject);
						console.log("	Sends to -->"+JSON.stringify(element));
						console.log("----------------------------------------------------------------------");
					m.messages.send(params2,function(res){console.log(res);},function(err){console.log(err);});
						//how to recover from an accident ?	
					}else{
						console.log("sendEmail not sent ! "+ count +"/"+total_toSend+ " -->" + element + " has a format error and was bypassed");				
					}
				});
				return countSend;		
			},
			sendEmailTest: function() {//sends a sample email with eMail/newsletter
				if(FL.login.emailContentTemplate){
					// var mailHTML = '<p>Thank you for selecting <a href="http://www.framelink.co"><strong>FrameLink version 8</strong></a> to build your backend site !</p>';			
					var mailHTML = FL.login.emailContentTemplate;			
					var senderObj = extractSenderObjFromModal();
					// var toArr = [{"email":testEmail}];
					var toArr = [senderObj.testEmail];
					console.log("Sends test email to from_name:"+senderObj.from_name+" email:"+senderObj.from_email+" subject:"+senderObj.subject);
					console.log("Sends to -->"+JSON.stringify(toArr));
					console.log("Sends HTML -->"+mailHTML);
					console.log("----------------------------------------------------------------------");
					FL.links.sendEmail(null,mailHTML,toArr,senderObj,"test");
					alert("Email test sent to "+senderObj.testEmail);
				}else{
					alert("Email content is empty - choose a template and try again ");
				}
				// FL.links.sendEmail("not working for the time being",mailHTML,toArr,senderObj);		
			},
			testEmail: function(x) {//sends a sample email with mandrill javascript API
				alert(x);
				FL.API.debug = true;
				csvStore.extractEmailArray();
				//http://getairmail.com/
				var mailHTML = '<p>Thank you for selecting <a href="http://www.framelink.co"><strong>FrameLink version 7</strong></a> to build your backend site !</p>';			
				var senderObj = {from_name:"jojo",from_email:"support@framelink.co",subject:"test #17 -  from FrameLink support team"};
				// var toArr = [{"email":"joaoccoliveira@live.com"},{"email":"joaocarloscoliveira@gmail.com"},{email:"wpngca@clrmail.com"}]
				var toArr = csvStore.extractEmailArray();//to arr becomes: [{"email":"e1@live.com"},{"email":"email2@gmail.com"}..]
				// FL.links.sendEmail("zzz",mailHTML,toArr,senderObj);
				return;

				var eCN = FL.dd.getCEntity("_histoMail");//necessary for metadata
				var fCN = FL.dd.getFieldCompressedName("_histoMail","msg");//necessary for metadata
				var dbName = FL.login.token.dbName;//necessary for metadata
				
				var m = new mandrill.Mandrill('vVC6R5SZJEHq2hjEZfUwRg');
				m.users.ping(function(res){console.log(res);},function(err){console.log(err);});
				var mailHTML = '<p>Thank you for selecting <a href="http://www.framelink.co"><strong>FrameLink version 3</strong></a> to build your backend site !</p>';			
				//var apikey ="04c0cdcfe7d52fbc844dfa496f1d78d5-us8";//mailchimp key
				// create a variable for the API call parameters
				var params = {
					"message": {
						"from_email":"support@framelink.co",
						"to":[{"email":"joaoccoliveira@live.com"}],
						"subject": "Text from FrameLink support team",
						"text": "I'm Joao from FrameLink support team."
					}
				};
				var params2 = {
					"message": {
						"from_email":"support@framelink.co",
						"from_name": "jojo",
						"to":[{"email":"joaoccoliveira@live.com"}],//{"email":"joaocarloscoliveira@gmail.com"},{"email":"nicolas@cuvillier.net"}],
						// "to":[{"email":"joaoccoliveira@live.com"}],
						// "to":[{"email":"joaocarloscoliveira@gmail.com"}],
						"subject": "test #15 -  from FrameLink support team",
						"html": mailHTML,
// "html":'<body style="margin:0; padding:0;" bgcolor="#F0F0F0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"><!-- 100% background wrapper (grey background) --><table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0" bgcolor="#F0F0F0"><tr>   <td align="center" valign="top" bgcolor="#F0F0F0" style="background-color: #F0F0F0;"><br><!-- 600px container (white background) --><table border="0" width="600" cellpadding="0" cellspacing="0" class="container" style="width:600px;max-width:600px"><tr><td class="container-padding header" align="left" style="font-family:Helvetica, Arial, sans-serif;font-size:24px;font-weight:bold;padding-bottom:12px;color:#DF4726;padding-left:24px;padding-right:24px">Antwort v1.0</td></tr><tr><td class="container-padding content" align="left" style="padding-left:24px;padding-right:24px;padding-top:12px;padding-bottom:12px;background-color:#ffffff"><br><div class="title" style="font-family:Helvetica, Arial, sans-serif;font-size:18px;font-weight:600;color:#374550">Single Column Fluid Layout</div><br><div class="body-text" style="font-family:Helvetica, Arial, sans-serif;font-size:14px;line-height:20px;text-align:left;color:#333333">This is an example of a single column fluid layout. There are no columns. Because the container table width is set to 100%, it automatically resizes itself to all devices. The magic of good old fashioned HTML.<br><br>The media query change we make is to decrease the content margin from 24px to 12px for devices up to max width of 400px.<br><br></div></td></tr><tr><td class="container-padding footer-text" align="left" style="font-family:Helvetica, Arial, sans-serif;font-size:12px;line-height:16px;color:#aaaaaa;padding-left:24px;padding-right:24px"><br><br>Sample Footer text: © 2014 Acme, Inc.<br><br>You are receiving this email because you opted in on our website. Update your <a href="#" style="color:#aaaaaa">email preferences</a> or <a href="#" style="color:#aaaaaa">unsubscribe</a>.<br><br><strong>Acme, Inc.</strong><br><span class="ios-footer">123 Main St.<br>Springfield, MA 12345<br></span><a href="http://www.acme-inc.com" style="color:#aaaaaa">www.acme-inc.com</a><br><br><br></td></tr></table><!--/600px container --></td></tr></table><!--/100% background wrapper--></body>',
// "html":'<body style="margin:0; padding:0;" bgcolor="#F0F0F0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"><!-- 100% background wrapper (grey background) --><table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0" bgcolor="#F0F0F0"><tr><td align="center" valign="top" bgcolor="#F0F0F0" style="background-color: #F0F0F0;"><br><!-- 600px container (white background) --><table border="0" width="600" cellpadding="0" cellspacing="0" class="container" style="width:600px;max-width:600px"><tr><td class="container-padding header" align="left" style="font-family:Helvetica, Arial, sans-serif;font-size:24px;font-weight:bold;padding-bottom:12px;color:#DF4726;padding-left:24px;padding-right:24px">Test 3 columns & Pictures</td></tr><tr><td class="content" align="left" style="padding-top:12px;padding-bottom:12px;background-color:#ffffff"><table width="600" border="0" cellpadding="0" cellspacing="0" class="force-row" style="width: 600px;"><tr><td class="content-wrapper" style="padding-left:24px;padding-right:24px"><br><div class="title" style="font-family:Helvetica, Arial, sans-serif;font-size:18px;font-weight:600;color:#374550">Three Columns</div></td></tr><tr><td class="cols-wrapper" style="padding-left:12px;padding-right:12px"><!--[if mso]><table border="0" width="576" cellpadding="0" cellspacing="0" style="width: 576px;"><tr><td width="192" style="width: 192px;" valign="top"><![endif]--><table width="192" border="0" cellpadding="0" cellspacing="0" align="left" class="force-row" style="width: 192px;"><tr><td class="col" valign="top" style="padding-left:12px;padding-right:12px;padding-top:18px;padding-bottom:12px"><img src="http://amerikaihirujsag.com/wp-content/uploads/2012/11/555-192x125.jpg" border="0" alt="The White Whale" width="168" height="110" hspace="0" vspace="0" style="max-width:100%; " class="image"><div class="subtitle" style="font-family:Helvetica, Arial, sans-serif;font-size:16px;font-weight:600;color:#2469A0;margin-top:18px">The White Whale</div><div class="col-copy" style="font-family:Helvetica, Arial, sans-serif;font-size:13px;line-height:20px;text-align:left;color:#333333;margin-top:12px">I take the good old <a href="http://www.framelink.co"><strong>FrameLink</strong></a> ground that the whale is a fish, and call upon holy Jonah to back me. This fundamental thing settled, the next point is, in what internal respect does the whale differ from other fish.</div><br></td></tr></table>'+
// '<!--[if mso]></td><td width="192" style="width: 192px;" valign="top"><![endif]--><table width="192" border="0" cellpadding="0" cellspacing="0" align="left" class="force-row" style="width: 192px;"><tr><td class="col" valign="top" style="padding-left:12px;padding-right:12px;padding-top:18px;padding-bottom:12px"><img src="http://eltcasino.com/wp-content/uploads/2013/12/EN-192x125-Blade-CRM.jpg" border="0" alt="I am Ishmael" width="168" height="110" hspace="0" vspace="0" style="max-width:100%; " class="image"><div class="subtitle" style="font-family:Helvetica, Arial, sans-serif;font-size:16px;font-weight:600;color:#2469A0;margin-top:18px">I am Ishmael</div><div class="col-copy" style="font-family:Helvetica, Arial, sans-serif;font-size:13px;line-height:20px;text-align:left;color:#333333;margin-top:12px">Here upon the very point of starting for the voyage, Captain Peleg and Captain Bildad were going it with a high hand on the quarter-deck, just as if they were to be joint-commanders at sea, as well as to all appearances in port.</div><br></td></tr></table><!--[if mso]></td><td width="192" style="width: 192px;" valign="top"><![endif]--><table width="192" border="0" cellpadding="0" cellspacing="0" align="left" class="force-row" style="width: 192px;"><tr><td class="col" valign="top" style="padding-left:12px;padding-right:12px;padding-top:18px;padding-bottom:12px"><img src="http://www.momentumlife.tv/wp-content/uploads/2013/01/012413_1442_MotherhoodI1-192x125.png" border="0" alt="The Albatross" width="168" height="110" hspace="0" vspace="0" style="max-width:100%; " class="image"><div class="subtitle" style="font-family:Helvetica, Arial, sans-serif;font-size:16px;font-weight:600;color:#2469A0;margin-top:18px">The Albatross</div><div class="col-copy" style="font-family:Helvetica, Arial, sans-serif;font-size:13px;line-height:20px;text-align:left;color:#333333;margin-top:12px">And somehow, at the time, I felt a sympathy and a sorrow for him, but for I dont know what, unless it was the cruel loss of his leg. And yet I also felt a strange awe of him; but that sort of awe, which I cannot at all describe.</div><br></td></tr></table>'+
// '<!--[if mso]></td></tr></table><![endif]--></td></tr></table></td></tr><tr><td class="container-padding footer-text" align="left" style="font-family:Helvetica, Arial, sans-serif;font-size:12px;line-height:16px;color:#aaaaaa;padding-left:24px;padding-right:24px"><br><br>Sample Footer text: © 2014 Acme, Inc.<br><br>You are receiving this email because you opted in on our website. Update your <a href="#" style="color:#aaaaaa">email preferences</a> or <a href="#" style="color:#aaaaaa">unsubscribe</a>.<br><br><strong>Acme, Inc.</strong><br><span class="ios-footer">123 Main St.<br>Springfield, MA 12345<br></span><a href="http://www.acme-inc.com" style="color:#aaaaaa">www.acme-inc.com</a><br><br><br></td></tr></table><!--/600px container --></td></tr></table><!--/100% background wrapper--></body>',
						// "html":'<table align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="ecxbodyTable" style="border-collapse:collapse;padding:0;background-color:#f2f2f2;height:100% !important;width:100% !important;"><tbody><tr><td align="center" valign="top" id="ecxbodyCell" style="padding:0;border-top:0;height:100% !important;width:100% !important;"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;"><tbody><tr><td align="center" valign="top" style=""><table border="0" cellpadding="0" cellspacing="0" width="100%" id="ecxtemplatePreheader" style="border-collapse:collapse;background-color:#ffffff;border-top:0;border-bottom:0;"><tbody><tr><td align="center" valign="top" style=""><table border="0" cellpadding="0" cellspacing="0" width="600" class="ecxtemplateContainer" style="border-collapse:collapse;"><tbody><tr><td valign="top" class="ecxpreheaderContainer" style="padding-top:9px;"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="ecxmcnTextBlock" style="border-collapse:collapse;"><tbody class="ecxmcnTextBlockOuter"><tr><td valign="top" class="ecxmcnTextBlockInner" style=""><table align="left" border="0" cellpadding="0" cellspacing="0" width="600" class="ecxmcnTextContentContainer" style="border-collapse:collapse;"><tbody><tr><td valign="top" class="ecxmcnTextContent" style="padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;color:#606060;font-family:Helvetica;font-size:11px;line-height:125%;text-align:left;"><div style="text-align:center;"><a href="https://*|ARCHIVE|*" style="word-wrap:break-word;color:#606060;font-weight:normal;text-decoration:underline;" target="_blank" class="">View it in your browser.</a></div></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr><tr><td align="center" valign="top" style=""><table border="0" cellpadding="0" cellspacing="0" width="100%" id="ecxtemplateHeader" style="border-collapse:collapse;background-color:#ffffff;border-top:0;border-bottom:0;"><tbody><tr><td align="center" valign="top" style=""><table border="0" cellpadding="0" cellspacing="0" width="600" class="ecxtemplateContainer" style="border-collapse:collapse;"><tbody><tr><td valign="top" class="ecxheaderContainer" style="padding-top:10px;padding-bottom:10px;"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="ecxmcnDividerBlock" style="border-collapse:collapse;"><tbody class="ecxmcnDividerBlockOuter"><tr><td class="ecxmcnDividerBlockInner" style="padding:1px 18px;"><table class="ecxmcnDividerContent" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-top-width:4px;border-top-style:solid;border-top-color:#1A1919;border-collapse:collapse;"><tbody><tr><td style=""><span></span></td></tr></tbody></table></td></tr></tbody></table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="ecxmcnImageCardBlock" style="border-collapse:collapse;"><tbody class="ecxmcnImageCardBlockOuter"><tr><td class="ecxmcnImageCardBlockInner" valign="top" style="padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;"><table align="right" border="0" cellpadding="0" cellspacing="0" class="ecxmcnImageCardBottomContent" width="100%" style="border:1px solid #999999;background-color:#EBEBEB;border-collapse:collapse;"><tbody><tr><td class="ecxmcnImageCardBottomImageContent" align="left" valign="top" style="padding-top:18px;padding-right:18px;padding-bottom:0;padding-left:18px;"><img alt="" src="https://gallery.mailchimp.com/33e752775d2e6f468d956f66f/images/7814e41e-0240-4b41-98ca-d70863188116.jpg" width="528" style="max-width:660px;border:0;text-decoration:none;-ms-interpolation-mode:bicubic;vertical-align:bottom;" class="ecxmcnImage"></td></tr><tr><td class="ecxmcnTextContent" valign="top" style="padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;color:#606060;font-family:Helvetica;font-size:15px;line-height:150%;text-align:left;" width="528"><span style="color:#5266ab;"><span style="font-family:arial,helvetica,sans-serif;font-size:14px;line-height:20px;text-align:justify;"><span style="font-size:16px;"><strong>NewsLetter WeAdvice</strong></span></span></span><span style="color:#515151;font-family:arial,helvetica,sans-serif;font-size:14px;line-height:20px;text-align:justify;">,<br><br><strong>Quarta-feira, </strong></span><span style="color:#5266ab;"><span style="font-family:arial,helvetica,sans-serif;font-size:14px;line-height:20px;text-align:justify;"><strong>5 de Novembro</strong></span></span><span style="color:#515151;font-family:arial,helvetica,sans-serif;font-size:14px;line-height:20px;text-align:justify;"><strong>&nbsp;2014</strong></span><br>&nbsp;<div style="text-align:justify;"><span style="color:#515151;font-family:arial,helvetica,sans-serif;font-size:14px;line-height:20px;text-align:justify;">Os parceiros da </span><a href="http://www.weadvice.pt" target="_blank" style="word-wrap:break-word;color:#6DC6DD;font-weight:normal;text-decoration:underline;"><span style="color:#5266ab;"><span style="font-family:arial,helvetica,sans-serif;font-size:14px;line-height:20px;text-align:justify;"><strong>WeAdvice</strong></span></span></a><span style="color:#515151;font-family:arial,helvetica,sans-serif;font-size:14px;line-height:20px;text-align:justify;"> chegam semanalmente a milhares de utilizadores da internet, empresas e particulares<br><br>A </span><a href="http://www.weadvice.pt" target="_blank" style="word-wrap:break-word;color:#6DC6DD;font-weight:normal;text-decoration:underline;"><span style="color:#5266ab;"><span style="font-family:arial,helvetica,sans-serif;font-size:14px;line-height:20px;text-align:justify;"><strong>WeAdvice</strong></span></span></a><span style="color:#515151;font-family:arial,helvetica,sans-serif;font-size:14px;line-height:20px;text-align:justify;"> é um conceito web único em Portugal e inovador pela sua transversalidade a todas as áreas de negócio, que visa divulgar e promover marcas, serviços e produtos<br><br>Potenciando o <strong>cross-selling</strong> e criando uma relação estreita entre o consumidor final e os parceiros, promove assim excelentes <strong>índices de satisfação e rentabilidade</strong>.<br><br><strong>Divulgue a sua empresa</strong> no nosso portal e potencie o seu negócio.</span></div><br><span style="color:#515151;font-family:arial,helvetica,sans-serif;font-size:14px;line-height:20px;text-align:justify;">Conheça os parceiros </span><a href="http://www.weadvice.pt" target="_blank" style="word-wrap:break-word;color:#6DC6DD;font-weight:normal;text-decoration:underline;"><span style="color:#5266ab;"><span style="font-family:arial,helvetica,sans-serif;font-size:14px;line-height:20px;text-align:justify;"><strong>WeAdvice</strong></span></span></a><span style="color:#515151;font-family:arial,helvetica,sans-serif;font-size:14px;line-height:20px;text-align:justify;"> em destaque esta semana:</span><br>&nbsp;</td></tr></tbody></table></td></tr></tbody></table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="ecxmcnImageCardBlock" style="border-collapse:collapse;"><tbody class="ecxmcnImageCardBlockOuter"><tr><td class="ecxmcnImageCardBlockInner" valign="top" style="padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;"><table align="left" border="0" cellpadding="0" cellspacing="0" class="ecxmcnImageCardBottomContent" width="100%" style="border:1px solid #999999;background-color:#EBEBEB;border-collapse:collapse;"><tbody><tr><td class="ecxmcnImageCardBottomImageContent" align="left" valign="top" style="padding-top:18px;padding-right:18px;padding-bottom:0;padding-left:18px;"><a href="http://www.weadvice.pt/parceiros/restaurante-akvavit-vilamoura/" title="" class="" target="_blank" style="word-wrap:break-word;"><img alt="" src="https://gallery.mailchimp.com/33e752775d2e6f468d956f66f/images/e389fbe4-c349-4e58-9d1c-76fd2c14f83e.jpg" width="528" style="max-width:660px;border:0;text-decoration:none;-ms-interpolation-mode:bicubic;vertical-align:bottom;" class="ecxmcnImage"></a></td></tr><tr><td class="ecxmcnTextContent" valign="top" style="padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;color:#606060;font-family:Helvetica;font-size:15px;line-height:150%;text-align:left;" width="528"><span style="color:#5266ab;"><strong><span style="font-size:14px;">4YourFamily</span></strong></span><br>&nbsp;<div style="text-align:justify;"><span style="color:#515151;font-family:arial,helvetica,sans-serif;font-size:12px;line-height:20px;text-align:justify;">A 4YourFamily é uma empresa que presta serviços de apoio à família ao domicílio. Estes serviços assentam nomeadamente ao nível de babysitting, nannies, explicações, organização de festas de aniversário para crianças, assistência a séniores, petsitting, serviços domésticos, entre outros.</span><br><br>&nbsp;</div>&nbsp;<div style="text-align:right;"><a href="http://www.weadvice.pt/parceiros/4yourfamily/" target="_blank" style="word-wrap:break-word;color:#6DC6DD;font-weight:normal;text-decoration:underline;"><span style="font-size:14px;"><span style="color:#515151;font-family:arial,helvetica,sans-serif;line-height:20px;text-align:justify;">Clique aqui para saber mais sobre o nosso parceiro</span></span></a></div></td></tr></tbody></table></td></tr></tbody></table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="ecxmcnImageCardBlock" style="border-collapse:collapse;"><tbody class="ecxmcnImageCardBlockOuter"><tr><td class="ecxmcnImageCardBlockInner" valign="top" style="padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;"><table align="right" border="0" cellpadding="0" cellspacing="0" class="ecxmcnImageCardBottomContent" width="100%" style="border:1px solid #999999;background-color:#EBEBEB;border-collapse:collapse;"><tbody><tr><td class="ecxmcnImageCardBottomImageContent" align="left" valign="top" style="padding-top:18px;padding-right:18px;padding-bottom:0;padding-left:18px;"><a href="http://www.weadvice.pt/parceiros/cubo-quinta-do-lago/" title="" class="" target="_blank" style="word-wrap:break-word;"><img alt="" src="https://gallery.mailchimp.com/33e752775d2e6f468d956f66f/images/74cd1667-58d7-47bf-8892-86da9d4e4bad.jpg" width="528" style="max-width:660px;border:0;text-decoration:none;-ms-interpolation-mode:bicubic;vertical-align:bottom;" class="ecxmcnImage"></a></td></tr><tr><td class="ecxmcnTextContent" valign="top" style="padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;color:#606060;font-family:Helvetica;font-size:15px;line-height:150%;text-align:left;" width="528"><div style="text-align:justify;"><span style="font-family:arial,helvetica,sans-serif;font-size:14px;line-height:20px;text-align:justify;"><font color="#5266ab"><strong>7 Tons</strong></font></span><br><br><span style="color:#515151;font-family:arial,helvetica,sans-serif;font-size:12px;line-height:20px;text-align:justify;">A Sete Tons está em Alverca desde 2009, sempre empenhada na proteção do meio ambiente através da reutilização de consumíveis informáticos, nomeadamente tinteiros e toners, fazendo com que o cliente poupe até 50% (comparando o preço com um consumível original) enquanto recicla.</span></div>&nbsp;<div style="text-align:right;"><a href="http://www.weadvice.pt/parceiros/7-tons/" target="_blank" style="word-wrap:break-word;color:#6DC6DD;font-weight:normal;text-decoration:underline;"><span style="font-size:14px;"><span style="color:#515151;font-family:arial,helvetica,sans-serif;line-height:20px;text-align:justify;">Clique aqui para saber mais sobre o nosso parceiro</span></span></a></div></td></tr></tbody></table></td></tr></tbody></table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="ecxmcnImageCardBlock" style="border-collapse:collapse;"><tbody class="ecxmcnImageCardBlockOuter"><tr><td class="ecxmcnImageCardBlockInner" valign="top" style="padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;"><table align="right" border="0" cellpadding="0" cellspacing="0" class="ecxmcnImageCardBottomContent" width="100%" style="border:1px solid #999999;background-color:#EBEBEB;border-collapse:collapse;"><tbody><tr><td class="ecxmcnImageCardBottomImageContent" align="left" valign="top" style="padding-top:18px;padding-right:18px;padding-bottom:0;padding-left:18px;"><a href="http://www.weadvice.pt/parceiros/restaurante-a-brasa-da-belavista/" title="" class="" target="_blank" style="word-wrap:break-word;"><img alt="" src="https://gallery.mailchimp.com/33e752775d2e6f468d956f66f/images/088d3b60-2577-4315-acb7-a453bfebd4d4.jpg" width="528" style="max-width:660px;border:0;text-decoration:none;-ms-interpolation-mode:bicubic;vertical-align:bottom;" class="ecxmcnImage"></a></td></tr><tr><td class="ecxmcnTextContent" valign="top" style="padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;color:#606060;font-family:Helvetica;font-size:15px;line-height:150%;text-align:left;" width="528"><div style="text-align:justify;"><span style="font-family:arial,helvetica,sans-serif;font-size:14px;line-height:20px;text-align:justify;"><font color="#5266ab"><strong>100% Bebé</strong></font></span><br><br><span style="color:#515151;font-family:arial,helvetica,sans-serif;font-size:12px;line-height:20px;text-align:justify;">Fundada em 2003, a Loja 100% Bebé está situada nos Jardins da Parede, uma zona nova entre São Pedro e a Parede no concelho de Cascais, mesmo em frente à praia da Bafureira.</span><br style="color:#515151;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:20px;text-align:justify;"><br style="color:#515151;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:20px;text-align:justify;"><span style="color:#515151;font-family:arial,helvetica,sans-serif;font-size:12px;line-height:20px;text-align:justify;">A 100% Bebé é uma loja com mobiliário de bebé, carrinhos de bebé, cadeiras auto, cadeiras de papa e puericultura diversa</span></div>&nbsp;<div style="text-align:right;"><a href="http://www.weadvice.pt/parceiros/100-bebe-mobiliario-e-quartos-para-bebe/" target="_blank" style="word-wrap:break-word;color:#6DC6DD;font-weight:normal;text-decoration:underline;"><span style="font-size:14px;"><span style="color:#515151;font-family:arial,helvetica,sans-serif;line-height:20px;text-align:justify;">Clique aqui para saber mais sobre o nosso parceiro</span></span></a></div></td></tr></tbody></table></td></tr></tbody></table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="ecxmcnImageCardBlock" style="border-collapse:collapse;"><tbody class="ecxmcnImageCardBlockOuter"><tr><td class="ecxmcnImageCardBlockInner" valign="top" style="padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;"><table align="right" border="0" cellpadding="0" cellspacing="0" class="ecxmcnImageCardBottomContent" width="100%" style="border:1px solid #999999;background-color:#EBEBEB;border-collapse:collapse;"><tbody><tr><td class="ecxmcnImageCardBottomImageContent" align="left" valign="top" style="padding-top:18px;padding-right:18px;padding-bottom:0;padding-left:18px;"><a href="http://www.weadvice.pt/parceiros/restaurante-marisqueira-a-cabrinha/" title="" class="" target="_blank" style="word-wrap:break-word;"><img alt="" src="https://gallery.mailchimp.com/33e752775d2e6f468d956f66f/images/1b5d9156-6137-40fb-926f-b4dcf4ffa546.jpg" width="528" style="max-width:660px;border:0;text-decoration:none;-ms-interpolation-mode:bicubic;vertical-align:bottom;" class="ecxmcnImage"></a></td></tr><tr><td class="ecxmcnTextContent" valign="top" style="padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;color:#606060;font-family:Helvetica;font-size:15px;line-height:150%;text-align:left;" width="528"><span style="color:#5266ab;"><span style="font-size:14px;"><span style="font-family:arial,helvetica,sans-serif;line-height:20px;text-align:justify;"><strong>Adega Bar 1987</strong></span></span></span><br>&nbsp;<div style="text-align:justify;"><span style="color:#515151;font-family:arial,helvetica,sans-serif;font-size:12px;line-height:20px;text-align:justify;">Durante anos a Adega serviu petiscos (Chouriço assado, Sangria, Caldo verde, Presunto com Broa de milho, Moelinhas…). As noites nem sempre eram iguais, ora era Fados, ora era Flamenco, ora era Salsa e o que á última da hora era proposto.</span><br style="color:#515151;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:20px;text-align:justify;"><span style="color:#515151;font-family:arial,helvetica,sans-serif;font-size:12px;line-height:20px;text-align:justify;">Sendo assim as noites tornavam-se temáticas, completando com o prato tradicional do país correspondente ao espetáculo.</span></div>&nbsp;<div style="text-align:right;"><a href="http://www.weadvice.pt/parceiros/adega-bar-1987/" target="_blank" style="word-wrap:break-word;color:#6DC6DD;font-weight:normal;text-decoration:underline;"><span style="font-size:14px;"><span style="color:#515151;font-family:arial,helvetica,sans-serif;line-height:20px;text-align:justify;">Clique aqui para saber mais sobre o nosso parceiro</span></span></a></div></td></tr></tbody></table></td></tr></tbody></table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="ecxmcnImageCardBlock" style="border-collapse:collapse;"><tbody class="ecxmcnImageCardBlockOuter"><tr><td class="ecxmcnImageCardBlockInner" valign="top" style="padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;"><table align="left" border="0" cellpadding="0" cellspacing="0" class="ecxmcnImageCardBottomContent" width="100%" style="border:1px solid #999999;background-color:#EBEBEB;border-collapse:collapse;"><tbody><tr><td class="ecxmcnImageCardBottomImageContent" align="left" valign="top" style="padding-top:18px;padding-right:18px;padding-bottom:0;padding-left:18px;"><a href="http://www.weadvice.pt/parceiros/lavandarias-anasec/" title="" class="" target="_blank" style="word-wrap:break-word;"><img alt="" src="https://gallery.mailchimp.com/33e752775d2e6f468d956f66f/images/bd2ec0dd-86a0-4203-ad3e-3aae301a6d9d.jpg" width="528" style="max-width:660px;border:0;text-decoration:none;-ms-interpolation-mode:bicubic;vertical-align:bottom;" class="ecxmcnImage"></a></td></tr><tr><td class="ecxmcnTextContent" valign="top" style="padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;color:#606060;font-family:Helvetica;font-size:15px;line-height:150%;text-align:left;" width="528"><div style="text-align:justify;"><span style="font-family:arial,helvetica,sans-serif;font-size:14px;line-height:20px;text-align:justify;"><font color="#5266ab"><strong>André, A Mercearia Familiar</strong></font></span><br><br><span style="color:#515151;font-family:arial,helvetica,sans-serif;font-size:12px;line-height:20px;text-align:justify;">Desde 1942 que a Mercearia “André”, situada em Santo Amaro de Oeiras, é uma referência pela qualidade e bom serviço entre as famílias e as gerações que por ali passaram.</span><br style="color:#515151;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:20px;text-align:justify;"><br style="color:#515151;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:20px;text-align:justify;"><span style="color:#515151;font-family:arial,helvetica,sans-serif;font-size:12px;line-height:20px;text-align:justify;">Em 12 de Junho de 2014 o “André” reabriu com nova gerência e com o espaço totalmente renovado e modernizado.</span></div>&nbsp;<div style="text-align:right;"><a href="http://www.weadvice.pt/parceiros/andre-mercearia-familiar/" target="_blank" style="word-wrap:break-word;color:#6DC6DD;font-weight:normal;text-decoration:underline;"><span style="font-size:14px;"><span style="color:#515151;font-family:arial,helvetica,sans-serif;line-height:20px;text-align:justify;">Clique aqui para saber mais sobre o nosso parceiro</span></span></a></div></td></tr></tbody></table></td></tr></tbody></table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="ecxmcnImageCardBlock" style="border-collapse:collapse;"><tbody class="ecxmcnImageCardBlockOuter"><tr><td class="ecxmcnImageCardBlockInner" valign="top" style="padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;"><table align="right" border="0" cellpadding="0" cellspacing="0" class="ecxmcnImageCardBottomContent" width="100%" style="border:1px solid #999999;background-color:#EBEBEB;border-collapse:collapse;"><tbody><tr><td class="ecxmcnImageCardBottomImageContent" align="left" valign="top" style="padding-top:18px;padding-right:18px;padding-bottom:0;padding-left:18px;"><a href="http://www.weadvice.pt/parceiros/lavandarias-anasec/" title="" class="" target="_blank" style="word-wrap:break-word;"><img alt="" src="https://gallery.mailchimp.com/33e752775d2e6f468d956f66f/images/4400836f-df0d-4097-b820-7456bf293693.jpg" width="528" style="max-width:660px;border:0;text-decoration:none;-ms-interpolation-mode:bicubic;vertical-align:bottom;" class="ecxmcnImage"></a></td></tr><tr><td class="ecxmcnTextContent" valign="top" style="padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;color:#606060;font-family:Helvetica;font-size:15px;line-height:150%;text-align:left;" width="528"><div style="text-align:justify;"><span style="font-family:arial,helvetica,sans-serif;font-size:14px;line-height:20px;text-align:justify;"><font color="#5266ab"><strong>Casa do Chaparral</strong></font></span><br><br><span style="color:#515151;font-family:arial,helvetica,sans-serif;font-size:12px;line-height:20px;text-align:justify;">Casa, em Vila Viçosa, construída de raiz, em propriedade privada de 45 ha, toda vedada com muro de xisto</span><br style="color:#515151;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:20px;text-align:justify;"><br style="color:#515151;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:20px;text-align:justify;"><span style="color:#515151;font-family:arial,helvetica,sans-serif;font-size:12px;line-height:20px;text-align:justify;">Sendo uma casa totalmente equipada, oferece todo o conforto.</span><br style="color:#515151;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:20px;text-align:justify;"><br style="color:#515151;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:20px;text-align:justify;"><span style="color:#515151;font-family:arial,helvetica,sans-serif;font-size:12px;line-height:20px;text-align:justify;">No exterior, poderá disfrutar de uma vista excelente, barbecue, e uma piscina inserida numa área de relva de cerca de 1200 metros quadrados.</span></div>&nbsp;<div style="text-align:right;"><a href="http://www.weadvice.pt/parceiros/casa-do-chaparral/" target="_blank" style="word-wrap:break-word;color:#6DC6DD;font-weight:normal;text-decoration:underline;"><span style="font-size:14px;"><span style="color:#515151;font-family:arial,helvetica,sans-serif;line-height:20px;text-align:justify;">Clique aqui para saber mais sobre o nosso parceiro</span></span></a></div></td></tr></tbody></table></td></tr></tbody></table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="ecxmcnImageCardBlock" style="border-collapse:collapse;"><tbody class="ecxmcnImageCardBlockOuter"><tr><td class="ecxmcnImageCardBlockInner" valign="top" style="padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;"><table align="right" border="0" cellpadding="0" cellspacing="0" class="ecxmcnImageCardBottomContent" width="100%" style="border:1px solid #999999;background-color:#EBEBEB;border-collapse:collapse;"><tbody><tr><td class="ecxmcnImageCardBottomImageContent" align="left" valign="top" style="padding-top:18px;padding-right:18px;padding-bottom:0;padding-left:18px;"><a href="http://www.weadvice.pt/parceiros/lavandarias-anasec/" title="" class="" target="_blank" style="word-wrap:break-word;"><img alt="" src="https://gallery.mailchimp.com/33e752775d2e6f468d956f66f/images/542babba-476e-4557-8b71-40e09c32e0a4.jpg" width="528" style="max-width:660px;border:0;text-decoration:none;-ms-interpolation-mode:bicubic;vertical-align:bottom;" class="ecxmcnImage"></a></td></tr><tr><td class="ecxmcnTextContent" valign="top" style="padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;color:#606060;font-family:Helvetica;font-size:15px;line-height:150%;text-align:left;" width="528"><div style="text-align:justify;"><span style="font-family:arial,helvetica,sans-serif;font-size:14px;line-height:20px;text-align:justify;"><font color="#5266ab"><strong>Centro de Estudos Pé Direito</strong></font></span><br><br><span style="color:#515151;font-family:arial,helvetica,sans-serif;font-size:12px;line-height:20px;text-align:justify;">O Pé Direito é uma empresa familiar que reúne como objectivos o sucesso escolar dos alunos que nos procuram, a saudável convivência num espaço aberto à natureza, onde há lugar para aprender e descontrair nas doses certas. Promovemos com dedicação e empenho um aprender com optimismo e obtemos a nossa gratificação nos bons resultados dos nossos alunos.</span><br style="color:#515151;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:20px;text-align:justify;">&nbsp;</div>&nbsp;<div style="text-align:right;"><a href="http://www.weadvice.pt/parceiros/centro-de-estudos-pe-direito/" target="_blank" style="word-wrap:break-word;color:#6DC6DD;font-weight:normal;text-decoration:underline;"><span style="font-size:14px;"><span style="color:#515151;font-family:arial,helvetica,sans-serif;line-height:20px;text-align:justify;">Clique aqui para saber mais sobre o nosso parceiro</span></span></a></div></td></tr></tbody></table></td></tr></tbody></table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="ecxmcnImageCardBlock" style="border-collapse:collapse;"><tbody class="ecxmcnImageCardBlockOuter"><tr><td class="ecxmcnImageCardBlockInner" valign="top" style="padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;"><table align="left" border="0" cellpadding="0" cellspacing="0" class="ecxmcnImageCardBottomContent" width="100%" style="border:1px solid #999999;background-color:#EBEBEB;border-collapse:collapse;"><tbody><tr><td class="ecxmcnImageCardBottomImageContent" align="left" valign="top" style="padding-top:18px;padding-right:18px;padding-bottom:0;padding-left:18px;"><a href="http://www.weadvice.pt/parceiros/lavandarias-anasec/" title="" class="" target="_blank" style="word-wrap:break-word;"><img alt="" src="https://gallery.mailchimp.com/33e752775d2e6f468d956f66f/images/3e7d68df-3644-44d1-bd7f-67e74763d569.jpg" width="528" style="max-width:660px;border:0;text-decoration:none;-ms-interpolation-mode:bicubic;vertical-align:bottom;" class="ecxmcnImage"></a></td></tr><tr><td class="ecxmcnTextContent" valign="top" style="padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;color:#606060;font-family:Helvetica;font-size:15px;line-height:150%;text-align:left;" width="528"><div style="text-align:justify;"><span style="font-family:arial,helvetica,sans-serif;font-size:14px;line-height:20px;text-align:justify;"><font color="#5266ab"><strong>DRC- Data Recover Center</strong></font></span><br><br><span style="color:#515151;font-family:arial,helvetica,sans-serif;font-size:12px;line-height:20px;text-align:justify;">A Data Recover Center é uma empresa especializada em Segurança da Informação e está no mercado desde 1989. Presta serviços de Recuperação de Dados digitais, Informática Forense, Destruição de Suportes com Segurança, Recolha de Backups, e Segurança de Informação (Auditoria de Segurança, Sensibilização e Formação, Gestão de Risco, Continuidade do Negócio), estando em constante especialização e atualização nestas áreas.</span></div>&nbsp;<div style="text-align:right;"><a href="http://www.weadvice.pt/parceiros/drc-data-recover-center/" target="_blank" style="word-wrap:break-word;color:#6DC6DD;font-weight:normal;text-decoration:underline;"><span style="font-size:14px;"><span style="color:#515151;font-family:arial,helvetica,sans-serif;line-height:20px;text-align:justify;">Clique aqui para saber mais sobre o nosso parceiro</span></span></a></div></td></tr></tbody></table></td></tr></tbody></table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="ecxmcnImageCardBlock" style="border-collapse:collapse;"><tbody class="ecxmcnImageCardBlockOuter"><tr><td class="ecxmcnImageCardBlockInner" valign="top" style="padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;"><table align="right" border="0" cellpadding="0" cellspacing="0" class="ecxmcnImageCardBottomContent" width="100%" style="border:1px solid #999999;background-color:#EBEBEB;border-collapse:collapse;"><tbody><tr><td class="ecxmcnImageCardBottomImageContent" align="left" valign="top" style="padding-top:18px;padding-right:18px;padding-bottom:0;padding-left:18px;"><a href="http://www.weadvice.pt/parceiros/lavandarias-anasec/" title="" class="" target="_blank" style="word-wrap:break-word;"><img alt="" src="https://gallery.mailchimp.com/33e752775d2e6f468d956f66f/images/5bbe961b-6cbb-4c36-b993-8c25d5f21939.jpg" width="528" style="max-width:660px;border:0;text-decoration:none;-ms-interpolation-mode:bicubic;vertical-align:bottom;" class="ecxmcnImage"></a></td></tr><tr><td class="ecxmcnTextContent" valign="top" style="padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;color:#606060;font-family:Helvetica;font-size:15px;line-height:150%;text-align:left;" width="528"><div style="text-align:justify;"><span style="font-family:arial,helvetica,sans-serif;font-size:14px;line-height:20px;text-align:justify;"><font color="#5266ab"><strong>Laser Adventures, Lda</strong></font></span><br><br><span style="color:#515151;font-family:arial,helvetica,sans-serif;font-size:12px;line-height:20px;text-align:justify;">A Laser Adventures é um novo conceito de aventura que se dedica a modalidades de outdoor.</span><br style="color:#515151;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:20px;text-align:justify;"><br style="color:#515151;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:20px;text-align:justify;"><span style="color:#515151;font-family:arial,helvetica,sans-serif;font-size:12px;line-height:20px;text-align:justify;">Uma empresa inovadora na área do entretenimento e atividades em grupo para qualquer faixa etária, vocacionados para a organização de eventos com equipamentos</span><strong style="background:transparent;border:0px;color:#515151;font-family:arial,helvetica,sans-serif;font-size:12px;line-height:20px;padding:0px;text-align:justify;">&nbsp;Laser Tag&nbsp;</strong><span style="color:#515151;font-family:arial,helvetica,sans-serif;font-size:12px;line-height:20px;text-align:justify;">(e outros) Indoor e Outdoor, e&nbsp;campos ou em espaços privados.&nbsp;</span><strong style="background:transparent;border:0px;color:#515151;font-family:arial,helvetica,sans-serif;font-size:12px;line-height:20px;padding:0px;text-align:justify;">Somos também Distribuidores exclusivos para a Península Ibérica da INTAGER (Equipamentos de Laser Tag)</strong><span style="color:#515151;font-family:arial,helvetica,sans-serif;font-size:12px;line-height:20px;text-align:justify;">.</span><br style="color:#515151;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:20px;text-align:justify;">&nbsp;</div>&nbsp;<div style="text-align:right;"><a href="http://www.weadvice.pt/parceiros/laser-adventures/" target="_blank" style="word-wrap:break-word;color:#6DC6DD;font-weight:normal;text-decoration:underline;"><span style="font-size:14px;"><span style="color:#515151;font-family:arial,helvetica,sans-serif;line-height:20px;text-align:justify;">Clique aqui para saber mais sobre o nosso parceiro</span></span></a></div></td></tr></tbody></table></td></tr></tbody></table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="ecxmcnImageCardBlock" style="border-collapse:collapse;"><tbody class="ecxmcnImageCardBlockOuter"><tr><td class="ecxmcnImageCardBlockInner" valign="top" style="padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;"><table align="right" border="0" cellpadding="0" cellspacing="0" class="ecxmcnImageCardBottomContent" width="100%" style="border:1px solid #999999;background-color:#EBEBEB;border-collapse:collapse;"><tbody><tr><td class="ecxmcnImageCardBottomImageContent" align="left" valign="top" style="padding-top:18px;padding-right:18px;padding-bottom:0;padding-left:18px;"><a href="http://www.weadvice.pt/parceiros/lavandarias-anasec/" title="" class="" target="_blank" style="word-wrap:break-word;"><img alt="" src="https://gallery.mailchimp.com/33e752775d2e6f468d956f66f/images/6bb3aa60-acc8-47d8-8133-e8af3e132725.jpg" width="528" style="max-width:660px;border:0;text-decoration:none;-ms-interpolation-mode:bicubic;vertical-align:bottom;" class="ecxmcnImage"></a></td></tr><tr><td class="ecxmcnTextContent" valign="top" style="padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;color:#606060;font-family:Helvetica;font-size:15px;line-height:150%;text-align:left;" width="528"><div style="text-align:justify;"><font color="#5266ab" face="arial, helvetica, sans-serif"><span style="font-size:14px;line-height:20px;"><strong>Monsanto Caffé</strong></span></font><br><br><span style="color:#515151;font-family:arial,helvetica,sans-serif;font-size:12px;line-height:20px;text-align:justify;">O Monsanto Caffé é um pequeno espaço num local privilegiado, onde natureza, vida académica e desporto se cruzam para beber um café ou partilhar uma refeição.</span><br style="color:#515151;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:20px;text-align:justify;"><br style="color:#515151;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:20px;text-align:justify;"><span style="color:#515151;font-family:arial,helvetica,sans-serif;font-size:12px;line-height:20px;text-align:justify;">Situado no edifício CEDAR, no coração de Monsanto e junto às faculdades, este pequeno café tem como principais atrativos os seus simpáticos preços, assim como a qualidade dos seus produtos e do seu atendimento, para além de uma esplanada em que o som é dominado pela natureza.&nbsp;</span><br style="color:#515151;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:20px;text-align:justify;">&nbsp;</div>&nbsp;<div style="text-align:right;"><a href="http://www.weadvice.pt/parceiros/monsanto-caffe/" target="_blank" style="word-wrap:break-word;color:#6DC6DD;font-weight:normal;text-decoration:underline;"><span style="font-size:14px;"><span style="color:#515151;font-family:arial,helvetica,sans-serif;line-height:20px;text-align:justify;">Clique aqui para saber mais sobre o nosso parceiro</span></span></a></div></td></tr></tbody></table></td></tr></tbody></table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="ecxmcnImageCardBlock" style="border-collapse:collapse;"><tbody class="ecxmcnImageCardBlockOuter"><tr><td class="ecxmcnImageCardBlockInner" valign="top" style="padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;"><table align="right" border="0" cellpadding="0" cellspacing="0" class="ecxmcnImageCardBottomContent" width="100%" style="border:1px solid #999999;background-color:#EBEBEB;border-collapse:collapse;"><tbody><tr><td class="ecxmcnImageCardBottomImageContent" align="left" valign="top" style="padding-top:18px;padding-right:18px;padding-bottom:0;padding-left:18px;"><a href="http://www.weadvice.pt/parceiros/lavandarias-anasec/" title="" class="" target="_blank" style="word-wrap:break-word;"><img alt="" src="https://gallery.mailchimp.com/33e752775d2e6f468d956f66f/images/39468d1f-81a6-4985-8ac9-e49c677f1ff5.jpg" width="528" style="max-width:660px;border:0;text-decoration:none;-ms-interpolation-mode:bicubic;vertical-align:bottom;" class="ecxmcnImage"></a></td></tr><tr><td class="ecxmcnTextContent" valign="top" style="padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;color:#606060;font-family:Helvetica;font-size:15px;line-height:150%;text-align:left;" width="528"><div style="text-align:justify;"><font color="#5266ab" face="arial, helvetica, sans-serif"><span style="font-size:14px;line-height:20px;"><strong>Nilza Costa Salão &amp; Cosmética</strong></span></font><br><br><span style="color:#515151;font-family:arial,helvetica,sans-serif;font-size:12px;line-height:20px;text-align:justify;">Descubra no Salão &amp; Cosmética Nilza Costa um conceito exclusivo para o tratamento e acompanhamento dos seus cabelos.</span><br style="color:#515151;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:20px;text-align:justify;"><br style="color:#515151;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:20px;text-align:justify;"><span style="color:#515151;font-family:arial,helvetica,sans-serif;font-size:12px;line-height:20px;text-align:justify;">O nosso conceito foi pensado de forma a proporcionar ao cliente uma experiência original e enriquecedora, onde combinamos beleza, arte, e bem-estar.</span><br style="color:#515151;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:20px;text-align:justify;"><br style="color:#515151;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:20px;text-align:justify;">&nbsp;</div>&nbsp;<div style="text-align:right;"><a href="http://www.weadvice.pt/parceiros/salao-nilza-costa/" target="_blank" style="word-wrap:break-word;color:#6DC6DD;font-weight:normal;text-decoration:underline;"><span style="font-size:14px;"><span style="color:#515151;font-family:arial,helvetica,sans-serif;line-height:20px;text-align:justify;">Clique aqui para saber mais sobre o nosso parceiro</span></span></a></div></td></tr></tbody></table></td></tr></tbody></table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="ecxmcnImageCardBlock" style="border-collapse:collapse;"><tbody class="ecxmcnImageCardBlockOuter"><tr><td class="ecxmcnImageCardBlockInner" valign="top" style="padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;"><table align="right" border="0" cellpadding="0" cellspacing="0" class="ecxmcnImageCardBottomContent" width="100%" style="border:1px solid #999999;background-color:#EBEBEB;border-collapse:collapse;"><tbody><tr><td class="ecxmcnImageCardBottomImageContent" align="left" valign="top" style="padding-top:18px;padding-right:18px;padding-bottom:0;padding-left:18px;"><a href="http://www.weadvice.pt/parceiros/lavandarias-anasec/" title="" class="" target="_blank" style="word-wrap:break-word;"><img alt="" src="https://gallery.mailchimp.com/33e752775d2e6f468d956f66f/images/c5464751-921c-41a3-927b-2043d5c7b3c8.jpg" width="528" style="max-width:660px;border:0;text-decoration:none;-ms-interpolation-mode:bicubic;vertical-align:bottom;" class="ecxmcnImage"></a></td></tr><tr><td class="ecxmcnTextContent" valign="top" style="padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;color:#606060;font-family:Helvetica;font-size:15px;line-height:150%;text-align:left;" width="528"><div style="text-align:justify;"><font color="#5266ab" face="arial, helvetica, sans-serif"><span style="font-size:14px;line-height:20px;"><strong>Ofício</strong></span></font><br><br><span style="color:#515151;font-family:arial,helvetica,sans-serif;font-size:12px;line-height:20px;text-align:justify;">Constituída em 1996 a Ofício é uma agência de publicidade especializada em serviços de comunicação. Gostamos do que fazemos. Este é o segredo do nosso sucesso e o motivo porque continuamos a considerar a nossa Ofício, um ofício apaixonante. Assumimos desde o seu início um posicionamento de consultadoria e uma permanente atenção a fenómenos de consequências determinantes, tais como:</span><br style="color:#515151;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:20px;text-align:justify;"><br style="color:#515151;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:20px;text-align:justify;"><span style="color:#515151;font-family:arial,helvetica,sans-serif;font-size:12px;line-height:20px;text-align:justify;">• Alterações constantes no comportamento do consumidor</span><br style="color:#515151;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:20px;text-align:justify;"><span style="color:#515151;font-family:arial,helvetica,sans-serif;font-size:12px;line-height:20px;text-align:justify;">• A importância da segmentação de mercado</span><br style="color:#515151;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:20px;text-align:justify;"><span style="color:#515151;font-family:arial,helvetica,sans-serif;font-size:12px;line-height:20px;text-align:justify;">• Desenvolvimento de novas tecnologias</span><br style="color:#515151;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:20px;text-align:justify;"><span style="color:#515151;font-family:arial,helvetica,sans-serif;font-size:12px;line-height:20px;text-align:justify;">• Os canais alternativos de comunicação</span><br style="color:#515151;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:20px;text-align:justify;"><br style="color:#515151;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:20px;text-align:justify;">&nbsp;</div>&nbsp;<div style="text-align:right;"><a href="http://www.weadvice.pt/parceiros/oficio/" target="_blank" style="word-wrap:break-word;color:#6DC6DD;font-weight:normal;text-decoration:underline;"><span style="font-size:14px;"><span style="color:#515151;font-family:arial,helvetica,sans-serif;line-height:20px;text-align:justify;">Clique aqui para saber mais sobre o nosso parceiro</span></span></a></div></td></tr></tbody></table></td></tr></tbody></table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="ecxmcnImageCardBlock" style="border-collapse:collapse;"><tbody class="ecxmcnImageCardBlockOuter"><tr><td class="ecxmcnImageCardBlockInner" valign="top" style="padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;"><table align="left" border="0" cellpadding="0" cellspacing="0" class="ecxmcnImageCardBottomContent" width="100%" style="border:1px solid #999999;background-color:#EBEBEB;border-collapse:collapse;"><tbody><tr><td class="ecxmcnImageCardBottomImageContent" align="left" valign="top" style="padding-top:18px;padding-right:18px;padding-bottom:0;padding-left:18px;"><a href="http://www.weadvice.pt/parceiros/lavandarias-anasec/" title="" class="" target="_blank" style="word-wrap:break-word;"><img alt="" src="https://gallery.mailchimp.com/33e752775d2e6f468d956f66f/images/675cf707-aba1-4318-a910-8fc29e08e720.jpg" width="528" style="max-width:660px;border:0;text-decoration:none;-ms-interpolation-mode:bicubic;vertical-align:bottom;" class="ecxmcnImage"></a></td></tr><tr><td class="ecxmcnTextContent" valign="top" style="padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;color:#606060;font-family:Helvetica;font-size:15px;line-height:150%;text-align:left;" width="528"><div style="text-align:justify;"><font color="#5266ab" face="arial, helvetica, sans-serif"><span style="font-size:14px;line-height:20px;"><strong>PCOLAB - Centro de Assistência Técnica</strong></span></font><br><br><span style="color:#515151;font-family:arial,helvetica,sans-serif;font-size:12px;line-height:20px;text-align:justify;">A PCILAB é um espaço vocacionado à assistência técnica especializada em computadores, reparamos todo o tipo de avarias, seja em portáteis, PCs fixos ou outros equipamentos multimédia, sempre com produtos de alta qualidade, sempre com aconselhamento e transparência para o cliente.</span><br style="color:#515151;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:20px;text-align:justify;"><br style="color:#515151;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:20px;text-align:justify;">&nbsp;</div>&nbsp;<div style="text-align:right;"><a href="http://www.weadvice.pt/parceiros/pcilab/" target="_blank" style="word-wrap:break-word;color:#6DC6DD;font-weight:normal;text-decoration:underline;"><span style="font-size:14px;"><span style="color:#515151;font-family:arial,helvetica,sans-serif;line-height:20px;text-align:justify;">Clique aqui para saber mais sobre o nosso parceiro</span></span></a></div></td></tr></tbody></table></td></tr></tbody></table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="ecxmcnImageCardBlock" style="border-collapse:collapse;"><tbody class="ecxmcnImageCardBlockOuter"><tr><td class="ecxmcnImageCardBlockInner" valign="top" style="padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;"><table align="right" border="0" cellpadding="0" cellspacing="0" class="ecxmcnImageCardBottomContent" width="100%" style="border:1px solid #999999;background-color:#EBEBEB;border-collapse:collapse;"><tbody><tr><td class="ecxmcnImageCardBottomImageContent" align="left" valign="top" style="padding-top:18px;padding-right:18px;padding-bottom:0;padding-left:18px;"><a href="http://www.weadvice.pt/parceiros/lavandarias-anasec/" title="" class="" target="_blank" style="word-wrap:break-word;"><img alt="" src="https://gallery.mailchimp.com/33e752775d2e6f468d956f66f/images/2844f34b-34ec-4ac2-be4d-5343c1b8c5ab.jpg" width="528" style="max-width:660px;border:0;text-decoration:none;-ms-interpolation-mode:bicubic;vertical-align:bottom;" class="ecxmcnImage"></a></td></tr><tr><td class="ecxmcnTextContent" valign="top" style="padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;color:#606060;font-family:Helvetica;font-size:15px;line-height:150%;text-align:left;" width="528"><div style="text-align:justify;"><font color="#5266ab" face="arial, helvetica, sans-serif"><span style="font-size:14px;line-height:20px;"><strong>Restaurante Italiano Al Fresco</strong></span></font><br><br><span style="color:#515151;font-family:arial,helvetica,sans-serif;font-size:12px;line-height:20px;text-align:justify;">Adjacente ao imponente Casino Estoril, o restaurante Al Fresco proporciona um espaço com uma decoração requintada, de vários estilos, onde é possível apreciar a cozinha italiana no seu melhor.</span><br style="color:#515151;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:20px;text-align:justify;"><br style="color:#515151;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:20px;text-align:justify;"><span style="color:#515151;font-family:arial,helvetica,sans-serif;font-size:12px;line-height:20px;text-align:justify;">A cozinha abrange a maior parte das regiões de Itália, onde a comida é um modo de vida, o que acrescenta variedade e história ao menu deste espaço.</span><br style="color:#515151;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:20px;text-align:justify;"><br style="color:#515151;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:20px;text-align:justify;"><span style="color:#515151;font-family:arial,helvetica,sans-serif;font-size:12px;line-height:20px;text-align:justify;">Com uma das melhores pizzas e carpaccio da região, conta com uma ampla esplanada com vista sobre os jardins envolventes, proporcionando um ambiente simpático e acolhedor.</span><br style="color:#515151;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:20px;text-align:justify;"><br style="color:#515151;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:20px;text-align:justify;">&nbsp;</div>&nbsp;<div style="text-align:right;"><a href="http://www.weadvice.pt/parceiros/restaurante-italiano-al-fresco/" target="_blank" style="word-wrap:break-word;color:#6DC6DD;font-weight:normal;text-decoration:underline;"><span style="font-size:14px;"><span style="color:#515151;font-family:arial,helvetica,sans-serif;line-height:20px;text-align:justify;">Clique aqui para saber mais sobre o nosso parceiro</span></span></a></div></td></tr></tbody></table></td></tr></tbody></table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="ecxmcnImageCardBlock" style="border-collapse:collapse;"><tbody class="ecxmcnImageCardBlockOuter"><tr><td class="ecxmcnImageCardBlockInner" valign="top" style="padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;"><table align="left" border="0" cellpadding="0" cellspacing="0" class="ecxmcnImageCardBottomContent" width="100%" style="border:1px solid #999999;background-color:#EBEBEB;border-collapse:collapse;"><tbody><tr><td class="ecxmcnImageCardBottomImageContent" align="left" valign="top" style="padding-top:18px;padding-right:18px;padding-bottom:0;padding-left:18px;"><a href="http://www.weadvice.pt/parceiros/lavandarias-anasec/" title="" class="" target="_blank" style="word-wrap:break-word;"><img alt="" src="https://gallery.mailchimp.com/33e752775d2e6f468d956f66f/images/d11d5d5a-0ec8-472a-8037-6d21e22319f8.jpg" width="528" style="max-width:660px;border:0;text-decoration:none;-ms-interpolation-mode:bicubic;vertical-align:bottom;" class="ecxmcnImage"></a></td></tr><tr><td class="ecxmcnTextContent" valign="top" style="padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;color:#606060;font-family:Helvetica;font-size:15px;line-height:150%;text-align:left;" width="528"><div style="text-align:justify;"><font color="#5266ab" face="arial, helvetica, sans-serif"><span style="font-size:14px;line-height:20px;"><strong>RFS Telecomunicações</strong></span></font><br><br><span style="color:#515151;font-family:arial,helvetica,sans-serif;font-size:12px;line-height:20px;text-align:justify;">RFS Telecomunicações iniciou a sua actividade em Junho de 1993.</span><br style="color:#515151;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:20px;text-align:justify;"><br style="color:#515151;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:20px;text-align:justify;"><span style="color:#515151;font-family:arial,helvetica,sans-serif;font-size:12px;line-height:20px;text-align:justify;">O objecto social da empresa engloba as áreas comercial e serviços em Gestão Documental, Telecomunicações e Informática.</span><br style="color:#515151;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:20px;text-align:justify;"><br style="color:#515151;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:20px;text-align:justify;"><span style="color:#515151;font-family:arial,helvetica,sans-serif;font-size:12px;line-height:20px;text-align:justify;">O fornecimento de equipamentos e serviços na área de telecomunicações é ainda hoje uma das principais actividades da empresa e teve um papel decisivo na primeira fase da RFS. Gradualmente a actividade da RFS foi incrementada nas áreas de informática e gestão documental, com especial relevo no Microfilme, Digitalização, Bases de Dados, Software específico, etc..</span><br style="color:#515151;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:20px;text-align:justify;">&nbsp;</div>&nbsp;<div style="text-align:right;"><a href="http://www.weadvice.pt/parceiros/rfs-telecomunicacoes/" target="_blank" style="word-wrap:break-word;color:#6DC6DD;font-weight:normal;text-decoration:underline;"><span style="font-size:14px;"><span style="color:#515151;font-family:arial,helvetica,sans-serif;line-height:20px;text-align:justify;">Clique aqui para saber mais sobre o nosso parceiro</span></span></a></div></td></tr></tbody></table></td></tr></tbody></table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="ecxmcnImageCardBlock" style="border-collapse:collapse;"><tbody class="ecxmcnImageCardBlockOuter"><tr><td class="ecxmcnImageCardBlockInner" valign="top" style="padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;"><table align="left" border="0" cellpadding="0" cellspacing="0" class="ecxmcnImageCardBottomContent" width="100%" style="border:1px solid #999999;background-color:#EBEBEB;border-collapse:collapse;"><tbody><tr><td class="ecxmcnImageCardBottomImageContent" align="left" valign="top" style="padding-top:18px;padding-right:18px;padding-bottom:0;padding-left:18px;"><a href="http://www.weadvice.pt/parceiros/lavandarias-anasec/" title="" class="" target="_blank" style="word-wrap:break-word;"><img alt="" src="https://gallery.mailchimp.com/33e752775d2e6f468d956f66f/images/a7803a7c-59d6-4701-9f4d-146cd1a42024.jpg" width="528" style="max-width:660px;border:0;text-decoration:none;-ms-interpolation-mode:bicubic;vertical-align:bottom;" class="ecxmcnImage"></a></td></tr><tr><td class="ecxmcnTextContent" valign="top" style="padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;color:#606060;font-family:Helvetica;font-size:15px;line-height:150%;text-align:left;" width="528"><div style="text-align:justify;"><font color="#5266ab" face="arial, helvetica, sans-serif"><span style="font-size:14px;line-height:20px;"><strong>Rita Sanctorum Atelier</strong></span></font><br><br><span style="color:#515151;font-family:arial,helvetica,sans-serif;font-size:12px;line-height:20px;text-align:justify;">Inaugurado em 2014, o Atelier Rita Sanctorum ocupa já uma presença marcante no comércio da Ericeira.</span><br style="color:#515151;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:20px;text-align:justify;"><br style="color:#515151;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:20px;text-align:justify;"><span style="color:#515151;font-family:arial,helvetica,sans-serif;font-size:12px;line-height:20px;text-align:justify;">Além das suas próprias criações, com colecções exclusivas e limitadas, a designer e modelista é também representante de marcas de renome tais como Sucre Et Sel, Scabal, Agnona, Cunha Rodrigues e Rinascimento, adaptando os fatos e vestidos à medida de cada cliente.</span><br style="color:#515151;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:20px;text-align:justify;">&nbsp;</div>&nbsp;<div style="text-align:right;"><a href="http://www.weadvice.pt/parceiros/rita-sanctorum-atelier/" target="_blank" style="word-wrap:break-word;color:#6DC6DD;font-weight:normal;text-decoration:underline;"><span style="font-size:14px;"><span style="color:#515151;font-family:arial,helvetica,sans-serif;line-height:20px;text-align:justify;">Clique aqui para saber mais sobre o nosso parceiro</span></span></a></div></td></tr></tbody></table></td></tr></tbody></table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="ecxmcnImageCardBlock" style="border-collapse:collapse;"><tbody class="ecxmcnImageCardBlockOuter"><tr><td class="ecxmcnImageCardBlockInner" valign="top" style="padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;"><table align="right" border="0" cellpadding="0" cellspacing="0" class="ecxmcnImageCardBottomContent" width="100%" style="border:1px solid #999999;background-color:#EBEBEB;border-collapse:collapse;"><tbody><tr><td class="ecxmcnImageCardBottomImageContent" align="left" valign="top" style="padding-top:18px;padding-right:18px;padding-bottom:0;padding-left:18px;"><a href="http://www.weadvice.pt/parceiros/lavandarias-anasec/" title="" class="" target="_blank" style="word-wrap:break-word;"><img alt="" src="https://gallery.mailchimp.com/33e752775d2e6f468d956f66f/images/b615f70c-83ec-4e0c-b6cb-e361cd7fa42f.jpg" width="528" style="max-width:660px;border:0;text-decoration:none;-ms-interpolation-mode:bicubic;vertical-align:bottom;" class="ecxmcnImage"></a></td></tr><tr><td class="ecxmcnTextContent" valign="top" style="padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;color:#606060;font-family:Helvetica;font-size:15px;line-height:150%;text-align:left;" width="528"><div style="text-align:justify;"><span style="font-family:arial,helvetica,sans-serif;font-size:14px;line-height:20px;text-align:justify;"><font color="#5266ab"><strong>Rústica - Móveis e Decoração</strong></font></span><br><br><span style="color:#515151;font-family:arial,helvetica,sans-serif;font-size:12px;line-height:20px;text-align:justify;">Tendo começado no ano de 1995 com o conceito de mobiliário e decoração rústica, com peças originárias da Índia, México, Brasil e Tailândia – apostando mais tarde em peças de fabrico nacional, a Loja Rústica - Móveis e Decoração, implementou-se definitivamente na Ericeira, com o seu leque de clientes vindos de todo o país, em particular da Grande Lisboa.</span><br style="color:#515151;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:20px;text-align:justify;">&nbsp;</div>&nbsp;<div style="text-align:right;"><a href="http://www.weadvice.pt/parceiros/rustica-moveis-e-decoracao/" target="_blank" style="word-wrap:break-word;color:#6DC6DD;font-weight:normal;text-decoration:underline;"><span style="font-size:14px;"><span style="color:#515151;font-family:arial,helvetica,sans-serif;line-height:20px;text-align:justify;">Clique aqui para saber mais sobre o nosso parceiro</span></span></a></div></td></tr></tbody></table></td></tr></tbody></table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="ecxmcnImageCardBlock" style="border-collapse:collapse;"><tbody class="ecxmcnImageCardBlockOuter"><tr><td class="ecxmcnImageCardBlockInner" valign="top" style="padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;"><table align="left" border="0" cellpadding="0" cellspacing="0" class="ecxmcnImageCardBottomContent" width="100%" style="border:1px solid #999999;background-color:#EBEBEB;border-collapse:collapse;"><tbody><tr><td class="ecxmcnImageCardBottomImageContent" align="left" valign="top" style="padding-top:18px;padding-right:18px;padding-bottom:0;padding-left:18px;"><a href="http://www.weadvice.pt/parceiros/lavandarias-anasec/" title="" class="" target="_blank" style="word-wrap:break-word;"><img alt="" src="https://gallery.mailchimp.com/33e752775d2e6f468d956f66f/images/7c968b9f-0c4b-4677-ad08-5a3d184dde5f.jpg" width="528" style="max-width:660px;border:0;text-decoration:none;-ms-interpolation-mode:bicubic;vertical-align:bottom;" class="ecxmcnImage"></a></td></tr><tr><td class="ecxmcnTextContent" valign="top" style="padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;color:#606060;font-family:Helvetica;font-size:15px;line-height:150%;text-align:left;" width="528"><div style="text-align:justify;"><font color="#5266ab" face="arial, helvetica, sans-serif"><span style="font-size:14px;line-height:20px;"><strong>Sabores do Produtor</strong></span></font><br><br><span style="color:#515151;font-family:arial,helvetica,sans-serif;font-size:12px;line-height:20px;text-align:justify;">No coração do Estoril pode agora encontrar os melhores produtos a preços imbatíveis. Sabores únicos da nossa terra e dos quatro cantos do mundo!&nbsp;</span><br style="color:#515151;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:20px;text-align:justify;"><span style="color:#515151;font-family:arial,helvetica,sans-serif;font-size:12px;line-height:20px;text-align:justify;">Venha visitar-nos e experiencie um serviço totalmente personalizado onde poderá degustar artigos tão diversos como queijos, alheiras, paios, lagostas ou até o melhor presunto do mundo… sempre acompanhados por um generoso copo de vinho.&nbsp;</span><br style="color:#515151;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:20px;text-align:justify;">&nbsp;</div>&nbsp;<div style="text-align:right;"><a href="http://www.weadvice.pt/parceiros/sabores-do-produtor/" target="_blank" style="word-wrap:break-word;color:#6DC6DD;font-weight:normal;text-decoration:underline;"><span style="font-size:14px;"><span style="color:#515151;font-family:arial,helvetica,sans-serif;line-height:20px;text-align:justify;">Clique aqui para saber mais sobre o nosso parceiro</span></span></a></div></td></tr></tbody></table></td></tr></tbody></table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="ecxmcnImageCardBlock" style="border-collapse:collapse;"><tbody class="ecxmcnImageCardBlockOuter"><tr><td class="ecxmcnImageCardBlockInner" valign="top" style="padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;"><table align="left" border="0" cellpadding="0" cellspacing="0" class="ecxmcnImageCardBottomContent" width="100%" style="border:1px solid #999999;background-color:#EBEBEB;border-collapse:collapse;"><tbody><tr><td class="ecxmcnImageCardBottomImageContent" align="left" valign="top" style="padding-top:18px;padding-right:18px;padding-bottom:0;padding-left:18px;"><a href="http://www.weadvice.pt/parceiros/lavandarias-anasec/" title="" class="" target="_blank" style="word-wrap:break-word;"><img alt="" src="https://gallery.mailchimp.com/33e752775d2e6f468d956f66f/images/194380cc-a696-4d8f-8277-0f6948f07a3a.jpg" width="528" style="max-width:660px;border:0;text-decoration:none;-ms-interpolation-mode:bicubic;vertical-align:bottom;" class="ecxmcnImage"></a></td></tr><tr><td class="ecxmcnTextContent" valign="top" style="padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;color:#606060;font-family:Helvetica;font-size:15px;line-height:150%;text-align:left;" width="528"><div style="text-align:justify;"><font color="#5266ab" face="arial, helvetica, sans-serif"><span style="font-size:14px;line-height:20px;"><strong>Wash4you Lavandaria Self Service Estoril</strong></span></font><br><br><span style="color:#515151;font-family:arial,helvetica,sans-serif;font-size:12px;line-height:20px;text-align:justify;">Somos uma Lavandaria Self Service Low Cost, com maquinas de lavar de 11Kg e 16Kg e máquinas de secar até 18Kg</span><br style="color:#515151;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:20px;text-align:justify;"><br style="color:#515151;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:20px;text-align:justify;"><span style="color:#515151;font-family:arial,helvetica,sans-serif;font-size:12px;line-height:20px;text-align:justify;">Lave e leve!&nbsp;</span><br style="color:#515151;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:20px;text-align:justify;"><br style="color:#515151;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:20px;text-align:justify;"><span style="color:#515151;font-family:arial,helvetica,sans-serif;font-size:12px;line-height:20px;text-align:justify;">É um conceito inovador e de excelente qualidade que lhe permite lavar uma grande quantidade de roupa (ou peças de grandes dimensões), secá-la e levá-la para casa pronta para arrumar.&nbsp;</span></div>&nbsp;<div style="text-align:right;"><a href="http://www.weadvice.pt/parceiros/wash4you-lavandaria-self-service-estoril/" target="_blank" style="word-wrap:break-word;color:#6DC6DD;font-weight:normal;text-decoration:underline;"><span style="font-size:14px;"><span style="color:#515151;font-family:arial,helvetica,sans-serif;line-height:20px;text-align:justify;">Clique aqui para saber mais sobre o nosso parceiro</span></span></a></div></td></tr></tbody></table></td></tr></tbody></table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="ecxmcnImageCardBlock" style="border-collapse:collapse;"><tbody class="ecxmcnImageCardBlockOuter"><tr><td class="ecxmcnImageCardBlockInner" valign="top" style="padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;"><table align="left" border="0" cellpadding="0" cellspacing="0" class="ecxmcnImageCardBottomContent" width="100%" style="border:1px solid #999999;background-color:#EBEBEB;border-collapse:collapse;"><tbody><tr><td class="ecxmcnImageCardBottomImageContent" align="left" valign="top" style="padding-top:18px;padding-right:18px;padding-bottom:0;padding-left:18px;"><a href="http://www.weadvice.pt/parceiros/lavandarias-anasec/" title="" class="" target="_blank" style="word-wrap:break-word;"><img alt="" src="https://gallery.mailchimp.com/33e752775d2e6f468d956f66f/images/b3bd78bc-3d31-47a9-9ff9-09f5f85d1e00.jpg" width="528" style="max-width:660px;border:0;text-decoration:none;-ms-interpolation-mode:bicubic;vertical-align:bottom;" class="ecxmcnImage"></a></td></tr><tr><td class="ecxmcnTextContent" valign="top" style="padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;color:#606060;font-family:Helvetica;font-size:15px;line-height:150%;text-align:left;" width="528"><div style="text-align:justify;"><span style="font-family:arial,helvetica,sans-serif;font-size:14px;line-height:20px;text-align:justify;"><font color="#5266ab"><strong>Zoom Hair Stylist</strong></font></span><br><br><span style="color:#515151;font-family:arial,helvetica,sans-serif;font-size:12px;line-height:20px;text-align:justify;">Zoom Hairstylist tem como principal missão contribuir para melhorar a sua imagem. Além de realçar a sua beleza natural também contribuir para o seu bem-estar físico e psíquico.</span><br style="color:#515151;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:20px;text-align:justify;"><br style="color:#515151;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:20px;text-align:justify;"><span style="color:#515151;font-family:arial,helvetica,sans-serif;font-size:12px;line-height:20px;text-align:justify;">Porque os nossos CLIENTES são exigentes, o nosso trabalho prima pela qualidade dos serviços prestados e produtos utilizados, pela diferenciação no atendimento e pela constante inovação e adaptação às novas tendências.</span></div>&nbsp;<div style="text-align:right;"><a href="http://www.weadvice.pt/parceiros/zoom-hair-stylist/" target="_blank" style="word-wrap:break-word;color:#6DC6DD;font-weight:normal;text-decoration:underline;"><span style="font-size:14px;"><span style="color:#515151;font-family:arial,helvetica,sans-serif;line-height:20px;text-align:justify;">Clique aqui para saber mais sobre o nosso parceiro</span></span></a></div></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr><tr><td align="center" valign="top" style=""><table border="0" cellpadding="0" cellspacing="0" width="100%" id="ecxtemplateBody" style="border-collapse:collapse;background-color:#ffffff;border-top:0;border-bottom:0;"><tbody><tr><td align="center" valign="top" style=""><table border="0" cellpadding="0" cellspacing="0" width="600" class="ecxtemplateContainer" style="border-collapse:collapse;"><tbody><tr><td valign="top" class="ecxbodyContainer" style="padding-top:10px;padding-bottom:10px;"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="ecxmcnImageCardBlock" style="border-collapse:collapse;"><tbody class="ecxmcnImageCardBlockOuter"><tr><td class="ecxmcnImageCardBlockInner" valign="top" style="padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;"><table align="right" border="0" cellpadding="0" cellspacing="0" class="ecxmcnImageCardBottomContent" width="100%" style="border:1px solid #999999;background-color:#EBEBEB;border-collapse:collapse;"><tbody><tr><td class="ecxmcnImageCardBottomImageContent" align="left" valign="top" style="padding-top:18px;padding-right:18px;padding-bottom:0;padding-left:18px;"><img alt="" src="https://gallery.mailchimp.com/33e752775d2e6f468d956f66f/images/ecadfe9d-4af6-40ce-a0a1-8f441df873a5.jpg" width="528" style="max-width:660px;border:0;text-decoration:none;-ms-interpolation-mode:bicubic;vertical-align:bottom;" class="ecxmcnImage"></td></tr><tr><td class="ecxmcnTextContent" valign="top" style="padding:9px 18px;font-size:12px;font-style:normal;font-weight:normal;line-height:100%;text-align:justify;color:#606060;font-family:Helvetica;" width="528"><p class="ecxmsonormal" style="line-height:17.05pt;background-image:initial;background-attachment:initial;background-size:initial;background-origin:initial;background-clip:initial;background-position:initial;background-repeat:initial;padding:0;color:#606060;font-family:Helvetica;font-size:15px;text-align:left;"><br><span style="color:#000000;font-family:trebuchet ms,lucida grande,lucida sans unicode,lucida sans,tahoma,sans-serif;font-size:12px;line-height:17.05pt;text-align:justify;"><strong><u><span style="font-size:13px;">A WeAdvice marca a sua presença da diverlândia de 2014</span></u></strong><br><br>A FIL Diverlândia abre as portas ao entretenimento com o maior Parque in door de diversões do país. Com vários espaços e equipamentos de diversão, como os carrosséis, Montanha Russa, trampolins e, para os mais valentes, o Adrenalina e a mega pista de carros de choque (a maior do País), entre outros, os visitantes podem passar dias em família, com a animação típica da quadra natalícia.</span><span style="color:#000000;font-family:trebuchet ms,lucida grande,lucida sans unicode,lucida sans,tahoma,sans-serif;font-size:12px;line-height:19.5px;text-align:justify;">.</span></p></td></tr></tbody></table></td></tr></tbody></table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="ecxmcnImageCardBlock" style="border-collapse:collapse;"><tbody class="ecxmcnImageCardBlockOuter"><tr><td class="ecxmcnImageCardBlockInner" valign="top" style="padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;"><table align="left" border="0" cellpadding="0" cellspacing="0" class="ecxmcnImageCardBottomContent" width="100%" style="border:1px solid #999999;background-color:#EBEBEB;border-collapse:collapse;"><tbody><tr><td class="ecxmcnImageCardBottomImageContent" align="left" valign="top" style="padding-top:18px;padding-right:18px;padding-bottom:0;padding-left:18px;"><img alt="" src="https://gallery.mailchimp.com/33e752775d2e6f468d956f66f/images/faf4cad3-4833-4a2c-9341-d42fe81a10b5.jpg" width="528" style="max-width:660px;border:0;text-decoration:none;-ms-interpolation-mode:bicubic;vertical-align:bottom;" class="ecxmcnImage"></td></tr><tr><td class="ecxmcnTextContent" valign="top" style="padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;color:#606060;font-family:Helvetica;font-size:15px;line-height:150%;text-align:left;" width="528"><a href="http://www.weadvice.pt" target="_blank" style="word-wrap:break-word;color:#6DC6DD;font-weight:normal;text-decoration:underline;">www.weadvice.pt</a></td></tr></tbody></table></td></tr></tbody></table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="ecxmcnDividerBlock" style="border-collapse:collapse;"><tbody class="ecxmcnDividerBlockOuter"><tr><td class="ecxmcnDividerBlockInner" style="padding:18px 18px 1px;"><table class="ecxmcnDividerContent" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-top-width:4px;border-top-style:solid;border-top-color:#1D1D1D;border-collapse:collapse;"><tbody><tr><td style=""><span></span></td></tr></tbody></table></td></tr></tbody></table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="ecxmcnTextBlock" style="border-collapse:collapse;"><tbody class="ecxmcnTextBlockOuter"><tr><td valign="top" class="ecxmcnTextBlockInner" style=""><table align="left" border="0" cellpadding="0" cellspacing="0" width="600" class="ecxmcnTextContentContainer" style="border-collapse:collapse;"><tbody><tr><td valign="top" class="ecxmcnTextContent" style="padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;color:#606060;font-family:Helvetica;font-size:15px;line-height:150%;text-align:left;"><em>Copyright © 2014 WeAdvice, All rights reserved.</em><br><br><a class="ecxutilityLink" href="https://*|UNSUB|*" style="word-wrap:break-word;color:#6DC6DD;font-weight:normal;text-decoration:underline;" target="_blank">anular a subscrição desta lista de Email</a>&nbsp; &nbsp;&nbsp;<a class="ecxutilityLink" href="https://*|UPDATE_PROFILE|*" style="word-wrap:break-word;color:#6DC6DD;font-weight:normal;text-decoration:underline;" target="_blank">actualizar dados da subscrição</a>&nbsp;<br><br>&nbsp;</td></tr></tbody></table></td></tr></tbody></table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="ecxmcnFollowBlock" style="border-collapse:collapse;"><tbody class="ecxmcnFollowBlockOuter"><tr><td align="center" valign="top" style="padding:9px;" class="ecxmcnFollowBlockInner"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="ecxmcnFollowContentContainer" style="border-collapse:collapse;"><tbody><tr><td align="center" style="padding-left:9px;padding-right:9px;"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="ecxmcnFollowContent" style="border:1px solid #EEEEEE;background-color:#FAFAFA;border-collapse:collapse;"><tbody><tr><td align="center" valign="top" style="padding-top:9px;padding-right:9px;padding-left:9px;"><table border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;"><tbody><tr><td valign="top" style=""><table align="left" border="0" cellpadding="0" cellspacing="0" class="ecxmcnFollowStacked" style="border-collapse:collapse;"> <tbody><tr><td align="center" valign="top" class="ecxmcnFollowIconContent" style="padding-right:10px;padding-bottom:5px;"><a href="https://www.facebook.com/Weadvice.living.web" target="_blank" style="word-wrap:break-word;"><img src="https://dub118.mail.live.com/Handlers/ImageProxy.mvc?bicild=&amp;canary=OskG7%2f5j91bPeGdObL96bnuvBPZKqi9912Pq1duhYnE%3d0&amp;url=http%3a%2f%2fcdn-images.mailchimp.com%2ficons%2fsocial-block-v2%2fcolor-facebook-96.png" alt="Facebook" class="ecxmcnFollowBlockIcon" width="48" style="width:48px;max-width:48px;display:block;border:0;text-decoration:none;-ms-interpolation-mode:bicubic;"></a></td></tr><tr><td align="center" valign="top" class="ecxmcnFollowTextContent" style="padding-right:10px;padding-bottom:9px;"><a href="https://www.facebook.com/Weadvice.living.web" target="_blank" style="color:#606060;font-family:Arial;font-size:11px;font-weight:normal;line-height:100%;text-align:center;text-decoration:none;word-wrap:break-word;">Facebook</a></td></tr></tbody></table><table align="left" border="0" cellpadding="0" cellspacing="0" class="ecxmcnFollowStacked" style="border-collapse:collapse;"> <tbody><tr><td align="center" valign="top" class="ecxmcnFollowIconContent" style="padding-right:10px;padding-bottom:5px;"><a href="http://www.weadvice.pt/" target="_blank" style="word-wrap:break-word;"><img src="https://dub118.mail.live.com/Handlers/ImageProxy.mvc?bicild=&amp;canary=OskG7%2f5j91bPeGdObL96bnuvBPZKqi9912Pq1duhYnE%3d0&amp;url=http%3a%2f%2fcdn-images.mailchimp.com%2ficons%2fsocial-block-v2%2fcolor-link-96.png" alt="Website" class="ecxmcnFollowBlockIcon" width="48" style="width:48px;max-width:48px;display:block;border:0;text-decoration:none;-ms-interpolation-mode:bicubic;"></a></td></tr><tr><td align="center" valign="top" class="ecxmcnFollowTextContent" style="padding-right:10px;padding-bottom:9px;"><a href="http://www.weadvice.pt/" target="_blank" style="color:#606060;font-family:Arial;font-size:11px;font-weight:normal;line-height:100%;text-align:center;text-decoration:none;word-wrap:break-word;">Website</a></td></tr></tbody></table><table align="left" border="0" cellpadding="0" cellspacing="0" class="ecxmcnFollowStacked" style="border-collapse:collapse;"> <tbody><tr><td align="center" valign="top" class="ecxmcnFollowIconContent" style="padding-right:10px;padding-bottom:5px;"><a href="https://plus.google.com/112849724150312489427/posts" target="_blank" style="word-wrap:break-word;"><img src="https://dub118.mail.live.com/Handlers/ImageProxy.mvc?bicild=&amp;canary=OskG7%2f5j91bPeGdObL96bnuvBPZKqi9912Pq1duhYnE%3d0&amp;url=http%3a%2f%2fcdn-images.mailchimp.com%2ficons%2fsocial-block-v2%2fcolor-googleplus-96.png" alt="Google Plus" class="ecxmcnFollowBlockIcon" width="48" style="width:48px;max-width:48px;display:block;border:0;text-decoration:none;-ms-interpolation-mode:bicubic;"></a></td></tr><tr><td align="center" valign="top" class="ecxmcnFollowTextContent" style="padding-right:10px;padding-bottom:9px;"><a href="https://plus.google.com/112849724150312489427/posts" target="_blank" style="color:#606060;font-family:Arial;font-size:11px;font-weight:normal;line-height:100%;text-align:center;text-decoration:none;word-wrap:break-word;">Google Plus</a></td></tr></tbody></table><table align="left" border="0" cellpadding="0" cellspacing="0" class="ecxmcnFollowStacked" style="border-collapse:collapse;"> <tbody><tr><td align="center" valign="top" class="ecxmcnFollowIconContent" style="padding-right:10px;padding-bottom:5px;"><a href="https://www.linkedin.com/company/weadvice" target="_blank" style="word-wrap:break-word;"><img src="https://dub118.mail.live.com/Handlers/ImageProxy.mvc?bicild=&amp;canary=OskG7%2f5j91bPeGdObL96bnuvBPZKqi9912Pq1duhYnE%3d0&amp;url=http%3a%2f%2fcdn-images.mailchimp.com%2ficons%2fsocial-block-v2%2fcolor-linkedin-96.png" alt="LinkedIn" class="ecxmcnFollowBlockIcon" width="48" style="width:48px;max-width:48px;display:block;border:0;text-decoration:none;-ms-interpolation-mode:bicubic;"></a></td></tr><tr><td align="center" valign="top" class="ecxmcnFollowTextContent" style="padding-right:10px;padding-bottom:9px;"><a href="https://www.linkedin.com/company/weadvice" target="_blank" style="color:#606060;font-family:Arial;font-size:11px;font-weight:normal;line-height:100%;text-align:center;text-decoration:none;word-wrap:break-word;">LinkedIn</a></td></tr></tbody></table><table align="left" border="0" cellpadding="0" cellspacing="0" class="ecxmcnFollowStacked" style="border-collapse:collapse;"> <tbody><tr><td align="center" valign="top" class="ecxmcnFollowIconContent" style="padding-right:10px;padding-bottom:5px;"><a href="https://www.youtube.com/user/weadvice4" target="_blank" style="word-wrap:break-word;"><img src="https://dub118.mail.live.com/Handlers/ImageProxy.mvc?bicild=&amp;canary=OskG7%2f5j91bPeGdObL96bnuvBPZKqi9912Pq1duhYnE%3d0&amp;url=http%3a%2f%2fcdn-images.mailchimp.com%2ficons%2fsocial-block-v2%2fcolor-youtube-96.png" alt="YouTube" class="ecxmcnFollowBlockIcon" width="48" style="width:48px;max-width:48px;display:block;border:0;text-decoration:none;-ms-interpolation-mode:bicubic;"></a></td></tr><tr><td align="center" valign="top" class="ecxmcnFollowTextContent" style="padding-right:10px;padding-bottom:9px;"><a href="https://www.youtube.com/user/weadvice4" target="_blank" style="color:#606060;font-family:Arial;font-size:11px;font-weight:normal;line-height:100%;text-align:center;text-decoration:none;word-wrap:break-word;">YouTube</a></td></tr></tbody></table><table align="left" border="0" cellpadding="0" cellspacing="0" class="ecxmcnFollowStacked" style="border-collapse:collapse;"> <tbody><tr><td align="center" valign="top" class="ecxmcnFollowIconContent" style="padding-right:0;padding-bottom:5px;"><a href="mailto:geral@weadvice.pt" target="_blank" style="word-wrap:break-word;"><img src="https://dub118.mail.live.com/Handlers/ImageProxy.mvc?bicild=&amp;canary=OskG7%2f5j91bPeGdObL96bnuvBPZKqi9912Pq1duhYnE%3d0&amp;url=http%3a%2f%2fcdn-images.mailchimp.com%2ficons%2fsocial-block-v2%2fcolor-forwardtofriend-96.png" alt="Email" class="ecxmcnFollowBlockIcon" width="48" style="width:48px;max-width:48px;display:block;border:0;text-decoration:none;-ms-interpolation-mode:bicubic;"></a></td></tr><tr><td align="center" valign="top" class="ecxmcnFollowTextContent" style="padding-right:0;padding-bottom:9px;"><a href="mailto:geral@weadvice.pt" target="_blank" style="color:#606060;font-family:Arial;font-size:11px;font-weight:normal;line-height:100%;text-align:center;text-decoration:none;word-wrap:break-word;">Email</a></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="ecxmcnTextBlock" style="border-collapse:collapse;"><tbody class="ecxmcnTextBlockOuter"><tr><td valign="top" class="ecxmcnTextBlockInner" style=""><table align="left" border="0" cellpadding="0" cellspacing="0" width="600" class="ecxmcnTextContentContainer" style="border-collapse:collapse;"><tbody><tr><td valign="top" class="ecxmcnTextContent" style="padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;color:#606060;font-family:Helvetica;font-size:15px;line-height:150%;text-align:left;"><table border="0" cellpadding="0" cellspacing="0" style="color:#4C4C4C;font-size:10px;line-height:normal;font-family:tahoma;padding:0px;border-collapse:collapse;" width="580"><tbody><tr><td style="padding:15px;"><p style="text-align:center;padding:0;color:#606060;font-family:Helvetica;font-size:15px;line-height:150%;"><font size="+0"><font face="Verdana, Arial, Helvetica, sans-serif" size="3"><strong><u><a href="http://www.weadvice.pt" style="word-wrap:break-word;color:#6DC6DD;font-weight:normal;text-decoration:underline;" target="_blank"><span style="color:#5266ab;"><font size="3"></font></span></a></u></strong><strong>WeAdvice</strong></font></font><font color="#333333"><font size="+0"><font face="Verdana, Arial, Helvetica, sans-serif" size="3"><strong>&nbsp;-&nbsp;</strong></font></font></font><span style="font-size:14px;"><strong style="background-attachment:initial;background-clip:initial;background-origin:initial;background-repeat:initial;background-size:initial;border:0px;color:#515151;font-family:verdana;font-weight:bold;line-height:20px;padding:0px;">Av. da República, 120 A .&nbsp;2780-132 Oeiras&nbsp;</strong></span></p><p style="text-align:center;padding:0;color:#606060;font-family:Helvetica;font-size:15px;line-height:150%;"><font color="#333333"><font size="+0"><font face="Verdana, Arial, Helvetica, sans-serif" size="3"><strong>Tel:&nbsp;</strong></font></font></font><strong><span style="font-size:16px;"><span style="color:#515151;font-family:verdana;line-height:20px;">968 146 986</span></span></strong></p><p style="text-align:center;padding:0;color:#606060;font-family:Helvetica;font-size:15px;line-height:150%;"><font color="#333333"><font face="Verdana, Arial, Helvetica, sans-serif"><font size="+0"><font style="background-color:#EFEFEF;"><font size="1"><font style="background-color:#E1E1E1;"><span style="background-color:#ffffff;">Recebeu este e-mail através do portal </span><a href="http://www.weadvice.pt" target="_blank" style="word-wrap:break-word;color:#6DC6DD;font-weight:normal;text-decoration:underline;"><span style="background-color:#ffffff;">www.weadvice.pt</span></a></font></font></font></font></font></font><br style="color:#333333;font-size:12px;line-height:14px;font-family:'trebuchet ms', arial, helvetica, sans-serif;background-color:#E1E1E1;"><span style="font-family:trebuchet ms,arial,helvetica,sans-serif;font-size:12px;line-height:14px;"><font face="Verdana, Arial, Helvetica, sans-serif"><font color="#333333">Para qualquer assunto contacte-nos através do e-mail: </font></font></span><font face="Verdana, Arial, Helvetica, sans-serif" style="color:#598FDE;"><strong><a href="mailto:geral@weadvice.pt" target="_blank" style="word-wrap:break-word;color:#6DC6DD;font-weight:normal;text-decoration:underline;">geral@weadvice.pt</a></strong></font></p></td></tr></tbody></table><table align="center" border="0" cellpadding="0" cellspacing="0" style="color:#000000;font-family:arial, sans-serif;line-height:normal;text-align:center;background-color:#E1E1E1;border-collapse:collapse;" width="580"><tbody><tr><td style="">&nbsp;</td></tr><tr><td bgcolor="#ffffff" style="color:#999999;padding:10px;text-align:left;"><p style="text-align:center;padding:0;color:#606060;font-family:Helvetica;font-size:15px;line-height:150%;"><font face="Verdana, Arial, Helvetica, sans-serif"><span style="color:#333333;font-family:trebuchet ms,arial,helvetica,sans-serif;font-size:12px;line-height:14px;">© WeAdvice, todos os direitos reservados.&nbsp;</span><br style="color:#333333;font-size:12px;line-height:14px;font-family:'trebuchet ms', arial, helvetica, sans-serif;background-color:#E1E1E1;"><span style="color:#333333;font-family:trebuchet ms,arial,helvetica,sans-serif;font-size:12px;line-height:14px;">Design by: </span><a href="http://www.weadvice.pt" target="_blank" style="word-wrap:break-word;color:#6DC6DD;font-weight:normal;text-decoration:underline;"><span style="color:#333333;"><font size="1">www.weadvice.pt</font></span></a></font></p></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr><tr><td align="center" valign="top" style=""><table border="0" cellpadding="0" cellspacing="0" width="100%" id="ecxtemplateFooter" style="border-collapse:collapse;background-color:#F2F2F2;border-top:0;border-bottom:0;"><tbody><tr><td align="center" valign="top" style=""><table border="0" cellpadding="0" cellspacing="0" width="600" class="ecxtemplateContainer" style="border-collapse:collapse;"><tbody><tr><td valign="top" class="ecxfooterContainer" style="padding-top:10px;padding-bottom:10px;"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="ecxmcnTextBlock" style="border-collapse:collapse;"><tbody class="ecxmcnTextBlockOuter"><tr><td valign="top" class="ecxmcnTextBlockInner" style=""><table align="left" border="0" cellpadding="0" cellspacing="0" width="600" class="ecxmcnTextContentContainer" style="border-collapse:collapse;"><tbody><tr><td valign="top" class="ecxmcnTextContent" style="padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;color:#606060;font-family:Helvetica;font-size:11px;line-height:125%;text-align:left;"><em>Copyright © 2014 WeAdvice, All rights reserved.</em><br><br><br>&nbsp;</td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table>',
						"autotext":true,
						"track_opens":true,
						"track_clicks":true,
						"metadata": {
							"dbName": dbName,//"45829",//it is in token
							"eCN": eCN,	//"111",
							"fCN": fCN   //456",
						}
						// "recipient_metadata": [
						// 	{
						// 		"rcpt": "joaoccoliveira@live.com",
						// 		"values": {
						// 			"user_id": 123456
						// 		}
						// 	}
						// ]						
					}
				};
				var params3 = {//placing merge tags in the content
					"message": {
						"from_email":"support@framelink.co",
						"from_name" : "Joao Oliveira",
						"to":[{"email":"joaool@framelink.co","name":"Jojo"},{"email":"joaoccoliveira@live.com","name":"Joao"}],
						"subject": "Your *|ORDER|* has been received",
						"html":  "<p>Hey *|COOLFRIEND|*, we've been friends for *|YEARS|*.</p>",
						"autotext":true,
						"track_opens":true,
						"track_clicks":true,
						"merge_vars": [//suports IF ELSE conditions
							{
								"rcpt": "joaool@framelink.co",
								"vars": [
									{
										"name": "ORDER",
										"content": "1"
									},
									{
										"name": "COOLFRIEND",
										"content": "Patolinas"
									},
									{
										"name": "YEARS",
										"content": "5 awesome years"
									}
								]
							},
							{
								"rcpt": "joaoccoliveira@live.com",
								"vars": [
									{
										"name": "ORDER",
										"content": "2"
									},
									{
										"name": "COOLFRIEND",
										"content": "Malhanca"
									},
									{
										"name": "YEARS",
										"content": "4.5 awesome years"
									}
								]
							},
						]
					}
				};
				//The global_merge_vars parameter lets you specify some default values in the event that a recipient
				//   doesn't have recipient-specific information.
				m.messages.send(params2,function(res){console.log(res);},function(err){console.log(err);});
				alert("Send a test email");
				// var xId = 'id_1';
				// var xEmail = 'joaoccoliveira@live.com';
				// _cio.identify({
				// 	// Required attributes
				// 	id: xId,          	// Unique id for the currently signed in user in your application.
				// 	email: xEmail,	// Email of the currently signed in user.
				// 	created_at: 1410680673, 	// Timestamp in your system that represents when
				// 								// the user first signed up. You'll want to send it
				// 								// as seconds since the epoch.

				// 	// Optional (these are examples. You can name attributes what you wish)

				// 	first_name: 'John',       // Add any attributes you'd like to use in the email subject or body.
				// 	plan_name: 'free'      // To use the example segments, set this to 'free' or 'premium'.
				// });
			}
		};
	})();
// });