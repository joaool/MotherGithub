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
	FL["dd"] = (function(){//name space FL.dd
		// entities={__Last:0,__LastRelation:0};//this is an object of objects (not an array of objects)
		//the key of the internal objects is the singular entity name
			//   {__Last:<number>,__LastRelation:<number>} is a special object with:
			//			__Last - The total the number of entities. This is used to generate entity compressed names
			//			__LastRelation - The total the number of relations. This is used to generate idRelation compressed names
			//   each internal object(entity) has: 
			//      key:{singular:xSingular,csingular:xCSingular,plural:xPlural,description:xDescription,lastId:0,L2C:{},C2L:{},attributes:[]};	
			//		ex:{"Client":{singular:"Client",
			//					csingular:"01",
			//					plural:"clients",
			//					description:"Individual or Company to whom we may send invoices",
			//					sync:false,
			//					lastId:0,
			//					L2C:{},
			//					C2L:{},
			//					attributes:[]	
			//					relations:[]	
			//		}};
			//
			//  singular - is the human (logical) entitity name
			//	csingular - is the compressed entity name (does not change on renames)
			//  plural - plural expression corresponding to singular
			//  description - description of singular (answer to: "what is a <singular> ?")
			//	sync - false if no synchronization was done with the server - true if synchronization was done
			//				- if sync = false (default) csingular and all attributes fieldCN are temporary 
			//				- when sync = true - csingular and all attributes fieldCN are correct
			//  lastId - number of attributes of entity <singular>
			//
			//each attribute (i) is in dDictionary.entities[<sEentity>].attributes[i]
			//     with the format 
			//		{name:"address",description:"address to send invoices",label:"Address",type:"string",typeUI:"textbox",enumerable:null,key:false});
			//
			//			name -  is the human (logical) attribute name or field name
			//			description - description of attribute (answer to: "what the <name > of a <entity.singular> ?")
			//			label - defaul value that will appear in UI labeling the attribute
			//	OLD>>	type - one of: "string","number","integer","boolean","date","weak" (a json object)
			//			type - string, integer, number, boolean, date, or json (Nico's field "M")
			//				NOTE: if type is "enumerable", the key enumerable must have an array of enumerables
			//				NOTE: type "enumerable" is invalid for server. "enumerable" will be send as type="string" to server
			//			enumerable - an array of enumerables or null (if key type != "enumerable")
			//			typeUI -type of widget that is used with the field (Nico's field "9")
			//				textbox, numberbox, textarea, checkbox, datetextbox, combobox, picture, emailbox, phonebox, urlbox
			//			key - boolean. True means the attribute is the  key field of the entity . (only one allowed)
			//			
			//          NOTE: to access the field compressed name use L2C() at entity level.
			//
			// each relation (i) is in dDictionary.entities[<sEntity>].relations[i]
			//     with the format 
			//     oRelation-->	{idRelation:3,cIdRelation:"03",rightEntity:"Invoice",description:"has",cardinality:"0_1",semantic:"Client has many Invoices",delChildren:false});
		 	//    		idRelation - key for database table "relation" int(11) autoincrement
		 	//    		cIdRelation - compressed name corresponding to idRelation - independent identifier  
			//      Note: semantic property is redundant with all other relation properties and with the entity key.
			//      Sych Server 
			//		      //cIdRelation ->rCN returned has _id
			//			  rightEntity ->entityCN ->U
			//			              side - must be saved in the customer dictionary
			//			  IF relation not reflexive
			//			  		description (change to verb) - V - if not reflexive
			//            IF relation reflexive
			//					two entries are necessary with the same right entity -side must be saved one is 0 the other is 1
			//			  cardinality :W ->0,1,N
			//			  delChildren ->option TBD->"02":[{delChildren:true,....}]
			//
			//  ----- relation's object was completely changed to match Nico's approach - April 8, 2014
			//
			//		rCN - relation compressed name
			//		withEntity - the same as rightEntity
			//	    verb - leftEntity <verb> rightEntity ex. "has"
			//		cardinality - leftEntity <verb><cardinality> rightEntity ex. "zero or many"
			//		side - only for Nico's use - convention when  relation was created with relation.add in server side
			//		storedHere - only for Nico's use - Permission to save defined when  relation was created with relation.add in server side

		var getCompressed = function ( iGenNext ) { //returns a 2 bytes string from number 
			var sOut="";
			//-------------
			var iMinLen=2;
			var sGenChars="0123456789aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ_";
			//---------------------------------------------------------
			// Test using small character sets :
			// var sGenChars="01"; // generates a binary represenntation with only '0' and '1' symbols
			//   or 
			// var sGenChars="abc";
			//-------------------------------------
			var iGenCharLength= sGenChars.length;
			
			var ii= iGenNext;
			while ( ii >0 ) {
				var iPos= ii % iGenCharLength;
				var ch= sGenChars.substr( iPos, 1);
				sOut+= ch;
				ii= Math.floor( ii / iGenCharLength);
			}
			ii=sOut.length;
			while (ii< iMinLen) {
				sOut+= sGenChars.substr( 0, 1);
				ii++;
			}
			//---------
			sOut=  strReverse( sOut);
			return sOut;
		};
		var strReverse=function ( str ) {//reverse a string: ex: "abcd" becomes "dcba"
			var sOut="";
			var iLen=str.length;
			for (var ii=iLen-1; ii>=0; ii--) {
				sOut+= str.substr(ii,1);
			}
			return sOut;
		};
		var preArticle = function(sWord,xLanguage) {//for language xLanguage extract the article to be used before sWord
			//Ex z="What is "+dDictionary.preArticle(xEntity,"En")+"?";
			if(!sWord)
				return null;
			var trad={ "En":"a","Fr":"un","Pt":"um","Nl":"een"};
			var xArticle=trad[xLanguage];
			var xFirst=sWord.substr(0,1);
			var xLen=sWord.length;
			var xLast=sWord.substr(xLen-1,1);

			switch(xLanguage){
				case "En":
					if(("aeiou").indexOf(xFirst)>=0) //if first letter is one of
						xArticle="an";
					break;
				case "Fr":
					var xLast2=sWord.substr(xLen-2,2);
					if(("ée ie té").indexOf(xLast2)>=0)
						xArticle="une";
					var xLast3=sWord.substr(xLen-3,3);
					if(("ade eur rie ère ine ise ose ole ure").indexOf(xLast3)>=0)
						xArticle="une";
					var xLast4=sWord.substr(xLen-4,4);
					if(("aille ison sion tion ance asse étée ence euse elle esse ette").indexOf(xLast3)>=0)
						xArticle="une";
					break;
				case "Pt":
					if(xLast=="a")
						xArticle="uma";
					break;
			}
			return xArticle+" "+sWord;
		};	//preArticle			
		var plural = function(sWord,xLanguage) {//returns the plural of sWord in language=xLanguage
			//ex: dDictionary.plural("car","En") ->cars, dDictionary.plural("box","En")->boxes 
			var xWord=sWord;
			var xFirst=sWord.substr(0,1);
			var xLen=sWord.length;
			var xLast=sWord.substr(xLen-1,1);
			var xLast2=sWord.substr(xLen-2,2);
			var xLast3=sWord.substr(xLen-3,3);

			switch(xLanguage){
				case "En":
					// var xLast2=sWord.substr(xLen-2,2);
					if(("x").indexOf(xLast)>=0){ //if last char is one of
						xWord=xWord+"es";//box->boxes
					}else if(("y").indexOf(xLast)>=0){ //if last chars are one of
						xWord=xWord.substr(0,xLen-1)+"ies";//city ->cities
					}else if(("ch to ro").indexOf(xLast2)>=0){ //if last 2 chars are one of
						xWord=xWord+"es";//switch ->switches tomato->tomatoes hero->heroes
						if(("disco piano photo").indexOf(sWord)>=0)//exceptions to the above rule
							xWord=sWord+"s";
					}else if(("fe").indexOf(xLast2)>=0){ //if last 2 chars are one of
						xWord=xWord.substr(0,xLen-2)+"ves";//wife ->wives
					}else if(("lf").indexOf(xLast2)>=0){ //if last 2 chars are one of
						xWord=xWord.substr(0,xLen-1)+"ves";//shelf->shelves
					}else{//remaining cases
						xWord=xWord+"s";
					}
					//irregular forms
					var oIrr={man:"men",woman:"women",child:"children",mouse:"mice",teeth:"tooth",goose:"geese",foot:"feet",ox:"oxen"};
					xIrr=oIrr[sWord];
					if(xIrr)
						xWord=xIrr;
					break;
				case "Fr":
					// xLast2=sWord.substr(xLen-2,2);
					if(("xs").indexOf(xLast)>=0){ //if last char is one of
						xWord=xWord;//prix->prix gros->gros
					}else if(("al").indexOf(xLast2)>=0){ //if last 2 chars are one of
						xWord=xWord.substr(0,xLen-1)+"ux";//jornal -> jornaux
					}else if(("au eu").indexOf(xLast2)>=0){ //if last 2 chars are one of
						xWord=xWord+"x";//chateu ->chateux, jeu -> jeux
					}else{//remaining cases
						xWord=xWord+"s";
					}
					break;
				case "Pt":
					// var xLast2=sWord.substr(xLen-2,2);
					// var xLast3=sWord.substr(xLen-3,3);
					if(("rsz").indexOf(xLast)>=0){ //if last char is one of
						xWord=xWord+"es";//cor->cores, chafariz->chafarizes mes->meses
					}else if(("al el il ol").indexOf(xLast2)>=0){ //if last 2 chars are one of
						xWord=xWord.substr(0,xLen-1)+"is";//sinal->sinais papel->papeis barril->barris lencol->lencois
					}else if(("cao iao").indexOf(xLast3)>=0){ //if last 3 chars are one of
						xWord=xWord.substr(0,xLen-2)+"oes";//organização->organizações, avião->aviões 
					}else if(("ao").indexOf(xLast2)>=0){ //if last 2 chars are one of
						xWord=xWord.substr(0,xLen-1)+"es";//pão->pães
					}else{//remaining cases
						xWord=xWord+"s";
					}
					break;
				case "Nl":
					// var xLast2=sWord.substr(xLen-2,2);
					// var xLast3=sWord.substr(xLen-3,3);
					if(("aeiou").indexOf(xLast)>=0){ //if last char is one of (vowel) plural is +en, +s or 's
						xWord=xWord+"s";//radio->radios, ziekte->ziektes 	
						if(("bekende gepensioneerde werkende").indexOf(sWord)>=0)//exceptions to the above rule
								xWord=sWord+"n";
					}else{//end in consonant
						if(("kl").indexOf(xLast)>=0){ //if last chars are one of
							xWord=xWord+xLast+"en";//rok->rokken, geval->gevallen
						}else if(("el em en er um rd").indexOf(xLast2)>=0){ //if last chars are one of
							xWord=xWord+"s";//keuken->keukens
						}else if(("eur oon oor ier").indexOf(xLast3)>=0){ //if last chars are one of
							xWord=xWord+"s";//monteur ->monteurs
						}else if(("f").indexOf(xLast)>=0){ //if last chars are one of
							xWord=xWord.substr(0,xLen-1)+"ven";//brief ->brieven
						}else{//remaining cases
							xWord=xWord+"en";//boek->boeken
						}
					}
					break;
			}
			return xWord;
		};//plural
		var makeSemStr= function(x1,x2,xType,xLanguage) {//concatenate basic entity semantics
		// x1 - first word (pre) to be connected to second by phrase of type=xType
		// x2 - second word (pos) to be connected to first by phrase of type=xType
		// xType:
		//     "A" - "Definition statement" - singular-description x1=singular and x2=description
		//		use: dDictionary.makeSemStr("Client","Individual or Company to whom we may send invoices","A","En") to get:
		//			<Client> is a <Individual or Company to whom we may send invoices>
		//     "B" - "plural statement" singular-plural x1=singular and x2=plural
		//		use: dDictionary.makeSemStr("Client","clients","B","En") to get:
		//				A set with more than one <Client> is called a set of <clients>
		//------------------------------------------------------------------------------
			var trad = { //semantinc repository
				"En":{A:{pre:"",mid:" is a(n) ",pos:""},B:{pre:"A set with more than one ",mid:" is called a set of ",pos:""}},
				"Fr":{A:{pre:"",mid:" c'est un ",pos:""},B:{pre:"Un group avec plus q'un ",mid:" s'appelle un groupe de ",pos:""}},
				"Nl":{A:{pre:"",mid:" is een ",pos:""},B:{pre:"Een set met meer dan één ",mid:" is een set van ",pos:""}},
				"Pt":{A:{pre:"",mid:" é um ",pos:""},B:{pre:"Um grupo com mais do que um ",mid:" designa-se por grupo de ",pos:""}}
			};
			var oTrad=trad[xLanguage][xType];
			var sRet=oTrad.pre+x1+oTrad.mid+x2+oTrad.pos;
			return sRet;
		}; //makeSemStr
		var entitySemantics= function(oEntity,xType,xLanguage) {//shows entity/description semantics
		// return (case "A") --> <Client> is a <Individual or Company to whom we may send invoices>
		// ex: if(this.oDbg.isDbg("main")) this.oDbg.display("Semantics 1)->"+dDictionary.entitySemantics(oEntity,"A","En"));
		// ex: if(this.oDbg.isDbg("main")) this.oDbg.display("Semantics 2)->"+dDictionary.entitySemantics(oEntity,"B","En"));
		//     A set with more than one <Client> is called a set of <clients>
			var xRet=null;
			if(xType=="A"){
				xRet = makeSemStr(oEntity.singular,oEntity.description,"A","En");
			}else if(xType=="B"){
				xRet = makeSemStr(oEntity.singular,oEntity.plural,"B","En");
			}else{
				alert("dDictionary.entitySemantics Parameter xType="+xType+" is unsupported !!!");
				//Err.alert("dDictionary.entitySemantics",(new Error),"Parameter xType="+xType+" is unsupported !!!");
			}
			return xRet;
		}; //entitySemantics
		var attributeSemantics= function(xAttribute,xAttrDescription,oEntity,xLanguage) {//shows singular-description for attribute=xAttribute
		// ex: The <address> of <Client> is <the address to send invoices>
		//  dDictionary.attributeSemantics(oEntity.attributes[i].name,oEntity.attributes[i].description,oEntity,"En");
			var trad={ //entity+A+description, B.pre+singular+B.mid+plural+B.pos
				"En":{pre:"The ",mid1:" of ",mid2:" is ",pos:""},
				"Fr":{pre:"Le ",mid1:" du ",mid2:" c'est ",pos:""},
				"Nl":{pre:"Het ",mid1:" van de ",mid2:" is het ",pos:""},
				"Pt":{pre:"",mid1:" do ",mid2:" é ",pos:""}
			};
			var oLanguage=trad[xLanguage];//extracts language code
			return oLanguage.pre+xAttribute+oLanguage.mid1+oEntity.singular+oLanguage.mid2+xAttrDescription+oLanguage.pos;
		};//attributeSemantics
		var reversePhrase_is_something = function(sVerb){
		//		book "is published by" an editor--> editor "publishes" many books
			var xArr=sVerb.split(" ");
			var xLen=xArr[1].length;//length of second word (supposedly a verb)
			var xLast=xArr[1].substr(xLen-2,2);//last 2 chars (ed)
			// if(xLast=="ed")
				var xRet=xArr[1].substr(0,xLen-2)+"es";//publishes							
			return xRet;
		};
		var invertedToOneVerb = function(sVerb,xLanguage){//returns verb of inverted relation of sVerb
		// this method computes the passive voice for the verb in "To One" sentences (3rd person)
		//		Invoice Line  "has" one product --> product "is referred by" many Incoice Lines
		//		Invoice "invoices" one client	--> client "is invoiced by" many invoices
		//		reserve "is done by" one member	--> member "does " many reserves
		//		book "has" genre                --> genre "is referred by" many books (or classifies) 
		//		book "is published by" an editor--> editor "publishes" many books
		//		editor "publishes" one title   --> title  "is published by" many editors
		//		trip "visits" one destination   --> destination "is visited by" many trips
		//
		//		salesRep "is responsable by complaints of " many clients --> client "complaints to" one salesRep
		//
		//   sVerb - verb in the direct "To One" relation (left side examples)
		//   RETURN: inverted relation verb (rigth side examples)
		//     Example: "visits" becomes "is visited by"
		//           the inverse relation becomes-> destination is visited by zero or many trips
		// Tests
		// xPre="reserve";xIn="is done by";xPos="member";
		// var xOut=dDictionary.invertedToOneVerb(xIn,"En");
		// console.log(xPre+" "+xIn+" one "+xPos+" ->"+xPos+" "+xOut+" many "+dDictionary.plural(xPre,"En"));
			var DirDefault = {"En":{"default":"is referred by","has":"is referred by","is done by":"does"},
								"Fr":{"default":"appartient a","a":"appartient a"},
								"Pt":{"default":"pertence a","tem":"pertence a"},
								"Nl":{"default":"wordt verwezen","heeft":"wordt verwezen"}
							};
			//var InvDefault ={ "En":{"referres":"is referred by"},"Fr":{"a":"appartiennent"},"Pt":{"tem":"pertence a"},"Nl":{"heeft":"wordt verwezen"};
			var oObj = DirDefault[xLanguage];
			var xRet = null;
			if(oObj){
				for (var key in oObj) {
					if (oObj.hasOwnProperty(key)) {
						if(key==sVerb)
							xRet=oObj[key];
					}
				}
			}
			if(xRet)
				return xRet;
			var xLen=sVerb.length;
			var xArr=sVerb.split(" ");
			var xLast = null;
			var xLast2 = null;
			switch(xLanguage){
				case "En":
					if(xArr.length>1){//more than one word
						if(xArr.length>3){
							if(xArr[1] == "responsable" && xArr[2] == "by" ){//"it begins by is responsable by" Ex:"is responsable by complaints"
								xRet=xArr[3]+" to";//returns "complaints to"
							}else{
								xRet=reversePhrase_is_something(sVerb);
							}		
						}else if(xArr[0]=="is"){ //"is published by" ->publishes <> "is managed by" ->manages
							xRet=reversePhrase_is_something(sVerb);
						}
					}else if(xArr.length==1){ //one single word -> "publishes" ->"is published by", "visits"->"is visited by" 
						xLen=xArr[0].length;
						xLast=xArr[0].substr(xLen-1,1);//last 1 chars (s)
						xLast2=xArr[0].substr(xLen-2,2);//last 2 chars (s)
						if(xLast2=="es"){//"publishes" ->"is published by"
							xRet="is "+xArr[0].substr(0,xLen-2)+"ed by";
						}else if(xLast=="s"){//"visits"->"is visited by" 
							xRet="is "+xArr[0].substr(0,xLen-1)+"ed by";
						}
					}
					break;
				case "Pt":
					if(xArr.length>1){//more than one word
						if(xArr[0]=="é"){ //"é publicado por " ->publica
							xLen=xArr[1].length;
							var xLast3=xArr[1].substr(xLen-3,3);//last 2 chars (ed)
							if(xLast3=="ado")
								xRet=xArr[1].substr(0,xLen-3)+"a";
						}
					}else if(xArr.length==1){ //one single word -> "publica" ->"é publicado por", "visita"->"é visitado por" 
						xLen=xArr[0].length;
						xLast=xArr[0].substr(xLen-1,1);//last 1 chars (s)
						xLast2=xArr[0].substr(xLen-2,2);//last 2 chars (s)
						if(xLast2=="xx"){//"to be done"
							xRet="is "+xArr[0].substr(0,xLen-2)+"ed by";
						}else if(xLast=="a"){//"visita"->"is visited by"
							xRet="é "+xArr[0]+"do por";
						}
					}
					break;
				}//end switch
			if(!xRet)
				xRet=oObj["default"];
			return xRet;
		}; //invertedToOneVerb			
		var cardinalityDecoder=function(sCardinality,xLanguage){//returns semantics to Cardinality - object {cardText:<string or null>,cardPlural:<boolean>}
			//returns and object with {cardText:<string or null>,cardPlural:<boolean>}
			//   cardText contains the expression corresponding to the code=sCardinality in the language=xLanguage
			//		 if cardinality does not exist - cardText will be null - working as a validator
			//   cardPlural - contains a boolean such as:
			//		 if cardinality implies a second member singular in relation semantics - cardPlural will be false
			//		 if cardinality implies a second member plural in relation semantics - cardPlural will be true
			//		  ex:in expression - "Invoice Item" "belongs to" "one and only one" "Invoice" ->second member is singular
			//		    :in expression - "Client" "has" "many" "Invoices"						  ->second member is plural
			var trad={ //entity+A+description, B.pre+singular+B.mid+plural+B.pos
				"En":{"1":{text:"zero or 1",cardPlural:false},"N":{text:"many",cardPlural:true},"1":{text:"one and only one",cardPlural:false}},
				"Fr":{"1":{text:"zero ou 1",cardPlural:false},"N":{text:"plusieurs",cardPlural:true},"1":{text:"un et seulement un",cardPlural:false}},
				"Nl":{"1":{text:"nul of 1",cardPlural:false},"N":{text:"velen",cardPlural:true},"1":{text:"slechts één",cardPlural:false}},
				"Pt":{"1":{text:"zero ou 1",cardPlural:false},"N":{text:"varios",cardPlural:true},"1":{text:"um e apenas um",cardPlural:false}},
			};
			var oLanguage=trad[xLanguage];//extracts language code
			xCardText=null;
			xCardPlural=false;
			if(oLanguage){//the quest is for a known language
				var xDecoder=oLanguage[sCardinality];
				if(xDecoder){
					xCardText=xDecoder.text;
					xCardPlural=xDecoder.cardPlural;
				}
			}
			return {cardText:xCardText,cardPlural:xCardPlural};//if cardiality does not exist cardText will return null
		};//cardinalityDecoder		
		var relationSemantics= function(sSingular,sRightEntity,sVerb,sCardinality,xLanguage) {//shows relationsemantics
		// ex for : sSingular="Client",sRightEntity="Invoice",sVerb="has",sCardinality="0_N",xLanguage="En"
		// 	  returns : "Client has many invoices"
		//  dDictionary.attributeSemantics(oEntity.attributes[i].name,oEntity.attributes[i].description,oEntity,"En");
			var xRet=sSingular+" "+sVerb+" ";
			var oCard=cardinalityDecoder(sCardinality,xLanguage);
			if(!oCard.cardText){
				alert("relationSemantics - Impossible to find semantics for cardinality="+sCardinality+" Language="+xLanguage);
				//Err.alert("dDictionary.relationSemantics",(new Error),"Impossible to find semantics for cardinality="+sCardinality+" Language="+xLanguage);
			}
			xRet+=oCard.cardText+" ";
			var xRight=sRightEntity;//this will be the singular for thew right entity
			if(oCard.cardPlural){
				xRight=FL.dd.entities[sRightEntity].plural;
				if(!xRight){
					alert("relationSemantics - RightEntity="+sRightEntity+" does not exist in Data Dictionay");
					//Err.alert("dDictionary.relationSemantics",(new Error),"RightEntity="+sRightEntity+" does not exist in Data Dictionay");
				}
			}
			return xRet+xRight;
		}; //relationSemantics			
		var attributeIndex= function(xSingular,xAttribute) {//for entity=xSingular, returns the index of attribute=xAttribute
			// if attribute exists within xSingular returns it. Returns -1 otherwise
			// console.log("dd.attributeIndex ->check index for "+xAttribute);
			var xRet = -1;
			var oEntity = FL.dd.entities[xSingular];
			if(oEntity){
				var xArr = oEntity.attributes;
				if(xArr.length>0){
					// console.log("-------------- dd.attributeIndex  existing attribute names ------------BEGIN");
					for (var i=0;i<xArr.length;i++){
						// console.log(xArr[i].name);
						if (xArr[i].name==xAttribute) {
							xRet=i;
						}
					}
					// console.log("-------------- dd.attributeIndex  existing attribute names ------------END");
				}else{
					console.log("FL.dd.attributeIndex ->no attributes defined !");
				}
				// console.log("dd.attributeIndex ->for attribute="+xAttribute+" returns position="+xRet);
			}
			return xRet;
		};//attributeIndex
		var prepareRelation = function(xSingular,rCN,withEntityName,verb,cardinality,side,storedHere,xLanguage){//prepare JSON to relation arr - used by FL.dd.addRelation()
			var relation = {};
			relation["rCN"] = rCN;
			relation["withEntity"] = withEntityName;
			relation["verb"] = verb;
			relation["cardinality"] = cardinality;
			if(!side)
				side = null;
			if(!storedHere)
				storedHere = null;
			relation["side"] = side;
			relation["storedHere"] = storedHere;
			// var rightEntityName = 
			var xSemantics=FL.dd.relationSemantics(xSingular,withEntityName,verb,cardinality,xLanguage);

			relation["semantic"] = xSemantics;

			relation["side"] = side;
			relation["storedHere"] = storedHere;
			relation["withEntityCN"] = null;//this is an auxiliary field to support FL.server.syncLocalDictionary()
			return relation;
		};
		return{
			entities: {__Last:9999,__LastRelation:0},
			test:"FL.dd.test return !!!",
			preArticle: function(sWord,xLanguage) {//for language xLanguage extract the article to be used before sWord
				//Ex z="What is "+dDictionary.preArticle(xEntity,"En")+"?";
				return preArticle(sWord,xLanguage);
			},
			plural: function(sWord,xLanguage) {//returns the plural of sWord in language=xLanguage				
				return plural(sWord,xLanguage);
			},
			clear: function(){
				this.entities = {__Last:9999,__LastRelation:0};
			},
			relationSemantics: function(sSingular,sRightEntity,sVerb,sCardinality,xLanguage) {
				return relationSemantics(sSingular,sRightEntity,sVerb,sCardinality,xLanguage);
			},
			displayEntities: function(){//display all entities with their attributes and relations
				//Reads dDictionary.entities={} and 
				//returns a collection of menu structure objects - {book:{},editor:{},..someEntity:{}}
				//the key of the internal objects are the singular entity name
				//   each internal object has: 
				//		key:{singular:<key>,plural:<entity plural>,description:<entity description>}	
				//based on  var oEntity=dDictionary.createEntity("Client","clients","Individual or Company to whom we may send invoices");
				//each attribute (i) is in dDictionary.entities[<sEentity>].attributes[i]
				//     with the format 
				//		{name:"address",description:"address to send invoices",label:"Address",type:"string",enumerable:null,key:false});
				//			NOTE: enumerable is null for all type except "enumerable" - in this case enumerable is an array of strings
				// 
				console.log("********************************** FL.dd.displayEntities ********************************");
				console.log("********************************************** BEGIN ******************************************");

				var oEntities = this.entities;
				for (var key in oEntities) {
					if (oEntities.hasOwnProperty(key)) {//this restrain the iteration only to the object's own attributes
						if(key=="__Last"){

							console.log("(__Last) -> Number of entities in dictionary="+ (oEntities[key]-9999) );
						}else if(key=="__LastRelation"){
							console.log("(__LastRelation) -> Number of relations in dictionary="+oEntities[key]);
						}else{
							console.log("Entity="+oEntities[key].singular+"/"+oEntities[key].csingular +" - Plural="+oEntities[key].plural+"- description="+oEntities[key].description + " sync="+oEntities[key].sync );
							//now we display each attribute
							var oL2C = oEntities[key].L2C;
							var xArr = oEntities[key].attributes;
							if(xArr.length>0){//the entity has attribute(s)
								for (var i=0;i<xArr.length;i++){
									var xName=xArr[i].name;
									var xCName=oL2C[xName];
									var xDescr=xArr[i].description;
									var xLabel=xArr[i].label;
									var xType=xArr[i].type;
									var xTypeUI=xArr[i].typeUI;
									var xKey=xArr[i].key;
									var xEnumerable=xArr[i].enumerable;
									// console.log("-----> attribute["+i+"]="+xName+"/"+xDescr+"/"+xCName+",key="+xKey+",type="+xType);
									console.log("-----> attribute["+i+"]="+xName+"/"+xDescr+"/"+xCName+",label="+xLabel+",key="+xKey+",type="+xType+",typeUI="+xTypeUI);
									if(xEnumerable) {
										for (var j=0;j<xEnumerable.length;j++){
											console.log("------------> enumerable["+j+"]="+xEnumerable[j]);
										}
									}
								}
							}else{
								console.log("----->no attributes defined !");
							}
							xArr=oEntities[key].relations;
							if(xArr.length>0){//the entity has attribute(s)
								for (var i=0;i<xArr.length;i++){
									// var xCIdRelation=xArr[i].cIdRelation;
									var xSemantic=xArr[i].semantic;
									// var xCard=xArr[i].cardinality;
									var rCN = xArr[i].rCN;
									var withEntity = xArr[i].withEntity;
									var verb = xArr[i].verb;
									var rCN = xArr[i].rCN;
									var cardinality = xArr[i].cardinality;
									var side = xArr[i].side;
									var storeHere = xArr[i].storeHere;

									console.log("-----> relation["+i+"] with rCN="+rCN+" -> "+xSemantic+" - #="+cardinality);
								}
							}else{
								console.log("----->no relations defined !");
							}
						}
					}
				}
				console.log("********************************************** END of displayEntities *****************************************");
			},
			countEntitiesBeginningBy: function(singularPrefix) {//return the number of entities whose singular name begins by singularPrefix
				//example   var count = FL.dd.countsEntitiesBeginningBy("_unNamed");=>count = 0
				var xRet = 0;
				var lenOfEntityPrefix = singularPrefix.length;
				var entities = this.entities;
				_.each(entities, function(value,key){// If list is a JavaScript object, iterator's arguments will be (value, key, list)
					if(key.substring(0,lenOfEntityPrefix) == singularPrefix) {
						xRet++;
					}
				});
				return xRet;
			},
			nextEntityBeginningBy: function(singularPrefix) {//proposes a name 
				//example   var nextUnNamed = FL.dd.nextEntityBeginningBy("unNamed");
				//   if there is no entity  begginning by unNamed --> returns "unNamed"
				//   if there is "unNamed"  --> returns "unNamed1"
				//   if there is "unNamed1"  --> returns "unNamed2"
				var nextEntityName = singularPrefix;
				var count = this.countEntitiesBeginningBy(singularPrefix);
				if(count>0){
					nextEntityName = singularPrefix + count;
				}
				return nextEntityName;
			},
			createEntity: function(xSingular,xDescription) {//add an entity entry returning true if it succeeds false otherwise
				//   Whenever a new entity is created a key attribute is also created with:
				//		dDictionary.addAttribute(xSingular,"id",xSingular+"'s id","textBox",true);
				//      Note:The key attribute is glued to the entity - (it may be editable, but not deleted)
				//			if the entity exists the key attribute also exist
				//			it only can be removed if we remove the entity
				//   
				//ex. var oEntity=dDictionary.createEntity("Client","Individual or Company to whom we may send invoices");
				// NOTE: entity is created only client side => sync = false 
				// NOTE:plural is calculated by dDictionary.plural(xSingular,"En");
				// returns true if succeded false if it fails
				//alert("dDictionary.createEntity xSingular="+xSingular);
				// console.log("BEGIN ############################ FL.dd.createEntity ##############################");
				var oEntity=null;
				var xPlural = null;
				var xRet = false;
				if(!this.entities[xSingular]){//xSingular does not exist in dictionary
					// console.log("FL.dd.createEntity ----------------->"+xSingular+" new!!!");
					var xNext = this.entities["__Last"]+1;
					this.entities["__Last"] = xNext;
					var xCSingular = getCompressed(xNext);
					xPlural = plural(xSingular,"En");  //+"s";
					oEntity = {singular:xSingular,csingular:xCSingular,plural:xPlural,description:xDescription,sync:false,lastId:0,L2C:{},C2L:{},attributes:[],relations:[]};
					this.entities[xSingular] = oEntity;
					this.addAttribute(xSingular,"id",xSingular+"'s id","id","string");//we need to set key=true !!!
					this.entities[xSingular].attributes[0].key=true;
					xRet = true;
				}else{//xSingular already exists in dictionary
					// alert("FL.dd.createEntity Error: you tried create entity "+xSingular+" but it already exists");
				}
				return xRet;
			},
			updateEntityBySingular: function(xSingular,xOptions) {//updates an existing entity 
				//Ex: updateEntityBySingular("client",{plural:"clients",description:"company that buys from us"});
				var oEntity=null;
				var oEntityUpdate = null;
				var xRet = false;
				if(this.entities[xSingular]){//xSingular exists in dictionary
					oEntity = this.entities[xSingular];
					oEntityUpdate = _.extend(oEntity, xOptions); 
					this.entities[xSingular] = oEntityUpdate;
					oEntity.sync = false;
					xRet = true;
				}else{//xSingular does not exists in dictionary
					alert("FL.dd.updateEntityBySingular Error: you tried update "+xSingular+" but it does not exists in Dictionary");
				}
				return xRet;
			},
			updateEntityByCName: function(xCName,xOptions) {//updates entity with compressed name = xCName with xOptions object
				//Ex: updateEntityByCName("02",false,{plural:"clients",description:"company that buys from us"});
				//Note - that xCName may not exist because sync has changed to true- temporary compresede number was changed !
				var xRet = false;
				var oEntityUpdate = null;
				var oldSingular = null;
				var arrOfRightSide = _.values(this.entities);//an array of JSONs
				var oEntity = _.find(arrOfRightSide, function(element) {return element.csingular == xCName;});
				if(oEntity){
					oldSingular = oEntity.singular;
					oEntityUpdate = _.extend(oEntity, xOptions);
					delete this.entities[oldSingular];
					var newSingular =  oEntityUpdate.singular;
					this.entities[newSingular] = oEntityUpdate;
					this.entities[newSingular].sync = false;
					xRet = true;
				}else{//xCName does not exists in dictionary
					alert("FL.dd.updateEntityByCName Error: you tried to update an entity with compressedName="+xCName+" but it does not exists in local Dictionary");
				}
				return xRet;
			},
			getCEntity: function(xEntity) {//returns the compressed name of a logical name xEntity - if does not exist =>returns null
				//returns the compressed name of the logical name xEntity. The method is a NOP if xEntity is null;
				var xCEntity=null;
				if(xEntity){
					var oEntities = this.entities;
					if(oEntities[xEntity])
						xCEntity=oEntities[xEntity].csingular;
				}
				return xCEntity;
			},
			getEntityByCName: function(eCN) {//returns the  logical name for compressed name = eCN. If not found returns null
				//finds the first all keys of this.entities will be searched looking for key.csingular = eCN 
				var entityName = null;
				var valuesArr = _.values(this.entities);
				//note for _.find: if valuesArr is and array of objects =>element is the value of each key/value and returns value
				var oEntity = _.find(valuesArr, function(element){//element is each array element. If is an object it returns the value
					if(typeof element == "number")
						return false;//necessary to skip __Last:<number> and __LastRelation:<number>
					return element.csingular == eCN;
				});
				if (oEntity) 
					entityName = oEntity.singular;
				return entityName;
			},
			addAttribute: function(xSingular,xAttribute,xDescription,xLabel,xType,xTypeUI,arrEnumerable) {//adds AttributeName,Description, label Type and enumerable to entity = xSingular			
			// addAttribute: function(xSingular,xAttribute,xDescription,xLabel,xType,arrEnumerable) {//adds AttributeName,Description, label Type and enumerable to entity = xSingular
				// xSingular - Entity name (singular) to add attribute
				// xAttribute - attribute name (Nico's "3")
				// xDescription - attribute description (Nico's "4")
				// xLabel - attribute label (Nico's "K")
				// xType - attribute data type (Nico's "M") - possible datatypes:string, integer, number, boolean, date, or json 
				// xTypeUI - widget to use for UI (Nico's "9") - possible datatypes:textbox, numberbox, textarea, checkbox, datetextbox, combobox, picture 
				// arrEnumerable -  an array of enumerables or null  (Nico's "N")
				// key - optional default = false - it is only true for standard attribute "id"
				
				// if Type != "enumerable" => ArrEnumerable will be forced to null.		
				

				// if xAttribute already exists it is updated with xDescription, xLabel, xType, xTypeUI, arrEnumerable (xKey will not be changed)
				// if xAttribute does not exist it is created with xDescription, xType and xKey forced to false
				// if xTypeUI is different from "combobox" arrEnumerable is forced to false
				//		
				// NOTE on xKey - the only attribute that has xKey=true is always created or removed when the entity is created or removed
				//    To update the name and description of the key attribute of a just created attribute:
				//		dDictionary.createEntity("Client","clients","Individual or Company to whom we may send invoices");//singular, plural, description
				//		dDictionary.renameAttribute("Client","id","name");//renaming the key attribute
				//		dDictionary.addAttribute("Client","name","client's id","Name","string","textbox",null);
				//		
				//		If we are updating a key attribute we force the type to "number" independently of the xType parameter
				//	
				// NOTE: type is mandatory and must be one of: string, integer, number, Boolean, date, or json (this will be Nico's "M") 
				//oEntity={singular:"Client",plural:"clients",description:"Company to send invoices",lastId:0,L2C:{},C2L:{},attributes:[]};
				//checks if attribute already exists. If it exists updates, otherwise create it !!!
				//console.clear();
				var oEntity = this.entities[xSingular];
				if(oEntity){
					var xIndex = attributeIndex(xSingular,xAttribute);
					if(xIndex<0){//if it does not exists creates it
						var nId = oEntity.lastId++;
						var sComp = getCompressed(nId++);
						//({name:"address",description:"address to send invoices",label:"Address",type:"string",enumerable:null,key:false});
						if( (xType != "string") && (xTypeUI != "combobox"))
							arrEnumerable = null;
						oEntity.attributes.push({name:xAttribute,description:xDescription,label:xLabel,type:xType,typeUI:xTypeUI,enumerable:arrEnumerable,key:false});
						oEntity.L2C[xAttribute] = sComp;//Logical to Compressed
						oEntity.C2L[sComp] = xAttribute;//Compressed to Logical
						// oEntity.lastId = nId;
					}else{//updates the existing attribute - if xKey is true (it will continue to be true)
						oEntity.attributes[xIndex].description = xDescription;
						oEntity.attributes[xIndex].label = xLabel;
						if(oEntity.attributes[xIndex].key)//if we are updating a key attribute we force the type to "number"
							xType="number";
						oEntity.attributes[xIndex].type = xType;
						oEntity.attributes[xIndex].typeUI = xTypeUI;
						if( (xType != "string") && (xTypeUI != "combobox"))
							arrEnumerable = null;
						oEntity.attributes[xIndex].enumerable = arrEnumerable;

						//oEntity.attributes[xIndex].key=xKey;
					}
					oEntity.sync = false;
					//dDictionary.save(xSingular,oEntity);
				}else{
					alert("FL.dd.addAttribute Error: you tried to add attribute "+xAttribute+" to a non existing entity "+xSingular);
					//Err.alert("dDictionary.addAttribute",(new Error)," you tried to add attribute "+xAttribute+" to a non existing entity "+xSingular);
				}
			},
			addRelation: function(xSingular,withEntityName,verb,cardinality,side,storedHere,xLanguage) {//adds a new relation to the array of relations of entity xSingular
				//xLanguage --> En, Fr, Nl, Pt
				//NOTE: the rCN relation compressed name is retirned by the server when we try to create the relation.
				//      In order to follow the approach -->"first we create in local dictionary the we synchronize to the server" we begin by generating
				//		an unique compressed name in the client that will be updated when we save the relation in the server. The unique relation compressed
				//		name is generated from entities.__LastRelation 
				//ex:FL.dd.addRelation(entities[i].d["3"],rCN,withEntityName,verb,cardinality,side,storedHere);
				//	{idRelation:3,cIdRelation:"03",rightEntity:"Invoice",description:"has",cardinality:"0_1",semantic:"Client has many Invoices",delChildren:false}
				//dDictionary.addRelation= function(xSingular,sRightEntity,sDescription,sCardinality,bDelChildren,xLanguage) {//adds/updates a relation to the Data Dictionary


				//     In real live we could have: 
				//					"invoice" "has" "one and only one" "client" - a first relation between invoice and client
				//					"invoice" "products must be delivered to" "one and only one" "client" - a second relation between invoice and client
				// alert("step1");
				var oEntity = this.entities[xSingular];
				var oToEntity = this.entities[withEntityName];
				if(oEntity){
					if(oToEntity){
						// checks if rCN already exists - if it exists it does not add
						if (FL.dd.isRelation(xSingular,rCN)){
							alert("FL.dd.addRelation Error: you tried to add a relation with a compressed name "+rCN+" that already exists !");
						}else{
							// var xNextRelation=dDictionary.entities["__LastRelation"]+1; ???????????
							// dDictionary.entities["__LastRelation"]=xNextRelation; ???????????????
							var xNext = this.entities["__LastRelation"]+1;
							this.entities["__LastRelation"] = xNext;
							var rCN = getCompressed(xNext);

							var side2 = 1;//we assume (0 - 1) if not we set  (1 - 0)
							if(side == 1)//Side, either 0 or 1. Mandatory
								side2 = 0;
							var storedHere2 = false;//we assume (true - false) if not we set (false - true)
							if(!storedHere)//storedHere. Where to store the relation. Should be true to at least one side. 
								storeHere2 = true;

							var relation = prepareRelation(xSingular,rCN,withEntityName,verb,cardinality,side,storedHere,xLanguage);
							oEntity.relations.push(relation);

							var verb2 = invertedToOneVerb(verb,xLanguage);
							var cardinality2 = "1";//Cardinality. Not used by the datalayer. Could be ‘1’ or ‘N’. Mandatory
							if(cardinality == "1")
								cardinality2 = "N";

							var relation2 = prepareRelation(withEntityName,rCN,xSingular,verb2,cardinality2,side2,storedHere2,xLanguage);
							oToEntity.relations.push(relation2);
							oToEntity.sync = false;
						}
					}else{
						alert("FL.dd.addRelation Error: you tried to add a relation between "+xSingular+" and a non existing entity "+withEntityName);
					}				
				}else{
					alert("FL.dd.addRelation Error: you tried to add a relation "+relationName+" to a non existing entity "+xSingular);
				}
			},
			relationPass2: function() {//goes thru all entities and for all relations of each entity fills withEntity and semantic using withEntityCN. Finally it sets sync = true for entity
				var valuesArr = _.values(this.entities);
				//note for _.find: if valuesArr is and array of objects =>element is the value of each key/value and returns value
				_.each(valuesArr, function(element){//element is each array element. If is an object it returns the value
					if(typeof element != "number"){
						// console.log("Pass2 -->"+element.singular);
						var xSingular = element.singular;
						_.each(element.relations, function(relation){//relation is a relation from the current entity
							relation["withEntity"] = FL.dd.getEntityByCName(relation["withEntityCN"]);
							relation["semantic"] = FL.dd.relationSemantics(xSingular,relation["withEntity"],relation["verb"],relation["cardinality"],"En");//sSingular,sRightEntity,sVerb,sCardinality,xLanguage
						});
						FL.dd.setSync(xSingular,true);
					}
				});
			},
			isRelation: function(xSingular,rCN) {//returns true if relation exists, false otherwise 
				var exists = false;
				var oEntity = this.entities[xSingular];
				if(oEntity){
					var arrPos = _.find(oEntity.relations, function(element){return element.rCN == rCN;});
					if (arrPos>=0)
						exists = true;
				}
				return exists;
			},
			getEntityBySingular: function(xSingular) {//returns an entity and its attributes
				var oEntity = this.entities[xSingular];
				return oEntity;
			},
			isEntityInLocalDictionary: function(entityName) {//returns true if entityName exists in local dictionary
				var exists = false;
				if(this.getEntityBySingular(entityName))//if getEntityBySingular is not null =>exists = true
					exists = true;
				return exists;
			},
			histoMailPeer: function(entityName){
				var eCN = this.getCEntity(entityName);
				return histoName = "_histoMail_" + eCN;
			},
			peerTypeFor: function(typeOfPeer,entityName){//for type histoMail and entity ecn=55 forms "_histomail_55"
				var eCN = this.getCEntity(entityName);
				return histoName = "_" + typeOfPeer + "_" + eCN;
			},			
			isHistoMailPeer: function(entityName) {//returns true if _histoMail_<ecn(entityName)> exists in local dictionary
				var exists = false;
				if(this.isEntityInLocalDictionary( this.histoMailPeer( entityName ) ) ){
					exists = true;
				}
				return exists;
			},			
			isEntityWithTypeUI: function(entityName,typeUI) {//returns true if entityName has an Email field 
				var exists = false;
				var oEntity = this.entities[entityName];
				if(oEntity){//searches for the first Email field
					var el = _.find(oEntity.attributes, function(element){
						return element.typeUI == typeUI;
					});
					if(el){
						return true;
					}else{
						return false;
					}
				}else{
					alert("FL.dd.isEntityWithTypeUI Error: "+entityName+" does not exist ! ");
					return false;
				}
			},
			isEntityInSync: function(entityName) {//returns true if entityName has in sync status = true
				var exists = false;
				var oEntity = this.entities[entityName];
				if(oEntity){
					return oEntity.sync;
				}else{
					alert("FL.dd.isEntityInSync Error: "+entityName+" does not exist ! ");
					return false;
				}
			},		
			setSync: function(xSingular,bStatus) {//set sync = true for entity= xSingular - nothing is done if entity does not exist
				var oEntity = this.entities[xSingular];
				if(oEntity){
					oEntity.sync = bStatus;
				}
			},
			setFieldTypeUI: function(xSingular,fieldName,newTypeUI) {//sets typeUI = newTypeUI for field = fieldName in entity xSingular
				var oEntity = this.entities[xSingular];
				if(oEntity){
					oEntity.sync = false;
					var el = _.find(oEntity.attributes, function(element){
						return element.name == fieldName;
					});
					if(el){
						el.typeUI = newTypeUI;
						return true;
					}else{
						alert("FL.dd.setFieldTypeUI Error: field " + fieldName + " does not exist in entity " + xSingular );
						return false;
					}
				}else{
					alert("FL.dd.setFieldTypeUI Error: "+xSingular+" does not exist ! ");
					return false;
				}
			},
			createHistoMailPeer: function(entityName){//create histoMail peer in local dict
				var fName = this.histoMailPeer(entityName);
				if(!this.isEntityInLocalDictionary(fName)){
					this.createEntity(fName,"histoMail peer for " + entityName);
					//		{name:"address",description:"address to send invoices",label:"Address",type:"string",typeUI:"textbox",enumerable:null,key:false});
					this.addAttribute(fName,"msg",fName + "'s msg","XXX","string","textbox",null);
					this.setSync(fName,false);
					return true;
				}else{
					alert("FL.dd.createHistoMailPeer Error: " + fName + ", the histomail peer for "+entityName+" exists already! ");
					return false;
				}
			},
			removeHistoMailPeer: function(entityName){//remove histoMail peer in local dict
				var fName = this.histoMailPeer(entityName);
				if(this.isEntityInLocalDictionary(fName)){
					this.removeEntity(fName);
				}else{
					alert("FL.dd.removeHistoMailPeer Error: " + fName + ", the histomail peer for "+entityName+" does not exist! ");
					return false;
				}
			},				
			setFieldCompressedName: function(xSingular,fieldName,fieldCN) {//for entity xSingular and attribute fieldName sets compressed name
				var oEntity = this.entities[xSingular];
				if(oEntity){
					oEntity.sync = false;
					var oldCFieldName = oEntity.L2C[fieldName];
					if(oldCFieldName){
						delete oEntity.C2L[oldCFieldName];
						oEntity.L2C[fieldName] = fieldCN;//Logical to Compressed
						oEntity.C2L[fieldCN] = fieldName;//Compressed to Logical					
					}				
				} 
			},
			getFieldCompressedName: function(xSingular,fieldName) {//for entity xSingular and attribute fieldName gets compressed name
				var oEntity = this.entities[xSingular];
				var fieldCN = null;
				if(oEntity){
					fieldCN = oEntity.L2C[fieldName];
				}
				return fieldCN;
			},
			getArrayOfFields: function(xSingular) {//for entity xSingular return an array of JSON 
				// The array has an object for each field with {attribute:xName, description:xDescription,statement:xStatement}
				// Ex: returning items (excepting id)
		        //  items = [
		        //         {attribute:"name", description:"official designation",statement:"the name of the client is the official designation"},
		        //         {attribute:"address", description:"place to send invoices",statement:"The address of the client is the place to send invoices"},
		        //         {attribute:"city", description:"headquarters place", statement:"The city of the client is the headquarters place"},
		        //         {attribute:"postal code", description:"postal reference for delivery",statement:"The postal code of the client is the postal reference for delivery"}
		        //  	];
				var oEntity = this.entities[xSingular];
				var xRetArr = [];
				var fieldCN = null;
				if(oEntity){
					_.each(oEntity.attributes, function(element, index){
						if(element.name != "id"){						
							var el = {};
							el["attribute"] = element.name;
							el["description"] = element.description;
							el["statement"] = attributeSemantics(element.name,element.description,oEntity,"En");
							xRetArr.push(el);
						}
					});
				}else{
					alert("FL.dd.getArrayOfFields Error: entity "+xSingular+" does not exit in FrameLink dictionary.");
				}
				return xRetArr;
			},
			createEntityAndFields: function(entityName,entityDescription,fieldDefinitionArray) {//creates a dd entity with a set of fields 
				//	fieldDefinitionArray - array of JSON (one element per field) with format definition
				// format for fieldDefinitionArray -->[{label:"xx",name:fieldName, description:xdescription, type:xtype,enumerable:xEnumerable},{col2}...{}]
				//     NOTE:fieldDefinitionArray may come from  csvStore.getAttributesArr() or csvStore.getAttributesArrNoId()
				// Returns: true if createEntityAndFields succeeds - false if entityName already exists.
				var xRet = false;
				if(FL.dd.createEntity(entityName, entityDescription)){//singular,description
					_.each(fieldDefinitionArray, function(element,index){
						FL.dd.addAttribute(entityName,element.name, element.description,element.label,element.type,element.typeUI,element.enumerable);
					});
					xRet = true;
				}else{
					// alert("FL.dd.createEntityAndFields createEntity() Error entity " + masterDetailItems.master.entityName + " already exists !");
					console.log("FL.dd.createEntityAndFields Error:trying to create existing entity " + entityName + " !!!");
				}
				return xRet;
			},
			relationsOf: function(xSingular) {//returns an array with all relations of xSingular
				//	format of each array element:
				//	{idRelation:3,cIdRelation:"03",rightEntity:"Invoice",description:"has",cardinality:"0_1",semantic:"Client has many Invoices"});
				//   one entity may have several relations with another entity !
				var xComboArr=[];
				// var oEntity=dDictionary.entities[xSingular];
				var oEntity = this.entities[xSingular];
				if(oEntity){
					var xArr=oEntity.relations;
					if(xArr.length>0){//entity has relations
						for (var i=0;i<xArr.length;i++){
							xComboArr.push(xArr[i]);
						}
					}
				}
				return xComboArr;
			},
			removeRelations: function(xSingular,sRightEntity) {//removes direct and reverse relations between the 2 entities
				//   removes relations sRightEntity from xSingular set of relations also removing
				// 		relations xSingular from sRightEntity set  of relations
				//   Notes:
				///  if xSingular or sRightEntity does not exists nothing is done
				//   this method assumes several relatiions between two entities
				//   if only one (direct or reverse) relation exist that relation will be removed
				
				var oDirectEntity = this.entities[xSingular];
				var oReverseEntity = this.entities[sRightEntity];

				if(oDirectEntity && oReverseEntity){
					oDirectEntity.sync = false;
					oReverseEntity.sync = false;
					// var xIndex=dDictionary.relationIndex(xSingular,sRightEntity);
					var directRelationsArr = oDirectEntity.relations;//all direct relations - we need to isolate those with sRightEntity
					var indexArr=[];
					_.each(directRelationsArr, function(element,index){
						if(element.rightEntity == sRightEntity)
							indexArr.push(index);
					});
					_.each(indexArr, function(element){
						oDirectEntity.relations.splice(element,1); //in position xIndex remove 1 item
					});						
					// xIndex=dDictionary.relationIndex(sRightEntity,xSingular);

					var reverseRelationsArr = oReverseEntity.relations;
					indexArr=[];
					_.each(reverseRelationsArr, function(element,index){
						if(element.rightEntity == xSingular)
							indexArr.push(index);
					});
					_.each(indexArr, function(element){
						oReverseEntity.relations.splice(element,1); //in position xIndex remove 1 item
					});
				}
			},
			removeEntity: function(xSingular) {//removes  entity xSingular in local dictionary
				//In order to remove an entity we begin by removing the relations of every direct relation of xSingular	and also the inverse relations
				//		that other entities ,may have with xSingular
				//	format of each array element:
				// 	{idRelation:3,cIdRelation:"03",rightEntity:"Invoice",description:"has",cardinality:"0_1",semantic:"Client has many Invoices"});
				// var oEntity=dDictionary.entities[xSingular];

				var oEntity = this.entities[xSingular];

				if(oEntity){//entity exists
					var xRelArr=FL.dd.relationsOf(xSingular);//xRelArr has all relations that xSingular has woth other entities
					for (var i=0;i<xRelArr.length;i++){
						//now deletes each relation (inverse and direct)
						xRightEntity=xRelArr[i].rightEntity;
						if(xRightEntity)
							FL.dd.removeRelations(xSingular,xRightEntity);//this removes direct and inverse relations
					};
					// delete dDictionary.entities[xSingular];//now that all relations are gone we can delete the entity
					delete this.entities[xSingular];//now that all relations are gone we can delete the entity
				}else{
					alert("dDictionary.removeEntity Error:Trying to remove a non existing entity:"+xSingular);
				}
			}
		};
	})();
// });