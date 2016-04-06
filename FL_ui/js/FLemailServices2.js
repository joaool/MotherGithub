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
	FL["emailServices"] = (function(){//name space FL.dd
		var internalTest = function ( x) { //returns a 2 bytes string from number
			FL.common.printToConsole( "emailServices2.js internalTest -->"+x );
		};
		return{
			abc: "abc",
			test: function(x) {//call with menu key "uri": "javascript:FL.links.test('JOJO')"
				internalTest(x);
				alert("Fl.emailServices2.test(x) x="+x);
			},
			testApigee: function(){
				 // http://framelink-test.apigee.net/v1/hello
				var def = $.Deferred();
				$.ajax({
					type: "GET",
					url: "http://framelink-test.apigee.net/v1/hello",
				})
				.done(function(response) {
					var toDisplay = response;
					FL.common.printToConsole('FL.emailServices. testApigee->'+toDisplay,"apigee" ); // show success message
					alert("FLemailServices2.js  OK testApigee->"+toDisplay);
					return def.resolve(response);
				})
				.fail(function(response) {
					alert("FLemailServices2.js  FAIL testApigee ->err="+response);
					return def.reject("FL.emailServices.testApigee FAILURE err="+response);
				});
				return def.promise();
			},
			testGoogleGeo: function(city){
				//return format: https://mandrillapp.com/api/docs/senders.JSON.html
				var def = $.Deferred();
				$.ajax({
					type: "POST",
					url: "https://maps.googleapis.com/maps/api/geocode/json?address="+city,
					data: {
						'address': city,
					}
				})
				.done(function(response) {
					var toDisplay = response.results[0].address_components[2].long_name + "/" + response.results[0].address_components[2].short_name;
					FL.common.printToConsole('FL.emailServices. testGoogleGeo->'+toDisplay,"geo" ); // show success message
					alert("FLemailServices2.js  testGoogleGeo->"+toDisplay);
					return def.resolve(response);
				})
				.fail(function(response) {
					alert("FLemailServices2.js  testGoogleGeo ->err="+response);
					return def.reject("FL.emailServices.testGoogleGeo FAILURE err="+response);
				});
				return def.promise();
			},
			extractMandrillInfoFromId: function(md_id){//not used anywhere 16-04-2015
				//return format: https://mandrillapp.com/api/docs/messages.JSON.html#method=info
				var def = $.Deferred();
				var mandrillKey = FL.common.getMandrillKey();
				$.ajax({
					type: "POST",
					url: "https://mandrillapp.com/api/1.0/messages/info.json",
					data: {
						'key': mandrillKey,
						'id':md_id
					}
				})
				.done(function(response) {
					FL.common.printToConsole('FL.emailServices.extractMandrillInfoFromId sender='+response.sender + ' located in ' + response.opens ); // show success message
					return def.resolve(response);
				})
				.fail(function(response) {
					FL.common.printToConsole("FL.emailServices.extractMandrillInfoFromId FAILURE err="+response.message);
					return def.reject("FL.emailServices.extractMandrillInfoFromId FAILURE err="+response.message);
				});
				return def.promise();
			},
			mandrillStats: function(){
				//return format: https://mandrillapp.com/api/docs/senders.JSON.html
				var def = $.Deferred();
				var mandrillKey = FL.common.getMandrillKey();
				$.ajax({
					type: "POST",
					url: "https://mandrillapp.com/api/1.0/senders/list.json",
					data: {
						'key': mandrillKey,
					}
				})
				.done(function(response) {
					FL.common.printToConsole('FL.emailServices.mandrillStats SUCCESS' ); // show success message
					return def.resolve(response);
				})
				.fail(function(response) {
					FL.common.printToConsole("FL.emailServices.mandrillStats FAILURE err="+response.message);
					return def.reject("FL.emailServices.mandrillStats FAILURE err="+response.message);
				});
				return def.promise();
			},
			sendEmail:function(mailHTML,imagesArr,recipientsArray,senderObj,metadataObj){//NewsletterName,dbName){//sends an email to the recipients
			  	//paramenter-->mailHTML, images array, recipients Array, senderObj={from_name:name,from_email:email,subject:subject,testEmail:testEmail}
      			//   and metadataObj={newsletterName:FL.login.emailTemplateName,dbName:FL.login.token.dbName,eCN:null,fCN:null}
      			//NOTE 1 - imagesArr = [] or: if images arr exists mailHtml must have a cid refering to the images
				//NOTE 2 - recipientsArray = ["joaoccoliveira@live.com","joaocarloscoliveira@gmail.com"]
				//returns the total number of emails sent. Notice that from the recipientsArray the methods will skip all those that do not have a valid email
				if(mailHTML ==="" || mailHTML === null){
					alert("Send Mail ->Cannot send an empty email !");
					return 0;
				}
				var mandrillKey = FL.common.getMandrillKey();
				// var m = new mandrill.Mandrill('vVC6R5SZJEHq2hjEZfUwRg');
				var m = new mandrill.Mandrill(mandrillKey);
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
								"images": imagesArr,
								"autotext":true,
								"track_opens":true,
								"track_clicks":true,
								"metadata": {
									"dbName": metadataObj.dbName,//"45829",//it is in token
									"eCN": metadataObj.eCN,	//"111",
									"fCN": metadataObj.fCN,   //456",
									"NName": metadataObj.newsletterName //NewsletterName  //Newsletter Name
								}
							}
						};
						FL.common.printToConsole("sendEmail() "+ count +"/"+total_toSend+ " --> sent Count=" + countSend + " -->" + element + " with label=" +metadataObj.newsletterName);
						FL.common.printToConsole("	to from_name:"+senderObj.from_name+" email:"+senderObj.from_email+" subject:"+senderObj.subject);
						FL.common.printToConsole("	Sends to -->"+JSON.stringify(element));
						FL.common.printToConsole("----------------------------------------------------------------------");
						m.messages.send(params2,function(res){FL.common.printToConsole(res);},function(err){FL.common.printToConsole(err);});
						//how to recover from an accident ?
					}else{
						FL.common.printToConsole("sendEmail not sent ! "+ count +"/"+total_toSend+ " -->" + element + " has a format error and was bypassed");
					}
				});
				return countSend;
			},
			sendEmail_mailgun:function(mailHTML,imagesArr,recipientsArray,senderObj,metadataObj){//NewsletterName,dbName){//sends an email to the recipients
				//paramenter-->mailHTML, images array, recipients Array, senderObj={from_name:name,from_email:email,subject:subject,testEmail:testEmail}
				//   and metadataObj={newsletterName:FL.login.emailTemplateName,dbName:FL.login.token.dbName,eCN:null,fCN:null}
				//NOTE 1 - imagesArr = [] or: if images arr exists mailHtml must have a cid refering to the images
				//NOTE 2 - recipientsArray = ["joaoccoliveira@live.com","joaocarloscoliveira@gmail.com"]
				//returns the total number of emails sent. Notice that from the recipientsArray the methods will skip all those that do not have a valid email
				if(mailHTML ==="" || mailHTML === null){
					alert("Send Mail ->Cannot send an empty email !");
					return 0;
				}
				// validateBatchEmail(recipientsArray)
				alert("before calling AJAX");
				$.ajax({
					//url: "http://localhost:80/cgi-bin/mailgun_pythonServer.py",
					//url: "http://127.0.0.1/cgi-bin/mailgun_pythonServer.py",
					url: "http://localhost/cgi-bin/mailgun_pythonServer.py",
					// contentType:'application/json',
					type:"POST",
					data: {
						mailHTML: mailHTML,
						imagesArr: JSON.stringify(imagesArr),
						recipientsArray: JSON.stringify(recipientsArray),
						senderObj: JSON.stringify(senderObj)
					},
					success: function (response) {
						alert("------ success --------");
						responseObj = FL.emailServices.getResponseObj(response);
						if (responseObj) {
							// alert("Send Mail ! status="+responseObj.status+" id="+responseObj.id);
							//reposnseObj has the format: {"resultsArr":[{"message":"mes1","id":"id1"},{"message":"mes2","id":"id2"},..{}]}
							alert("Mailgun sent Mail ! --> " + JSON.stringify(responseObj));
						} else
							alert("Null answer from python server");
					},
					error: function (xhr, errmsg, err) {
						alert("xx!!!!!!!!!!!!!! error !!!!!!!!!!!!! " + xhr.status);
						var z = 32;
					}
				});
				countSend = recipientsArray.length;//temporary count for tests
				return countSend;
			},
			getResponseObj: function(htmlStr){
				var xAns = null;
				// var xBegin=htmlStr.indexOf('{"status":');
				var xBegin=htmlStr.indexOf('<body>{')+6;
				if(xBegin>=5){
					var xEnd = htmlStr.indexOf("}</body></html>");
					if (xEnd>0){
						xAns = htmlStr.substr(xBegin,xEnd-xBegin+1);
						xAns=JSON.parse(xAns);
					}
				}
				return xAns;
			},
			validateBatchEmail: function(recipientsArray){
				var count = 0;
				var countSend = 0;
				var total_toSend = recipientsArray.length;
				_.each(recipientsArray, function(element){
					count++;
					if(FL.common.validateEmail(element)){//checks if it is a valid email format
						countSend++;
						FL.common.printToConsole("sendEmail() "+ count +"/"+total_toSend+ " --> sent Count=" + countSend + " -->" + element );
						//FL.common.printToConsole("	to from_name:"+senderObj.from_name+" email:"+senderObj.from_email+" subject:"+senderObj.subject);
						FL.common.printToConsole("	Sends to -->"+JSON.stringify(element));
						FL.common.printToConsole("----------------------------------------------------------------------");
					}else{
						FL.common.printToConsole("sendEmail not sent ! "+ count +"/"+total_toSend+ " -->" + element + " has a format error and was bypassed");
					}
				});
			},
			testEmail: function(x) {//sends a sample email with mandrill javascript API
				alert(x);
				// FL.API.debug = true;
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

				var mandrillKey = FL.common.getMandrillKey();
				// var m = new mandrill.Mandrill('vVC6R5SZJEHq2hjEZfUwRg');
				var m = new mandrill.Mandrill(mandrillKey);
				m.users.ping(function(res){FL.common.printToConsole(res);},function(err){FL.common.printToConsole(err);});
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
				m.messages.send(params2,function(res){FL.common.printToConsole(res);},function(err){FL.common.printToConsole(err);});
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