/*! FLMenu - v1.0.0 - 2014-05-14
Dependencies: JQuery, Underscore.js
	//  PATERN http://stackoverflow.com/questions/1841916/how-to-avoid-global-variables-in-javascript
	// (function() {
	//	Your code here
	//	Expose to global
	//	window['varName'] = varName;
	// })();
* Copyright (c) 2014 FrameLink Co. - JO */
var FL = FL || {};
// var FLMenu = function(oMenu, initialMenu ) {
// FL["menu"] = function(oMenu, initialMenu ) {
FL["menu"] = function(menuSettings) { //{jsonMenu:null,initialMenu:null,editable:false} 
	menuSettings = _.extend( {jsonMenu:null,initialMenu:null,editable:false},menuSettings);
	this.settings = menuSettings;
	parentThis = this;
	// this.init = function() { //constructor
	// 	console.log("-------------------------------> a new instance of FL.menu is constructed... ");
	// 	if(menuSettings.jsonMenu){
	// 		if (typeof(Storage) != "undefined") {//browser supports storage
	// 			localStorage.storedMenu = JSON.stringify(menuSettings.jsonMenu);
	// 		}else{
	// 			BootstrapDialog.alert('No menu persistence because your browser does not support Web Storage...');
	// 		}
	// 	}else{
	// 		alert("FL.menu Error menuSettings.jsonMenu is null !!!");
	// 	}
	// 	this.settings = menuSettings;
	// };
	// $(".FL_login").bind("DOMSubtreeModified", function() {
	// 	alert("tree changed !!!!");
	// });
	// $( "#FL_login" ).change(function() {
	// 	alert( "Handler for .change() called." );
	// });
	this.createMenuEntryLastTop = function(optionTitle,singular) {
		var nextId = menuEach(parentThis.settings.jsonMenu.menu,add_Id_Top);
		// alert("The menu has the last id="+(nextId-1));
		var uri ="javascript:FL.links.setDefaultGrid('" + singular + "')";
		 		//"javascript:FL.links.setDefaultGrid('Order')"
		var newMenuItem = { "title": optionTitle, "uri": uri,top:true, id:nextId };
		parentThis.settings.jsonMenu.menu.push(newMenuItem);
		parentThis.menuRefresh();
	};
	this.setEditable = function(is_editable){
		// alert("is_editable="+is_editable);
		parentThis.settings.editable = is_editable;
	};
	this.updateJsonMenu = function(jsonMenu){
		parentThis.settings.jsonMenu = jsonMenu;
		parentThis.menuRefresh();
	};
	this.createDatabaseAcess = function (optionTitle) {
		alert("Request to create "+optionTitle);
		parentThis.createMenuEntryLastTop(optionTitle,"__windowOpen(weadvice.knackhq.com/weadvice1)");
		// parentThis.menuRefresh();
	};
	this.createGrid = function (optionTitle, singular) {
		alert("FLMenus2.js createGrid->Request to create grid "+optionTitle);
		parentThis.createMenuEntryLastTop(optionTitle,singular);
		// parentThis.menuRefresh();
	};
	$.Topic( 'signInDone' ).subscribe( this.setEditable );
	$.Topic( 'jsonMenuUpdate' ).subscribe( this.updateJsonMenu );
	$.Topic( 'createOption' ).subscribe( this.createDatabaseAcess );
	$.Topic( 'createGridOption' ).subscribe( this.createGrid );
	this.test_Add_Id_Top = function() {//only for testing
		menuEach(this.settings.jsonMenu.menu,add_Id_Top);//any call to menuEach returns the next available idOrder
	};
	this.test_menuFindById = function(menuArray,id) {//only for testing
		return menuFindById(menuArray,id);
	};
	this.is_menuHide = true;//To control if menu is hidding or not 
	this.is_contextOn = false;//To if contextmenu is On/Off 
	this.menuRefresh = function(menuArray){//sets dom with menuArray definition
		if(!menuArray)
			menuArray = this.settings.jsonMenu.menu;
		// alert("menuRefresh entrance: editable = "+this.settings.editable);
		menuEach(menuArray,add_Id_Top);//any call to menuEach returns the next available idOrder
		var $menu = $("#main-menu");
		$menu.empty();//removes the child elements of the selected element(s).
		var oMenuHTML = null;
		for (var i=0;i<menuArray.length;i++){//scans top menus
			oMenuHTML = menuHTML( menuArray[i] );//{order:order,html:htmlStr}; scans nested menus in current top menu
			$menu.append( $( oMenuHTML.html) );//with $(htmlStr) we convert htmlStr to a JQuery object
		}
		$menu.smartmenus('refresh');//necessary to show submenus if dom is changed
		if(parentThis.settings.initialMenu){ //FLMenu has a second parameter
			console.log("Inside FL.menu.menuRefresh with initial ="+parentThis.settings.initialMenu);
			// alert("Inside FL.menu.menuRefresh with initial ="+parentThis.settings.initialMenu);
			loadInternalPage(parentThis.settings.initialMenu);
		}
		var k=0;
		var settings = this.settings; //to make settings accessible to anonimous function...
		$("#main-menu").mousedown(function(event) {//exists only to set is:menu = false on right mouse (if editable)!!!!
			switch (event.which) {
				case 1://Left Mouse button pressed
					break;
				case 2://Middle Mouse button pressed
					break;
				case 3://Right Mouse button pressed
					console.log("---------------------------------------------->Right Mouse button pressed...");
					parentThis.is_menuHide = true;
					if(settings.editable){
						parentThis.is_menuHide = false;
						console.log("is_menuHide was set to false in mousedown !!!");
					}
					break;
				default:
					console.log('You have a strange Mouse!');
			}
		});
		$("#main-menu").bind('activate.smapi', function(e, item) {//Fired when an item is activated, right before its sub menu (if the item has a sub menu) is shown
			if(parentThis.is_contextOn) {
				$("#contextMenu").hide();//hide any context menu that may be visible
				$('.nav ul').hide();//hide any dropdown menu
				parentThis.is_contextOn = false;
				parentThis.is_menuHide = true;
			}
			// console.log("activate " + k +" item id="+item.attributes[1].value+ " was activated ! is_menuHide="+parentThis.is_menuHide+" is_contextOn="+parentThis.is_contextOn);
		});
		$("#main-menu").bind('beforehide.smapi', function(e, item) {//Fired by smartmenus right before a sub menu is hidden.
			console.log("hide" + k +" status is_menuHide="+parentThis.is_menuHide);//OK
			return parentThis.is_menuHide;//submenu will not be hidden if is_menuHide=false
		});
		var $mainMenu = $("#menuContainer");
		$mainMenu.on("contextmenu", function (e) {//Set of DOM elements #menuContainer got a click handler
			console.log("contextmenu was clicked");
			$.Topic( 'inMenuEdition' ).publish( true );
			$.fn.editable.defaults.mode = 'popup';
			parentThis.is_contextOn = true;
			if(parentThis.settings.editable){
				parentThis.is_menuHide = false;
				console.log("parentThis.is_menuHide was set to false");
				var menuTag = setupContextMenu(menuArray,e);//prepares #contextMenu for right clicked element
				$( "#contextMenu" ).on( "click", insideContextMenu);//a click inside main-menu will call refHandler 
				$("#contextMenu")
					.data("invokedOn", $(e.target)) //attach data to settings.menuSelector, under the name "invokeOn" 
					.show() //The matched elements will be revealed immediately, with no animation
					.css({
						position: "absolute",
						left: getLeftLocation(e),
						top: getTopLocation(e)
					});
				// var el = $("#contextMenu")[0];
				// var idBeingEdited = $.data(el,"invokedOn").attr("id");
				// alert("invokedOn is a memory with idBeingEdited="+idBeingEdited);
				return false;
				// $mainMenu.contextMenu()(e);				
			}
		});
		$( "#main-menu" ).on( "click", refHandler);//a click inside main-menu will call refHandler 
	};
	var getEventTrigger = function(e){//for an event return json with tag,id and className
		var toReturn = {tag:null,id:null,className:null,href:null,tagDescription:null};
		var menuTag = $(e.target).get(0).tagName;//A for normal menus <a>menu</a> and IMG for brand
		var className = $(e.target).get(0).className;//A for normal menus <a>menu</a> and IMG for brand
		var href = $(e.target).get(0).href;//if it is an anchor with href gets href
		if(menuTag){
			toReturn.tag = menuTag;
			var index = {H1:"H1 paragraph",H2:"H2 paragraph",P:"paragraph",IMG:"image"};
			toReturn.tagDescription = index[menuTag];
		}
		if(e.target.id)
			toReturn.id = e.target.id;
		if(className)
			toReturn.className = className;
		if(href)
			toReturn.href = href;
		if(className.substring(0,3)=="btn" && href) { //a button is defined by having a btn class name and existing href
			toReturn.tagDescription = "button";
		}else if(toReturn.id == "toolbar"){
			toReturn.tagDescription = "menu toolbar";
		}else if(toReturn.id == "brand"){
			toReturn.tagDescription = "menu brand";
		}else if(toReturn.id >= 0 && menuTag =="A"){
			toReturn.tagDescription = "menu item";
		}
		// alert("getEventTrigger with [tag="+toReturn.tag+"] [id="+toReturn.id+"] [className="+toReturn.className+"] [href="+toReturn.href+"] [tagDescription="+toReturn.tagDescription+"]");
		return toReturn;
	};
	var add_Id_Top = function(element,order,top) {
		element["id"]=order;
		// var topLevelLength = oMenu.menu.length;
		var topLevelLength = menuSettings.jsonMenu.menu.length;
		element["top"]=top;
		// if( top ) element.title = "[" + element.title + "]" ;//EXAMPLE
		return element;
	};
	var menuEach = function (menuArray,action,initialOrder){//initialOrder is optional. If missing we assume =0
		//all action methods will receive (element,order,top ) where element is the current menuArray[i], order is the current order and top is true only for tier one menu options. action should ALWAYS RETURN element
		//Example: menuEach(oMenu.menu,add_Id_Top);//any call to menuEach returns the next available idOrder
		var idOrder = initialOrder, top = false;
		if(!idOrder) idOrder = 0;
		if( idOrder === 0){
			top = true;
		}
		for(var i=0;i<menuArray.length;i++){
			//menuArray[i] = action(menuArray[i]);
			menuArray[i] = action.call(null,menuArray[i],idOrder,top);
			idOrder++;
			if( menuArray[i]["menu"] ) {
				idOrder = menuEach(menuArray[i]["menu"],action,idOrder,top);
			}
		}
		return idOrder;//return lastOrder+1
	};
	var menuFindById = function(menuArray,id) {//ret element (null if no find)->ex:alert( "title="+menuFindById(oMenu.menu,14).title);
		var retElement = null;
		var order = menuEach(menuArray,function(element,order) {
			if(	id == order) {
				retElement = element;
			}
			return element;
		});
		return retElement;
	};
	var menuHTML = function(menuItem){//returns HTML string for bootstrap menu 
		var htmlStr = "<li><a id="+ menuItem.id +" href=" + menuItem.uri + ">" + menuItem.title + "</a></li>";
		// var htmlStr = "<li><a id="+ menuItem.id +" href=" + menuItem.uri + " onClick='alert(beforeLink())'>" + menuItem.title + "</a></li>";
		if(menuItem.menu){
			htmlStr =  "<li><a id="+ menuItem.id +" href=" + menuItem.uri + ">" + menuItem.title + "</a>";
			// htmlStr =  "<li><a id="+ menuItem.id +" href=" + menuItem.uri + " onClick='alert(beforeLink())'>" + menuItem.title + "</a>";
			htmlStr +=    "<ul class='dropdown-menu'>";
			var subMenuItem = menuItem.menu;
			for (var i=0;i<subMenuItem.length;i++){
				oMenuHTML = menuHTML( subMenuItem[i] );//returns {order:order,html:htmlStr};
				htmlStr += oMenuHTML.html;
			}
			htmlStr +=    "</ul>";
			htmlStr += "</li>";
		}
		return {order:0,html:htmlStr};
	};
	var getMenuTag = function(path){ // return the content after the last "/" disregarding a terminal "/"
		var menuTag = path.substring(path.lastIndexOf("/"));
		var pos = null;
		if(menuTag=="/"){//if path is "/" terminated. - menutag 
			var pathWithoutLast = path.substring(0,path.length-1);//removes last "/"
			pos=pathWithoutLast.lastIndexOf("/");
			menuTag = pathWithoutLast.substring(pos+1);
		}else{
			pos=path.lastIndexOf("/");
			menuTag = path.substring(pos+1);
		}
		return menuTag;
	};
	var loadInternalPage = function(menuName) {//load html block and places it in id="_placeHolder"
		var $placeHolder = $("#_placeHolder");
		if (!$placeHolder.length ) {
			alert("FrameLink Menus Error. Undefined _placeHolder in DOM");
		}else{//"#_placeHolder" exists in DOM
			console.log("           loadInternalPage -> the id placeHolder exists and loadInternalPage will try to load "+menuName+".html");
			// $placeHolder.empty();//removes the child elements in placeHolder.
			//for firefox https://support.mozilla.org/en-US/kb/how-clear-firefox-cache
			$.get(menuName+".html")
				.done(function(data){
					// alert( "Data Loaded: " + data );
					$placeHolder.empty();//removes the child elements in placeHolder.
					$placeHolder.append(data);
					$("#_placeHolder .btn").bind('click',function(e){
						var leftClicked = getEventTrigger(e);
						buttonToCall = leftClicked.href;
						e.stopPropagation();
						$placeHolder.off( "contextmenu");
						// alert(" click in a btn inside placeHolderplaceholder -->this will call "+leftClicked.href);
						dispatchHref(leftClicked.href);
						return false;//preventing the href to be called automaticaly
					});
					$placeHolder.on( "contextmenu", function(e){
						var rightClicked = getEventTrigger(e);
						if (parentThis.settings.editable)
							alert("FrameLink will allow you to edit "+rightClicked.tagDescription+"s");
						return false;
					});
				})
				.fail(function(){
					alert("Error in FL.menu loadInternalPage - This menu option points to an internal page "+menuName+".html that does not exist!!!");
				});
			//next code would be here	
		}
	};
	var dispatchHref = function(href) { //for "./mission.html" returns "mission.html" - for "./mission.html/" returns "mission.html"
		var pos = href.indexOf("__");
		if(pos>=0) {//"__" means a special function
			var flMenuFunction = href.substr(pos);
			var posArgument = flMenuFunction.indexOf("(");
			if(posArgument>=0){
				var flArgument = flMenuFunction.substring(posArgument+1);
				flArgument = flArgument.substr(0,flArgument.length-1);
				// alert("Hooked in a special Frame link function ->"+flMenuFunction+" with argument "+flArgument);
				// alert("test ->"+flMenuFunction.substr(0,12));
				if(flMenuFunction.substr(0,12)=="__windowOpen") {
					// alert("vai chamar:"+"http://"+flArgument);
					// window.open("http://"+flArgument,"newWindow");
					var $placeHolder = $("#_placeHolder");
					$placeHolder.empty();//removes the child elements in placeHolder.
					$placeHolder.append($('<iframe src="' + "http://"+flArgument +'" width="1140" height="600"></iframe>'));
					// var temp = 
					// <iframe src="demo_iframe.htm" width="200" height="200"></iframe>
					// window.open("http://weadvice.knackhq.com/weadvice1","newWindow");
					z=32;
				}else if(flMenuFunction.substr(0,6)=="__grid"){
					var singular = flMenuFunction.substr(7);
					alert("grid !!! line 302 "+singular);
					// var columnsArr = utils.backGridColumnsExtractedFromDictionary(singular);
					// utils.csvToStore(data.results.rows);
					// csvStore.setGrid(singular);
 					// 	utils.mountGridInCsvStore(columnsArr);
				}
			}else{
				alert("dispatchHref Error:FrameLink menu function "+ flMenuFunction + "has no arguments !!!");
			}
		}else{
			var menuTag = getMenuTag(href);
			console.log("   dispatchHref called by refHandler href="+href+" ---------> menuTag="+menuTag);
			// alert("dispatchHref href="+href+" ---------> menuTag="+menuTag);
			if(menuTag.substr(0,1) == "_"){ //ex:"http://www.microsoft.com" or "./mission.html"
				// alert("Special menu command ->"+menuTag);
				loadInternalPage(menuTag);
			}else{
				// alert("Normal dispatch to internal and external url for "+menuTag);
				console.log("------------------------------------>Is going to leave to  ->"+href);
				// ---> temporary suspended --->localStorage.storedMenu = JSON.stringify(menuSettings.jsonMenu);//stores before leaving
				// alert("SAI com:"+JSON.stringify(oMenu) );
				location.href = href;
				// alert("Chegou aqui 150 !!!");
			}
		}
	};
	var refHandler = function(event) {
		console.log("refHandler called by click inside id main-menu with target "+event.target.nodeName);
		// alert("refHandler  called by click inside id main-menu with target "+event.target.nodeName+" and href="+event.target.href);
		if(event.target.nodeName === 'A') {
			var href = event.target.href;
			// change the URL
			// location.href = href;
			dispatchHref(href);
			event.preventDefault();
		}
	};
	// --------- all methods above work for menuRefresh() with editable = false ---- code bellow is for editable = true
	var setupContextMenu = function(jsonMenu,e){//changes DOM template according with e.target
		var menuText = "Rename " + $(e.target).text();// + " menu";//default is menu
		var menuTag = $(e.target).get(0).tagName;//A for normal menus <a>menu</a> and IMG for brand
		var menuId = $(e.target).attr("id");//get id of current line
		var $contextMenu = $("#contextMenu");
		$contextMenu.empty();//removes the child elements of the selected element(s).
		if(menuTag == "IMG"){//the brand was clicked
			$contextMenu.append("<li><a tabindex='-1' href='#'>Update Logo</a></li>");
			$contextMenu.append("<li class='divider'></li>");
			$contextMenu.append("<li><a tabindex='-1' href='#'>Cancel</a></li>");
		}else if(menuTag == "A") {// a menu item was clicked
			var menuItem = menuFindById(parentThis.settings.jsonMenu.menu,menuId);
			var topMenu = menuItem.top;
			$contextMenu.append("<li><a tabindex='-1' href='#'>" + menuText + "</a></li>");
			if( topMenu ){
				$contextMenu.append("<li><a tabindex='-1' href='#'>Add submenu</a></li>");
				$contextMenu.append("<li><a tabindex='-1' href='#'>Remove menu</a></li>");
			}else{
				$contextMenu.append("<li><a tabindex='-1' href='#'>Add submenu before</a></li>");
				$contextMenu.append("<li><a tabindex='-1' href='#'>Add submenu after</a></li>");
				if(!menuItem.menu) {//no submenu
					$contextMenu.append("<li><a tabindex='-1' href='#'>Create inside submenu</a></li>");
					$contextMenu.append("<li><a tabindex='-1' href='#'>Remove this menu item</a></li>");
				}else{//has submenu
					$contextMenu.append("<li><a tabindex='-1' href='#'>Remove inside submenus</a></li>");
				}
			}
			$contextMenu.append("<li class='divider'></li>");
			$contextMenu.append("<li><a tabindex='-1' href='#'>Cancel</a></li>");
		}else if(menuTag == "DIV") {// the menubar was clicked
			$contextMenu.append("<li><a tabindex='-1' href='#'>Add top menu</a></li>");
			$contextMenu.append("<li class='divider'></li>");
			$contextMenu.append("<li><a tabindex='-1' href='#'>Cancel</a></li>");
		}
		return menuTag;
	};
	var getLeftLocation = function(e) {
		var mouseWidth = e.pageX;
		var pageWidth = $(window).width();
		var menuWidth = $("#contextMenu").width();
		// opening menu would pass the side of the page
		if (mouseWidth + menuWidth > pageWidth &&
			menuWidth < mouseWidth) {
			return mouseWidth - menuWidth;
		}
		return mouseWidth;
	};
	var getTopLocation = function (e) {
		var mouseHeight = e.pageY;
		var pageHeight = $(window).height();
		var menuHeight = $("#contextMenu").height();
		// opening menu would pass the bottom of the page
		if (mouseHeight + menuHeight > pageHeight &&
			menuHeight < mouseHeight) {
			return mouseHeight - menuHeight;
		}
		return mouseHeight;
	};
	var updateMenuItemById = function(menuArray,updatedElement,id){//finds id and replace menuItem by updatedElement
		//updateMenuItemById(menuArray,{title:"abc",uri:"http://microsoft.com"},14)
		var order = menuEach(menuArray,function(element,order) {
			if( id == order) {
				element = _.extend(element,updatedElement);//passed by reference
			}
			return element;
		});
		return true;
	};
	// -----------------------------------------------------------------------------------
	// ----------------------------- to be used by insideContextMenu ---------------------
	// -----------------------------------------------------------------------------------
	var onId = function(id,action) { //gets submenu containing id and does an action (removeSubmenu,addSubmenu...etc)
		// var parentId = getParentIdOfId(oMenu.menu,id);
		var parentId = getParentIdOfId(parentThis.settings.jsonMenu.menu,id);
		var parentMenuItem = menuFindById(parentThis.settings.jsonMenu.menu,parentId);
		var index = null;
		if (parentId == -1){//top level
			index = findOrderOfIdInSubmenu(parentThis.settings.jsonMenu.menu,id);
			action(parentThis.settings.jsonMenu.menu,index,parentMenuItem);
		}else{
			index = findOrderOfIdInSubmenu(parentMenuItem.menu,id);
			action(parentMenuItem.menu,index,parentMenuItem);
		}
	};
	var getParentIdOfId = function(menuArray,id) {//returns Id of the parent menuitem containing a given Id.If id is toplevel return -1
		id =parseInt(id);
		var retId = -1;
		var isFoundElement=!(_.isUndefined(_.findWhere( menuArray,{id:id} )));//at top level ->true if found false if not found
		console.log("isFoundElement="+isFoundElement);
		if(!isFoundElement) {
			menuEach(menuArray,function(element,order,top){//menuEach passes (element,order,top )
				if(element.menu) {//goes up
					// console.log("getParentIdOfId -->"+element.title+" order="+element.id+" top="+element.top+" retId="+retId);
					if(element.id == id) {//the id belongs to a menuItem with a menu
						//
					}else{
						isFoundElement=!( _.isUndefined( _.findWhere( element.menu,{id:id} ) ) );//at submenu level 
						if(isFoundElement)
							retId = element.id;
					}
				}
				return element;
			});
		}
		return retId;
	};
	var findOrderOfIdInSubmenu = function(submenu,id){
		var index= -1;
		_.each(submenu, function(element, idx) {
			if(element.id == id) {
				index = idx;
				return;
			}
		});
		return index;
	};
	var appendLastTop = function(menuArray,title) {//inserts a Top menu position in last position with title=title
		var lastTopPosition = menuArray.length - 1;
		var idOfNewLastTopPosition = menuEach(menuArray,add_Id_Top);//any call to menuEach returns the next available idOrder
		menuArray.push({ "title":title,"uri":"#", id: idOfNewLastTopPosition,top:true});
		return idOfNewLastTopPosition;
	};
	var appendLastTopOnDOM = function(menuArray) {
		var lastTopPosition = menuEach(menuArray,add_Id_Top)-1;//any call to menuEach returns the next available idOrder
		var menuItem = menuFindById(menuArray,lastTopPosition);
		var htmlStr = "<li><a id="+ menuItem.id +" href=" + menuItem.uri + ">" + menuItem.title + "</a></li>";
		var $menu = $("#begin_menu");
		$menu.append( $( htmlStr) );//with $(htmlStr) we convert htmlStr to a JQuery object
	};
	var addSubmenu = function(submenu,index) { //only for top menus. Append a submenu to second level menus
		// alert(submenu[index].title + "/" + submenu[index].id);
		if(submenu[index].menu){
			submenu[index].menu.push({title:"New",uri:"#"});
		}else{
			submenu[index]["menu"] = [{title:"New",uri:"#"}];
		}
	};
	var addSubmenuBefore = function(submenu,index) { //2nd level+ only. Insert a menu before
		// alert(submenu[index].title + "/" + submenu[index].id);
		if (index > -1) {
			submenu.splice(index, 0,{title:"New",uri:"#"});
		}
	};
	var addSubmenuAfter = function(submenu,index) { //2nd level+ only. Insert a menu after
		// alert(submenu[index].title + "/" + submenu[index].id);
		if (index > -1) {
			submenu.splice(index+1, 0,{title:"New",uri:"#"});
		}
	};
	var changeToSubmenuInside = function(submenu,index) { //2nd level+ only.Insert a menu after
		// alert(submenu[index].title + "/" + submenu[index].id);
		if(submenu[index].menu) {
			//submenu[index].menu.push({title:"New",uri:"#"});
			console.log("Nothing to do ...this menu is already a gate to other submenus");
		}else{
			submenu[index]["menu"] = [{title:"New",uri:"#"}];
		}
	};
	var removeSubmenu = function(submenu,index,parentMenuItem) {
		if (index > -1) {
			if(parentMenuItem.menu.length==1){//it is the last submenu we should clear the menu key on parent...
				// alert("remove key menu from "+parentMenuItem.id+" title="+parentMenuItem.title)
				delete parentMenuItem.menu;
			}else{
				submenu.splice(index, 1);
			}
		}
	};
	var removeTopMenu = function(topmenu,id) {
		var index = findOrderOfIdInSubmenu(parentThis.settings.jsonMenu.menu,id);
		if (index > -1) {
			topmenu.splice(index, 1);
		}
	};
	var saveMenuToLocal = function() {
		localStorage.storedMenu  = JSON.stringify(parentThis.settings.jsonMenu);
		// alert("Menu was Saved to local !!!");
	};	
	var insideContextMenu = function(event) {
		event.stopImmediatePropagation();
		var selectedMenuInContextMenu = $(event.target);
		var contextSelection = selectedMenuInContextMenu.text();
		var is_beingEdited = false;
		var el = $("#contextMenu")[0];
		var idBeingEdited = $.data(el,"invokedOn").attr("id");//$(e.target) was stored into element #contextMenu before right mouse click
		console.log("insideContextMenu with "+contextSelection+" and idBeingEdited="+idBeingEdited);
		if(contextSelection == "Cancel") {//2nd level+ only. Append a submenu to second level menus
			console.log("******************************> insideContextMenu 'Cancel' was the selection !");
		}else if(contextSelection == "Add top menu") {//top level only.
			var newId = appendLastTop(parentThis.settings.jsonMenu.menu,"New");
			appendLastTopOnDOM(parentThis.settings.jsonMenu.menu);
			parentThis.is_menuHide = true;
			parentThis.menuRefresh(parentThis.settings.jsonMenu.menu);	
			saveMenuToLocal();
			console.log("******************************> insideContextMenu 'Add top menu' was the selection !");
		}else if( contextSelection.substring(0,6) == "Rename" ) {
			var editId="#"+idBeingEdited;
			is_beingEdited = true;
			$(editId).editable({
				type: 'text',
				title: 'Enter new menu title:',
				placement: 'bottom',
				validate: function(value) {
					if($.trim(value) === '') {
						return 'The menu title is required';
					}
					updateMenuItemById(parentThis.settings.jsonMenu.menu,{title:value},idBeingEdited);
					parentThis.is_menuHide = true;
					parentThis.menuRefresh(parentThis.settings.jsonMenu.menu);
					saveMenuToLocal();
					$.Topic( 'inMenuEdition' ).publish( false );
				}
			});
			console.log("before $(editId).editable('show');");
			$("#contextMenu").hide();
			$(editId).editable('show');
			console.log("******************************> insideContextMenu 'Rename' was the selection ! idBeingEdited="+idBeingEdited);
		}else if( contextSelection == "Add submenu" ) {//2nd level+ only. Append a submenu to second level menus
			onId(idBeingEdited,addSubmenu);
			menuEach(parentThis.settings.jsonMenu.menu,add_Id_Top);
			parentThis.is_menuHide = true;
			parentThis.menuRefresh(parentThis.settings.jsonMenu.menu);
			saveMenuToLocal();
			console.log("******************************> insideContextMenu 'Add submenu' was the selection !");
		}else if(contextSelection == "Add submenu before") {//2nd level+ only. Insert a menu before
			onId(idBeingEdited,addSubmenuBefore);
			menuEach(parentThis.settings.jsonMenu.menu,add_Id_Top);
			parentThis.is_menuHide = true;
			parentThis.menuRefresh(parentThis.settings.jsonMenu.menu);
			saveMenuToLocal();
			console.log("******************************> insideContextMenu 'addSubmenuBefore' was the selection !");
		}else if(contextSelection == "Add submenu after") {//2nd level+ only. Insert a menu after
			onId(idBeingEdited,addSubmenuAfter);
			menuEach(parentThis.settings.jsonMenu.menu,add_Id_Top);
			parentThis.is_menuHide = true;
			parentThis.menuRefresh(parentThis.settings.jsonMenu.menu);
			saveMenuToLocal();			
			console.log("******************************> insideContextMenu 'addSubmenuAfter' was the selection !");
		}else if(contextSelection == "Create inside submenu") {//2nd level+ only. Makes an inside gate to a menu
			onId(idBeingEdited,changeToSubmenuInside);
			menuEach(parentThis.settings.jsonMenu.menu,add_Id_Top);
			parentThis.is_menuHide = true;
			parentThis.menuRefresh(parentThis.settings.jsonMenu.menu);
			saveMenuToLocal();			
			console.log("******************************> insideContextMenu 'changeToSubmenuInside' was the selection !");
		}else if(contextSelection == "Remove this menu item") {//2nd level+ only
			onId(idBeingEdited,removeSubmenu);
			menuEach(parentThis.settings.jsonMenu.menu,add_Id_Top);
			parentThis.is_menuHide = true;
			parentThis.menuRefresh(parentThis.settings.jsonMenu.menu);
			saveMenuToLocal();			
			console.log("******************************> insideContextMenu 'removeSubmenu' was the selection !");
		}else if(contextSelection == "Remove inside submenus") {//2nd level+ only
			var menuItem = menuFindById(parentThis.settings.jsonMenu.menu,idBeingEdited);
			if(menuItem.menu){//menu has subitems
				BootstrapDialog.confirm("All sub menus of " + menuItem.title + " will be lost. Do you want to delete them anyway ?", function(result) {
					console.log("Confirm result: "+result);
					if(result){
						delete menuItem.menu;
						menuEach(parentThis.settings.jsonMenu.menu,add_Id_Top);
					}
					parentThis.is_menuHide = true;
					parentThis.menuRefresh(parentThis.settings.jsonMenu.menu);
					saveMenuToLocal();	
					$.Topic( 'inMenuEdition' ).publish( false );
				},{title:"DELETE OPERATION",button1:"Do not delete",button2:"OK to delete",type:'type-danger',cssButton2:"btn-danger"});
			}
		}else if(contextSelection == "Remove menu") {//remove at top level only
			var menuItem = menuFindById(parentThis.settings.jsonMenu.menu,idBeingEdited);
			if(menuItem.menu){//menu has subitems - requires confirmation to delete
				BootstrapDialog.confirm("All sub menus of " + menuItem.title + " will be lost. Do you want to delete them anyway ?", function(result) {
					console.log("Confirm result: "+result);
					if(result){
						removeTopMenu(parentThis.settings.jsonMenu.menu,idBeingEdited);
						menuEach(parentThis.settings.jsonMenu.menu,add_Id_Top);
					}
					parentThis.is_menuHide = true;
					parentThis.menuRefresh(parentThis.settings.jsonMenu.menu);
					saveMenuToLocal();	
					$.Topic( 'inMenuEdition' ).publish( false );
				},{title:"TOP MENU DELETE OPERATION !",button1:"Do not delete",button2:"OK to delete",type:'type-danger',cssButton2:"btn-danger"});
			}else{//menu without subitems no confirmation required - removes immediately
				removeTopMenu(parentThis.settings.jsonMenu.menu,idBeingEdited);
				menuEach(parentThis.settings.jsonMenu.menu,add_Id_Top);
				parentThis.is_menuHide = true;
				parentThis.menuRefresh(parentThis.settings.jsonMenu.menu);
				saveMenuToLocal();
				$.Topic( 'inMenuEdition' ).publish( false );
			}
		}
		if(!is_beingEdited){
			$("#contextMenu").hide();
			parentThis.is_menuHide = true;
			parentThis.is_contextOn = false;
			// console.log("parentThis.is_menuHide was set to true after context selection");
			// console.log("==================================================>context menu has hidden after context selection");
			$('.nav ul').hide();//hide any dropdown menu
			$.Topic( 'inMenuEdition' ).publish( false );
		}
	};
	this.displayInitialMenu = function() {
		console.log("displayInitialMenu -->"+this.settings.initialMenu);
	};
	this.init = function() { //constructor
		console.log("-------------------------------> a new instance of FL.menu was constructed... ");
	};
	this.init();
};