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
			//each attribute (i) is in dDictionary.entities[<sEentity>].arributes[i]
			//     with the format 
			//		{name:"address",description:"address to send invoices",label:"Address",type:"string",enumerable:null,key:false});
			//
			//			name -  is the human (logical) attribute name or field name
			//			description - description of attribute (answer to: "what the <name > of a <entity.singular> ?")
			//			label - defaul value that will appear in UI labeling the attribute
			//			type - one of: "string","string:email","string:url"... (others) ,"number","integer","boolean","date","weak" (a json object)
			//				NOTE: if type is "enumerable", the key enumerable must have an array of enumerables
			//			enumerable - an array of enumerables or null (if key type != "enumerable"
			//			typeUI -type of widget that is used with the field
			//				textbox, numberbox, textarea, checkbox, datetextbox, combobox, picture
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
		strReverse=function ( str ) {//reverse a string: ex: "abcd" becomes "dcba"
			var sOut="";
			var iLen=str.length;
			for (var ii=iLen-1; ii>=0; ii--) {
				sOut+= str.substr(ii,1);
			}
			return sOut;
		};
		preArticle = function(sWord,xLanguage) {//for language xLanguage extract the article to be used before sWord
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
		plural = function(sWord,xLanguage) {//returns the plural of sWord in language=xLanguage
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
		makeSemStr= function(x1,x2,xType,xLanguage) {//concatenate basic entity semantics
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
		entitySemantics= function(oEntity,xType,xLanguage) {//shows entity/description semantics
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
		attributeSemantics= function(xAttribute,xAttrDescription,oEntity,xLanguage) {//shows singular-description for attribute=xAttribute
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
		}; //attributeSemantics
		attributeIndex= function(xSingular,xAttribute) {//for entity=xSingular, returns the index of attribute=xAttribute
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
					console.log("dd.attributeIndex ->no attributes defined !");
				}
				// console.log("dd.attributeIndex ->for attribute="+xAttribute+" returns position="+xRet);
			}
			return xRet;
		};//attributeIndex			
		return{
			entities: {__Last:0,__LastRelation:0},
			test:"FL.dd.test return !!!",
			preArticle: function(sWord,xLanguage) {//for language xLanguage extract the article to be used before sWord
				//Ex z="What is "+dDictionary.preArticle(xEntity,"En")+"?";
				return preArticle(sWord,xLanguage);
			},
			plural: function(sWord,xLanguage) {//returns the plural of sWord in language=xLanguage				
				return plural(sWord,xLanguage);
			},
			clear: function(){
				this.entities = {__Last:0,__LastRelation:0};
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
							console.log("(__Last) -> Number of entities in dictionary="+oEntities[key]);
						}else if(key=="__LastRelation"){
							console.log("(__LastRelation) -> Number of relations in dictionary="+oEntities[key]);
						}else{
							console.log("Entity="+oEntities[key].singular+"/"+oEntities[key].csingular +" - Plural="+oEntities[key].plural+"- description="+oEntities[key].description + "sync="+oEntities[key].sync );
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
									var xKey=xArr[i].key;
									var xEnumerable=xArr[i].enumerable;
									// console.log("-----> attribute["+i+"]="+xName+"/"+xDescr+"/"+xCName+",key="+xKey+",type="+xType);
									console.log("-----> attribute["+i+"]="+xName+"/"+xDescr+"/"+xCName+",label="+xLabel+",key="+xKey+",type="+xType);
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
									var xCIdRelation=xArr[i].cIdRelation;
									var xSemantic=xArr[i].semantic;
									var xCard=xArr[i].cardinality;
									console.log("-----> relation["+i+"] with compressedId="+xCIdRelation+" -> "+xSemantic+" - #="+xCard);
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
				//example   var nextUnNamed = FL.dd.nextEntityBeginningBy("_unNamed");
				//   if there is no entity  begginning by _unNamed --> returns "_unNamed"
				//   if there is "_unNamed"  --> returns "_unNamed1"
				//   if there is "_unNamed1"  --> returns "_unNamed2"
				var nextEntityName = singularPrefix;
				var count = this.countEntitiesBeginningBy(singularPrefix);
				if(count>0){
					nextEntityName = singularPrefix + count;
				}
				return nextEntityName;
			},
			createEntity: function(xSingular,xDescription) {//add an entity entry 
				//   Whenever a new entity is created a key attribute is also created with:
				//		dDictionary.addAttribute(xSingular,"id",xSingular+"'s id","textBox",true);
				//      Note:The key attribute is glued to the entity - (it may be editable, but not deleted)
				//			if the entity exists the key attribute also exist
				//			it only can be removed if we remove the entity
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
					console.log("FL.dd.createEntity ----------------->"+xSingular+" new!!!");
					var xNext = this.entities["__Last"]+1;
					this.entities["__Last"] = xNext;
					var xCSingular = getCompressed(xNext);
					xPlural = plural(xSingular,"En");  //+"s";
					oEntity = {singular:xSingular,csingular:xCSingular,plural:xPlural,description:xDescription,sync:false,lastId:0,L2C:{},C2L:{},attributes:[],relations:[]};
					this.entities[xSingular] = oEntity;
					this.addAttribute(xSingular,"id",xSingular+"'s id","id","textBox");//we need to set key=true !!!
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
					xRet = true;
				}else{//xSingular does not exists in dictionary
					alert("FL.dd.updateEntityBySingular Error: you tried update "+xSingular+" but it does not exists in Dictionary");
				}
				return xRet;
			},
			updateEntityByCName: function(xCName,xOptions) {//updates xSingular,xPlural,xDescription
				//Ex: updateEntityByCName("02",false,{plural:"clients",description:"company that buys from us"});
				//Note - that xCName may not exist because sync has changed to true- temporary compresede number was changed !
				var xRet = false;
				var oEntityUpdate = null;
				var xSingular = null;
				var arrOfRightSide = _.values(this.entities);//an array of JSONs
				var oEntity = _.find(arrOfRightSide, function(element) {return element.csingular == xCName;});
				if(oEntity){
					xSingular = oEntity.singular;
					oEntityUpdate = _.extend(oEntity, xOptions);
					this.entities[xSingular] = oEntityUpdate;
					xRet = true;
				}else{//xCName does not exists in dictionary
					alert("FL.dd.updateEntityByCName Error: you tried update compressedName="+xCName+" but it does not exists in Dictionary");
				}
				return xRet;
			},
			NicoCreateEntity: function(xSingular,xDescription) {//add or updates an entity entry 
				//This may create a new entity (if xSingular does not exist) or update an existing entity /if xSingular exists).
				//   Whenever a new entity is created a key attribute is also created with:
				//		dDictionary.addAttribute(xSingular,"id",xSingular+"'s id","textBox",true);
				//      Note:The key attribute is glued to the entity - (it may be editable, but not deleted)
				//			if the entity exists the key attribute also exist
				//			it only can be removed if we remove the entity
				//ex. var oEntity=dDictionary.createEntity("Client","Individual or Company to whom we may send invoices");
				//checks if entity already exists - creates if entity does not exist
				// NOTE:plural is calculated by dDictionary.plural(xSingular,"En");
				//alert("dDictionary.createEntity xSingular="+xSingular);

				// console.log("BEGIN ############################ FL.dd.createEntity ##############################");
				var oEntity=null;
				var xPlural = null;
				var eCN = null;
				if(!entities[xSingular]){//xSingular does not exist in dictionary
					console.log("FL.dd.createEntity ----------------->"+xSingular+" new!!!");			
					// var xNext = entities["__Last"]+1;
					// entities["__Last"] = xNext;
					// var xCSingular = getCompressed(xNext);

					xPlural = plural(xSingular,"En");  //+"s";
					var fEntity = new FL.login.fl.entity();//var fEntity = new fl.entity();

					fEntity.add({"3": xSingular, "4": xDescription, 'E': xPlural}, function (err, data){
						if(err){
							alert("createEntity Error: "+JSON.stringify(err));
							return;
						}
						eCN=data[0]['_id'];
						oEntity = {singular:xSingular,csingular:eCN,plural:xPlural,description:xDescription,lastId:0,L2C:{},C2L:{},attributes:[],relations:[]};
						entities[xSingular] = oEntity;
						this.addAttribute(xSingular,"id",xSingular+"'s id","id","textBox");//we need to set key=true !!!
						entities[xSingular].attributes[0].key=true;
					});
				}else{//xSingular already exists in dictionary
					alert("FL.dd.createEntity "+xSingular+" already exists !!! TO BE DONE");
					console.log("FL.dd.createEntity "+xSingular+" already exists !!!");
					oEntity = entities[xSingular];
					xPlural = oEntity.plural;
					this.updateEntity(xSingular,xPlural,xDescription);
				}
				// console.log("dd.createEntity end1----------------->"+entitySemantics(oEntity,"A","En"));
				// console.log("dd.createEntity end2----------------->"+entitySemantics(oEntity,"B","En"));
				// console.log("END ############################ dd.createEntity ##############################");
			},
			getCEntity: function(xEntity) {//returns the compressed name of a logical name xEntity
				//returns the compressed name of the logical name xEntity. The method is a NOP if xEntity is null;
				var xCEntity=null;
				if(xEntity){
					var oEntities = this.entities;
					if(oEntities[xEntity])
						xCEntity=oEntities[xEntity].csingular;
				}
				return xCEntity;
			},
			addAttribute: function(xSingular,xAttribute,xDescription,xLabel,xType,arrEnumerable) {//adds AttributeName,Description, label Type and enumerable to entity = xSingular
				// if Type != "enumerable" => ArrEnumerable will be forced to null.
				// if xAttribute already exists it is updated with xDescription, xType (xKey will not be changed)
				// if xAttribute does not exist it is created with xDescription, xType and xKey forced to false
				//		
				// NOTE on xKey - the only attribute that has xKey=true is always created or removed when the entity is created or removed
				//    To update the name and description of the key attribute of a just created attribute:
				//		dDictionary.createEntity("Client","clients","Individual or Company to whom we may send invoices");//singular, plural, description
				//		dDictionary.renameAttribute("Client","id","name");//renaming the key attribute
				//		dDictionary.addAttribute("Client","name","client's id","Name",string",null);//xEntity,xAttribute,xDescription,xType,xKey
				//		
				//		If we are updating a key attribute we force the type to "number" independently of the xType parameter
				//	
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
						if(xType !="enumerable")
							arrEnumerable = null;
						oEntity.attributes.push({name:xAttribute,description:xDescription,label:xLabel,type:xType,enumerable:arrEnumerable,key:false});
						oEntity.L2C[xAttribute] = sComp;//Logical to Compressed
						oEntity.C2L[sComp] = xAttribute;//Compressed to Logical
						oEntity.lastId = nId;
					}else{//updates the existing attribute - if xKey is true (it will continue to be true)
						oEntity.attributes[xIndex].description = xDescription;
						oEntity.attributes[xIndex].label = xLabel;
						if(oEntity.attributes[xIndex].key)//if we are updating a key attribute we force the type to "string"
							xType="number";
						oEntity.attributes[xIndex].type = xType;
						if(xType !="enumerable")
							arrEnumerable = null;
						oEntity.attributes[xIndex].enumerable = arrEnumerable;

						//oEntity.attributes[xIndex].key=xKey;
					}
					//dDictionary.save(xSingular,oEntity);
				}else{
					alert("FL.dd.addAttribute Error: you tried to add attribute "+xAttribute+" to a non existing entity "+xSingular);
					//Err.alert("dDictionary.addAttribute",(new Error)," you tried to add attribute "+xAttribute+" to a non existing entity "+xSingular);
				}
			},
			NicoAddAttribute: function(xSingular,xAttribute,xDescription,xLabel,xType,arrEnumerable) {//adds AttributeName,Description, label Type amd enumerable to oEntity of Data Dictionary
				// if Type != "enumerable" => ArrEnumerable will be forced to null.
				// if xAttribute already exists it is updated with xDescription, xType (xKey will not be changed)
				// if xAttribute does not exist it is created with xDescription, xType and xKey forced to false
				//		
				// NOTE on xKey - the only attribute that has xKey=true is always created or removed when the entity is created or removed
				//    To update the name and description of the key attribute of a just created attribute:
				//		dDictionary.createEntity("Client","clients","Individual or Company to whom we may send invoices");//singular, plural, description
				//		dDictionary.renameAttribute("Client","id","name");//renaming the key attribute
				//		dDictionary.addAttribute("Client","name","client's id","Name",string",null);//xEntity,xAttribute,xDescription,xType,xKey
				//		
				//		If we are updating a key attribute we force the type to "number" independently of the xType parameter
				//	
				//oEntity={singular:"Client",plural:"clients",description:"Company to send invoices",lastId:0,L2C:{},C2L:{},attributes:[]};
				//checks if attribute already exists. If it exists updates, otherwise create it !!!
				//console.clear();
				var oEntity = this.entities[xSingular];
				var ffield = null;
				var sComp = null;
				if(oEntity){
					var xIndex = attributeIndex(xSingular,xAttribute);
					if(xIndex<0){//if it does not exists creates it

						// var nId = oEntity.lastId++;
						// var sComp = getCompressed(nId++);

						ffield = new FL.login.fl.field();//var ffield = new fl.field();
	
						ffield.add(	{"1": oEntity.csingular , "3": xAttribute, "4":xDescription, 'K': xLabel, 'M': xType, 'O':'simple','N':arrEnumerable}, function (err, data){
							if(err){
								alert("FLdd2.js addAttribute Error:"+JSON.stringify(err));
								return;
							}
							sComp = data[0]['_id'];
							if(xType !="enumerable")
								arrEnumerable = null;
							oEntity.attributes.push({name:xAttribute,description:xDescription,label:xLabel,type:xType,enumerable:arrEnumerable,key:false});
							oEntity.L2C[xAttribute] = sComp;//Logical to Compressed
							oEntity.C2L[sComp] = xAttribute;//Compressed to Logical
							// oEntity.lastId = nId;

						});
					}else{//updates the existing attribute - if xKey is true (it will continue to be true)
						alert("XXXXXXXXX to be done");
						oEntity.attributes[xIndex].description = xDescription;
						oEntity.attributes[xIndex].label = xLabel;
						if(oEntity.attributes[xIndex].key)//if we are updating a key attribute we force the type to "string"
							xType="number";
						oEntity.attributes[xIndex].type = xType;
						if(xType !="enumerable")
							arrEnumerable = null;
						oEntity.attributes[xIndex].enumerable = arrEnumerable;

						//oEntity.attributes[xIndex].key=xKey;
					}
					//dDictionary.save(xSingular,oEntity);
				}else{
					alert("FL.dd.addAttribute Error: you tried to add attribute "+xAttribute+" to a non existing entity "+xSingular);
					//Err.alert("dDictionary.addAttribute",(new Error)," you tried to add attribute "+xAttribute+" to a non existing entity "+xSingular);
				}
				// console.log("dDictionary.addAttribute ->" + attributeSemantics(xAttribute,xDescription,oEntity,"En"));
			},
			getEntityBySingular: function(xSingular) {//returns an entity and its attributes
				var oEntity = this.entities[xSingular];
				return oEntity;
			},
			isEntityInLocalDictionary: function(entityName) {//returns not null if entityName exists in local dictionary
				var exists = false;
				if(this.getEntityBySingular(entityName))//if getEntityBySingular is not null =>exists = true
					exists = true;
				return exists;
			},
			setSync: function(xSingular,bStatus) {//set sync = true for entity= xSingular - nothing is done if entity does not exist
				var oEntity = this.entities[xSingular];
				if(oEntity){
					oEntity.sync = bStatus;
				}
			},
			setFieldCompressedName: function(xSingular,fieldName,fieldCN) {//for entity xSingular and attribute fieldName sets compressed name
				var oEntity = this.entities[xSingular];
				if(oEntity){
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
			}						
		};
	})();
// });